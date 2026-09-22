// Builds public/models/{iphone,ipad}.glb from the Sketchfab downloads (credited in src/data/copy.mjs):
//   node scripts/make-models.mjs ~/Downloads/iphone_17_pro.glb ~/Downloads/ipad_pro13in_black_m4.glb
// Each model comes out centred, screen facing +Z with its top at +Y, and a material named "Screen"
// with texture coordinates 0–1 reading left→right, top→bottom; the page puts the screenshot there.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, weld, flatten, join, textureCompress, meshopt, getBounds } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [iphoneSrc, ipadSrc] = process.argv.slice(2);
if (!iphoneSrc || !ipadSrc) {
  console.error('usage: node scripts/make-models.mjs <iphone_17_pro.glb> <ipad_pro13in_black_m4.glb>');
  process.exit(1);
}

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const sub = (a, b) => a.map((x, k) => x - b[k]);

async function build(src, out, prepare) {
  const doc = await io.read(src);
  const root = doc.getRoot();
  const scene = root.listScenes()[0];
  prepare(root);

  // The screen is the one material carrying an emissive image (the model's own wallpaper).
  const screens = root.listNodes().filter((n) => n.getMesh()?.listPrimitives().some((p) => p.getMaterial()?.getEmissiveTexture()));
  if (screens.length !== 1) throw new Error(`${src}: expected one screen mesh, found ${screens.length}`);
  const screen = screens[0];
  const prim = screen.getMesh().listPrimitives()[0];
  prim.getMaterial().setName('Screen').setEmissiveTexture(null).setBaseColorTexture(null)
    .setEmissiveFactor([0, 0, 0]).setBaseColorFactor([0, 0, 0, 1]).setDoubleSided(false);

  // Fit screen position ≈ O + u·A + v·B (world space) to learn which way the picture runs.
  const W = screen.getWorldMatrix();
  const toWorld = (p, w = 1) => [0, 1, 2].map((i) => W[i] * p[0] + W[4 + i] * p[1] + W[8 + i] * p[2] + w * W[12 + i]);
  const toLocal = (v) => [0, 1, 2].map((r) => dot([W[r * 4], W[r * 4 + 1], W[r * 4 + 2]], v)); // Wᵀ; fine for rotation + uniform scale
  const pos = prim.getAttribute('POSITION'), uv = prim.getAttribute('TEXCOORD_0'), nrm = prim.getAttribute('NORMAL');
  const P = [], U = [];
  for (let i = 0; i < pos.getCount(); i++) { P.push(toWorld(pos.getElement(i, []))); U.push(uv.getElement(i, [])); }
  const pm = [0, 1, 2].map((k) => P.reduce((s, p) => s + p[k], 0) / P.length);
  const um = [0, 1].map((k) => U.reduce((s, u) => s + u[k], 0) / U.length);
  let suu = 0, suv = 0, svv = 0; const pu = [0, 0, 0], pv = [0, 0, 0];
  P.forEach((p, i) => {
    const du = U[i][0] - um[0], dv = U[i][1] - um[1];
    suu += du * du; suv += du * dv; svv += dv * dv;
    for (let k = 0; k < 3; k++) { pu[k] += (p[k] - pm[k]) * du; pv[k] += (p[k] - pm[k]) * dv; }
  });
  const det = suu * svv - suv * suv;
  const A = [0, 1, 2].map((k) => (pu[k] * svv - pv[k] * suv) / det);
  const B = [0, 1, 2].map((k) => (pv[k] * suu - pu[k] * suv) / det);

  // Facing: away from the device's centre (vertex normals can't be trusted; the iPhone's point inward).
  const b0 = getBounds(scene);
  let n = unit(cross(A, B));
  if (dot(n, sub(pm, b0.min.map((v, k) => (v + b0.max[k]) / 2))) < 0) n = n.map((x) => -x);
  const up = unit(B.map((x) => -x).map((x, k, v) => x - dot(v, n) * n[k])); // glTF v runs top→bottom
  const right = cross(up, n);

  if (dot(A, right) < 0) { // mirrored picture: flip u
    for (let i = 0; i < uv.getCount(); i++) { const e = uv.getElement(i, []); uv.setElement(i, [1 - e[0], e[1]]); }
  }
  const idx = prim.getIndices();
  const tri = [0, 1, 2].map((j) => P[idx.getScalar(j)]);
  if (dot(cross(sub(tri[1], tri[0]), sub(tri[2], tri[0])), n) < 0) { // wound inward: reverse every triangle
    for (let t = 0; t < idx.getCount(); t += 3) {
      const a = idx.getScalar(t + 1); idx.setScalar(t + 1, idx.getScalar(t + 2)); idx.setScalar(t + 2, a);
    }
  }
  const scale2 = dot(W.slice(0, 3), W.slice(0, 3));
  const nLocal = unit(toLocal(n));
  const lift = toLocal(n).map((x) => (x * 0.00015) / scale2); // 0.15 mm off any coplanar backing panel
  for (let i = 0; i < pos.getCount(); i++) {
    pos.setElement(i, pos.getElement(i, []).map((x, k) => x + lift[k]));
    nrm.setElement(i, nLocal);
  }

  // Rotate so right→+X, up→+Y, n→+Z, then centre.
  const [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]] = [right, up, n];
  const tr = m00 + m11 + m22;
  let q;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; q = [(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, s / 4]; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; q = [s / 4, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s]; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; q = [(m01 + m10) / s, s / 4, (m12 + m21) / s, (m02 - m20) / s]; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; q = [(m02 + m20) / s, (m12 + m21) / s, s / 4, (m10 - m01) / s]; }
  const turn = doc.createNode('Turn').setRotation(q);
  for (const c of scene.listChildren()) { scene.removeChild(c); turn.addChild(c); }
  const centre = doc.createNode('Centre').addChild(turn);
  scene.addChild(centre);
  const b1 = getBounds(scene);
  centre.setTranslation(b1.min.map((v, k) => -(v + b1.max[k]) / 2));

  await doc.transform(
    prune({ keepLeaves: false, keepAttributes: true }), dedup(), flatten(), join(), weld(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [512, 512], quality: 80 }),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  await io.write(out, doc);
  const b = getBounds(doc.getRoot().listScenes()[0]);
  console.log(`wrote ${out}: ${b.max.map((v, k) => ((v - b.min[k]) * 1000).toFixed(1)).join(' × ')} mm`);
}

