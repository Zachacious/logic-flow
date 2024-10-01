import { Coords } from './Coords';
import { Rect } from './Rect';
import { Camera } from './Camera';

// SpatialObject can be either a Point or a Rect with an ID for tracking
type SpatialObject = Point | BBox;

interface Point extends Coords {
  id: string; // Unique ID of the point (e.g., connector)
}

interface BBox extends Rect {
  id: string; // Unique ID of the rect (e.g., node)
}

export class Quadtree {
  boundary: Rect;
  capacity: number;
  objects: SpatialObject[];
  divided: boolean;
  northeast: Quadtree | null;
  northwest: Quadtree | null;
  southeast: Quadtree | null;
  southwest: Quadtree | null;
  camera: Camera;

  constructor(boundary: Rect, capacity: number, camera: Camera) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.objects = [];
    this.divided = false;
    this.northeast = null;
    this.northwest = null;
    this.southeast = null;
    this.southwest = null;
    this.camera = camera;
  }

  subdivide() {
    const { left, top, width, height } = this.boundary;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.northeast = new Quadtree(
      { left: left + halfWidth, top, width: halfWidth, height: halfHeight },
      this.capacity,
      this.camera,
    );
    this.northwest = new Quadtree(
      { left, top, width: halfWidth, height: halfHeight },
      this.capacity,
      this.camera,
    );
    this.southeast = new Quadtree(
      {
        left: left + halfWidth,
        top: top + halfHeight,
        width: halfWidth,
        height: halfHeight,
      },
      this.capacity,
      this.camera,
    );
    this.southwest = new Quadtree(
      { left, top: top + halfHeight, width: halfWidth, height: halfHeight },
      this.capacity,
      this.camera,
    );

    this.divided = true;
  }

  expandBoundaryToInclude(object: SpatialObject) {
    if ('x' in object && 'y' in object) {
      this.expandBoundaryToPoint(object);
    } else {
      this.expandBoundaryToRect(object);
    }
  }

  expandBoundaryToPoint(point: Point) {
    const { left, top, width, height } = this.boundary;
    const { x, y } = point;

    const newLeft = Math.min(left, x);
    const newTop = Math.min(top, y);
    const newRight = Math.max(left + width, x);
    const newBottom = Math.max(top + height, y);

    this.boundary = {
      left: newLeft,
      top: newTop,
      width: newRight - newLeft,
      height: newBottom - newTop,
    };
  }

  expandBoundaryToRect(rect: Rect) {
    const { left, top, width, height } = this.boundary;
    const {
      left: rectLeft,
      top: rectTop,
      width: rectWidth,
      height: rectHeight,
    } = rect;

    const newLeft = Math.min(left, rectLeft);
    const newTop = Math.min(top, rectTop);
    const newRight = Math.max(left + width, rectLeft + rectWidth);
    const newBottom = Math.max(top + height, rectTop + rectHeight);

    this.boundary = {
      left: newLeft,
      top: newTop,
      width: newRight - newLeft,
      height: newBottom - newTop,
    };
  }

  insert(object: SpatialObject): boolean {
    // if (!this.contains(object)) return false;

    if (!this.contains(object)) {
      this.expandBoundaryToInclude(object);
    }

    if (this.objects.length < this.capacity) {
      this.objects.push(object);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northeast!.insert(object)) return true;
      if (this.northwest!.insert(object)) return true;
      if (this.southeast!.insert(object)) return true;
      if (this.southwest!.insert(object)) return true;

      console.log('Object could not be inserted into any child node');

      // If none of the children can contain the object, keep it in the current node
      this.objects.push(object);
      return true;
    }
  }

  remove(id: string): boolean {
    const removeFromNode = (node: Quadtree | null): boolean => {
      if (!node) return false;

      const originalLength = node.objects.length;
      node.objects = node.objects.filter(obj => (obj as any).id !== id);

      if (originalLength !== node.objects.length) return true;

      if (node.divided) {
        return (
          removeFromNode(node.northwest) ||
          removeFromNode(node.northeast) ||
          removeFromNode(node.southwest) ||
          removeFromNode(node.southeast)
        );
      }

      return false;
    };

    return removeFromNode(this);
  }

  contains(object: SpatialObject): boolean {
    if ('x' in object && 'y' in object) {
      return this.containsPoint(object);
    } else {
      return this.containsRect(object);
    }
  }

  containsPoint(point: Point): boolean {
    const { left, top, width, height } = this.boundary;
    return (
      point.x >= left &&
      point.x < left + width &&
      point.y >= top &&
      point.y < top + height
    );

    // boundary adjusted to world space
    // const adjBounds = {
    //   left: this.boundary.left + this.camera.pos.x,
    //   top: this.boundary.top + this.camera.pos.y,
    //   width: this.boundary.width,
    //   height: this.boundary.height,
    // };

    // return (
    //   point.x >= adjBounds.left &&
    //   point.x < adjBounds.left + adjBounds.width &&
    //   point.y >= adjBounds.top &&
    //   point.y < adjBounds.top + adjBounds.height
    // );
  }

  containsRect(rect: Rect): boolean {
    const { left, top, width, height } = this.boundary;
    return (
      rect.left >= left &&
      rect.left + rect.width <= left + width &&
      rect.top >= top &&
      rect.top + rect.height <= top + height
    );
  }

  inRange(
    object: SpatialObject,
    range: Rect,
    pan: Coords,
    zoom: number,
  ): boolean {
    if ('x' in object && 'y' in object) {
      // It's a point
      return this.pointInRange(object, range, pan, zoom);
    } else {
      // It's a rect
      return this.rectInRange(object, range, pan, zoom);
    }
  }

  pointInRange(point: Point, range: Rect, pan: Coords, zoom: number): boolean {
    // Adjust point position relative to pan and zoom
    const adjX = (point.x + pan.x) * zoom;
    const adjY = (point.y + pan.y) * zoom;

    // const screenX = adjX / zoom - pan.x;
    // const screenY = adjY / zoom - pan.y;

    // // show debug
    // const debugDiv = document.getElementById('debug');
    // debugDiv.style.left = `${screenX}px`;
    // debugDiv.style.top = `${screenY}px`;
    // debugDiv.style.width = '10px';
    // debugDiv.style.height = '10px';

    // // // show debug range
    // const screenRange = {
    //   left: range.left / zoom - pan.x,
    //   top: range.top / zoom - pan.y,
    //   width: range.width / zoom,
    //   height: range.height / zoom,
    // };

    // const debugDiv2 = document.getElementById('debug2');
    // debugDiv2.style.left = `${screenRange.left}px`;
    // debugDiv2.style.top = `${screenRange.top}px`;
    // debugDiv2.style.width = `${screenRange.width}px`;
    // debugDiv2.style.height = `${screenRange.height}px`;

    return (
      adjX >= range.left &&
      adjX < range.left + range.width &&
      adjY >= range.top &&
      adjY < range.top + range.height
    );
  }

  rectInRange(rect: Rect, range: Rect, pan: Coords, zoom: number): boolean {
    // Adjust rect position relative to pan and zoom
    const adjLeft = (rect.left + pan.x) * zoom;
    const adjTop = (rect.top + pan.y) * zoom;

    const adjRight = adjLeft + rect.width * zoom;
    const adjBottom = adjTop + rect.height * zoom;

    // const screenW = (adjRight - adjLeft) / this.camera.zoom;
    // const screenH = (adjBottom - adjTop) / this.camera.zoom;
    // const screenX = adjLeft / this.camera.zoom - pan.x;
    // const screenY = adjTop / this.camera.zoom - pan.y;

    // const debugDiv2 = document.getElementById('debug2');
    // debugDiv2.style.width = `${screenW}px`;
    // debugDiv2.style.height = `${screenH}px`;
    // debugDiv2.style.left = `${screenX}px`;
    // debugDiv2.style.top = `${screenY}px`;

    // const screenRange = {
    //   left: range.left / zoom - pan.x,
    //   top: range.top / zoom - pan.y,
    //   width: range.width / zoom,
    //   height: range.height / zoom,
    // };

    // const debugDiv = document.getElementById('debug2');
    // debugDiv.style.width = `${screenRange.width}px`;
    // debugDiv.style.height = `${screenRange.height}px`;
    // debugDiv.style.left = `${screenRange.left}px`;
    // debugDiv.style.top = `${screenRange.top}px`;

    return !(
      adjRight < range.left ||
      adjLeft > range.left + range.width ||
      adjBottom < range.top ||
      adjTop > range.top + range.height
    );
  }

  query(
    range: Rect,
    found: SpatialObject[] = [],
    pan: Coords,
    zoom: number,
  ): SpatialObject[] {
    if (!this.intersects(range)) return found;

    for (let i = 0; i < this.objects.length; i++) {
      if (this.inRange(this.objects[i], range, pan, zoom)) {
        found.push(this.objects[i]);
      }
    }

    if (this.divided) {
      this.northwest!.query(range, found, pan, zoom);
      this.northeast!.query(range, found, pan, zoom);
      this.southwest!.query(range, found, pan, zoom);
      this.southeast!.query(range, found, pan, zoom);
    }

    return found;
  }

  intersects(range: Rect): boolean {
    const { left, top, width, height } = this.boundary;
    return !(
      range.left > left + width ||
      range.left + range.width < left ||
      range.top > top + height ||
      range.top + range.height < top
    );
  }

  checkNearby(coords: Coords, range: number): SpatialObject | null {
    const bounds = {
      left: coords.x - range / 2,
      top: coords.y - range / 2,
      width: range,
      height: range,
    };

    const nearby = this.query(bounds, [], this.camera.pos, this.camera.zoom);
    return nearby.length > 0 ? nearby[0] : null;
  }
}
