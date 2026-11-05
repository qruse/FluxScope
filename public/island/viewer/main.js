// HSL Island viewer: the tutorial island in 3D, playable by a human with the same tank controls the AI gets
// (forward/back, turn left/right, interact, eat, sleep). Survival rules come from ../rules.json.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const [island, rules] = await Promise.all([
  fetch('../maps/tutorial.json').then((r) => r.json()),
  fetch('../rules.json').then((r) => r.json()),
]);
const N = island.size + 1;
const H = island.heights;

// ---------- terrain helpers ----------
function heightAt(x, z) {
  const cx = Math.min(Math.max(x, 0), island.size - 1e-4);
  const cz = Math.min(Math.max(z, 0), island.size - 1e-4);
  const i = Math.floor(cx), j = Math.floor(cz), fx = cx - i, fz = cz - j;
  const a = H[j][i], b = H[j][i + 1], c = H[j + 1][i], d = H[j + 1][i + 1];
  return (a * (1 - fx) + b * fx) * (1 - fz) + (c * (1 - fx) + d * fx) * fz;
}
const inSpring = (x, z, pad = 0) => Math.hypot(x - island.spring.x, z - island.spring.z) < island.spring.r + pad;

// ---------- scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;   // tames the highlights but keeps the toy colours saturated
renderer.toneMappingExposure = 1.05;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x9fd3e6, 60, 140);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 400);

const hemi = new THREE.HemisphereLight(0xdff3ff, 0x6b8f5a, 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1d6, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 160 });
sun.target.position.set(32, 0, 32);
scene.add(sun, sun.target);
// soft fill light riding on the camera, so whatever faces the viewer is never pitch dark
const fill = new THREE.DirectionalLight(0xfff4e6, 0.8);
fill.position.set(0.3, 0.6, 1);
fill.target.position.set(0, 0, -5);
camera.add(fill, fill.target);
scene.add(camera);

// a fixed random stream, so the scenery is the same on every run and every recording
const rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(1234567);

// terrain mesh: one vertex per height sample, coloured by zone
let terrainMesh;
{
  const pos = [], col = [], idx = [];
  const c = new THREE.Color();
  const sand = new THREE.Color(0xe9d7a5), wetSand = new THREE.Color(0xcdb983), grass = new THREE.Color(0x8fbf5f),
    forest = new THREE.Color(0x5f9a4a), rock = new THREE.Color(0x9a958c), seabed = new THREE.Color(0xc8b98a), dirt = new THREE.Color(0x6e5a44);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const h = H[j][i];
    pos.push(i, h, j);
    const slope = Math.abs((H[j][Math.min(i + 1, N - 1)] - H[j][Math.max(i - 1, 0)])) + Math.abs((H[Math.min(j + 1, N - 1)][i] - H[Math.max(j - 1, 0)][i]));
    if (h < 0) c.copy(seabed).lerp(new THREE.Color(0x6f8f9a), Math.min(1, -h / 2.6));
    else if (h < 0.55) c.copy(wetSand).lerp(sand, h / 0.55);
    else if (h < 0.95) c.copy(sand).lerp(grass, (h - 0.55) / 0.4);
    else if (slope > 1.2 || h > 3.6) c.copy(rock);
    else if (i > 30 && j > 30) c.copy(forest);
    else c.copy(grass);
    // broad patches of lighter and darker ground, then a little grain
    const patch = Math.sin(i * 0.31 + j * 0.17) * Math.sin(i * 0.13 - j * 0.29);
    if (h >= 0.55) c.offsetHSL(patch * 0.02, patch * 0.05, patch * 0.03);
    c.offsetHSL(0, 0, ((i * 928371 + j * 12377) % 100) / 2500 - 0.02);
    const fromCave = Math.hypot(i - island.cave.x, j - island.cave.z);    // the cave floor is bare dirt
    if (fromCave < 3) c.lerp(dirt, Math.min(1, (3 - fromCave) / 0.8));
    col.push(c.r, c.g, c.b);
  }
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    const a = j * N + i, b = a + 1, d = a + N, e = d + 1;
    idx.push(a, d, b, b, d, e);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const terrain = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  terrain.receiveShadow = true;
  scene.add(terrain);
  terrainMesh = terrain;
}

// sea and spring (a deep seabed hides the square edge of the terrain mesh)
const seabed = new THREE.Mesh(new THREE.PlaneGeometry(400, 400, 1, 1), new THREE.MeshLambertMaterial({ color: 0x6f8f9a }));
seabed.rotation.x = -Math.PI / 2;
seabed.position.set(32, -2.62, 32);
scene.add(seabed);
const waterTime = { value: 0 };   // every water shader reads this one clock, driven by the frame time, so recordings repeat
const sea = new THREE.Mesh(new THREE.PlaneGeometry(400, 400, 220, 220),
  new THREE.MeshPhongMaterial({ color: 0x2f9dbd, specular: 0x2c5a66, shininess: 40, flatShading: true, transparent: true, opacity: 0.8 }));
sea.material.onBeforeCompile = (sh) => {
  sh.uniforms.uTime = waterTime;
  sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position;
    transformed.z += 0.045 * sin(position.x * 0.55 + uTime * 0.9) + 0.035 * sin(position.y * 0.8 - uTime * 1.2) + 0.02 * sin((position.x + position.y) * 1.3 + uTime * 1.7);`);
};
sea.rotation.x = -Math.PI / 2;
sea.position.set(32, 0, 32);
scene.add(sea);
// foam along the shore: the waterline traced from the height samples, breathing in and out with the same clock
const shoreFoam = new THREE.Mesh(new THREE.BufferGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
{
  const p = [], out = [], edge = [], idx = [];
  const cross = (i, j, i2, j2) => {
    const a = H[j][i], b = H[j2][i2];
    if ((a < 0) === (b < 0)) return null;
    const t = a / (a - b);
    return [i + (i2 - i) * t, j + (j2 - j) * t];
  };
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    const c = [cross(i, j, i + 1, j), cross(i + 1, j, i + 1, j + 1), cross(i, j + 1, i + 1, j + 1), cross(i, j, i, j + 1)].filter(Boolean);
    if (c.length !== 2) continue;
    const a = p.length / 3;
    for (const [x, z] of c) {
      const gx = heightAt(x + 0.5, z) - heightAt(x - 0.5, z), gz = heightAt(x, z + 0.5) - heightAt(x, z - 0.5), l = Math.hypot(gx, gz) || 1;
      p.push(x, 0.06, z, x, 0.06, z);
      out.push(-gx / l, -gz / l, -gx / l, -gz / l);
      edge.push(0, 1);
    }
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  shoreFoam.geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  shoreFoam.geometry.setAttribute('aOut', new THREE.Float32BufferAttribute(out, 2));
  shoreFoam.geometry.setAttribute('aEdge', new THREE.Float32BufferAttribute(edge, 1));
  shoreFoam.geometry.setIndex(idx);
  shoreFoam.frustumCulled = false;
  shoreFoam.material.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = waterTime;
    sh.vertexShader = 'attribute vec2 aOut;\nattribute float aEdge;\nuniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position;
      transformed.xz += aOut * (aEdge * (0.3 + 0.2 * sin(uTime * 0.8 + position.x * 0.6 + position.z * 0.4)) - 0.05);`);
  };
  scene.add(shoreFoam);
}

// sky: a gradient dome with stars, moon and sun that rides along with the camera, and clouds drifting around the island
const skyColors = { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } };
const skyGroup = new THREE.Group();
const skyDome = new THREE.Mesh(new THREE.SphereGeometry(380, 24, 12), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyColors,
  vertexShader: 'varying float vY;\nvoid main() {\n  vY = normalize(position).y;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}',
  fragmentShader: 'uniform vec3 top;\nuniform vec3 bottom;\nvarying float vY;\nvoid main() {\n  gl_FragColor = vec4(mix(bottom, top, pow(clamp(vY, 0.0, 1.0), 0.55)), 1.0);\n  #include <tonemapping_fragment>\n  #include <colorspace_fragment>\n}',
}));
skyDome.renderOrder = -2;
const stars = (() => {
  const p = [];
  for (let k = 0; k < 1400; k++) {
    const a = rnd() * Math.PI * 2, u = 0.04 + rnd() * 0.96, r = Math.sqrt(1 - u * u);
    p.push(Math.cos(a) * r * 360, u * 360, Math.sin(a) * r * 360);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false, toneMapped: false }));
})();
stars.renderOrder = -1;
const skyBall = (r, color) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), new THREE.MeshBasicMaterial({ color, fog: false, toneMapped: false, transparent: true, depthWrite: false }));
  m.renderOrder = -1;
  return m;
};
const moon = skyBall(10, 0xf3efd8), sunDisc = skyBall(13, 0xfff3c4);
moon.position.set(-190, 200, -170);
skyGroup.add(skyDome, stars, moon, sunDisc);
scene.add(skyGroup);
const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x777777, fog: false });   // soft, so they never read as flying rocks
const clouds = new THREE.Group();
clouds.position.set(32, 0, 32);
for (let k = 0; k < 18; k++) {
  const cl = new THREE.Group(), a = rnd() * Math.PI * 2, d = 95 + rnd() * 130, size = 5 + rnd() * 7;
  for (let n = 0, puffs = 3 + Math.floor(rnd() * 3); n < puffs; n++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(size * (0.6 + rnd() * 0.5), 2), cloudMat);
    m.position.set((n - puffs / 2) * size * 0.95, rnd() * size * 0.25, (rnd() - 0.5) * size);
    m.scale.y = 0.5;
    m.rotation.y = rnd() * 3;
    cl.add(m);
  }
  cl.position.set(Math.cos(a) * d, 16 + rnd() * 20, Math.sin(a) * d);
  cl.rotation.y = -a;
  clouds.add(cl);
}
scene.add(clouds);
const spring = new THREE.Mesh(new THREE.CircleGeometry(island.spring.r, 28),
  new THREE.MeshLambertMaterial({ color: 0x6cc7e8, transparent: true, opacity: 0.9 }));
spring.rotation.x = -Math.PI / 2;
spring.position.set(island.spring.x, island.spring.y, island.spring.z);
scene.add(spring);

// ---------- props (low-poly, built from primitives) ----------
const M = (color) => new THREE.MeshLambertMaterial({ color, flatShading: true });
const mats = {
  bark: M(0x8a5a3b), palmBark: M(0xa77b4f), leaf: M(0x4f9a3f), leafLight: M(0x6bb04c), palmLeaf: M(0x5fae4a), dark: M(0x3f7f3a),
  rock: M(0x8f8b84), berry: M(0xd23b4b), coconut: M(0x6b4a2b), grass: M(0x7fbf4f), drift: M(0xb59a78), fish: M(0x2f6f86),
};
function shadowed(o) { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; }
const swayers = [];   // tree tops that move a little in the wind

