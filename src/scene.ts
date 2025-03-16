import * as three from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { getPerlinTextureCanvas } from "./perlinTexture";

export function getSceneAndAnimations(
  addHelpers: boolean,
  renderer: three.WebGLRenderer,
): {
  scene: three.Scene;
  animations: (() => undefined)[];
} {
  // Create our scene
  const scene = new three.Scene();
  const animations: (() => undefined)[] = [];

  // Add ambient light
  const ambientLight = new three.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  // Make the ground a 20x20 grid of random height boxes with a platform in the middle
  // box width: 100
  // x in [-1000, 1000]
  // z in [-1000, 1000]
  const groundBoxes = [];
  const groundMaterial = new three.MeshPhysicalMaterial({
    color: new three.Color(0.48, 0.83, 0.53),
  });
  const width = 100;
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      const x = -1000.0 + (i + 0.5) * width;
      const y = 0.5 * width;
      const z = -1000.0 + (j + 0.5) * width;
      const height =
        (i >= 10 && i < 14 && j >= 10 && j < 14 ? 100.0 : three.MathUtils.randFloat(1.0, 96.0)) +
        0.5 * width;

      const boxGeometry = new three.BoxGeometry(width, height, width);
      const box = new three.Mesh(boxGeometry, groundMaterial);
      box.position.set(x, y, z);
      groundBoxes.push(box);
    }
  }
  scene.add(...groundBoxes);

  // Make a light
  const rectLight = new three.RectAreaLight(0xffffff, 6, 646, 265);
  rectLight.position.set(200, 554, 280);
  rectLight.lookAt(200, 0, 280);
  const rectLightHelper = new RectAreaLightHelper(rectLight);
  scene.add(rectLight, rectLightHelper);

  // Add a moving sphere
  const movingSphereMaterial = new three.MeshPhysicalMaterial({
    color: new three.Color(0.7, 0.3, 0.1),
  });
  const movingSphereGeometry = new three.SphereGeometry(50);
  const movingSphere = new three.Mesh(movingSphereGeometry, movingSphereMaterial);
  movingSphere.position.set(430.0, 400.0, 500.0);
  scene.add(movingSphere);
  let movingSphereDirection = 1;
  animations.push(() => {
    if (movingSphere.position.x > 490 || movingSphere.position.x < 370) {
      // Change direction
      movingSphereDirection *= -1;
    }
    movingSphere.position.x += movingSphereDirection;
  });

  // Add a dielectric (glass) sphere
  const glassSphere = new three.Mesh(
    new three.SphereGeometry(50),
    new three.MeshPhysicalMaterial({
      color: new three.Color(0.7, 0.7, 0.7),
      roughness: 0.1,
      transmission: 1,
      ior: 7,
      thickness: 10,
    }),
  );
  glassSphere.position.set(175.0, 175.0, 45.0);
  scene.add(glassSphere);

  // Add a red pyramid
  const pyr0 = new three.Mesh(
    new three.ConeGeometry(40, 75),
    new three.MeshPhysicalMaterial({
      color: new three.Color(0.65, 0.05, 0.05),
    }),
  );
  pyr0.position.set(70.0, 175.0, 92.0);
  scene.add(pyr0);

  // Add a metal sphere
  const metalSphere = new three.Mesh(
    new three.SphereGeometry(50),
    new three.MeshPhysicalMaterial({
      color: new three.Color(0.8, 0.8, 0.9),
      metalness: 1,
      roughness: 0.15,
    }),
  );
  metalSphere.position.set(-50.0, 175.0, 156.0);
  scene.add(metalSphere);

  // Add a blue subsurface reflection sphere by putting a volume inside a
  // dielectric sphere.
  const blueSphere = new three.Mesh(
    new three.SphereGeometry(60),
    new three.MeshPhysicalMaterial({
      color: 0x0a1584,
      transmission: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0,
    }),
  );
  blueSphere.position.set(460.0, 185.0, 145.0);
  scene.add(blueSphere);

  // Add an Earth sphere
  const loader = new three.TextureLoader();
  const texture = loader.load("/rs-webgl/earthmap.jpg");
  texture.colorSpace = three.SRGBColorSpace;
  const earthSphere = new three.Mesh(
    new three.SphereGeometry(100),
    new three.MeshPhysicalMaterial({
      map: texture,
    }),
  );
  earthSphere.rotateY(1.361);
  earthSphere.position.set(500.0, 225.0, 400.0);
  scene.add(earthSphere);

  // Add a perlin noise sphere
  const perlinTexture = new three.CanvasTexture(
    getPerlinTextureCanvas(new three.Color(0.1, 0.1, 0.1)),
  );
  perlinTexture.repeat = new three.Vector2(10, 5);
  perlinTexture.wrapS = three.RepeatWrapping;
  perlinTexture.wrapT = three.RepeatWrapping;
  const perlinSphere = new three.Mesh(
    new three.SphereGeometry(80),
    new three.MeshPhysicalMaterial({
      color: new three.Color(0.5, 0.5, 0.5),
      map: perlinTexture,
    }),
  );
  perlinSphere.position.set(82.0, 370.0, 484.0);
  scene.add(perlinSphere);

  // Add a random assortment of white spheres in a translated rotated box
  const spheres = new three.Group();
  const white = new three.MeshPhysicalMaterial({ color: new three.Color(0.73, 0.73, 0.73) });
  const sphereGeometry = new three.SphereGeometry(10);
  const sphere = new three.Mesh(sphereGeometry, white);
  for (let i = 0; i < 1000; i++) {
    const sphereCopy = sphere.clone();
    sphereCopy.position.set(
      three.MathUtils.randFloat(0, 165),
      three.MathUtils.randFloat(0, 165),
      three.MathUtils.randFloat(0, 165),
    );
    spheres.add(sphereCopy);
  }
  spheres.rotateY(0.262);
  spheres.position.set(-250.0, 270.0, 395.0);
  scene.add(spheres);

  // Set environment maps where necessary
  const pmremGenerator = new three.PMREMGenerator(renderer);
  function setEnvironmentMaps() {
    glassSphere.material.envMap = pmremGenerator.fromScene(scene, undefined, undefined, 10000, {
      position: glassSphere.position,
    }).texture;
    metalSphere.material.envMap = pmremGenerator.fromScene(scene, undefined, undefined, 10000, {
      position: metalSphere.position,
    }).texture;
    blueSphere.material.envMap = pmremGenerator.fromScene(scene, undefined, undefined, 10000, {
      position: blueSphere.position,
    }).texture;
  }
  setEnvironmentMaps();

  // Add a gold dragon
  const dragonMaterial = new three.MeshPhysicalMaterial({
    color: 0xffd700,
    metalness: 0.5,
    roughness: 0.15,
  });
  const objLoader = new OBJLoader();
  objLoader.load("/rs-webgl/dragon.obj", (root) => {
    root.traverse((child) => {
      if (child instanceof three.Mesh) {
        child.material = dragonMaterial;
      }
    });
    root.scale.set(400.0, 400.0, 400.0);
    root.rotateY(-1.5);
    root.position.set(200.0, 238.0, 200.0);
    scene.add(root);
    dragonMaterial.envMap = pmremGenerator.fromScene(scene, undefined, undefined, 10000, {
      position: root.position,
    }).texture;
    setEnvironmentMaps();
  });

  // Add helpers
  // Add direction arrows
  if (addHelpers) {
    const origin = new three.Vector3(0, 150, 0);
    const xArrow = new three.ArrowHelper(new three.Vector3(1, 0, 0), origin, 100, 0xff0000);
    const yArrow = new three.ArrowHelper(new three.Vector3(0, 1, 0), origin, 100, 0x00ff00);
    const zArrow = new three.ArrowHelper(new three.Vector3(0, 0, 1), origin, 100, 0x0000ff);
    scene.add(xArrow, yArrow, zArrow);
    // Add a grid
    const gridHelper = new three.GridHelper(10000, 100);
    scene.add(gridHelper);
  }

  return { scene, animations };
}
