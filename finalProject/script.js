import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("gallery").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

const backWallGeometry = new THREE.PlaneGeometry(50, 10);
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.position.set(0, 5, -25);
scene.add(backWall);

const leftWallGeometry = new THREE.PlaneGeometry(50, 10);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-25, 5, 0);
scene.add(leftWall);

const rightWallGeometry = new THREE.PlaneGeometry(50, 10);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(25, 5, 0);
scene.add(rightWall);

const loader = new GLTFLoader();

loader.load("models/sculpture.glb", (gltf) => {
  const sculpture = gltf.scene;
  sculpture.position.set(-10, 0, 0);
  sculpture.scale.set(1.5, 1.5, 1.5);
  scene.add(sculpture);
});

const paintingTexture = new THREE.TextureLoader().load("textures/painting.jpg");
const planeGeometry = new THREE.PlaneGeometry(3, 4);
const planeMaterial = new THREE.MeshBasicMaterial({ map: paintingTexture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 5, -24.9);
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x20b2aa,
  emissive: 0x112244,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(10, 0.75, 0);
scene.add(sphere);

function animateSphere() {
  sphere.rotation.y += 0.01;
  sphere.rotation.x += 0.005;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  animateSphere();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
