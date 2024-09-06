import { FlowyConnection } from './FlowyConnection';
import { FlowyNode } from './FlowyNode';

export class FlowyGraph {
  nodes: FlowyNode[];
  edges: FlowyConnection[];
  constructor(FlowyGraph: FlowyGraph) {
    this.nodes = FlowyGraph.nodes;
    this.edges = FlowyGraph.edges;
  }
}