function makePalm(o) {
  const g = new THREE.Group();
  let y = 0, x = 0;
  for (let k = 0; k < 5; k++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.16 - k * 0.015, 0.2 - k * 0.015, 0.9, 6), mats.palmBark);
    x += 0.12 * k;
    seg.position.set(x, y + 0.45, 0);
    seg.rotation.z = -0.12 * k;
    g.add(seg);
    y += 0.86;
  }
  const crown = new THREE.Group();
  crown.position.set(x + 0.2, y + 0.1, 0);
  for (let k = 0; k < 9; k++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.2 + (k % 3) * 0.25, 4), k % 2 ? mats.dark : mats.palmLeaf);
    leaf.scale.set(1, 1, 0.25);
    leaf.rotation.set(0, (k / 9) * Math.PI * 2, 1.75 + (k % 3) * 0.16);
    leaf.translateY(1.0);
    crown.add(leaf);
  }
  g.add(crown);
  swayers.push(crown);
  const nuts = new THREE.Group();
  for (let k = 0; k < 3; k++) {
    const n = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 0), mats.coconut);
    n.position.set(x + 0.15 + Math.cos(k * 2.1) * 0.18, y - 0.15, Math.sin(k * 2.1) * 0.18);
    nuts.add(n);
  }
  g.add(nuts);
  g.userData.stockMeshes = nuts.children;
  return g;
}
function makeTree(o) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 1.7, 6), mats.bark);
  trunk.position.y = 0.85;
  const crown = new THREE.Group();
  crown.position.y = 1.6;
  const v = Math.abs(Math.sin(o.x * 12.9 + o.z * 78.2));     // no two trees quite alike
  const lobes = [[0, 0.7, 0, 1.15, mats.leaf], [0.3 + v * 0.3, 1.5, 0.1, 0.8, mats.dark], [-0.55, 1.05, 0.35 - v * 0.6, 0.72, mats.leaf], [0.15, 0.95, -0.6 + v * 0.3, 0.68, mats.leafLight]];
  for (const [x, y, z, r, mat] of lobes) {
    const top = new THREE.Mesh(new THREE.IcosahedronGeometry(r * (0.9 + v * 0.2), 0), mat);
    top.position.set(x, y, z);
    top.rotation.y = v * 3 + x;
    crown.add(top);
  }
  g.add(trunk, crown);
  swayers.push(crown);
  return g;
}
function makeBush() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 0), mats.dark);
  b.scale.set(1.2, 0.8, 1.1);
  b.position.y = 0.4;
  const b2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), mats.leaf);
  b2.position.set(0.38, 0.3, -0.25);
  g.add(b, b2);
  const berries = new THREE.Group();
  for (let k = 0; k < 4; k++) {
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 0), mats.berry);
    const a = k * 1.7;
    s.position.set(Math.cos(a) * 0.62, 0.45 + (k % 2) * 0.2, Math.sin(a) * 0.55);
    berries.add(s);
  }
  g.add(berries);
  g.userData.stockMeshes = berries.children;
  return g;
}
function makeRock() {
  const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), mats.rock);
  r.scale.set(1.2, 0.75, 1);
  r.position.y = 0.25;
  return new THREE.Group().add(r);
}
function makeGrass() {
  const g = new THREE.Group();
  for (let k = 0; k < 5; k++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.7, 3), mats.grass);
    blade.position.set(Math.cos(k * 1.3) * 0.18, 0.35, Math.sin(k * 1.3) * 0.18);
    blade.rotation.z = Math.cos(k) * 0.3;
    g.add(blade);
  }
  return g;
}
function makeDrift() {
  const d = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 1.6, 6), mats.drift);
  d.rotation.z = Math.PI / 2;
  d.position.y = 0.1;
  return new THREE.Group().add(d);
}
function makeFish() {
  const g = new THREE.Group();
  for (let k = 0; k < 4; k++) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), mats.fish);
    f.rotation.z = Math.PI / 2;
    g.add(f);
  }
  return g;
}
const makers = { palm: makePalm, tree: makeTree, bush: makeBush, rock: makeRock, grass: makeGrass, driftwood: makeDrift, fish: makeFish };
const names = { palm: 'palm', tree: 'tree', bush: 'berry bush', rock: 'rock', grass: 'grass', driftwood: 'driftwood', fish: 'fish school', spring: 'spring' };
const itemNames = { wood: 'wood', stone: 'stone', fiber: 'fiber', berry: 'berry', coconut: 'coconut', fish: 'fish', spear: 'spear', can: 'can of food', net: 'fishing net' };

// the cave: a hollow rock dome with its opening toward the island and a warm glow inside, so you can see who is in there;
// standing inside its radius keeps you warm
const caveMesh = new THREE.Group();
{
  const cv = island.cave;
  const rockM = M(0x8a857c), R = 2.75, gap = 1.75;
  const shell = (r, mat) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 8, Math.PI / 2 + gap / 2, Math.PI * 2 - gap, 0, Math.PI * 0.62), mat);
    m.scale.y = 0.88;
    return m;
  };
  const inner = new THREE.MeshLambertMaterial({ color: 0x51443a, emissive: 0x241a12, emissiveIntensity: 0.5, flatShading: true, side: THREE.BackSide });
  caveMesh.add(shell(R + 0.3, rockM), shell(R, inner));
  // stones laid along both edges of the opening make a rough arch, and boulders behind break up the dome's outline
  const arch = [[90, 0.6], [70, 0.52], [50, 0.46], [30, 0.4], [12, 0.34]].flatMap(([deg, r]) => {
    const th = (deg * Math.PI) / 180, side = Math.sin(gap / 2) * (R + 0.15) * Math.sin(th), y = (R + 0.15) * 0.88 * Math.cos(th), z = Math.cos(gap / 2) * (R + 0.15) * Math.sin(th);
    return [[side, y, z, r], [-side, y, z, r]];
  });
  for (const [x, y, z, r] of [...arch, [2.2, 0.2, -2.4, 1.5], [-2.3, 0.1, -2.1, 1.3], [0.2, 2.5, -1.1, 0.85]]) {
    const b = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), rockM);
    b.position.set(x, y, z);
    b.rotation.set(x, z, y);
    caveMesh.add(b);
  }
  const glow = new THREE.PointLight(0xffb070, 3, 7, 1.8);
  glow.position.set(0, 1.0, -0.4);
  caveMesh.add(glow);
  caveMesh.position.set(cv.x, cv.y, cv.z);
  caveMesh.rotation.y = cv.facing;
  shadowed(caveMesh);
  scene.add(caveMesh);
}
const inCave = (x, z) => Math.hypot(x - island.cave.x, z - island.cave.z) < island.cave.r;

// today's crate (flotsam): lands on a random coast point at 06:00, gone at nightfall if unopened
const crateMesh = new THREE.Group();
{
  const wood = M(0xa3784e), dark = M(0x6e4f33);
  crateMesh.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.45), wood));
  for (const y of [-0.12, 0.12]) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.47), dark);
    plank.position.y = y;
    crateMesh.add(plank);
  }
  crateMesh.visible = false;
  shadowed(crateMesh);
  scene.add(crateMesh);
}
function placeCrate(c) {
  crateMesh.visible = !!c?.active;
  if (c?.active) { crateMesh.position.set(c.x, heightAt(c.x, c.z) + 0.2, c.z); crateMesh.rotation.y = c.x * 1.7; }
}

// hidden fishing spots: invisible to the castaways; the audience can see them (H) as pale water with fish in it
const spotPatchMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false, toneMapped: false, map: (() => {
  const c = Object.assign(document.createElement('canvas'), { width: 256, height: 256 }), p = c.getContext('2d');
  const grad = p.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(150,240,225,.20)');
  grad.addColorStop(0.8, 'rgba(170,245,230,.30)');
  grad.addColorStop(0.93, 'rgba(235,255,245,.62)');
  grad.addColorStop(1, 'rgba(235,255,245,0)');
  p.fillStyle = grad;
  p.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})() });
const spotFishGeo = (() => {
  const f = new THREE.Shape();
  f.moveTo(0.34, 0);
  f.quadraticCurveTo(0.08, 0.14, -0.2, 0.03);
  f.lineTo(-0.38, 0.12);
  f.lineTo(-0.34, 0);
  f.lineTo(-0.38, -0.12);
  f.lineTo(-0.2, -0.03);
  f.quadraticCurveTo(0.08, -0.14, 0.34, 0);
  return new THREE.ShapeGeometry(f).rotateX(-Math.PI / 2);
})();
const spotFishMat = new THREE.MeshBasicMaterial({ color: 0x08293a, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide });
const spotMarks = island.fishSpots.map((s) => {
  const g = new THREE.Group();
  g.position.set(s.x, 0.03, s.z);
  // a patch of paler water, brighter toward its edge, so the place reads from any distance
  const patch = new THREE.Mesh(new THREE.CircleGeometry(s.r, 48), spotPatchMat);
  patch.rotation.x = -Math.PI / 2;
  patch.position.y = 0.09;
  g.add(patch);
  // dark fish shapes circling just under the surface: one per fish really there, so a fished-out spot goes empty
  const fish = [];
  for (let k = 0; k < s.cap; k++) {
    const f = new THREE.Mesh(spotFishGeo, spotFishMat);
    f.scale.setScalar(1.15 + (k % 3) * 0.2);
    g.add(f);
    fish.push(f);
  }
  g.userData.fish = fish;
  // now and then one leaps, with a ring where it comes down
  const leap = new THREE.Group();
  const leapBody = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15, 0), M(0xcfe9f2));
  leapBody.scale.set(1.8, 0.65, 0.5);
  const leapTail = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.2, 3), M(0xcfe9f2));
  leapTail.position.x = -0.32;
  leapTail.rotation.z = -Math.PI / 2;
  leap.add(leapBody, leapTail);
  g.add(leap);
  const plop = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  plop.rotation.x = -Math.PI / 2;
  plop.position.y = 0.1;
  g.add(plop);
  Object.assign(g.userData, { leap, plop, r: s.r });
  g.visible = false;
  scene.add(g);
  return g;
});
const blocking = { palm: 0.45, tree: 0.55, rock: 0.7, bush: 0.6 };

const props = island.objects.map((o) => {
  const mesh = shadowed(makers[o.kind](o));
  mesh.position.set(o.x, o.kind === 'fish' ? -0.25 : o.y, o.z);
  mesh.rotation.y = o.rot;
  scene.add(mesh);
  return { ...o, mesh, stock: o.berries ?? o.coconuts ?? 1, hits: 0, timer: 0, gone: false };
});

// small scenery with no game meaning: tufts, flowers and pebbles, kept away from anything the castaway can use
{
  const clear = (x, z) => !inSpring(x, z, 0.6) && Math.hypot(x - island.cave.x, z - island.cave.z) > island.cave.r + 1.6 && props.every((p) => Math.hypot(p.x - x, p.z - z) > 1);
  const scatter = (geo, mat, n, size, ok) => {
    const m = new THREE.InstancedMesh(geo, mat, n), o = new THREE.Object3D();
    let placed = 0;
    for (let t = 0; placed < n && t < n * 40; t++) {
      const x = 2 + rnd() * (island.size - 4), z = 2 + rnd() * (island.size - 4), h = heightAt(x, z);
      if (!ok(h, x, z) || !clear(x, z)) continue;
      o.position.set(x, h, z);
      o.rotation.set((rnd() - 0.5) * 0.35, rnd() * 6.28, (rnd() - 0.5) * 0.35);
      o.scale.setScalar(size * (0.6 + rnd() * 0.8));
      o.updateMatrix();
      m.setMatrixAt(placed++, o.matrix);
    }
    m.count = placed;
    m.receiveShadow = true;
    scene.add(m);
  };
  const lifted = (geo, y) => { geo.translate(0, y, 0); return geo; };
  const steep = (x, z) => Math.abs(heightAt(x + 1, z) - heightAt(x - 1, z)) + Math.abs(heightAt(x, z + 1) - heightAt(x, z - 1)) > 1.1;   // bare rock
  const onGrass = (h, x, z) => h > 0.95 && h < 3.4 && !steep(x, z);
  scatter(lifted(new THREE.ConeGeometry(0.045, 0.24, 3), 0.11), M(0x6fae45), 1300, 1, onGrass);
  scatter(lifted(new THREE.IcosahedronGeometry(0.038, 0), 0.05), M(0xf4d35e), 170, 1, onGrass);
  scatter(lifted(new THREE.IcosahedronGeometry(0.038, 0), 0.05), M(0xe88fb0), 130, 1, onGrass);
  scatter(lifted(new THREE.DodecahedronGeometry(0.09, 0), 0.03), M(0xa9a39a), 320, 1, (h) => h > 0.05 && h < 0.85);
}
// what the camera may not look through: everything solid, not the water and not the castaway
const occluders = [terrainMesh, caveMesh, ...props.filter((p) => !['grass', 'driftwood', 'fish'].includes(p.kind)).map((p) => p.mesh)];

