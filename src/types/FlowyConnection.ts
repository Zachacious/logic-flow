import { FlowyNode } from './FlowyNode';
import { Point } from './Point';

export class FlowyConnection {
  source: FlowyNode;
  target: FlowyNode;
  offsets: Point[];
  constructor(FlowyConnection: FlowyConnection) {
    this.source = FlowyConnection.source;
    this.target = FlowyConnection.target;
  }
}
