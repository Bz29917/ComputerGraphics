import * as THREE from "three";

const scene = new THREE.Scene();
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  shininess: 100,
  specular: 0x555555,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x800080,
  shininess: 100,
  specular: 0x555555,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  shininess: 100,
  specular: 0x555555,
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

box.position.x = -4;
sphere.position.x = 4;
cylinder.position.x = 0;

scene.add(cylinder);
scene.add(box);
scene.add(sphere);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspect = sizes.width / sizes.height;

const cameraSize = 10;
const camera = new THREE.OrthographicCamera(
  -cameraSize * aspect,
  cameraSize * aspect,
  cameraSize,
  -cameraSize,
  0.1,
  1000
);

camera.position.z = 10;
camera.position.y = 2;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);

document.getElementById("scene").appendChild(renderer.domElement);

camera.lookAt(sphere.position);

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  camera.left = -cameraSize * aspect;
  camera.right = cameraSize * aspect;
  camera.top = cameraSize;
  camera.bottom = -cameraSize;

  renderer.setSize(width, height);
  camera.updateProjectionMatrix();
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "b":
      camera.lookAt(box.position);
      break;
    case "s":
      camera.lookAt(sphere.position);
      break;
    case "c":
      camera.lookAt(cylinder.position);
      break;
  }
  camera.updateProjectionMatrix();
});

const animate = () => {
  requestAnimationFrame(animate);
  cylinder.position.x += 0.03;
  renderer.render(scene, camera);
};
animate();