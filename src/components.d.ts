/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Point } from "./types/Point";
import { LogicConnection } from "./components/logic-connection/logic-connection";
import { Size } from "./types/Size";
export { Point } from "./types/Point";
export { LogicConnection } from "./components/logic-connection/logic-connection";
export { Size } from "./types/Size";
export namespace Components {
    interface FlowyCanvas {
        "destroy": () => Promise<void>;
        "getUid": () => Promise<string>;
        "gridBgColor": string;
        "gridLineColor": string;
        "gridSize": number;
        "maxZoom": number;
        "minZoom": number;
        "renderGrid": boolean;
        "zoomSpeed": number;
    }
    interface FlowyCanvasOld {
        "gridBgColor": string;
        "gridLineColor": string;
        "gridSize": number;
        "maxZoom": number;
        "minZoom": number;
        "renderGrid": boolean;
        "zoomSpeed": number;
    }
    interface LogicConnection {
        "destroy": () => Promise<void>;
        "end": Point;
        "getUid": () => Promise<string>;
        "start": Point;
        "type": 'input' | 'output';
    }
    interface LogicConnector {
        "connectingConnector": LogicConnector | null;
        "connections": LogicConnection[];
        "destroy": () => Promise<void>;
        "getUid": () => Promise<string>;
        "type": 'input' | 'output';
    }
    interface LogicNode {
        "destroy": () => Promise<void>;
        "getUid": () => Promise<string>;
        "position": Point;
        "size": Size;
        "title": string;
        "type": string;
    }
    interface MyComponent {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
}
declare global {
    interface HTMLFlowyCanvasElement extends Components.FlowyCanvas, HTMLStencilElement {
    }
    var HTMLFlowyCanvasElement: {
        prototype: HTMLFlowyCanvasElement;
        new (): HTMLFlowyCanvasElement;
    };
    interface HTMLFlowyCanvasOldElement extends Components.FlowyCanvasOld, HTMLStencilElement {
    }
    var HTMLFlowyCanvasOldElement: {
        prototype: HTMLFlowyCanvasOldElement;
        new (): HTMLFlowyCanvasOldElement;
    };
    interface HTMLLogicConnectionElement extends Components.LogicConnection, HTMLStencilElement {
    }
    var HTMLLogicConnectionElement: {
        prototype: HTMLLogicConnectionElement;
        new (): HTMLLogicConnectionElement;
    };
    interface HTMLLogicConnectorElement extends Components.LogicConnector, HTMLStencilElement {
    }
    var HTMLLogicConnectorElement: {
        prototype: HTMLLogicConnectorElement;
        new (): HTMLLogicConnectorElement;
    };
    interface HTMLLogicNodeElement extends Components.LogicNode, HTMLStencilElement {
    }
    var HTMLLogicNodeElement: {
        prototype: HTMLLogicNodeElement;
        new (): HTMLLogicNodeElement;
    };
    interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    }
    var HTMLMyComponentElement: {
        prototype: HTMLMyComponentElement;
        new (): HTMLMyComponentElement;
    };
    interface HTMLElementTagNameMap {
        "flowy-canvas": HTMLFlowyCanvasElement;
        "flowy-canvas-old": HTMLFlowyCanvasOldElement;
        "logic-connection": HTMLLogicConnectionElement;
        "logic-connector": HTMLLogicConnectorElement;
        "logic-node": HTMLLogicNodeElement;
        "my-component": HTMLMyComponentElement;
    }
}
declare namespace LocalJSX {
    interface FlowyCanvas {
        "gridBgColor"?: string;
        "gridLineColor"?: string;
        "gridSize"?: number;
        "maxZoom"?: number;
        "minZoom"?: number;
        "renderGrid"?: boolean;
        "zoomSpeed"?: number;
    }
    interface FlowyCanvasOld {
        "gridBgColor"?: string;
        "gridLineColor"?: string;
        "gridSize"?: number;
        "maxZoom"?: number;
        "minZoom"?: number;
        "renderGrid"?: boolean;
        "zoomSpeed"?: number;
    }
    interface LogicConnection {
        "end"?: Point;
        "start"?: Point;
        "type"?: 'input' | 'output';
    }
    interface LogicConnector {
        "connectingConnector"?: LogicConnector | null;
        "connections"?: LogicConnection[];
        "type"?: 'input' | 'output';
    }
    interface LogicNode {
        "position"?: Point;
        "size"?: Size;
        "title"?: string;
        "type"?: string;
    }
    interface MyComponent {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface IntrinsicElements {
        "flowy-canvas": FlowyCanvas;
        "flowy-canvas-old": FlowyCanvasOld;
        "logic-connection": LogicConnection;
        "logic-connector": LogicConnector;
        "logic-node": LogicNode;
        "my-component": MyComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "flowy-canvas": LocalJSX.FlowyCanvas & JSXBase.HTMLAttributes<HTMLFlowyCanvasElement>;
            "flowy-canvas-old": LocalJSX.FlowyCanvasOld & JSXBase.HTMLAttributes<HTMLFlowyCanvasOldElement>;
            "logic-connection": LocalJSX.LogicConnection & JSXBase.HTMLAttributes<HTMLLogicConnectionElement>;
            "logic-connector": LocalJSX.LogicConnector & JSXBase.HTMLAttributes<HTMLLogicConnectorElement>;
            "logic-node": LocalJSX.LogicNode & JSXBase.HTMLAttributes<HTMLLogicNodeElement>;
            "my-component": LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
        }
    }
}