// ---------- the cast: three chunky low-poly castaways, one per algorithm (about 1.3 m tall) ----------
// Each character keeps its brain for the whole series, so the habits it learns become its personality.
const CAST = {
  peppo:  { name: 'Peppo',   shirt: 0xee7a4c, shorts: 0x4677a6, hair: 0x55392a, hat: 'straw',    scale: [1, 1, 1] },
  pickle: { name: 'Pickle',     shirt: 0x7fb24a, shorts: 0xb59a63, hair: 0xc9a25a, hat: 'bucket',   scale: [0.9, 0.9, 0.9] },
  galoot: { name: 'Galoot', shirt: 0x4d7fc0, shorts: 0x5a4636, hair: 0x2b211b, hat: 'headband', scale: [1.2, 1.08, 1.15], pack: true },
};

// a little warm self-light keeps faces readable when they are in shadow
const W = (color, glow, k = 0.4) => new THREE.MeshLambertMaterial({ color, emissive: glow, emissiveIntensity: k, flatShading: true });
const glowOf = (hex) => new THREE.Color(hex).multiplyScalar(0.3);

function buildHero(spec) {
  const h = { group: new THREE.Group() };
  const skin = W(0xffdcbc, 0xa8734f, 0.38), shirt = W(spec.shirt, glowOf(spec.shirt), 0.5), shorts = W(spec.shorts, glowOf(spec.shorts), 0.5),
    shoe = M(0x5a3d2b), hair = W(spec.hair, glowOf(spec.hair), 0.4), ink = new THREE.MeshBasicMaterial({ color: 0x1f2328 });
  const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };
  const box = (w, hh, d, mat, x = 0, y = 0, z = 0) => mesh(new THREE.BoxGeometry(w, hh, d), mat, x, y, z);

  // blocky limbs hang from pivots so they can swing
  const limb = (x, y, len, w, mat, end) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    pivot.add(box(w, len, w, mat, 0, -len / 2, 0), end);
    end.position.y = -len;
    return pivot;
  };
  h.legL = limb(0.1, 0.34, 0.22, 0.13, skin, box(0.15, 0.09, 0.22, shoe, 0, 0, 0.03));
  h.legR = limb(-0.1, 0.34, 0.22, 0.13, skin, box(0.15, 0.09, 0.22, shoe, 0, 0, 0.03));

  h.body = new THREE.Group();
  h.body.position.y = 0.34;
  h.body.add(box(0.4, 0.14, 0.28, shorts, 0, 0.05, 0));
  h.body.add(box(0.44, 0.34, 0.3, shirt, 0, 0.28, 0));
  h.armL = limb(0.28, 0.42, 0.28, 0.11, shirt, box(0.12, 0.1, 0.12, skin));
  h.armR = limb(-0.28, 0.42, 0.28, 0.11, shirt, box(0.12, 0.1, 0.12, skin));
  h.armL.rotation.z = 0.15; h.armR.rotation.z = -0.15;
  h.body.add(h.armL, h.armR);
  if (spec.pack) {
    // Galoot hauls a backpack around: he keeps everything
    const brown = W(0x8a5a3b, 0x2a1a10, 0.4);
    h.body.add(box(0.34, 0.34, 0.15, brown, 0, 0.28, -0.22), box(0.36, 0.08, 0.17, brown, 0, 0.44, -0.22));
  }

  h.head = new THREE.Group();
  h.head.position.y = 0.73;   // chin sinks a little into the shirt, no floating head
  // round head with a few visible facets: simple, not spiky
  const skull = mesh(new THREE.SphereGeometry(0.31, 10, 8), skin);
  skull.scale.set(1.03, 0.95, 0.97);
  h.head.add(skull);
  const cap = mesh(new THREE.SphereGeometry(0.315, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), hair, 0, 0.04, -0.03);
  cap.scale.set(1.04, 0.9, 1);
  h.head.add(cap);
  h.eyes = [];
  for (const x of [0.11, -0.11]) {
    const eye = box(0.06, 0.08, 0.03, ink, x, 0.0, 0.27);
    h.head.add(eye);
    h.eyes.push(eye);
  }
  const hat = new THREE.Group();
  if (spec.hat === 'straw') {
    const straw = W(0xf0d98a, 0x5a4a20, 0.35);
    hat.position.set(0, 0.2, -0.02);
    hat.rotation.set(-0.12, 0, 0.08);
    hat.add(mesh(new THREE.CylinderGeometry(0.46, 0.48, 0.04, 6), straw), mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.18, 6), straw, 0, 0.1, 0));
  } else if (spec.hat === 'bucket') {
    const cloth = W(0x4f7f34, 0x18280f, 0.4);
    hat.position.set(0, 0.17, 0);
    hat.rotation.set(0.1, 0, -0.06);
    hat.add(mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.2, 6), cloth, 0, 0.08, 0), mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.07, 6), cloth, 0, -0.02, 0));
  } else if (spec.hat === 'headband') {
    const red = W(0xd9504a, 0x401010, 0.4);
    hat.position.set(0, 0.1, 0);
    hat.add(mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.07, 10, 1, true), red), box(0.08, 0.08, 0.06, red, 0.06, -0.02, -0.33));
  }
  h.head.add(hat);
  h.body.add(h.head);

  // what the castaway is carrying: dressHero shows each piece only while it is in the bag
  h.spear = new THREE.Group();               // gripped in the right hand, a third of the way up the shaft
  h.spear.position.set(0, -0.28, 0.02);
  h.spearShaft = new THREE.Group();
  h.spearShaft.add(mesh(new THREE.CylinderGeometry(0.022, 0.026, 1.7, 5), M(0x8a6a45), 0, 0.35, 0), mesh(new THREE.ConeGeometry(0.05, 0.2, 4), M(0x7b7f86), 0, 1.28, 0));
  h.spear.add(h.spearShaft);
  h.armR.add(h.spear);
  h.heldFish = new THREE.Group();            // dangling from the left hand
  h.heldFish.position.set(0, -0.42, 0.03);
  const silver = M(0x8fb6c4);
  const fishBody = mesh(new THREE.IcosahedronGeometry(0.1, 0), silver);
  fishBody.scale.set(0.55, 1.7, 0.4);
  h.heldFish.add(fishBody, mesh(new THREE.ConeGeometry(0.07, 0.1, 3), silver, 0, -0.2, 0));
  h.armL.add(h.heldFish);
  h.netBack = new THREE.Group();             // rolled up and slung on the back
  h.netBack.position.set(0, 0.3, -0.19);
  const twine = M(0xc9b48a);
  h.netBack.add(mesh(new THREE.TorusGeometry(0.17, 0.018, 5, 12), twine),
    mesh(new THREE.CircleGeometry(0.16, 10), new THREE.MeshLambertMaterial({ color: 0xc9b48a, transparent: true, opacity: 0.45, side: THREE.DoubleSide })));
  h.body.add(h.netBack);
  h.pouch = box(0.13, 0.13, 0.09, M(0x7a5433), 0.27, 0.03, 0.02);   // on the hip; it swells with fruit
  h.body.add(h.pouch);
  h.xEyes = new THREE.Group();               // the eyes of a castaway who did not make it
  for (const x of [0.11, -0.11]) for (const a of [0.785, -0.785]) {
    const bar = box(0.11, 0.022, 0.02, ink, x, 0, 0.29);
    bar.rotation.z = a;
    h.xEyes.add(bar);
  }
  h.head.add(h.xEyes);
  h.spear.visible = h.heldFish.visible = h.netBack.visible = h.pouch.visible = h.xEyes.visible = false;

  h.group.add(h.legL, h.legR, h.body);
  h.group.scale.set(...spec.scale);
  shadowed(h.group);
  return h;
}

const player = new THREE.Group();
scene.add(player);
let hero, castId, ghost;
const ghostMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, fog: false });
function setCast(id) {
  castId = CAST[id] ? id : 'peppo';
  player.clear();
  hero = buildHero(CAST[castId]);
  player.add(hero.group);
  if (ghost) scene.remove(ghost);
  ghost = buildHero(CAST[castId]).group;     // the same figure in white, rising out of the body at death
  ghost.traverse((m) => { if (m.isMesh) { m.material = ghostMat; m.castShadow = false; m.receiveShadow = false; } });
  ghost.visible = false;
  scene.add(ghost);
  document.getElementById('who').textContent = `${CAST[castId].name} · Tutorial`;
}
setCast(new URLSearchParams(location.search).get('c') ?? 'peppo');

// walk cycle, breathing, blinking, lying down to sleep
function animateHero(dt, moving, now) {
  hero.phase = (hero.phase ?? 0) + (moving ? dt * 9 : 0);
  const swing = moving ? Math.sin(hero.phase) * 0.7 : 0;
  hero.legL.rotation.x = swing;
  hero.legR.rotation.x = -swing;
  hero.armL.rotation.x = -swing * 0.8;
  hero.armR.rotation.x = swing * 0.8;
  hero.body.position.y = 0.34 + (moving ? Math.abs(Math.cos(hero.phase)) * 0.04 : Math.sin(now * 2) * 0.008);
  hero.head.rotation.z = moving ? Math.sin(hero.phase) * 0.05 : 0;
  const resting = st.sleeping || st.dead;
  const blink = resting || (now % 3.7) < 0.12;
  for (const e of hero.eyes) e.scale.y = blink ? 0.12 : 1;
}

// the body language on top of the walk cycle: what is carried, the swim, the cold, the last of the health, eating and drinking
const poseT = { eat: 0, drink: 0 };          // seconds left of a meal or a drink being shown
const STAB_REACH = rules.fishing.reachAhead;
function dressHero(dt, moving, now, act, swim, flail, esc) {
  const { armL, armR, legL, legR, body, head, spear, spearShaft } = hero;
  poseT.eat = Math.max(0, poseT.eat - dt);
  poseT.drink = Math.max(0, poseT.drink - dt);
  armL.rotation.z = 0.15; armR.rotation.z = -0.15;
  body.rotation.x = 0; head.rotation.x = 0;
  hero.group.position.set(0, 0, 0);
  hero.group.rotation.z = 0;
  const inv = st.inv, lying = st.sleeping || st.dead, cold = st.warmth < S.warmth.comfortLow && !st.dead;
  const fruit = (inv.berry ?? 0) + (inv.coconut ?? 0);
  spear.visible = inv.spear > 0 && !lying && !esc;
  hero.heldFish.visible = inv.fish > 0 && !lying && !esc;
  hero.netBack.visible = inv.net > 0 && !esc;
  hero.pouch.visible = fruit > 0 && !esc;
  hero.pouch.scale.setScalar(0.65 + Math.min(fruit, 9) * 0.12);
  hero.xEyes.visible = !!st.dead;
  for (const e of hero.eyes) e.visible = !st.dead;
  if (cold) hero.group.position.x = Math.sin(now * 50) * 0.012;
  if (lying || esc) return;

  const stabbing = spear.visible && !swim && act === 'interact' && heightAt(st.x + Math.sin(st.heading) * STAB_REACH, st.z + Math.cos(st.heading) * STAB_REACH) < 0;
  if (swim) {
    legL.rotation.x = Math.sin(now * 10) * 0.35;
    legR.rotation.x = -legL.rotation.x;
    if (flail) {                             // going under: both arms up, thrashing
      armL.rotation.set(-Math.PI + Math.sin(now * 14) * 0.5, 0, 0.35);
      armR.rotation.set(-Math.PI - Math.sin(now * 14) * 0.5, 0, -0.35);
      head.rotation.x = -0.2;
    } else {                                 // a front crawl, head up
      armL.rotation.x = -((now * 5) % (Math.PI * 2));
      armR.rotation.x = spear.visible ? -0.2 : -((now * 5 + Math.PI) % (Math.PI * 2));
      head.rotation.x = -0.85;
    }
  } else if (poseT.drink > 0) {              // down on the knees at the spring
    body.rotation.x = 0.75;
    body.position.y -= 0.14;
    legL.rotation.x = legR.rotation.x = -0.9;
    armL.rotation.x = armR.rotation.x = -1.4;
    head.rotation.x = 0.25 + Math.sin(now * 12) * 0.06;
  } else if (poseT.eat > 0) {                // hand to mouth
    armL.rotation.set(-2.5 + Math.sin(now * 16) * 0.15, 0, -0.35);
    head.rotation.x = 0.08 + Math.sin(now * 16) * 0.04;
  } else if (act === 'interact' && !stabbing) {   // reaching for whatever is in front
    (spear.visible ? armL : armR).rotation.x = -1.3 + Math.sin(now * 14) * 0.25;
  } else if (cold && !moving) {              // arms wrapped around itself
    armL.rotation.set(-0.9, 0, -0.55);
    armR.rotation.set(-0.9, 0, 0.55);
  }
  if (!swim && st.health < 30 && moving) {   // barely on its feet
    hero.group.rotation.z = Math.sin((hero.phase ?? 0) * 0.5) * 0.14;
    head.rotation.x = 0.25;
  }
  if (spear.visible) {
    spear.rotation.set(0, 0, 0.15);
    spearShaft.position.y = 0;
    if (stabbing) {                          // drive the point down into the water, again and again
      const th = Math.sin(((now * 3.2) % 1) * Math.PI);
      armR.rotation.set(-1.25 - th * 0.25, 0, -0.15);
      spear.rotation.x = 1.95 - armR.rotation.x;
      spearShaft.position.y = -0.25 + th * 0.5;
      body.rotation.x = 0.1 + th * 0.12;
    } else if (!swim) {                      // otherwise it stays upright like a staff, whatever the arm is doing
      armR.rotation.x = -0.35 + armR.rotation.x * 0.2;
      armR.rotation.z = -0.15;
      spear.rotation.x = -armR.rotation.x;
    }
  }
  if (hero.heldFish.visible && armL.rotation.x > -0.5 && !swim) armL.rotation.x = -0.35 + armL.rotation.x * 0.3;
}

