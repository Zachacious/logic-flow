import { nanoid } from 'nanoid';
import { Rect } from './Rect';
import { Quadtree } from './Quadtree';
import { Camera } from './Camera';

type EntityType = 'node' | 'connector' | 'connection' | 'viewport';

export class ViewportData {
  static instances = new Map<string, ViewportData>();

  uid: string;
  // viewport: HTMLFlowyCanvasElement;

  // viewports = new Map<string, FlowyCanvas>();
  nodes = new Map<string, HTMLLogicNodeElement>();
  connectors = new Map<string, HTMLLogicConnectorElement>();
  connections = new Map<string, HTMLLogicConnectionElement>();

  connectorRects = <Record<string, Rect>>{};
  // connectorQuadTrees = new Map<string, Quadtree>();
  quadtree: Quadtree;

  camera = new Camera();

  // mutation observer
  observer: MutationObserver;

  constructor(viewport: HTMLFlowyCanvasElement) {
    // const viewport = document.getElementById(
    //   viewportId,
    // ) as HTMLFlowyCanvasElement;
    const id = nanoid();
    viewport.id = id;
    const viewportId = id;
    if (ViewportData.instances.has(viewportId)) {
      return ViewportData.instances.get(viewportId);
    }
    this.uid = viewportId;
    ViewportData.instances.set(this.uid, this);

    ViewportData.initializeViewport(viewport);

    this.observer = new MutationObserver(this.viewportMutation);
    this.observer.observe(viewport, {
      childList: true,
      subtree: true,
    });
  }

  destroy() {
    // for (const [id] of this.nodes) {
    //   this.unregisterNode(id);
    // }

    // for (const [id] of this.connectors) {
    //   this.unregisterConnector(id);
    // }

    // for (const [id] of this.connections) {
    //   this.unregisterConnection(id);
    // }

    this.observer.disconnect();

    ViewportData.instances.delete(this.uid);
  }

  static seekAndDestroy = (type: EntityType, id: string) => {
    // search and destroy in all instances
    for (const [, instance] of ViewportData.instances) {
      switch (type) {
        case 'node':
          instance.unregisterNode(id);
          break;
        case 'connector':
          instance.unregisterConnector(id);
          break;
        case 'connection':
          instance.unregisterConnection(id);
          break;
        case 'viewport':
          instance.destroy();
          break;
      }
    }
  };

  registerNode = (node: HTMLLogicNodeElement) => {
    const id = nanoid();
    node.id = id;
    this.nodes.set(id, node);
    return id;
  };

  unregisterNode = (id: string) => {
    // remove all connections and connectors associated with the node
    // get connectors
    const node = this.nodes.get(id);
    if (node) {
      // TODO: not sure if this is necessary with mutation observer

      // const connectors = node.querySelectorAll('logic-connector');
      // connectors.forEach((connector: HTMLLogicConnectorElement) => {
      //   const cid = connector.id;
      //   // remove connections
      //   connector.connections.forEach(
      //     (connection: HTMLLogicConnectionElement) => {
      //       const id = connection.id;
      //       if (id) this.unregisterConnection(id);
      //     },
      //   );
      //   // remove connector
      //   this.unregisterConnector(cid);
      // });

      // remove from nodes
      this.nodes.delete(id);
    }
  };

  registerConnector = (connector: HTMLLogicConnectorElement) => {
    const id = nanoid();
    connector.id = id;
    const el = document.getElementById(id);
    this.connectors.set(id, connector);
    const connectorEl = connector.querySelector('.connector');
    const rect = connectorEl.getBoundingClientRect();
    // const rect = connector.getBoundingClientRect();
    this.connectorRects[id] = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
    };

    return id;
  };

  unregisterConnector = (id: string) => {
    this.connectors.delete(id);
    delete this.connectorRects[id];
  };

  registerConnection = (connection: HTMLLogicConnectionElement) => {
    const id = nanoid();
    connection.id = id;
    this.connections.set(id, connection);
    return id;
  };

  unregisterConnection = (id: string) => {
    // remove from dom
    const el = document.getElementById(id);
    if (el) {
      el.remove();
    }
    this.connections.delete(id);
  };

  // getViewport = (id: string) => this.viewports.get(id);
  // getNode = (id: string) => this.nodes.get(id);
  // getConnector = (id: string) => this.connectors.get(id);
  // getConnection = (id: string) => this.connections.get(id);

  // mutation observer callback
  // when elements are added or removed from the dom
  // we need to register or unregister them if they are nodes, connectors or connections
  viewportMutation = (mutations: MutationRecord[]) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LOGIC-NODE') {
              const logicNode = node as HTMLLogicNodeElement;
              this.registerNode(logicNode);
            } else if (node.tagName === 'LOGIC-CONNECTOR') {
              const logicConnector = node as HTMLLogicConnectorElement;
              this.registerConnector(logicConnector);
            } else if (node.tagName === 'LOGIC-CONNECTION') {
              const logicConnection = node as HTMLLogicConnectionElement;
              this.registerConnection(logicConnection);
            }
          }
        }

        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const node = mutation.removedNodes[i];
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LOGIC-NODE') {
              const logicNode = node as HTMLLogicNodeElement;
              this.unregisterNode(logicNode.getAttribute('id'));
            } else if (node.tagName === 'LOGIC-CONNECTOR') {
              const logicConnector = node as HTMLLogicConnectorElement;
              this.unregisterConnector(logicConnector.getAttribute('id'));
            } else if (node.tagName === 'LOGIC-CONNECTION') {
              const logicConnection = node as HTMLLogicConnectionElement;
              this.unregisterConnection(logicConnection.getAttribute('id'));
            }
          }
        }
      }
    });
  };

  static initializeViewport = (viewport: HTMLFlowyCanvasElement) => {
    // need to register all nodes, connectors and connections
    // that are already in the dom

    const id = viewport.id;
    const instance = ViewportData.instances.get(id);

    const contentEl = viewport.querySelector('.flowy-content');
    const children = contentEl.children;

    // for (let i = 0; i < children.length; i++) {
    //   const child = children[i];
    //   if (child instanceof HTMLElement) {
    //     if (child.tagName === 'LOGIC-NODE') {
    //       const logicNode = child as HTMLLogicNodeElement;
    //       instance.registerNode(logicNode);
    //     } else if (child.tagName === 'LOGIC-CONNECTOR') {
    //       const logicConnector = child as HTMLLogicConnectorElement;
    //       instance.registerConnector(logicConnector);
    //     } else if (child.tagName === 'LOGIC-CONNECTION') {
    //       const logicConnection = child as HTMLLogicConnectionElement;
    //       instance.registerConnection(logicConnection);
    //     }
    //   }
    // }

    // need to do the above for all children recursively
    const traverse = (el: HTMLElement) => {
      if (el.tagName === 'LOGIC-NODE') {
        const logicNode = el as HTMLLogicNodeElement;
        instance.registerNode(logicNode);
      } else if (el.tagName === 'LOGIC-CONNECTOR') {
        const logicConnector = el as HTMLLogicConnectorElement;
        instance.registerConnector(logicConnector);
      } else if (el.tagName === 'LOGIC-CONNECTION') {
        const logicConnection = el as HTMLLogicConnectionElement;
        instance.registerConnection(logicConnection);
      }

      const children = el.children;
      for (let i = 0; i < children.length; i++) {
        traverse(children[i] as HTMLElement);
      }
    };

    for (let i = 0; i < children.length; i++) {
      traverse(children[i] as HTMLElement);
    }
  };
}
