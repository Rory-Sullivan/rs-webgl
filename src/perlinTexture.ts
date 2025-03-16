import { Color } from "three";

export function getPerlinTextureCanvas(color: Color, width = 512, height = 512): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    const error = "Unable to get 2D context on canvas";
    console.error(error);
    throw Error(error);
  }
  context.fillStyle = `#${color.getHexString()}`;
  context.fillRect(0, 0, width, height);

  const colorPerturbation = 0.02;
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 3 + 3;

    const pertR = (Math.random() * 2 - 1) * colorPerturbation;
    const pertG = (Math.random() * 2 - 1) * colorPerturbation;
    const pertB = (Math.random() * 2 - 1) * colorPerturbation;

    context.fillStyle =
      "rgb(" +
      (color.r + pertR) * 256 +
      "," +
      (color.g + pertG) * 256 +
      "," +
      (color.b + pertB) * 256 +
      ")";
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
  }

  return canvas;
}
