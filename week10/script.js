import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2, 2, 3);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.position.set(2, 3, -2);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1.5, 10, Math.PI * 0.2);
spotLight.castShadow = true;
spotLight.position.set(-2, 3, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const pointLight = new THREE.PointLight(0xffffff, 1.2, 10);
pointLight.castShadow = true;
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.5
);
scene.add(directionalLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
scene.add(pointLightHelper);

const material = new THREE.MeshStandardMaterial({
  roughness: 0.4,
  metalness: 0.3,
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;
sphere.position.set(-1, 0.5, 0);
scene.add(sphere);

const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), material);
box.castShadow = true;
box.position.set(1, 0.3, -1);
scene.add(box);

const cone = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 32), material);
cone.castShadow = true;
cone.position.set(0, 0.4, 1);
scene.add(cone);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
  box.rotation.y += 0.02;
  cone.rotation.x += 0.03;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