// the effects around the body, all driven by the frame clock: rings on the water, breath in the cold, Zzz, and the death itself
const splash = [0, 1, 2].map(() => {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.5, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  scene.add(m);
  return m;
});
const bubbles = Array.from({ length: 9 }, () => {
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 0), new THREE.MeshBasicMaterial({ color: 0xe8f7ff, transparent: true, depthWrite: false }));
  scene.add(m);
  return m;
});
const breath = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 0), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }));
scene.add(breath);
const zTexture = (() => {
  const c = Object.assign(document.createElement('canvas'), { width: 64, height: 64 }), g = c.getContext('2d');
  g.font = '800 54px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.lineWidth = 6;
  g.strokeStyle = '#1f2328';
  g.strokeText('Z', 32, 34);
  g.fillStyle = '#ffffff';
  g.fillText('Z', 32, 34);
  return new THREE.CanvasTexture(c);
})();
const zzz = [0, 1, 2].map(() => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: zTexture, transparent: true, fog: false, toneMapped: false, depthWrite: false }));
  scene.add(s);
  return s;
});
let deadT = 0, icedAt = 0;
const icy = new THREE.Color(0xbfe3ff);
function iceOver(k) {                        // the body slowly turning pale blue
  if (k === icedAt) return;
  icedAt = k;
  hero.group.traverse((m) => {
    if (!m.isMesh || !m.material.color) return;
    m.userData.c0 ??= m.material.color.clone();
    m.material.color.copy(m.userData.c0).lerp(icy, k);
  });
}
const drownedNow = () => /drown/i.test(st.why ?? ''), frozeNow = () => /froze|hypo/i.test(st.why ?? '');
function bodyEffects(now, dt, moving, baseY, wet, swim) {
  deadT = st.dead ? deadT + dt : 0;
  iceOver(st.dead && frozeNow() ? smooth(deadT / 1.2) * 0.75 : 0);
  // rings on the water around anyone in it
  const churning = !st.dead && wet && !ESC;
  splash.forEach((m, i) => {
    m.visible = churning;
    if (!churning) return;
    const a = (now * 0.9 + i / 3) % 1;
    m.position.set(st.x, 0.07, st.z);
    m.scale.setScalar((swim ? 0.9 : 0.6) + a * 1.6);
    m.material.opacity = (moving || swim ? 0.5 : 0.18) * (1 - a);
  });
  // a little cloud of breath when it is cold
  const puff = st.warmth < S.warmth.comfortLow && !st.sleeping && !st.dead && !ESC;
  breath.visible = puff;
  if (puff) {
    const a = (now * 0.7) % 1;
    breath.position.set(st.x + Math.sin(st.heading) * (0.42 + a * 0.4), baseY + 0.92 + a * 0.18, st.z + Math.cos(st.heading) * (0.42 + a * 0.4));
    breath.scale.setScalar(0.35 + a * 1.3);
    breath.material.opacity = 0.28 * (1 - a);
  }
  zzz.forEach((s, i) => {
    s.visible = !!st.sleeping && !st.dead;
    if (!s.visible) return;
    const a = (now * 0.45 + i / 3) % 1;
    s.position.set(st.x + a * 0.45, baseY + 0.75 + a * 0.95, st.z);
    s.scale.setScalar(0.18 + a * 0.26);
    s.material.opacity = Math.sin(a * Math.PI);
  });
  // bubbles from a drowned body, thinning out
  const sinking = st.dead && drownedNow() && deadT < 4.5;
  bubbles.forEach((m, i) => {
    m.visible = sinking;
    if (!sinking) return;
    const a = (deadT * 0.8 + i / bubbles.length) % 1, top = 0.05, from = Math.min(-0.3, baseY);
    m.position.set(st.x + Math.sin(i * 2.4) * 0.3 + Math.sin(now * 3 + i) * 0.04, from + (top - from) * a, st.z + Math.cos(i * 2.4) * 0.3);
    m.scale.setScalar(0.6 + (i % 3) * 0.5);
    m.material.opacity = 0.85 * (1 - smooth((deadT - 3) / 1.5));
  });
  // the ghost rises out of the body and fades
  const rising = st.dead && deadT > 0.2 && deadT < 2.8;
  ghost.visible = rising;
  if (rising) {
    const u = deadT - 0.2;
    ghost.position.set(st.x + Math.sin(u * 2.4) * 0.12, Math.max(baseY, 0) + 0.2 + u * 0.95, st.z);
    ghost.rotation.set(0, st.heading, Math.sin(u * 2.4) * 0.1);
    ghostMat.opacity = 0.6 * smooth(u / 0.3) * (1 - smooth((u - 1.3) / 1.2));
  }
}

// ---------- game state ----------
const S = rules.status;
const START = Math.round(rules.dayLength / 12);   // wake up at 08:00, two hours after sunrise
let st;
function reset() {
  st = {
    x: island.spawn.x, z: island.spawn.z, heading: island.spawn.heading,
    ...structuredClone(S.start), inv: {}, step: START, sleeping: false, dead: false, why: '',
    movedThisStep: false, swimming: false,
    fish: island.fishSpots.map((s) => s.cap), fishTimer: island.fishSpots.map(() => 0),
    crate: null,
    crateEta: START + 1 + Math.floor(Math.random() * (rules.dayLength - START - 1)),   // first crate: sometime on day 1
  };
  placeCrate(null);
  for (const p of props) {
    p.stock = p.berries ?? p.coconuts ?? 1; p.hits = 0; p.timer = 0; p.gone = false; p.mesh.visible = true;
    syncStock(p);
  }
  document.getElementById('dead').style.display = 'none';
  logLines.length = 0;
  log('Woke up on the beach. There is a spring somewhere to the west.');
}
function syncStock(p) {
  const meshes = p.mesh.userData.stockMeshes;
  if (meshes) meshes.forEach((m, k) => (m.visible = k < p.stock));
}

const logLines = [];
let quietLog = false;          // set while a replay fast-forwards to a clip
function log(text) {
  if (quietLog) return;
  const day = Math.floor(st.step / rules.dayLength) + 1;
  logLines.unshift(`<b>Day ${day}</b> ${text}`);
  logLines.length = Math.min(logLines.length, 6);
  document.getElementById('log').innerHTML = logLines.join('<br>');
}

// ---------- movement ----------
const keys = new Set();
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (!keys.has(k)) onPress(k);
  keys.add(k);
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

function blockedAt(x, z) {
  if (x < 1 || z < 1 || x > island.size - 1 || z > island.size - 1) return true;   // deep water is swimmable
  for (const p of props) {
    const r = blocking[p.kind];
    if (r && !p.gone && Math.hypot(p.x - x, p.z - z) < r) return true;
  }
  return false;
}

function movePlayer(dt) {
  if (st.dead || st.sleeping) return;
  const turn = (keys.has('a') || keys.has('arrowleft') ? 1 : 0) - (keys.has('d') || keys.has('arrowright') ? 1 : 0);
  const fwd = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 0.6 : 0);
  st.heading += turn * rules.move.turn * dt;
  if (!fwd) return;
  const speed = (st.swimming ? rules.move.swim : rules.move.walk) * (st.energy < 15 ? 0.5 : 1);
  const nx = st.x + Math.sin(st.heading) * fwd * speed * dt;
  const nz = st.z + Math.cos(st.heading) * fwd * speed * dt;
  const climb = (heightAt(nx, nz) - heightAt(st.x, st.z)) / Math.max(1e-6, speed * dt);
  if (climb > rules.move.maxSlope) return;
  if (!blockedAt(nx, st.z)) st.x = nx;
  if (!blockedAt(st.x, nz)) st.z = nz;
  st.movedThisStep = true;
}

