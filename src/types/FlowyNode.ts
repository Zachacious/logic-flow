export interface FlowyNode {
  id: string;
  inputs: FlowyNode[];
  outputs: FlowyNode[];
  data: any;
}

export class FlowyNode {
  uid: string;
  inputs: FlowyNode[];
  outputs: FlowyNode[];
  data: any;

  constructor(FlowyNode: FlowyNode) {
    this.id = FlowyNode.id;
    this.inputs = FlowyNode.inputs;
    this.outputs = FlowyNode.outputs;
    this.data = FlowyNode.data;
  }
}
