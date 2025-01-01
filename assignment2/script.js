import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 8);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

const textureLoader = new THREE.TextureLoader();
const classroomMaterials = [
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/wall.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/wall.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/ceiling.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/floor.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/wall.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./textures/wall.jpg"),
  }),
];
classroomMaterials.forEach((mat) => (mat.side = THREE.BackSide));
const classroom = new THREE.Mesh(
  new THREE.BoxGeometry(10, 6, 10),
  classroomMaterials
);
classroom.rotation.y = Math.PI / 2;
scene.add(classroom);

const windowWidth = 3;
const windowHeight = 2;
const windowDepth = 0.1;

const windowGeometry = new THREE.BoxGeometry(
  windowWidth,
  windowHeight,
  windowDepth
);
const windowMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load("./textures/window.jpg"),
  transparent: true,
  opacity: 0.8,
});
const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
windowMesh.position.set(0, 1, -4.99);
scene.add(windowMesh);

const frameWidth = windowWidth + 0.2;
const frameHeight = windowHeight + 0.2;
const frameDepth = windowDepth + 0.1;

const frameGeometry = new THREE.BoxGeometry(
  frameWidth,
  frameHeight,
  frameDepth
);
const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 });
const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
frameMesh.position.set(0, 1, -5.05);
scene.add(frameMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

const loader = new GLTFLoader();

function loadModel(url, position, scale) {
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(...position);
      model.scale.set(...scale);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
}

const chairOffsets = [
  [-0.6, 0, -0.6],
  [0.6, 0, -0.6],
];

const deskPositions = [
  [-2.5, -2.8, -2],
  [2.5, -2.8, -2],
  [-2.5, -2.8, 1],
  [2.5, -2.8, 1],
];

deskPositions.forEach((deskPos) => {
  chairOffsets.forEach((offset) => {
    const chairPos = [
      deskPos[0] + offset[0],
      deskPos[1] + offset[1],
      deskPos[2] + offset[2],
    ];
    loadModel("./models/Chair.glb", chairPos, [0.6, 0.6, 0.6]);
  });
  loadModel("./models/Desk.glb", deskPos, [1, 1, 1]);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
