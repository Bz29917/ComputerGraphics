import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 15);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const grassMaterial = new THREE.MeshBasicMaterial({ color: "green" });
const roadMaterial = new THREE.MeshBasicMaterial({ color: "gray" });

const groundGrass = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  grassMaterial
);
groundGrass.rotation.x = -Math.PI / 2;
scene.add(groundGrass);

const roadVertical = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 20),
  roadMaterial
);
roadVertical.rotation.x = -Math.PI / 2;
roadVertical.position.set(0, 0.01, 0);
scene.add(roadVertical);

const roadLeftTop = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), roadMaterial);
roadLeftTop.rotation.x = -Math.PI / 2;
roadLeftTop.position.set(-2, 0.01, 4);
scene.add(roadLeftTop);

const roadLeftBottom = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 2),
  roadMaterial
);
roadLeftBottom.rotation.x = -Math.PI / 2;
roadLeftBottom.position.set(-2, 0.01, -5);
scene.add(roadLeftBottom);

const whiteBuildingMaterial = new THREE.MeshBasicMaterial({ color: "white" });
const blueBuildingMaterial = new THREE.MeshBasicMaterial({ color: "blue" });

function createBuilding(x, z, material, width, height, depth, rotationY = 0) {
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );
  building.position.set(x, height / 2, z);
  building.rotation.y = rotationY;
  scene.add(building);
}

createBuilding(-4, 4, whiteBuildingMaterial, 3, 3, 9);
createBuilding(-4, -5, blueBuildingMaterial, 3, 3, 9);
createBuilding(6, 4, whiteBuildingMaterial, 3, 3, 7, Math.PI / 4);

const sphereMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  sphereMaterial
);
sphere.position.set(0, 0.5, 0);
scene.add(sphere);

gsap.to(sphere.position, {
  duration: 20,
  repeat: -1,
  ease: "linear",
  keyframes: [
    { x: 0, z: 4 },
    { x: -4, z: 4 },
    { x: 0, z: 4 },
    { x: 0, z: -5 },
    { x: -4, z: -5 },
    { x: 0, z: -5 },
    { x: 0, z: 0 },
  ],
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
