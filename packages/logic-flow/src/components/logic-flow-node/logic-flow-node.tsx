import {
  Component,
  Host,
  Prop,
  h,
  Element,
  State,
  Watch,
  Method,
  EventEmitter,
  Event,
} from '@stencil/core';
import { Coords } from '../../types/Coords';

@Component({
  tag: 'logic-flow-node',
  styleUrl: 'logic-flow-node.css',
  shadow: false,
})
export class LogicFlowNode {
  @Element() el: HTMLLogicFlowNodeElement;

  @Prop() type: string = 'default';
  // @Prop() name: string = 'Node';
  @Prop() startX: number = 0;
  @Prop() startY: number = 0;
  @Prop({ mutable: true }) position: Coords = { x: 0, y: 0 };
  @Prop({ mutable: true }) isVisible: boolean = true;

  @State() isDragging = false;

  @Event() notifyConnectors: EventEmitter;

  style = {};
  observer: MutationObserver;
  connectors: Set<HTMLLogicFlowConnectorElement> = new Set();

  componentWillLoad() {
    //  set initial size
    this.position.x = this.startX;
    this.position.y = this.startY;

    this.onPositionChange(this.position);

    // set up observer - watch for adding or removing connectors
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node: Node) => {
            if (node.nodeName === 'LOGIC-FLOW-CONNECTOR') {
              const connector = node as HTMLLogicFlowConnectorElement;
              this.connectors.add(connector);
            }
          });

          mutation.removedNodes.forEach((node: Node) => {
            if (node.nodeName === 'LOGIC-FLOW-CONNECTOR') {
              const connector = node as HTMLLogicFlowConnectorElement;
              this.connectors.delete(connector);
            }
          });
        }
      }
    });
  }

  @Watch('position')
  onPositionChange(newValue: Coords | string) {
    if (typeof newValue === 'string') {
      this.position = JSON.parse(newValue);
    }
    // update transform
    this.updateTransform();
  }

  @Method()
  async getInputConnectors() {
    return this.el.querySelectorAll('logic-flow-connector[type="input"]');
  }

  @Method()
  async getOutputConnectors() {
    return this.el.querySelectorAll('logic-flow-connector[type="output"]');
  }

  @Method()
  async getConnectors(type: 'input' | 'output' | 'both' = 'both') {
    let connectors = this.connectors;
    if (type === 'input') {
      connectors = new Set(
        Array.from(connectors).filter(connector => connector.type === 'input'),
      );
    } else if (type === 'output') {
      connectors = new Set(
        Array.from(connectors).filter(connector => connector.type === 'output'),
      );
    }

    return connectors;
  }

  @Method()
  async getConnectedNodes(type: 'input' | 'output' | 'both' = 'both') {
    const nodes = [];
    const connectors = await this.getConnectors(type);

    for (const connector of connectors) {
      const connections = connector.connections;
      for (const connection of connections) {
        // if connectors length is greater than 1, then we have a connection
        if (connection.connectors.size > 1) {
          // get the other connector
          const otherConnector = Array.from(connection.connectors).find(
            c => c !== connector,
          );
          // get the node
          const node = await otherConnector.getNode();
          nodes.push(node);
        }
      }
    }
  }

  @Method()
  async notifyConnectedConnectors(
    type: 'input' | 'output' | 'both' = 'both',
    data: any,
  ) {
    const connectors = await this.getConnectors(type);
    for (const connector of connectors) {
      const connections = connector.connections;
      for (const connection of connections) {
        // if connectors length is greater than 1, then we have a connection
        if (connection.connectors.size > 1) {
          // get the other connector
          const otherConnector = Array.from(connection.connectors).find(
            c => c !== connector,
          );

          if (otherConnector.onUpdateFromConnectedNode) {
            otherConnector.onUpdateFromConnectedNode(
              otherConnector,
              this.el,
              data,
            );
          }
        }
      }
    }
  }

  updateTransform() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px )`;
  }

  componentWillRender() {
    if (!this.isVisible) {
      this.style = { display: 'none' };
    } else {
      this.style = {};
    }
  }

  render() {
    return (
      <Host class="logic-flow-node" style={this.style} tabIndex="0">
        <slot></slot>
      </Host>
    );
  }
}