mkdirSync('public/models', { recursive: true });

await build(iphoneSrc, 'public/models/iphone.glb', (root) => {
  // The model is Silver; repaint the aluminium, back glass and antenna lines in Deep Blue (linear RGB).
  const paint = { Anodized_aluminum: [0.028, 0.045, 0.085], Frosted_glass: [0.032, 0.05, 0.09], Plastic_antena: [0.02, 0.028, 0.045] };
  for (const [name, rgb] of Object.entries(paint)) root.listMaterials().find((m) => m.getName() === name).setBaseColorFactor([...rgb, 1]);
  // Its cover glass uses transmission, which renders opaque black over the screen; make it a thin reflective layer.
  const glass = root.listMaterials().find((m) => m.getName() === 'Glass');
  glass.setExtension('KHR_materials_transmission', null)
    .setAlphaMode('BLEND').setBaseColorFactor([0, 0, 0, 0.06]).setRoughnessFactor(0.05).setMetallicFactor(0);
});

await build(ipadSrc, 'public/models/ipad.glb', (root) => {
  // USDRoot holds the Apple Pencil, the Magic Keyboard and the iPad, in that order. Keep the iPad.
  const usd = root.listNodes().find((n) => n.getName() === 'USDRoot');
  for (const part of usd.listChildren().slice(0, 2)) part.traverse((n) => n.dispose());
});
