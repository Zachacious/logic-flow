import { genUID } from '../utils/genUID';
import { FlowyNodeType } from './FlowyNode';

export class FlowyNodeConnector {
  uid: string;
  type: 'input' | 'output';
  name: string;
  accepts: FlowyNodeType[];

  constructor(flowyNodeConnector?: FlowyNodeConnector) {
    this.uid = flowyNodeConnector.uid || genUID();
    this.type = flowyNodeConnector.type || 'input';
    this.name = flowyNodeConnector.name || '';
  }
}
