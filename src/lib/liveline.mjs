// The home page's live diary line: one day of a headache diary, drawn as a line that moves left while the
// red sun (the "now" point, near the right edge) keeps drawing it. Used twice: the server renders one still
// frame (LiveLine.astro), and src/scripts/liveline.ts animates it in the browser. Pure functions, no DOM.
//
// World coordinate u grows with time; the sun draws at u = now. Event n of the endless day is logged at
// u = n * gap, so it appears at the sun and drifts left with the line. The line's height IS the pain: it passes
// exactly through every pain reading ("Episode Ended" is 0) and eases between readings, as the app's own pain
// curve does; outside a headache it lies flat at 0 and rises only in the half-step before the first reading.

/** Height of the line's band, in px; the line's baseline (pain 0) and how much higher each pain point draws it. */
export const BAND = 330;
export const BASE = 268;
export const PER_LEVEL = 20;
const WOBBLE = 3;
const STEP = 12;
/** The sun sits this far across the band. */
export const PEN_AT = 0.82;
export const SPEED = 46; // px per second
export const GAP = 175; // px between events
/** The still frame starts with the line already full: the sun has passed this many events. */
const START = 9.4;

// One day, looping. `time` is shown as is in every language; names come from the page copy (`live.names`).
export const DAY = [
  { kind: 'sleep', time: '07:10' },
  { kind: 'pain', time: '09:00', level: 3 },
  { kind: 'med', time: '09:20' },
  { kind: 'coffee', time: '10:15' },
  { kind: 'pain', time: '12:00', level: 8 },
  { kind: 'nausea', time: '12:10' },
  { kind: 'light', time: '12:30' },
  { kind: 'pain', time: '15:00', level: 4 },
  { kind: 'pain', time: '16:30', level: 2 },
  { kind: 'end', time: '17:00', level: 0 },
  { kind: 'period', time: '19:00' },
];

const setsPain = (e) => e.kind === 'pain' || e.kind === 'end';
const at = (n) => DAY[((n % DAY.length) + DAY.length) % DAY.length];

/** The app's pain colours: low, middle, high. */
export function painColor(level) {
  return level >= 7 ? '#b5502a' : level >= 4 ? '#dca444' : '#c9bd5e';
}

/** Pain level at world position u, eased between the reading before u and the reading after it. */
export function levelAt(u, gap = GAP) {
  const n = Math.floor(u / gap);
  let a = null;
  let b = null;
  for (let i = n; i >= Math.max(0, n - 24); i--) if (setsPain(at(i))) { a = { at: i * gap, level: at(i).level }; break; }
  for (let j = n + 1; j <= n + 24; j++) if (setsPain(at(j))) { b = { at: j * gap, level: at(j).level }; break; }
  a ??= { at: 0, level: 0 };
  if (!b) return a.level;
  const start = a.level === 0 ? Math.max(a.at, b.at - gap * 0.5) : a.at;
  if (u <= start) return a.level;
  let s = (u - start) / (b.at - start);
  s = s * s * (3 - 2 * s);
  return a.level + (b.level - a.level) * s;
}

export const yAt = (u, gap = GAP) => BASE - levelAt(u, gap) * PER_LEVEL + WOBBLE * Math.sin(u / 70);

/**
 * One frame of the line, `t` seconds in, for a band `width` px wide. Returns the line's SVG path, the sun's
 * position and the events on screen, each with its x, y (px), and `age` in seconds since it was logged.
 */
export function frame({ t = 0, width = 1440, speed = SPEED, gap = GAP } = {}) {
  const pen = Math.round(width * PEN_AT);
  const now = gap * START + t * speed;
  const pts = [];
  for (let x = 0; x <= pen; x += STEP) {
    const u = now - (pen - x);
    if (u >= 0) pts.push(`${x} ${yAt(u, gap).toFixed(1)}`);
  }
  pts.push(`${pen} ${yAt(now, gap).toFixed(1)}`);
  const events = [];
  const first = Math.max(0, Math.ceil((now - pen - 40) / gap));
  for (let n = first; n <= Math.floor(now / gap); n++) {
    const e = at(n);
    events.push({ n, ...e, x: pen - (now - n * gap), y: yAt(n * gap, gap), age: (now - n * gap) / speed });
  }
  return { path: `M${pts.join(' L')}`, pen: { x: pen, y: yAt(now, gap) }, events };
}

// ---------- the hills ----------
// Day hills under the line (an SVG 240 high) and night hills at the foot of the page (320 high), far to near.
// They drift left from the same clock, the far ones slower: `rate` is a share of the line's speed.
export const HILLS = {
  day: { height: 240, layers: [
    { base: 70, amp: 24, rate: 0.22, seed: 0.3 },
    { base: 112, amp: 20, rate: 0.38, seed: 2.1 },
    { base: 156, amp: 15, rate: 0.6, seed: 4.4 },
    { base: 200, amp: 9, rate: 0.9, seed: 1.2 },
  ] },
  night: { height: 320, layers: [
    { base: 118, amp: 26, rate: 0.18, seed: 5.2 },
    { base: 192, amp: 18, rate: 0.32, seed: 3.3 },
    { base: 252, amp: 10, rate: 0.5, seed: 0.9 },
  ] },
};

function hillY(h, x, offset) {
  const u = x + offset;
  return h.base + h.amp * (0.62 * Math.sin(u / 190 + h.seed) + 0.28 * Math.sin(u / 87 + h.seed * 2.3) + 0.1 * Math.sin(u / 39 + h.seed * 4.1));
}

/** A hill's top edge, `t` seconds in, `width` px wide. */
export function hillLine(h, t, width, speed = SPEED) {
  const pts = [];
  for (let x = 0; x <= width + 16; x += 16) pts.push(`${x} ${hillY(h, x, t * speed * h.rate).toFixed(1)}`);
  return `M${pts.join(' L')}`;
}

/** A hill as a filled shape down to `bottom`. */
export const hillShape = (h, t, width, bottom, speed = SPEED) =>
  `${hillLine(h, t, width, speed)} L${width + 16} ${bottom} L0 ${bottom}Z`;

// ---------- event icons (24 x 24, stroked in currentColor) ----------
export const ICONS = {
  sleep: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  med: '<g transform="rotate(-35 12 12)"><rect x="3" y="8.5" width="18" height="7" rx="3.5"/><path d="M12 8.5v7"/></g>',
  coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1 1 1.2 1 2.2M12 3.5c0 1 1 1.2 1 2.2"/>',
  nausea: '<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  period: '<path d="M12 4.5 20.5 19h-17z"/>',
  end: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
};
/** Each kind's icon colour. */
export const INK = { sleep: '#5856d6', med: '#0062cc', coffee: '#8a5a2b', nausea: '#0062cc', light: '#0062cc', period: '#e0352b', end: '#248a3d' };

/** An event's visible name: "Pain 8/10", or the kind's name from the page copy. */
export const eventLabel = (e, names, pain) => (e.kind === 'pain' ? `${pain} ${e.level}/10` : names[e.kind]);
