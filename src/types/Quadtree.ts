interface Point {
  x: number;
  y: number;
  connectorId: string; // Unique ID of the connector
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

  contains(point: Point): boolean {
    const { x, y, width, height } = this.boundary;
    return (
      point.x >= x &&
      point.x < x + width &&
      point.y >= y &&
      point.y < y + height
    );
  }

  query(range: BoundingBox, found: Point[] = []): Point[] {
    if (!this.intersects(range)) return found;

    for (let point of this.points) {
      if (this.inRange(point, range)) {
        found.push(point);
      }
    }

    if (this.divided) {
      this.northwest!.query(range, found);
      this.northeast!.query(range, found);
      this.southwest!.query(range, found);
      this.southeast!.query(range, found);
    }

    return found;
  }

  inRange(point: Point, range: BoundingBox): boolean {
    return (
      point.x >= range.x &&
      point.x < range.x + range.width &&
      point.y >= range.y &&
      point.y < range.y + range.height
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
}
