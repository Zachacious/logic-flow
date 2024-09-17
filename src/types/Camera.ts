import { nanoid } from 'nanoid';
import { Coords } from './Coords';

export class Camera {
  uid: string;
  pos: Coords;
  zoom: number;

  constructor() {
    this.uid = nanoid();
    this.pos = { x: 0, y: 0 };
    this.zoom = 1;
  }

  toScreenCoords(worldCoords: Coords): Coords {
    return {
      x: (worldCoords.x - this.pos.x) * this.zoom,
      y: (worldCoords.y - this.pos.y) * this.zoom,
    };
  }

  toWorldCoords(screenCoords: Coords): Coords {
    return {
      x: screenCoords.x / this.zoom - this.pos.x,
      y: screenCoords.y / this.zoom - this.pos.y,
    };
  }
}
