// The hero's iPhone and iPad as real 3D models. The CSS devices in DeviceGroup.astro stay underneath as the
// first paint and the fallback; this fades in over them once everything has loaded, and removes itself on any error.
// The scene copies the CSS rig exactly: each model fills its .dev box, placed by the same perspective, transforms
// and sway animation, read from the computed styles every frame. So the CSS stays the one place to change the layout.
import {
  ACESFilmicToneMapping, Box3, DirectionalLight, Group, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera,
  PMREMGenerator, Scene, SRGBColorSpace, Texture, Vector3, WebGLRenderer, type Object3D,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export async function mount(stage: HTMLElement, urls: { iphone: string; ipad: string }) {
  const rigEl = stage.querySelector<HTMLElement>('.rig');
  const phoneEl = stage.querySelector<HTMLElement>('.dev.iphone');
  const ipadEl = stage.querySelector<HTMLElement>('.dev.ipad');
  const phoneImg = phoneEl?.querySelector('img');
  const ipadImg = ipadEl?.querySelector('img');
  if (!rigEl || !phoneEl || !ipadEl || !phoneImg || !ipadImg) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'stage-3d';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  try {
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    // A light from behind and above catches the edges, so the dark devices don't vanish into a dark page.
    const rim = new DirectionalLight(0xffffff, 2.5);
    rim.position.set(-0.6, 1, -0.8);
    scene.add(rim);

    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const [iphone, ipad] = await Promise.all([
      loader.loadAsync(urls.iphone).then((g) => g.scene),
      loader.loadAsync(urls.ipad).then((g) => g.scene),
      phoneImg.decode(), ipadImg.decode(),
    ]);
    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    showScreenshot(iphone, phoneImg, anisotropy);
    showScreenshot(ipad, ipadImg, anisotropy);

    // Work in the stage's CSS pixels (y down); one flip turns that into three's y-up world.
    const css = new Group();
    css.scale.set(1, -1, 1);
    scene.add(css);
    const devices = [fitBox(ipad, ipadEl), fitBox(iphone, phoneEl)];
    for (const d of devices) css.add(d.holder);

    const camera = new PerspectiveCamera();
    const rigMatrix = new Matrix4();
    const place = () => {
      const rig = cssMatrix(rigEl, rigMatrix);
      for (const d of devices) d.place(rig);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = stage;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      // CSS `perspective: d` with `perspective-origin: ox oy`: an eye d px in front of that point, looking straight in.
      const s = getComputedStyle(stage);
      const d = parseFloat(s.perspective) || 1500;
      const [ox, oy] = s.perspectiveOrigin.split(' ').map(parseFloat);
      const fullW = 2 * Math.max(ox, w - ox), fullH = 2 * Math.max(oy, h - oy);
      camera.fov = (2 * Math.atan(fullH / 2 / d) * 180) / Math.PI;
      camera.aspect = fullW / fullH;
      camera.near = 10;
      camera.far = d * 4;
      camera.position.set(ox, -oy, d);
      camera.setViewOffset(fullW, fullH, fullW / 2 - ox, fullH / 2 - oy, w, h);
    };
    const render = () => { place(); renderer.render(scene, camera); };

    resize();
    render();
    stage.append(canvas);
    requestAnimationFrame(() => stage.classList.add('is-3d'));

    // The CSS sway keeps running (invisibly) under the canvas; while it can move, follow it every frame.
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    const loop = () => renderer.setAnimationLoop(still.matches || !visible || document.hidden ? null : render);
    new ResizeObserver(() => { resize(); render(); }).observe(stage);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; loop(); }).observe(stage);
    document.addEventListener('visibilitychange', loop);
    still.addEventListener('change', () => { loop(); render(); });
    // The screenshots follow the colour scheme: <picture> swaps its source and the <img> fires load.
    for (const img of [phoneImg, ipadImg]) img.addEventListener('load', render);
    loop();
  } catch (err) {
    renderer.dispose();
    canvas.remove();
    stage.classList.remove('is-3d');
    console.warn('3D devices unavailable, keeping the flat ones', err);
  }
}

// An element's CSS transform about its transform-origin, as a matrix in its parent's pixel space.
function cssMatrix(el: HTMLElement, out: Matrix4) {
  const s = getComputedStyle(el);
  const [ox, oy, oz = 0] = s.transformOrigin.split(' ').map(parseFloat);
  const t = s.transform === 'none' ? new Matrix4() : new Matrix4().fromArray(new DOMMatrix(s.transform).toFloat32Array());
  return out.makeTranslation(ox, oy, oz).multiply(t).multiply(new Matrix4().makeTranslation(-ox, -oy, -oz));
}

// Scales a model (metres, centred, screen facing +Z) to its .dev box's height, screen in the box's plane.
function fitBox(model: Object3D, el: HTMLElement) {
  const size = new Box3().setFromObject(model, true).getSize(new Vector3()); // precise: parts sit under rotated nodes
  const holder = new Group();
  holder.matrixAutoUpdate = false;
  holder.add(model);
  const own = new Matrix4();
  return {
    holder,
    place(rig: Matrix4) {
      const k = el.offsetHeight / size.y;
      model.scale.set(k, -k, k); // y down in CSS space
      model.position.set(el.offsetWidth / 2, el.offsetHeight / 2, (-size.z / 2) * k);
      cssMatrix(el, own).premultiply(new Matrix4().makeTranslation(el.offsetLeft, el.offsetTop, 0));
      holder.matrix.multiplyMatrices(rig, own);
      holder.matrixWorldNeedsUpdate = true;
    },
  };
}

// Paints the page's own <img> (already downloaded, and already the right colour scheme) onto the model's screen.
function showScreenshot(model: Object3D, img: HTMLImageElement, anisotropy: number) {
  const map = new Texture(img);
  map.colorSpace = SRGBColorSpace;
  map.flipY = false;
  map.anisotropy = anisotropy;
  map.needsUpdate = true;
  img.addEventListener('load', () => { map.needsUpdate = true; });
  let found = false;
  model.traverse((o) => {
    if (o instanceof Mesh && o.material.name === 'Screen') {
      o.material = new MeshBasicMaterial({ map, toneMapped: false });
      found = true;
    }
  });
  if (!found) throw new Error('model has no Screen material');
}