// ---------- interaction ----------
function target() {
  const fx = Math.sin(st.heading), fz = Math.cos(st.heading);
  let best = null, bestD = Infinity;
  for (const p of props) {
    if (p.gone) continue;
    const dx = p.x - st.x, dz = p.z - st.z, d = Math.hypot(dx, dz);
    if (d > rules.move.reach + (blocking[p.kind] ?? 0) || d < 1e-3) continue;
    if ((dx * fx + dz * fz) / d < Math.cos(0.9)) continue;
    if (d < bestD) { best = p; bestD = d; }
  }
  const c = st.crate;
  if (c?.active) {
    const dx = c.x - st.x, dz = c.z - st.z, d = Math.hypot(dx, dz);
    if (d <= rules.move.reach && d > 1e-3 && (dx * fx + dz * fz) / d >= Math.cos(0.9) && d < bestD) return { kind: 'crate' };
  }
  if (best) return best;
  if (inSpring(st.x + fx * 0.8, st.z + fz * 0.8, rules.move.reach * 0.5)) return { kind: 'spring' };
  const wx = st.x + fx * rules.fishing.reachAhead, wz = st.z + fz * rules.fishing.reachAhead;
  if (heightAt(wx, wz) < 0) return { kind: 'water', wx, wz };
  return null;
}
function describe(t) {
  if (!t) return '';
  if (t.kind === 'spring') return 'E · Drink from the spring';
  if (t.kind === 'crate') return 'E · Open the crate';
  if (t.kind === 'water') return st.inv.spear ? 'E · Fish with the spear' : 'Open water · make a spear first (Q)';
  if (t.kind === 'bush' || t.kind === 'palm') return t.stock > 0 ? `E · Pick a ${itemNames[rules.gather[t.kind].item]} from the ${names[t.kind]} (${t.stock})` : `${cap(names[t.kind])} · nothing left`;
  if (t.kind === 'grass' && t.stock === 0) return 'Grass · nothing left';
  const g = rules.gather[t.kind];
  const hits = g.hits ? ` (${t.hits}/${g.hits})` : '';
  return `E · Get ${itemNames[g.item]} from the ${names[t.kind]}${hits}`;
}
const add = (item, n = 1) => (st.inv[item] = (st.inv[item] ?? 0) + n);
const cap = (w) => w[0].toUpperCase() + w.slice(1);
const an = (w) => (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w;

function interact() {
  const t = target();
  if (!t || st.dead || st.sleeping) return;
  if (t.kind === 'spring') {
    st.water = Math.min(S.max, st.water + rules.drink.spring);
    poseT.drink = 0.9;
    log('Drank from the spring.');
    return;
  }
  if (t.kind === 'crate') {
    const item = st.crate.net ? 'net' : 'can';
    add(item);
    st.crate.active = false;
    placeCrate(st.crate);
    log(item === 'net' ? 'Found a fishing net in the crate!' : 'Found a can of food in the crate.');
    return;
  }
  if (t.kind === 'water') {
    if (!st.inv.spear) return;
    const k = island.fishSpots.findIndex((s, i) => st.fish[i] > 0 && Math.hypot(t.wx - s.x, t.wz - s.z) < s.r);
    const chance = st.inv.net ? rules.fishing.netChance : rules.fishing.chance;
    const roll = Math.random();
    if (k >= 0 && roll < chance) { st.fish[k]--; add('fish'); log('Caught a fish!'); }
    // away from the spots a stab in shallow water still lands a fish now and then
    else if (k < 0 && heightAt(t.wx, t.wz) >= rules.move.deepWater && roll < rules.fishing.anywhereChance) { add('fish'); log('Lucky stab: a fish!'); }
    else log('Nothing bites.');
    return;
  }
  const g = rules.gather[t.kind];
  if (!g) return;
  if (g.stock) {
    if (t.stock <= 0) return;
    t.stock--; t.timer = 0; syncStock(t); add(g.item);
    log(`Got ${itemNames[g.item]}.`);
  } else if (g.hits) {
    t.hits++;
    if (t.hits >= g.hits) { t.hits = 0; add(g.item); log(`Got ${itemNames[g.item]}.`); }
  } else {
    if (t.kind === 'grass' && t.stock === 0) return;
    add(g.item);
    if (t.kind === 'driftwood') { t.gone = true; t.timer = 0; t.mesh.visible = false; }
    else { t.stock = 0; t.timer = 0; t.mesh.scale.setScalar(0.4); }
    log(`Got ${itemNames[g.item]}.`);
  }
}
function craftSpear() {
  if (st.dead || st.sleeping) return;
  if (st.inv.spear) { log('Already has a spear.'); return; }
  const cost = rules.craft.spear;
  if (!Object.entries(cost).every(([k, n]) => (st.inv[k] ?? 0) >= n)) { log('A spear needs 1 wood and 1 stone.'); return; }
  for (const [k, n] of Object.entries(cost)) st.inv[k] -= n;
  add('spear');
  log('Made a spear.');
}
function eat() {
  if (st.dead || st.sleeping) return;
  const order = Object.keys(rules.food).sort((a, b) => rules.food[b].food - rules.food[a].food);
  const item = order.find((k) => st.inv[k] > 0);
  if (!item) { log('Nothing to eat.'); return; }
  st.inv[item]--;
  const f = rules.food[item];
  st.food = Math.min(S.max, st.food + (f.food ?? 0));
  st.water = Math.min(S.max, st.water + (f.water ?? 0));
  poseT.eat = 0.7;
  log(`Ate ${an(itemNames[item])}.`);
}

let timeScale = 1, follow = true;
function onPress(k) {
  if (k === '1' || k === '2' || k === '3') setCast(['peppo', 'pickle', 'galoot'][+k - 1]);
  if (k === 'h') for (const m of spotMarks) m.visible = !m.visible;
  if (replay && 'efzrq'.includes(k)) return;   // a replay is watched, not played
  if (k === 'e') interact();
  if (k === 'q') craftSpear();
  if (k === 'f') eat();
  if (k === 'z' && !st.dead) {
    if (!st.sleeping && heightAt(st.x, st.z) < 0) log("Can't sleep in the water.");
    else { st.sleeping = !st.sleeping; log(st.sleeping ? 'Fell asleep.' : 'Woke up.'); }
  }
  if (k === 'r' && st.dead) reset();
  if (k === 't') { timeScale = timeScale === 1 ? 4 : timeScale === 4 ? 16 : 1; log(`Time ×${timeScale}`); }
  if (k === 'c') { follow = !follow; orbit.enabled = !follow; if (!follow) orbit.target.set(32, 0, 32); }
}

// ---------- survival step (fixed 0.5 s of game time) ----------
function step() {
  if (st.dead) return;
  st.step++;
  const night = st.step % rules.dayLength >= rules.nightFrom;
  st.swimming = heightAt(st.x, st.z) < 0;
  const deep = heightAt(st.x, st.z) < rules.move.deepWater;
  const scale = st.sleeping ? S.sleep.drainScale : 1;
  for (const k of ['food', 'water', 'energy']) {
    let d = S.drainPerStep[k] * scale;
    if (st.movedThisStep) d += S.moveExtra[k];
    if (st.swimming) d += S.swimExtra[k] ?? 0;
    if (deep) d += S.deepSwimExtra[k] ?? 0;
    st[k] -= d;
  }
  if (st.sleeping) st.energy += S.sleep.energy;
  const w = S.warmth;
  const air = inCave(st.x, st.z) ? rules.cave.warmth : night ? w.nightTarget : w.dayTarget;
  st.warmth += (air - st.warmth) * w.pull;
  if (st.swimming) st.warmth -= S.swimExtra.warmth;
  for (const k of ['food', 'water', 'energy', 'warmth']) st[k] = Math.min(S.max, Math.max(0, st[k]));

  let hurt = 0, why = '';
  if (st.food <= 0) { hurt += S.damagePerStep.starving; why = 'Starvation'; }
  if (st.water <= 0) { hurt += S.damagePerStep.thirsty; why = 'Dehydration'; }
  if (st.warmth < w.comfortLow || st.warmth > w.comfortHigh) { hurt += S.damagePerStep.cold; why ||= 'Hypothermia'; }
  if (st.energy <= 0) { hurt += S.damagePerStep.exhausted; why ||= 'Exhaustion'; if (!st.sleeping && heightAt(st.x, st.z) >= 0) { st.sleeping = true; log('Collapsed from exhaustion.'); } }
  if (st.sleeping && st.energy >= S.max) { st.sleeping = false; log('Woke up refreshed.'); }
  const R = S.regenPerStep;
  if (!hurt && st.food > R.whenAbove && st.water > R.whenAbove) st.health += R.health;
  st.health = Math.min(S.max, st.health - hurt);
  if (deep && st.energy <= 0) { st.health = 0; why = 'Drowned'; }
  if (st.health <= 0) {
    st.health = 0; st.dead = true; st.why = why;
    const days = ((st.step - START) / rules.dayLength).toFixed(1);
    document.getElementById('deadwhy').textContent = `${why} · survived ${days} days`;
    document.getElementById('dead').style.display = 'grid';
  }
  st.movedThisStep = false;

  // flotsam: one crate a day at a random time, taken back by the sea two hours later
  if (st.crate?.active && ++st.crate.timer >= rules.flotsam.staySteps) { st.crate.active = false; placeCrate(st.crate); }
  if (st.step === st.crateEta) {
    const [x, z] = island.coast[Math.floor(Math.random() * island.coast.length)];
    st.crate = { x, z, timer: 0, active: true, net: !st.inv.net && Math.random() < rules.flotsam.netShare };
    placeCrate(st.crate);
    log('Something washed up on the shore.');
    st.crateEta = (Math.floor(st.step / rules.dayLength) + 1) * rules.dayLength + Math.floor(Math.random() * rules.dayLength);
  }
  island.fishSpots.forEach((s, i) => {
    if (st.fish[i] >= s.cap) { st.fishTimer[i] = 0; return; }
    if (++st.fishTimer[i] >= rules.dayLength / s.perDay) { st.fish[i]++; st.fishTimer[i] = 0; }
  });
  for (const p of props) {
    const g = rules.gather[p.kind];
    if (!g) continue;
    if (p.gone && g.respawnSteps && ++p.timer >= g.respawnSteps) { p.gone = false; p.mesh.visible = true; }
    const full = p.berries ?? p.coconuts ?? 1;
    if (!p.gone && g.regrowSteps && p.stock < full && ++p.timer >= g.regrowSteps) {
      p.stock++; p.timer = 0; syncStock(p);
      if (p.kind === 'grass') p.mesh.scale.setScalar(1);
    }
  }
}

// ---------- HUD ----------
const barDefs = [
  ['health', 'Health', '#d9534f'], ['food', 'Food', '#e0a030'], ['water', 'Water', '#3d9bd6'],
  ['energy', 'Energy', '#7a63c9'], ['warmth', 'Warmth', '#e8774a'],
];
document.getElementById('bars').innerHTML = barDefs.map(([k, label]) =>
  `<div class="bar"><span>${label}</span><i><b id="b-${k}"></b></i><span id="v-${k}"></span></div>`).join('');
function hud() {
  for (const [k, , color] of barDefs) {
    const v = st[k];
    const el = document.getElementById(`b-${k}`);
    el.style.width = `${v}%`;
    el.style.background = (k === 'warmth' ? v < S.warmth.comfortLow : v < 20) ? '#c0392b' : color;
    document.getElementById(`v-${k}`).textContent = Math.round(v);
  }
  const t = st.step % rules.dayLength;
  const minutes = Math.floor(360 + (t / rules.dayLength) * 1440) % 1440;
  const day = Math.floor(st.step / rules.dayLength) + 1;
  document.getElementById('clock').textContent =
    `Day ${day} · ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}${st.sleeping ? ' · asleep' : ''}${inCave(st.x, st.z) ? ' · in the cave' : ''}`;
  const items = Object.entries(st.inv).filter(([, n]) => n > 0);
  document.getElementById('inv').innerHTML = items.length
    ? items.map(([k, n]) => `<span>${itemNames[k] ?? k} ×${n}</span>`).join('') : '<span style="opacity:.55">Bag is empty</span>';
  const p = document.getElementById('prompt');
  const text = st.dead || replay ? '' : st.sleeping ? 'Z · Wake up' : describe(target());
  p.textContent = text;
  p.style.display = text ? 'block' : 'none';
}

// ---------- day / night ----------
const skyTop = { day: new THREE.Color(0x4f9fd8), dusk: new THREE.Color(0x5b6a9e), night: new THREE.Color(0x0a1226) };
const skyLow = { day: new THREE.Color(0xc4e6f0), dusk: new THREE.Color(0xf2a679), night: new THREE.Color(0x1a2844) };
const cloudTint = { day: new THREE.Color(0xffffff), dusk: new THREE.Color(0xf6c9b4), night: new THREE.Color(0x2c3650) };
const mixSky = (out, set, k) => out.copy(set.night).lerp(set.dusk, Math.min(1, k * 2)).lerp(set.day, Math.max(0, k * 2 - 1));
function lighting(stepFloat) {
  const t = (stepFloat % rules.dayLength) / rules.dayLength;   // 0 = 06:00, nightFrom/dayLength = 22:00
  const dayFrac = rules.nightFrom / rules.dayLength;
  const sunAng = t < dayFrac ? (t / dayFrac) * Math.PI : Math.PI + ((t - dayFrac) / (1 - dayFrac)) * Math.PI;
  const elev = Math.sin(sunAng);
  sun.position.set(32 + Math.cos(sunAng) * 50, Math.max(elev, 0.05) * 60 + 5, 32 + 20);
  const k = Math.max(0, Math.min(1, elev * 3));
  sun.intensity = 0.15 + 1.45 * k;
  hemi.intensity = 0.38 + 0.52 * k;
  fill.intensity = 0.25 + 0.55 * k;
  mixSky(skyColors.top.value, skyTop, k);
  mixSky(skyColors.bottom.value, skyLow, k);
  mixSky(cloudMat.color, cloudTint, k);
  cloudMat.emissiveIntensity = 0.4 + 0.6 * k;
  scene.fog.color.copy(skyColors.bottom.value);
  const dark = 1 - Math.min(1, k * 2);
  stars.material.opacity = dark * 0.9;
  moon.material.opacity = dark;
  moon.visible = dark > 0.02;
  sunDisc.visible = elev > -0.02;
  sunDisc.position.set(Math.cos(sunAng) * 300, Math.max(elev, 0) * 300 + 6, -90);
  shoreFoam.material.color.setScalar(0.3 + 0.7 * k);
  spotPatchMat.color.setScalar(0.45 + 0.55 * k);
}

// ---------- camera ----------
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enabled = false;
orbit.maxPolarAngle = Math.PI * 0.48;
let camYaw = 0, camDist = 7, dragging = false, lastX = 0;
renderer.domElement.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; });
addEventListener('pointerup', () => (dragging = false));
addEventListener('pointermove', (e) => { if (dragging && follow) { camYaw -= (e.clientX - lastX) * 0.006; lastX = e.clientX; } });
renderer.domElement.addEventListener('wheel', (e) => { if (follow) camDist = Math.min(18, Math.max(3.5, camDist + e.deltaY * 0.01)); }, { passive: true });

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------- replay: play back one recorded life from the training simulator (?replay=../replays/x.json) ----------
const replayUrl = /^\.\.\/replays\/[\w-]+\.json$/.exec(new URLSearchParams(location.search).get('replay') ?? '')?.[0];
const replay = replayUrl ? await fetch(replayUrl).then((r) => r.json()) : null;
let rIdx = 0;
const F = replay && Object.fromEntries(replay.fields.map((f, i) => [f, i]));
const rChanges = new Map();
if (replay) for (const c of replay.changes) (rChanges.get(c[0]) ?? rChanges.set(c[0], []).get(c[0])).push(c);
const ITEMS = ['wood', 'stone', 'fiber', 'berry', 'coconut', 'fish', 'can', 'spear', 'net'];
const rSpots = new Map(), rCrates = new Map();
if (replay) for (const c of replay.spotChanges ?? []) (rSpots.get(c[0]) ?? rSpots.set(c[0], []).get(c[0])).push(c);
if (replay) for (const c of replay.crateChanges ?? []) rCrates.set(c[0], c);

