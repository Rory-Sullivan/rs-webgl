import * as three from "three";

export function getSceneAndAnimations(addHelpers: boolean): {
  scene: three.Scene;
  animations: (() => undefined)[];
} {
  // Create our scene
  const scene = new three.Scene();
  const animations: (() => undefined)[] = [];

  // Add ambient light
  const ambientLight = new three.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);
  animations.push(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
  });

  // Add a point light
  const pointLight = new three.PointLight(0xffffff, 10.0, 0, 0.5);
  pointLight.position.set(10, 10, 5);
  scene.add(pointLight);

  // Add a cube
  const geometry = new three.BoxGeometry(5, 5, 5);
  const material = new three.MeshStandardMaterial({ color: 0x69ff69 });
  const cube = new three.Mesh(geometry, material);
  scene.add(cube);

  // Add stars
  function addStar() {
    const geometry = new three.SphereGeometry(0.25, 24, 24);
    const material = new three.MeshStandardMaterial({ color: 0xffffff });
    const star = new three.Mesh(geometry, material);
    const [x, y, z] = Array(3)
      .fill(0)
      .map(() => three.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
  }
  for (let index = 0; index < 200; index++) {
    addStar();
  }

  // Add helpers
  // Add direction arrows
  if (addHelpers) {
    const origin = new three.Vector3(0, 0, 0);
    const xArrow = new three.ArrowHelper(new three.Vector3(1, 0, 0), origin, 10, 0xff0000);
    const yArrow = new three.ArrowHelper(new three.Vector3(0, 1, 0), origin, 10, 0x00ff00);
    const zArrow = new three.ArrowHelper(new three.Vector3(0, 0, 1), origin, 10, 0x0000ff);
    scene.add(xArrow, yArrow, zArrow);
    // Add a grid
    const gridHelper = new three.GridHelper(200, 50);
    scene.add(gridHelper);
    // Show where a point light is located
    const lightHelper = new three.PointLightHelper(pointLight);
    scene.add(lightHelper);
  }

  return { scene, animations };
}
