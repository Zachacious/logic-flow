import { genUID } from '../utils/genUID';
import { FlowyNode } from './FlowyNode';
import { Coords } from './Coords';

export class FlowyEdge {
  uid: string;
  source: FlowyNode;
  target: FlowyNode;
  offsets: Coords[];
  constructor(flowyConnection: FlowyEdge) {
    this.uid = flowyConnection.uid || genUID();
    this.source = flowyConnection.source || new FlowyNode();
    this.target = flowyConnection.target || new FlowyNode();
    this.offsets = flowyConnection.offsets || [];
  }
}