// ---------- for the film, so what the narration says can be seen. &fx=1: what the castaway gets or eats pops up over its head; &mark=1: a marker
// over it in wide shots; &fruit=1: every fruit left on the island is lit; &nonap=N: naps of N steps or fewer play standing (they read as a flicker when sped up)
const fxQ = new URLSearchParams(location.search);
const FX_ON = fxQ.has('fx'), FRUIT_ON = fxQ.has('fruit');
const fxTex = new Map();
function fxIcon(kind, ring) {
  const key = kind + ring;
  if (fxTex.has(key)) return fxTex.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2);
  g.fillStyle = '#fffdf6'; g.fill();
  g.lineWidth = 8; g.strokeStyle = ring; g.stroke();
  const fill = (col, draw) => { g.fillStyle = col; g.beginPath(); draw(); g.fill(); };
  if (kind === 'fish') {
    fill('#ef8a3c', () => g.ellipse(56, 64, 32, 19, 0, 0, Math.PI * 2));
    fill('#ef8a3c', () => { g.moveTo(82, 64); g.lineTo(106, 44); g.lineTo(106, 84); g.closePath(); });
    fill('#222', () => g.arc(40, 58, 4, 0, Math.PI * 2));
  } else if (kind === 'berry') {
    fill('#d8343f', () => g.arc(64, 70, 28, 0, Math.PI * 2));
    fill('#4f9e3f', () => g.ellipse(76, 36, 16, 8, -0.5, 0, Math.PI * 2));
  } else if (kind === 'coconut') {
    fill('#7a5433', () => g.arc(64, 66, 32, 0, Math.PI * 2));
    fill('#3d2a18', () => { g.arc(54, 56, 5, 0, Math.PI * 2); g.moveTo(79, 56); g.arc(74, 56, 5, 0, Math.PI * 2); g.moveTo(69, 74); g.arc(64, 74, 5, 0, Math.PI * 2); });
  } else if (kind === 'drop') {
    fill('#3d9bd6', () => { g.moveTo(64, 20); g.bezierCurveTo(64, 20, 32, 62, 32, 80); g.arc(64, 80, 32, Math.PI, 0, true); g.bezierCurveTo(96, 62, 64, 20, 64, 20); });
  } else if (kind === 'wood') {
    g.save(); g.translate(64, 64); g.rotate(-0.5);
    fill('#8a5d34', () => g.rect(-42, -14, 84, 28));
    fill('#c79a63', () => g.ellipse(42, 0, 8, 14, 0, 0, Math.PI * 2));
    g.restore();
  } else if (kind === 'stone') {
    fill('#8b8f94', () => { g.moveTo(30, 84); g.lineTo(38, 46); g.lineTo(66, 32); g.lineTo(94, 52); g.lineTo(98, 84); g.closePath(); });
  } else if (kind === 'spear') {
    g.lineWidth = 8; g.strokeStyle = '#7a5433'; g.beginPath(); g.moveTo(32, 96); g.lineTo(88, 40); g.stroke();
    fill('#8b8f94', () => { g.moveTo(102, 26); g.lineTo(76, 36); g.lineTo(92, 52); g.closePath(); });
  } else if (kind === 'net') {
    g.lineWidth = 5; g.strokeStyle = '#7a5433';
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(34 + k * 20, 32); g.lineTo(34 + k * 20, 96); g.moveTo(32, 34 + k * 20); g.lineTo(96, 34 + k * 20); g.stroke(); }
  } else if (kind === 'can') {
    fill('#9aa3ab', () => g.rect(40, 36, 48, 58));
    fill('#d8343f', () => g.rect(40, 50, 48, 28));
  } else if (kind === 'fiber') {
    g.lineWidth = 7; g.strokeStyle = '#4f9e3f';
    for (const a of [-0.45, 0, 0.45]) { g.beginPath(); g.moveTo(64, 98); g.quadraticCurveTo(64 + a * 20, 60, 64 + a * 70, 30); g.stroke(); }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  fxTex.set(key, t);
  return t;
}
const fxSprite = (tex) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, fog: false }));
  s.renderOrder = 999;
  s.visible = false;
  scene.add(s);
  return s;
};
const fxLive = [];
let fxNext = 0, fxClock = 0;
function fxPop(kind, eaten) {
  if (!FX_ON || quietLog || timeScale >= 30) return;
  fxNext = Math.max(fxNext, fxClock);
  fxLive.push({ sprite: fxSprite(fxIcon(kind, eaten ? '#e8833a' : '#58b368')), at: fxNext, eaten });
  fxNext += 0.3;
}
const markSprite = fxQ.has('mark') ? (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.beginPath(); g.moveTo(14, 26); g.lineTo(114, 26); g.lineTo(64, 112); g.closePath();
  g.fillStyle = '#ffa35c'; g.fill();
  g.lineWidth = 9; g.strokeStyle = '#fff'; g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = fxSprite(t);
  s.visible = true;
  return s;
})() : null;
const fruitMarks = [];
function fruitMarksBuild() {
  const box = new THREE.Box3();
  for (const p of props) {
    const n = p.berries ?? p.coconuts;
    if (!n) continue;
    box.setFromObject(p.mesh);
    const tex = fxIcon(p.coconuts ? 'coconut' : 'berry', '#ffe08a');
    for (let k = 0; k < n; k++) {
      const s = fxSprite(tex), a = (k / n) * Math.PI * 2, r = n > 1 ? 0.9 : 0;
      s.position.set(p.mesh.position.x + Math.cos(a) * r, box.max.y + 0.5, p.mesh.position.z + Math.sin(a) * r);
      fruitMarks.push({ s, p, k });
    }
  }
}
function fxFrame(dt, y) {
  fxClock += dt;
  const size = (pos, k) => camera.position.distanceTo(pos) * k;
  for (let i = fxLive.length - 1; i >= 0; i--) {
    const e = fxLive[i], u = (fxClock - e.at) / (e.eaten ? 0.75 : 1.2);
    if (u >= 1) { scene.remove(e.sprite); fxLive.splice(i, 1); continue; }
    e.sprite.visible = u >= 0;
    if (u < 0) continue;
    const top = y + 1.75;
    e.sprite.position.set(st.x, e.eaten ? top + 0.6 - u * 1.1 : top + 0.25 + u * 0.55, st.z);
    e.sprite.scale.setScalar(size(e.sprite.position, 0.15) * (e.eaten ? 1 - u * 0.75 : Math.min(1, u * 7)));
    e.sprite.material.opacity = e.eaten ? 1 : Math.min(1, (1 - u) * 4);
  }
  if (markSprite) {
    markSprite.position.set(st.x, y + 2.1 + Math.sin(fxClock * 4) * 0.12, st.z);
    markSprite.scale.setScalar(size(markSprite.position, 0.05));
  }
  for (const m of fruitMarks) {
    m.s.visible = !m.p.gone && m.k < m.p.stock;
    m.s.scale.setScalar(size(m.s.position, 0.034));
  }
}
const NAP_MAX = +(fxQ.get('nonap') ?? 0);
const napHidden = new Set();
if (replay && NAP_MAX) {
  for (let i = 0; i < replay.frames.length; i++) {
    if (!replay.frames[i][F.sleeping]) continue;
    let j = i;
    while (j + 1 < replay.frames.length && replay.frames[j + 1][F.sleeping]) j++;
    if (j - i + 1 <= NAP_MAX) for (let k = i; k <= j; k++) napHidden.add(k);
    i = j;
  }
}

function replayApply(i) {
  const f = replay.frames[i], prev = replay.frames[Math.max(0, i - 1)];
  for (const k of ['health', 'food', 'water', 'energy', 'warmth']) st[k] = f[F[k]];
  for (const k of ITEMS) st.inv[k] = f[F[k]];
  st.sleeping = !!f[F.sleeping] && !napHidden.has(i);
  st.step = replay.startStep + i;
  for (const [, o, stock, gone] of rChanges.get(i) ?? []) {
    const p = props[o];
    if (!p) continue;                 // the cave and the crate are not props; crateChanges carries the crate
    p.stock = stock; p.gone = !!gone; p.mesh.visible = !gone; syncStock(p);
    if (p.kind === 'grass') p.mesh.scale.setScalar(stock > 0 ? 1 : 0.4);
  }
  for (const [, s, count] of rSpots.get(i) ?? []) st.fish[s] = count;
  const cc = rCrates.get(i);
  if (cc) {
    st.crate = { x: cc[1], z: cc[2], active: !!cc[3] };
    placeCrate(st.crate);
    if (cc[3]) log('Something washed up on the shore.');
  }
  if (i === 0) return;
  if (f[F.spear] > prev[F.spear]) { log('Made a spear.'); fxPop('spear', false); }
  for (const k of ITEMS) {
    if (k === 'spear' || F[k] === undefined) continue;
    const d = f[F[k]] - prev[F[k]];
    if (d > 0) { log(k === 'fish' ? 'Caught a fish!' : k === 'can' || k === 'net' ? `Found ${an(itemNames[k])} in the crate!` : `Got ${itemNames[k]}.`); fxPop(k, false); }
    if (d < 0 && rules.food[k]) { log(`Ate ${an(itemNames[k])}.`); if (!quietLog) poseT.eat = 0.7; fxPop(k, true); }
  }
  if (replay.actions[f[F.action]] === 'interact' && f[F.water] > prev[F.water] + 5) { log('Drank from the spring.'); if (!quietLog) poseT.drink = 0.9; fxPop('drop', true); }
  if (f[F.sleeping] && !prev[F.sleeping]) log('Fell asleep.');
  if (!f[F.sleeping] && prev[F.sleeping]) log('Woke up.');
}
function replayEnd() {
  st.dead = replay.died;
  const last = replay.frames.at(-1);
  const why = heightAt(last[0], last[1]) < rules.move.deepWater && st.energy < 2 ? 'Drowned' : st.water <= 0 ? 'Dehydration' : st.food <= 0 ? 'Starvation' : st.warmth < S.warmth.comfortLow ? 'Hypothermia' : 'Exhaustion';
  st.why = replay.cause ?? why;
  document.getElementById('deadwhy').textContent = replay.died ? `${why} · survived ${replay.days} days` : `Alive after ${replay.days} days`;
  document.getElementById('dead').firstElementChild.firstChild.textContent = replay.died ? `${CAST[castId].name} died` : `${CAST[castId].name} made it`;
  document.getElementById('dead').style.display = 'grid';
}
const lerpAngle = (a, b, t) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;

