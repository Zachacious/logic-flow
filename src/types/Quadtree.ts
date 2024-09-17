interface Point {
  x: number;
  y: number;
  id: string; // Unique ID of the connector
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Quadtree {
  boundary: BoundingBox;
  capacity: number;
  points: Point[];
  divided: boolean;
  northeast: Quadtree | null;
  northwest: Quadtree | null;
  southeast: Quadtree | null;
  southwest: Quadtree | null;

  constructor(boundary: BoundingBox, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.northeast = null;
    this.northwest = null;
    this.southeast = null;
    this.southwest = null;
  }

  subdivide() {
    const { x, y, width, height } = this.boundary;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.northeast = new Quadtree(
      { x: x + halfWidth, y: y, width: halfWidth, height: halfHeight },
      this.capacity,
    );
    this.northwest = new Quadtree(
      { x: x, y: y, width: halfWidth, height: halfHeight },
      this.capacity,
    );
    this.southeast = new Quadtree(
      {
        x: x + halfWidth,
        y: y + halfHeight,
        width: halfWidth,
        height: halfHeight,
      },
      this.capacity,
    );
    this.southwest = new Quadtree(
      { x: x, y: y + halfHeight, width: halfWidth, height: halfHeight },
      this.capacity,
    );

    this.divided = true;
  }

  insert(point: Point): boolean {
    if (!this.contains(point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) this.subdivide();

      return (
        this.northeast!.insert(point) ||
        this.northwest!.insert(point) ||
        this.southeast!.insert(point) ||
        this.southwest!.insert(point)
      );
    }
  }

  insertItems(points: Point[]): void {
    for (let point of points) {
      this.insert(point);
    }
  }

  remove(id: string): boolean {
    const removeFromNode = (node: Quadtree | null): boolean => {
      if (node === null) return false;

      // Remove points from the node
      node.points = node.points.filter(point => point.id !== id);

      // Recursively remove from child nodes
      const removed =
        removeFromNode(node.northwest) ||
        removeFromNode(node.northeast) ||
        removeFromNode(node.southwest) ||
        removeFromNode(node.southeast);

      // If no points in the node and no children have points, remove the node
      if (node.points.length === 0 && !node.divided) {
        node.northwest =
          node.northeast =
          node.southwest =
          node.southeast =
            null;
      }

      return removed;
    };

    return removeFromNode(this);
  }

  removeItems(ids: string[]): void {
    for (let id of ids) {
      this.remove(id);
    }
  }

  contains(point: Point): boolean {
    const { x, y, width, height } = this.boundary;
    return (
      point.x >= x &&
      point.x < x + width &&
      point.y >= y &&
      point.y < y + height
    );
  }

  query(
    range: BoundingBox,
    found: Point[] = [],
    pan: { x: number; y: number },
    zoom: number,
  ): Point[] {
    if (!this.intersects(range)) return found;

    for (let point of this.points) {
      if (this.inRange(point, range, pan, zoom)) {
        found.push(point);
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

  inRange(
    point: Point,
    range: BoundingBox,
    pan: { x: number; y: number },
    zoom: number,
  ): boolean {
    // Adjust the point position relative to pan and zoom
    const adjPoint = {
      x: (point.x + pan.x) * zoom,
      y: (point.y + pan.y) * zoom,
    };

    // Check if the adjusted point is within the adjusted range
    return (
      adjPoint.x >= range.x &&
      adjPoint.x < range.x + range.width &&
      adjPoint.y >= range.y &&
      adjPoint.y < range.y + range.height
    );
  }

  intersects(range: BoundingBox): boolean {
    const { x, y, width, height } = this.boundary;
    return !(
      range.x > x + width ||
      range.x + range.width < x ||
      range.y > y + height ||
      range.y + range.height < y
    );
  }

  checkNearby(
    x: number,
    y: number,
    range: number,
    pan: { x: number; y: number },
    zoom: number,
  ) {
    const bounds = {
      x: x - range / 2,
      y: y - range / 2,
      width: range,
      height: range,
    };

    const nearby = this.query(bounds, [], pan, zoom);

    if (nearby.length > 0) {
      const nearest = nearby[0];
      return nearest;
    }

    return null;
  }
}
