// Animates the home page's live diary line and the drifting hills (src/lib/liveline.mjs draws every frame;
// LiveLine.astro and Night.astro render the still first frame). One clock for everything; only what is on screen
// is redrawn, about 30 times a second. With reduced motion the frame is drawn once, to fit the screen, and stays.
import { frame, hillShape, hillLine, HILLS, BAND, ICONS, INK, painColor, eventLabel } from '../lib/liveline.mjs';

type Names = Record<string, string>;
interface Live {
  band: HTMLElement;
  svg: SVGSVGElement;
  paths: SVGPathElement[];
  layer: HTMLElement;
  sun: HTMLElement;
  names: Names;
  pain: string;
  nodes: Map<number, HTMLElement>;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const lives: Live[] = [];
const hills: SVGSVGElement[] = [];
const onScreen = new Set<Element>();
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const pct = (x: number, of: number) => `${((x / of) * 100).toFixed(3)}%`;
// Pops in with a small overshoot.
const easeOutBack = (p: number) => { const s = p - 1; return 1 + 2.70158 * s * s * s + 1.70158 * s * s; };

function makeEvent(e: { kind: string; time: string; level?: number }, live: Live): HTMLElement {
  const el = document.createElement('div');
  el.className = 'ev';
  const label = document.createElement('span');
  label.className = 'ev-label';
  const time = document.createElement('span');
  time.className = 'ev-time';
  time.textContent = e.time;
  label.append(time, ` ${eventLabel(e, live.names, live.pain)}`);
  el.append(label);
  if (e.kind === 'pain') {
    const dot = document.createElement('span');
    dot.className = (e.level ?? 0) >= 7 ? 'ev-dot ev-dot-high' : 'ev-dot';
    dot.style.background = painColor(e.level ?? 0);
    dot.textContent = String(e.level);
    el.append(dot);
  } else {
    const icon = document.createElement('span');
    icon.className = 'ev-icon';
    icon.style.color = (INK as Record<string, string>)[e.kind];
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '19');
    svg.setAttribute('height', '19');
    svg.innerHTML = (ICONS as Record<string, string>)[e.kind]; // fixed markup from liveline.mjs, never user data
    icon.append(svg);
    el.append(icon);
  }
  return el;
}

function drawLive(live: Live, t: number, animate: boolean) {
  const w = Math.max(320, Math.round(live.band.clientWidth));
  live.svg.setAttribute('viewBox', `0 0 ${w} ${BAND}`);
  const f = frame({ t, width: w });
  for (const p of live.paths) p.setAttribute('d', f.path);
  live.sun.style.left = pct(f.pen.x, w);
  live.sun.style.top = pct(f.pen.y, BAND);
  const seen = new Set<number>();
  for (const e of f.events) {
    seen.add(e.n);
    let el = live.nodes.get(e.n);
    if (!el) {
      el = makeEvent(e, live);
      live.nodes.set(e.n, el);
      live.layer.append(el);
    }
    el.style.left = pct(e.x, w);
    el.style.top = pct(e.y, BAND);
    const pop = animate && e.age < 0.45 ? easeOutBack(e.age / 0.45) : 1;
    el.style.transform = pop === 1 ? '' : `scale(${pop.toFixed(3)})`;
    el.style.opacity = animate && e.age < 0.25 ? (e.age / 0.25).toFixed(2) : '';
  }
  for (const [n, el] of live.nodes) if (!seen.has(n)) { el.remove(); live.nodes.delete(n); }
}

function drawHills(svg: SVGSVGElement, t: number) {
  const spec = HILLS[svg.dataset.hills as 'day' | 'night'];
  const w = Math.max(320, Math.round(svg.clientWidth));
  svg.setAttribute('viewBox', `0 0 ${w} ${spec.height}`);
  const shapes = svg.querySelectorAll<SVGPathElement>('path:not([data-rim])');
  shapes.forEach((p, i) => p.setAttribute('d', hillShape(spec.layers[i], t, w, spec.height)));
  svg.querySelector('[data-rim]')?.setAttribute('d', hillLine(spec.layers[0], t, w));
}

function drawAll(t: number, animate: boolean, all = false) {
  for (const live of lives) if (all || onScreen.has(live.band)) drawLive(live, t, animate);
  for (const svg of hills) if (all || onScreen.has(svg)) drawHills(svg, t);
}

function setup() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-live]')) {
    const band = root.querySelector<HTMLElement>('.live-band')!;
    const live: Live = {
      band,
      svg: band.querySelector('svg')!,
      paths: [...band.querySelectorAll<SVGPathElement>('.live-line path')],
      layer: band.querySelector<HTMLElement>('.live-events')!,
      sun: band.querySelector<HTMLElement>('.live-sun')!,
      names: JSON.parse(root.dataset.names ?? '{}'),
      pain: root.dataset.pain ?? '',
      nodes: new Map(),
    };
    // The server's still frame: adopt its events so nothing flickers on the first redraw.
    for (const el of live.layer.querySelectorAll<HTMLElement>('.ev')) live.nodes.set(Number(el.dataset.n), el);
    lives.push(live);
  }
  hills.push(...document.querySelectorAll<SVGSVGElement>('svg[data-hills]'));
  if (!lives.length && !hills.length) return;

  const watched = [...lives.map((l) => l.band), ...hills];
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) en.isIntersecting ? onScreen.add(en.target) : onScreen.delete(en.target);
  });
  watched.forEach((el) => io.observe(el));

  let t0: number | null = null;
  let last = 0;
  let raf = 0;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    t0 ??= now;
    if (now - last < 33) return;
    last = now;
    drawAll((now - t0) / 1000, true);
  };
  const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; drawAll(0, false, true); };

  reduce.matches ? stop() : start();
  reduce.addEventListener('change', () => (reduce.matches ? stop() : start()));
  addEventListener('resize', () => { if (reduce.matches) drawAll(0, false, true); });
}

setup();