// ---------- loop ----------
reset();
if (replay) {
  setCast(replay.cast);
  document.getElementById('who').textContent = CAST[castId].name;      // run tags stay off the video
  if (replay.label) {
    const stage = document.getElementById('stage');
    stage.textContent = replay.label;          // growth stage, e.g. "Attempt 10,000"
    stage.style.display = 'block';
  }
  logLines.length = 0;
  if (FRUIT_ON) fruitMarksBuild();
  for (const m of spotMarks) m.visible = true;   // the audience knows where the fish are; the castaway does not
  replayApply(0);
  [st.x, st.z, st.heading] = replay.frames[0];
}

// highlight clips and events (train/highlights.py): &clip=K plays one clip, &at=N starts at frame N, [ ] jump between events
const qs = new URLSearchParams(location.search);
const clip = replay && qs.has('clip') ? replay.clips?.[+qs.get('clip')] : null;
const events = replay?.events ?? [];
let rEnd = replay ? replay.frames.length - 1 : 0, clipDone = false;
if (qs.has('speed')) timeScale = +qs.get('speed');         // e.g. &speed=16 for a long clip
if (qs.has('camdist')) camDist = +qs.get('camdist');       // wider follow shot for the edit
// &cam=aerial circles the whole island; &cam=poi&px=..&pz=.. circles one place (spring, cave, fishing spot) for the tour
const CAM = qs.get('cam');
let camT = +(qs.get('yaw') ?? 0), heroSet = false;

// ---------- the way home (&escape=shore|boat|side|deck|aerial &from=s &to=s): day 30's ending for the video. It is staged,
// not learned: a boat comes to the beach they woke up on, and the castaway leaves. Everything is a function of the clock t.
const ESC = qs.get('escape');
const smooth = (u) => { const v = Math.min(1, Math.max(0, u)); return v * v * (3 - 2 * v); };
let escT = +(qs.get('from') ?? 0);
const escEnd = +(qs.get('to') ?? 30);
const ARRIVE = 9, LEAVE = 18, DECK_Y = 0.52;
function makeBoat() {
  const g = new THREE.Group();
  const outline = (k) => {
    const s = new THREE.Shape();
    s.moveTo(-1.1 * k, -3.2 * k); s.lineTo(1.1 * k, -3.2 * k); s.lineTo(1.25 * k, 1.1 * k); s.lineTo(0, 3.6 * k); s.lineTo(-1.25 * k, 1.1 * k);
    s.closePath();
    return s;
  };
  const slab = (k, depth, y, color) => {
    const geo = new THREE.ExtrudeGeometry(outline(k), { depth, bevelEnabled: false });
    geo.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(geo, M(color));
    m.position.y = y;
    return m;
  };
  const box = (w, h, d, color, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(color)); m.position.set(x, y, z); return m; };
  g.add(slab(1, 0.95, 0.75, 0xf4f1e6), slab(1.02, 0.22, 0.28, 0xc8453a), slab(0.9, 0.04, 0.77, 0xc49a63));
  g.add(box(1.5, 1.1, 1.7, 0xf4f1e6, 0, 1.3, -1.5), box(1.75, 0.1, 2.0, 0x2f6f86, 0, 1.9, -1.5));
  g.add(box(1.52, 0.34, 0.9, 0x24323a, 0, 1.5, -1.5), box(1.2, 0.34, 1.72, 0x24323a, 0, 1.5, -1.5));
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.8, 8), M(0xc8453a));
  funnel.position.set(0, 2.3, -1.9);
  g.add(funnel, box(0.05, 1.5, 0.05, 0x5a3d2b, 0, 2.6, -0.8), box(0.45, 0.26, 0.03, 0xe0a030, 0.24, 3.2, -0.8));
  shadowed(g);
  return g;
}
const boat = ESC ? makeBoat() : null;
const smoke = [], foam = [];
if (ESC) {
  scene.add(boat);
  for (const m of spotMarks) m.visible = false;
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 5), new THREE.MeshLambertMaterial({ color: 0xf2f2ee, transparent: true, flatShading: true }));
    scene.add(m);
    smoke.push(m);
  }
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.1, 14), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    scene.add(m);
    foam.push(m);
  }
}
function boatAt(t) {
  if (t < ARRIVE) {
    const e = 1 - Math.pow(1 - t / ARRIVE, 2.2);
    return { x: 31 + 16 * Math.pow(1 - e, 2), z: 57 + 75 * (1 - e), h: Math.PI + 0.3 * (1 - e) };
  }
  if (t < LEAVE) return { x: 31, z: 57, h: Math.PI };
  const u = t - LEAVE, s = smooth(u / 5);
  return { x: 31 + 9 * s, z: 57 + (u < 5 ? 0.35 * u * u : 8.75 + 3.5 * (u - 5)), h: Math.PI * (1 - s) };
}
const onBoat = (b, lz, lx = 0) => ({ x: b.x + Math.sin(b.h) * lz + Math.cos(b.h) * lx, z: b.z + Math.cos(b.h) * lz - Math.sin(b.h) * lx });
const WADE = { x: 31, z: 53.0 }, SHORE = { x: 31, z: 47.0 };
function escapeStep(dt) {
  escT += dt;
  const t = escT, b = boatAt(t), bob = Math.sin(t * 1.3) * 0.05;
  boat.position.set(b.x, bob, b.z);
  boat.rotation.set(Math.sin(t * 1.1) * 0.015, b.h, Math.sin(t * 0.9) * 0.02);
  smoke.forEach((m, i) => {
    const a = ((t * 0.45 + i / smoke.length) % 1), p = boatAt(t - a * 2.2), f = onBoat(p, -1.9);
    m.position.set(f.x, 2.7 + a * 2.4, f.z);
    m.scale.setScalar(0.5 + a * 1.6);
    m.material.opacity = 0.75 * (1 - a);
  });
  foam.forEach((m, i) => {
    const age = i * 0.5, p = boatAt(t - age), q = boatAt(t - age - 0.2), speed = Math.hypot(p.x - q.x, p.z - q.z) / 0.2, f = onBoat(p, -3.2);
    m.position.set(f.x, 0.03, f.z);
    m.scale.setScalar(0.7 + age * 0.55);
    m.material.opacity = Math.min(1, speed / 2) * 0.5 * (1 - i / foam.length);
  });
  st.step = rules.dayLength * 30 + rules.dayLength * 0.16;   // a clear blue morning
  player.visible = ESC !== 'boat';
  st.sleeping = false;
  let moving = false, y;
  if (t < 12.2) {                                   // on the beach: back to the sea, a horn, then a run for it
    const run = smooth((t - ARRIVE) / 3.2);
    st.x = SHORE.x + (WADE.x - SHORE.x) * run;
    st.z = SHORE.z + (WADE.z - SHORE.z) * run;
    st.heading = lerpAngle(Math.PI, 0, smooth((t - 2.6) / 0.6));
    moving = t >= ARRIVE;
    const jump = t > 3.2 && t < ARRIVE ? Math.abs(Math.sin((t - 3.2) * 5)) * 0.32 : 0;
    y = Math.max(heightAt(st.x, st.z), -0.55) + jump;
  } else if (t < 13.2) {                            // up over the bow
    const u = t - 12.2, p = onBoat(b, 3.0);
    st.x = WADE.x + (p.x - WADE.x) * u;
    st.z = WADE.z + (p.z - WADE.z) * u;
    st.heading = 0;
    y = -0.55 + (DECK_Y + 0.55) * u + Math.sin(u * Math.PI) * 1.0;
  } else {                                          // on deck: walk to the front deck, turn around, ride home
    const lz = 3.0 - 1.6 * smooth((t - 13.2) / 1.6), p = onBoat(b, lz);
    st.x = p.x;
    st.z = p.z;
    moving = t < 14.8;
    st.heading = lerpAngle(0, b.h, smooth((t - 14.6) / 0.8));
    if (t >= 14.6 && t < LEAVE) st.heading = lerpAngle(0, Math.PI, smooth((t - 14.6) / 0.8));
    y = DECK_Y + bob;
    if (castId === 'pickle' && t > 15.6) {           // first thing Pickle does with safety: a nap, flat out across the deck
      st.sleeping = true;
      st.heading = b.h + Math.PI / 2;
    }
  }
  return { moving, y, t };
}
let treat = null;
function escapePose(t) {
  if (t > 3.2 && t < ARRIVE) {                      // both arms up, waving
    const w = Math.sin((t - 3.2) * 10) * 0.35;
    hero.armL.rotation.set(Math.PI + w, 0, 0.3);
    hero.armR.rotation.set(Math.PI - w, 0, -0.3);
  } else if (t >= 15.6 && castId === 'peppo') {     // already pointing at the next horizon
    hero.armR.rotation.set(-Math.PI * 0.62, 0, -0.15);
  } else if (t >= 15.2 && castId === 'galoot') {    // one last fish, for the road
    if (!treat) {
      treat = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.14), mats.fish);
      treat.position.set(0, -0.42, 0.06);
      hero.armR.add(treat);
    }
    hero.armR.rotation.set(-2.5 + Math.sin(t * 7) * 0.22, 0, 0.35);
    hero.head.rotation.x = Math.sin(t * 7) * 0.05;
  }
}
function escapeCam(t) {
  const b = boatAt(t);
  if ((ESC === 'shore' || ESC === 'boat') && qs.has('vert')) {
    // 9:16 is too narrow for the wide shot below: step back and keep the beach and the boat both in view
    camera.position.set(27.2, 3.4, 40.4);
    camera.lookAt((32.2 + b.x) / 2 + (ESC === 'shore' ? 3.5 : 0), 0.9, (50 + b.z) / 2);   // 'shore' has Peppo on the left of the frame to keep in
  } else if (ESC === 'shore' || ESC === 'boat') {
    const push = smooth(t / 9);
    camera.position.set(27.2, 1.8, 42.6 + push * 0.8);   // the castaway on the right, the boat coming in on the left
    camera.lookAt(32.2, 1.25, 50);
  } else if (ESC === 'side') {
    camera.position.set(42 - smooth((t - 9) / 8) * 2, 2.8, 53 + smooth((t - 9) / 8));
    camera.lookAt(31, 0.9, 53.4);
  } else if (ESC === 'deck') {
    const c = onBoat(b, 3.6, 0.7);
    const f = onBoat(b, 1.4);
    camera.position.set(c.x, 1.55, c.z);
    camera.lookAt(f.x, DECK_Y + 0.75, f.z);
  } else {
    const u = Math.max(0, t - LEAVE);
    camera.position.set(b.x + 7, 13 + u * 0.35, b.z + 15);
    camera.lookAt(b.x, 0, b.z - 12);
  }
}

