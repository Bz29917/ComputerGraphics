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

const columnGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
const columnMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });

for (let i = -20; i <= 20; i += 10) {
  const leftColumn = new THREE.Mesh(columnGeometry, columnMaterial);
  leftColumn.position.set(-22, 5, i);
  scene.add(leftColumn);

  const rightColumn = new THREE.Mesh(columnGeometry, columnMaterial);
  rightColumn.position.set(22, 5, i);
  scene.add(rightColumn);
}

const loader = new GLTFLoader();

let sculpture;
const interactableObjects = [];

loader.load("models/sculpture.glb", (gltf) => {
  sculpture = gltf.scene;
  sculpture.position.set(0, 0, 0);
  sculpture.scale.set(6, 6, 6);
  scene.add(sculpture);
  sculpture.traverse((child) => {
    if (child.isMesh) {
      interactableObjects.push(child);
      child.userData.parentSculpture = sculpture;
    }
  });
});

const paintingTexture = new THREE.TextureLoader().load("textures/mona.jpg");
const planeGeometry = new THREE.PlaneGeometry(7, 9);
const planeMaterial = new THREE.MeshBasicMaterial({ map: paintingTexture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 5, -24.9);
scene.add(plane);
interactableObjects.push(plane);

const leftPaintingTexture = new THREE.TextureLoader().load(
  "textures/painting1.jpg"
);
const leftPaintingGeometry = new THREE.PlaneGeometry(7, 9);
const leftPaintingMaterial = new THREE.MeshBasicMaterial({
  map: leftPaintingTexture,
});

const leftWallPainting = new THREE.Mesh(
  leftPaintingGeometry,
  leftPaintingMaterial
);
leftWallPainting.position.set(-24.9, 5, 10);
leftWallPainting.rotation.y = Math.PI / 2;
scene.add(leftWallPainting);
interactableObjects.push(leftWallPainting);

const rightPaintingTexture = new THREE.TextureLoader().load(
  "textures/painting2.jpg"
);
const rightPaintingGeometry = new THREE.PlaneGeometry(7, 9);
const rightPaintingMaterial = new THREE.MeshBasicMaterial({
  map: rightPaintingTexture,
});

const rightWallPainting = new THREE.Mesh(
  rightPaintingGeometry,
  rightPaintingMaterial
);
rightWallPainting.position.set(24.9, 5, -10);
rightWallPainting.rotation.y = -Math.PI / 2;
scene.add(rightWallPainting);
interactableObjects.push(rightWallPainting);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function displayArtworkInfo(object) {
  const infoBox = document.getElementById("infoBox");
  if (!infoBox) return;
  let infoText = "";
  if (object === plane) {
    infoText = "Mona Lisa by Leonardo da Vinci";
  } else if (object === leftWallPainting) {
    infoText = "Random Phobia";
  } else if (object === rightWallPainting) {
    infoText = "Upcoming Grand Theft Auto VI";
  } else if (object.userData.parentSculpture === sculpture) {
    infoText = "Modern Sculpture by Random Artist";
  }

  infoBox.innerText = infoText;
  infoBox.style.display = "block";
}

function hideArtworkInfo() {
  const infoBox = document.getElementById("infoBox");
  if (infoBox) {
    infoBox.style.display = "none";
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactableObjects);

  if (intersects.length > 0) {
    displayArtworkInfo(intersects[0].object);
  } else {
    hideArtworkInfo();
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
