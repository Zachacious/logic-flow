import { genUID } from '../utils/genUID';

export type FlowyNodeType = string;

export class FlowyNode {
  uid: string;
  type: FlowyNodeType;

  constructor(flowyNode?: FlowyNode) {
    this.uid = flowyNode.uid || genUID();
    this.type = flowyNode.type || 'default';
  }
}
