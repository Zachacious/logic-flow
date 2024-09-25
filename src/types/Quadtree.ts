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

  insert(object: SpatialObject): boolean {
    // if (!this.contains(object)) console.log('Object out of bounds');
    // if (!this.contains(object)) return false;

    if (this.objects.length < this.capacity) {
      this.objects.push(object);
      return true;
    } else {
      if (!this.divided) this.subdivide();

      return (
        this.northeast!.insert(object) ||
        this.northwest!.insert(object) ||
        this.southeast!.insert(object) ||
        this.southwest!.insert(object)
      );
    }
  }

  remove(id: string): boolean {
    const removeFromNode = (node: Quadtree | null): boolean => {
      if (!node) return false;

      const originalLength = node.objects.length;
      node.objects = node.objects.filter(obj => (obj as any).id !== id);

      // If any objects were removed, return true
      if (originalLength !== node.objects.length) return true;

      // Recursively remove from child nodes if subdivided
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
      // It's a point
      return this.containsPoint(object);
    } else {
      // It's a rect
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

  query(
    range: Rect,
    found: SpatialObject[] = [],
    pan: Coords,
    zoom: number,
  ): SpatialObject[] {
    if (!this.intersects(range)) return found;

    this.objects.forEach(obj => {
      if (this.inRange(obj, range, pan, zoom)) {
        found.push(obj);
      }
    });

    if (this.divided) {
      this.northwest!.query(range, found, pan, zoom);
      this.northeast!.query(range, found, pan, zoom);
      this.southwest!.query(range, found, pan, zoom);
      this.southeast!.query(range, found, pan, zoom);
    }

    return found;
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

    // // show debug range
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

    // const debugDiv = document.getElementById('debug');
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

// import { Camera } from './Camera';

// interface Point {
//   x: number;
//   y: number;
//   id: string; // Unique ID of the connector
// }

// interface BoundingBox {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// export class Quadtree {
//   boundary: BoundingBox;
//   capacity: number;
//   points: Point[];
//   divided: boolean;
//   northeast: Quadtree | null;
//   northwest: Quadtree | null;
//   southeast: Quadtree | null;
//   southwest: Quadtree | null;
//   camera: Camera;

//   constructor(boundary: BoundingBox, capacity: number, camera: Camera) {
//     this.boundary = boundary;
//     this.capacity = capacity;
//     this.points = [];
//     this.divided = false;
//     this.northeast = null;
//     this.northwest = null;
//     this.southeast = null;
//     this.southwest = null;
//     this.camera = camera;
//   }

//   subdivide() {
//     const { x, y, width, height } = this.boundary;
//     const halfWidth = width / 2;
//     const halfHeight = height / 2;

//     this.northeast = new Quadtree(
//       { x: x + halfWidth, y: y, width: halfWidth, height: halfHeight },
//       this.capacity,
//       this.camera,
//     );
//     this.northwest = new Quadtree(
//       { x: x, y: y, width: halfWidth, height: halfHeight },
//       this.capacity,
//       this.camera,
//     );
//     this.southeast = new Quadtree(
//       {
//         x: x + halfWidth,
//         y: y + halfHeight,
//         width: halfWidth,
//         height: halfHeight,
//       },
//       this.capacity,
//       this.camera,
//     );
//     this.southwest = new Quadtree(
//       { x: x, y: y + halfHeight, width: halfWidth, height: halfHeight },
//       this.capacity,
//       this.camera,
//     );

//     this.divided = true;
//   }

//   insert(point: Point): boolean {
//     if (!this.contains(point)) return false;

//     if (this.points.length < this.capacity) {
//       this.points.push(point);
//       return true;
//     } else {
//       if (!this.divided) this.subdivide();

//       return (
//         this.northeast!.insert(point) ||
//         this.northwest!.insert(point) ||
//         this.southeast!.insert(point) ||
//         this.southwest!.insert(point)
//       );
//     }
//   }

//   insertItems(points: Point[]): void {
//     for (let point of points) {
//       this.insert(point);
//     }
//   }

//   remove(id: string): boolean {
//     const removeFromNode = (node: Quadtree | null): boolean => {
//       if (node === null) return false;

//       // Remove points from the node
//       node.points = node.points.filter(point => point.id !== id);

//       // Recursively remove from child nodes
//       const removed =
//         removeFromNode(node.northwest) ||
//         removeFromNode(node.northeast) ||
//         removeFromNode(node.southwest) ||
//         removeFromNode(node.southeast);

//       // If no points in the node and no children have points, remove the node
//       if (node.points.length === 0 && !node.divided) {
//         node.northwest =
//           node.northeast =
//           node.southwest =
//           node.southeast =
//             null;
//       }

//       return removed;
//     };

//     return removeFromNode(this);
//   }

//   removeItems(ids: string[]): void {
//     for (let id of ids) {
//       this.remove(id);
//     }
//   }

//   contains(point: Point): boolean {
//     const { x, y, width, height } = this.boundary;
//     return (
//       point.x >= x &&
//       point.x < x + width &&
//       point.y >= y &&
//       point.y < y + height
//     );
//   }

//   query(
//     range: BoundingBox,
//     found: Point[] = [],
//     pan: { x: number; y: number },
//     zoom: number,
//   ): Point[] {
//     if (!this.intersects(range)) return found;

//     for (let point of this.points) {
//       if (this.inRange(point, range, pan, zoom)) {
//         found.push(point);
//       }
//     }

//     if (this.divided) {
//       this.northwest!.query(range, found, pan, zoom);
//       this.northeast!.query(range, found, pan, zoom);
//       this.southwest!.query(range, found, pan, zoom);
//       this.southeast!.query(range, found, pan, zoom);
//     }

//     return found;
//   }

//   inRange(
//     point: Point,
//     range: BoundingBox,
//     pan: { x: number; y: number },
//     zoom: number,
//   ): boolean {
//     // Adjust the point position relative to pan and zoom
//     const adjPoint = {
//       x: (point.x + pan.x) * zoom,
//       y: (point.y + pan.y) * zoom,
//     };

//     // Check if the adjusted point is within the adjusted range
//     return (
//       adjPoint.x >= range.x &&
//       adjPoint.x < range.x + range.width &&
//       adjPoint.y >= range.y &&
//       adjPoint.y < range.y + range.height
//     );
//   }

//   intersects(range: BoundingBox): boolean {
//     const { x, y, width, height } = this.boundary;
//     return !(
//       range.x > x + width ||
//       range.x + range.width < x ||
//       range.y > y + height ||
//       range.y + range.height < y
//     );
//   }

//   checkNearby(
//     x: number,
//     y: number,
//     range: number,
//     // pan: { x: number; y: number },
//     // zoom: number,
//   ) {
//     const bounds = {
//       x: x - range / 2,
//       y: y - range / 2,
//       width: range,
//       height: range,
//     };

//     const nearby = this.query(bounds, [], this.camera.pos, this.camera.zoom);

//     if (nearby.length > 0) {
//       const nearest = nearby[0];
//       return nearest;
//     }

//     return null;
//   }
// }