if (replay) {
  const from = clip ? clip.from : Math.min(+(qs.get('at') ?? 0), rEnd);
  if (clip) rEnd = Math.min(clip.to + +(qs.get('ext') ?? 0), rEnd);   // &ext=N: carry on past the clip so it covers the narration
  if (qs.has('to')) rEnd = Math.min(+qs.get('to'), rEnd);   // &at=N&to=M: any stretch of the life, for the edit
  quietLog = true;
  while (rIdx < from) replayApply(++rIdx);
  quietLog = false;
  [st.x, st.z, st.heading] = replay.frames[rIdx];
  const bar = document.getElementById('timeline');
  if (events.length) {
    bar.style.display = 'block';
    const n = replay.frames.length - 1;
    if (clip) bar.insertAdjacentHTML('beforeend', `<s style="left:${(clip.from / n) * 100}%;width:${((clip.to - clip.from) / n) * 100}%"></s>`);
    for (const e of events) bar.insertAdjacentHTML('beforeend', `<u style="left:${(e.at / n) * 100}%" title="${e.clock} · ${e.text}"></u>`);
    bar.addEventListener('click', (ev) => seek(Math.round(((ev.clientX - bar.getBoundingClientRect().left) / bar.clientWidth) * n)));
  }
}
function seek(i) {
  const q = new URLSearchParams(location.search);
  q.delete('clip');
  q.set('at', Math.max(0, i));
  location.search = q.toString();
}
addEventListener('keydown', (e) => {
  if (!replay || (e.key !== '[' && e.key !== ']')) return;
  const next = e.key === ']' ? events.find((v) => v.from > rIdx + 1) : events.findLast((v) => v.from < rIdx - 5);
  if (next) seek(next.from);
});
function caption() {
  const el = document.getElementById('caption');
  // &onlyclip=1: only this clip's own line, so an unrelated event never sits under the narration
  const e = (clip && rIdx >= clip.at - 4 && rIdx <= clip.at + 30 ? clip : null)
    ?? (qs.has('onlyclip') ? null : events.find((v) => rIdx >= v.at - 4 && rIdx <= v.at + 30));
  el.textContent = e ? e.text : '';
  el.style.display = e ? 'block' : 'none';
  const cur = document.querySelector('#timeline i');
  if (cur) cur.style.left = `${(rIdx / (replay.frames.length - 1)) * 100}%`;
}
camera.position.set(st.x, 6, st.z - 8);
// debug handle: lets tests drive frames and keys when the page runs in a background tab
window.__island = {
  get st() { return st; }, camera, clouds, heightAt, keys, onPress, orbit, player, scene, buildHero, CAST,
  canvas: renderer.domElement, get finished() { return ESC ? escT >= escEnd : clipDone || st.dead; }, get speed() { return timeScale; },
  run(seconds) { for (let k = 0; k < seconds * 30; k++) frame(last + 1000 / 30, true); },
  // a still from any spot (viewer/thumb.html): call and read the canvas in the same task, the buffer does not outlive it
  shoot(pos, aim, fov = 55) {
    camera.fov = fov; camera.updateProjectionMatrix();
    camera.position.set(...pos); camera.lookAt(...aim);
    skyGroup.position.copy(camera.position);
    renderer.render(scene, camera);
  },
};
// the spring-arm: if anything solid sits between the castaway and the camera, bring the camera in front of it
const camRay = new THREE.Raycaster(), camAim = new THREE.Vector3(), camDir = new THREE.Vector3();
function pullIn(aim, pos) {
  camDir.subVectors(pos, aim);
  const len = camDir.length();
  if (len < 1.3) return;
  camDir.divideScalar(len);
  camRay.set(aim, camDir);
  camRay.far = len;
  const hit = camRay.intersectObjects(occluders, true).find((h) => h.object.visible);
  if (hit) pos.copy(aim).addScaledVector(camDir, Math.max(1.3, hit.distance - 0.35));
}
// how much of the way from the castaway to this camera spot is clear, 0 to 1
function clearFrom(aim, pos) {
  camDir.subVectors(pos, aim);
  const len = camDir.length();
  camRay.set(aim, camDir.divideScalar(len));
  camRay.far = len;
  const hit = camRay.intersectObjects(occluders, true).find((h) => h.object.visible);
  return hit ? hit.distance / len : 1;
}
const TURNS = [0.4, -0.4, 0.8, -0.8, 1.2, -1.2, 1.6, -1.6, 2.1, -2.1, 2.6, -2.6, 3.14], camGoal = new THREE.Vector3(), camFeet = new THREE.Vector3();
let camTurn = 0, camTurnTo = 0;
let acc = 0, last = performance.now();
function frame(now, manual = false) {
  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
  last = now;
  let moving, esc;
  if (ESC) {
    esc = escapeStep(dt);
    moving = esc.moving;
  } else if (replay) {
    acc += st.dead || clipDone ? 0 : dt * timeScale;
    while (acc >= rules.stepSeconds) {
      acc -= rules.stepSeconds;
      if (rIdx < rEnd) replayApply(++rIdx);
      else { if (rEnd === replay.frames.length - 1) replayEnd(); clipDone = true; acc = 0; break; }
    }
    caption();
    const a = replay.frames[rIdx], b = replay.frames[Math.min(rIdx + 1, replay.frames.length - 1)];
    const t = acc / rules.stepSeconds;
    st.x = a[0] + (b[0] - a[0]) * t;
    st.z = a[1] + (b[1] - a[1]) * t;
    st.heading = lerpAngle(a[2], b[2], t);
    moving = !st.dead && !st.sleeping && Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.05;
  } else {
    for (let s = 0; s < timeScale; s++) movePlayer(dt);
    acc += dt * timeScale;
    while (acc >= rules.stepSeconds) { step(); acc -= rules.stepSeconds; }
    moving = !st.dead && !st.sleeping && (keys.has('w') || keys.has('s') || keys.has('arrowup') || keys.has('arrowdown'));
  }

  const t = now / 1000;
  const y = esc ? esc.y : Math.max(heightAt(st.x, st.z), -0.55);
  const lying = st.sleeping || st.dead;
  const depth = -heightAt(st.x, st.z), wet = !esc && depth > 0.02;
  const swim = !esc && !lying && depth > 0.35;
  const flail = swim && depth > -rules.move.deepWater && st.energy < 15;
  // how the whole body sits: lying on its back, falling over at death, flat in the water, or sinking
  let bodyY = y, tilt = 0;
  if (st.dead) {
    const u = smooth((deadT + dt) / 0.5);
    tilt = -Math.PI / 2 * u;
    bodyY = y + 0.22 * u - (drownedNow() ? Math.min(1.9, deadT * 0.6) : 0);
  } else if (lying) { tilt = -Math.PI / 2; bodyY = y + 0.22; }
  else if (flail) { tilt = 0.35; bodyY = y + 0.12 + Math.sin(t * 9) * 0.07; }
  else if (swim) { tilt = 1.2; bodyY = y + 0.35; }
  player.position.set(st.x, bodyY, st.z);
  player.rotation.set(tilt, st.heading, 0, 'YXZ');   // tilt < 0 is on the back, face up
  animateHero(dt, moving, t);
  dressHero(dt, moving, t, replay && !esc && !st.dead ? replay.actions[replay.frames[rIdx][F.action]] : null, swim, flail, !!esc);
  if (esc) escapePose(esc.t);
  bodyEffects(t, dt, moving, y, wet, swim);
  fxFrame(dt, y);

  spotMarks.forEach((g, i) => {
    const { fish, leap, plop, r } = g.userData;
    fish.forEach((m, k) => {
      m.visible = k < st.fish[i];
      const a = t * (0.42 + (k % 3) * 0.09) + (k / fish.length) * Math.PI * 2, rad = r * (0.28 + ((k * 7) % 5) * 0.12);
      m.position.set(Math.cos(a) * rad, 0.1, Math.sin(a) * rad);
      m.rotation.y = -(a + Math.PI / 2);
    });
    const cycle = t / 3.4 + i * 0.37, u = cycle % 1, seed = Math.floor(cycle) * 2.4 + i, jump = u / 0.2;
    const lx = Math.cos(seed) * r * 0.5, lz = Math.sin(seed) * r * 0.5, stocked = st.fish[i] > 0;
    leap.visible = stocked && jump < 1;
    if (leap.visible) {                       // up out of the water and back down, nose along the arc
      leap.position.set(lx + (jump - 0.5) * 0.7, 0.05 + Math.sin(jump * Math.PI) * 0.75, lz);
      leap.rotation.set(0, 0, Math.cos(jump * Math.PI) * 1.1);
    }
    const ripple = (u - 0.19) / 0.24;
    plop.visible = stocked && ripple > 0 && ripple < 1;
    if (plop.visible) {
      plop.position.set(lx + 0.35, 0.1, lz);
      plop.scale.setScalar(0.6 + ripple * 2.2);
      plop.material.opacity = 0.7 * (1 - ripple);
    }
  });
  waterTime.value = t;
  clouds.rotation.y = t * 0.004;
  swayers.forEach((c, k) => { c.rotation.z = Math.sin(t * 0.9 + k * 1.7) * 0.014; c.rotation.x = Math.cos(t * 0.7 + k) * 0.01; });

  // &noon=1: a fixed midday, for a time lapse so fast that day and night would flash like a strobe
  lighting(qs.has('noon') ? rules.dayLength * 0.3 : st.step + acc / rules.stepSeconds);
  if (esc) escapeCam(esc.t);
  else if (CAM === 'hero') {                 // the opening: low and close, circling the castaway slowly whatever way they face
    camT += dt * +(qs.get('spin') ?? 0.06);
    const d = +(qs.get('d') ?? 4.5), lift = +(qs.get('h') ?? 1.5);
    const aim = camAim.set(st.x, y + 0.8, st.z);
    const armGoal = (yaw, out) => {
      let cy = y + lift;
      for (let k = 0.25; k <= 1; k += 0.25) cy = Math.max(cy, heightAt(st.x + Math.sin(yaw) * d * k, st.z + Math.cos(yaw) * d * k) + 0.9);
      return out.set(st.x + Math.sin(yaw) * d, cy, st.z + Math.cos(yaw) * d);
    };
    // in a time lapse the castaway jumps around too fast to dodge anything: the high wide camera just holds its orbit
    const dodge = timeScale < 30;
    if (dodge) {
      // something close in the way: swing around to the nearest clear angle instead of pushing into the castaway's face
      // (the feet count too: a ridge that hides everything below the hat is just as bad)
      const seen = (yaw) => { armGoal(yaw, camGoal); return Math.min(clearFrom(aim, camGoal), clearFrom(camFeet.set(st.x, y + 0.15, st.z), camGoal)); };
      if (seen(camT + camTurn) < 0.7) {
        for (const o of TURNS) if (seen(camT + camTurn + o) >= 0.9) { camTurnTo = camTurn + o; break; }
      }
      camTurn = heroSet ? camTurn + (camTurnTo - camTurn) * (1 - Math.pow(0.02, dt)) : camTurnTo;
    }
    const goal = armGoal(camT + camTurn, camGoal);
    if (dodge) pullIn(aim, goal);
    camera.position.lerp(goal, heroSet ? 1 - Math.pow(0.02, dt) : 1);
    if (dodge) pullIn(aim, camera.position);  // like a game camera: slides out gently, but never stays behind a rock
    heroSet = true;
    camera.lookAt(aim);
  } else if (CAM === 'cave') {               // from just outside the opening, looking in at whoever is inside
    const cv = island.cave, d = +(qs.get('d') ?? 5.4);
    camera.position.set(cv.x + Math.sin(cv.facing) * d, cv.y + +(qs.get('h') ?? 3), cv.z + Math.cos(cv.facing) * d);
    camera.lookAt(cv.x, cv.y + 0.9, cv.z);
  } else if (CAM) {
    const aerial = CAM === 'aerial';
    const [cx, cz, r, h] = aerial ? [32, 32, +(qs.get('r') ?? 46), +(qs.get('h') ?? 36)] : [+qs.get('px'), +qs.get('pz'), +(qs.get('r') ?? 9), +(qs.get('h') ?? 5)];
    camT += dt * (aerial ? 0.1 : 0.16);
    camera.position.set(cx + Math.sin(camT) * r, h, cz + Math.cos(camT) * r);
    camera.lookAt(cx, aerial ? -4 : 0.4, cz);
  } else if (follow) {
    const yaw = st.heading + Math.PI + camYaw;
    const goal = new THREE.Vector3(st.x + Math.sin(yaw) * camDist, y + 2.2 + camDist * 0.35, st.z + Math.cos(yaw) * camDist);
    // hills between the camera and the castaway: rise over them instead of filming rock
    for (let k = 0.25; k <= 1; k += 0.25) goal.y = Math.max(goal.y, heightAt(st.x + Math.sin(yaw) * camDist * k, st.z + Math.cos(yaw) * camDist * k) + 1.6);
    camera.position.lerp(goal, 1 - Math.pow(0.001, dt));
    camera.lookAt(st.x, y + 1, st.z);
  } else orbit.update();
  skyGroup.position.copy(camera.position);
  hud();
  renderer.render(scene, camera);
  if (!manual) requestAnimationFrame(frame);
}
// record mode drives the frames itself (viewer/record.js, cache-busted so a stale recorder never runs); otherwise the browser does
if (qs.has('record')) import(`./record.js?t=${Date.now()}`).then((m) => m.start(window.__island, qs.get('record')));
else requestAnimationFrame(frame);
