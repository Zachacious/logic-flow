import { Camera } from '../types/Camera';

export const renderCanvasGrid = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  gridSize: number,
  color: string,
  bgColor: string,
  camera: Camera,
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  let step = gridSize * camera.zoom;

  // if the step is too small because of zoom, increase it by a factor of 10
  if (step < 10) {
    step *= 2;
  }

  // const dpr = window.devicePixelRatio || 1;
  // canvas.width = width * dpr;
  // canvas.height = height * dpr;
  // ctx.scale(dpr, dpr);

  // canvas.width = width;
  // canvas.height = height;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  //clear
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const offsetX = (-camera.pos.x % gridSize) * camera.zoom;
  const offsetY = (-camera.pos.y % gridSize) * camera.zoom;

  ctx.beginPath();

  for (let x = -offsetX; x < width; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = -offsetY; y < height; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
};

export const renderCanvasDotGrid = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  gridSize: number,
  color: string,
  bgColor: string,
  camera: Camera,
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  let step = gridSize * camera.zoom;

  // if the step is too small because of zoom, increase it by a factor of 10
  if (step < 10) {
    step *= 2;
  }

  // const dpr = window.devicePixelRatio || 1;
  // canvas.width = width * dpr;
  // canvas.height = height * dpr;
  // ctx.scale(dpr, dpr);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  //clear
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const offsetX = (-camera.pos.x % gridSize) * camera.zoom;
  const offsetY = (-camera.pos.y % gridSize) * camera.zoom;

  ctx.beginPath();

  // for (let x = -offsetX; x < width; x += step) {
  //   for (let y = -offsetY; y < height; y += step) {
  //     ctx.moveTo(x, y);
  //     ctx.arc(x, y, 1, 0, 2 * Math.PI);
  //   }
  // }

  ctx.fillStyle = color;

  for (let x = -offsetX; x < width; x += step) {
    for (let y = -offsetY; y < height; y += step) {
      //  ctx.moveTo(x, y);
      //  ctx.arc(x, y, 1, 0, 2 * Math.PI);
      // use fill rect
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }

  ctx.stroke();
};
