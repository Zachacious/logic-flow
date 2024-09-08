import { genUID } from '../utils/genUID';
import { FlowyEdge } from './FlowyEdge';
import { FlowyNode } from './FlowyNode';

export class FlowyGraph {
  uid: string;
  nodes: FlowyNode[];
  edges: FlowyEdge[];
  constructor(flowyGraph?: FlowyGraph) {
    this.uid = flowyGraph.uid || genUID();
    this.nodes = flowyGraph.nodes || [];
    this.edges = flowyGraph.edges || [];
  }

  addNode(node: FlowyNode) {
    this.nodes.push(node);
  }

  addEdge(edge: FlowyEdge) {
    this.edges.push(edge);
  }

  removeNode(node: FlowyNode) {
    this.nodes = this.nodes.filter(n => n.uid !== node.uid);
  }

  removeEdge(edge: FlowyEdge) {
    this.edges = this.edges.filter(e => e.uid !== edge.uid);
  }
}
