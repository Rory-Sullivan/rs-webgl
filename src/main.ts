import "./style.css";

import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getSceneAndAnimations } from "./scene";

const ADD_HELPERS = true;

// Create renderer and camera
const canvas = document.querySelector<HTMLCanvasElement>("canvas#scene") ?? undefined;
if (!canvas) {
  console.error("Canvas not found");
}
const renderer = new three.WebGLRenderer({ canvas });
const camera = new three.PerspectiveCamera(
  40,
  renderer.domElement.clientWidth / renderer.domElement.clientHeight,
  0.1,
  10000,
);
camera.position.set(478, 278, -600);
camera.updateProjectionMatrix();

/**
 * Resizes the renderer and camera if necessary.
 */
function resize(renderer: three.WebGLRenderer, camera: three.PerspectiveCamera) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

// Create scene
const { scene, animations } = getSceneAndAnimations(ADD_HELPERS);

// Adds controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(200, 278, 280);

// Create animation loop
function animationLoop() {
  resize(renderer, camera);
  animations.forEach((animation) => {
    animation();
  });
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animationLoop);
