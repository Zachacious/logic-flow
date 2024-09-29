/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Coords } from "./types/Coords";
import { LogicFlowConnection } from "./components/logic-flow-connection/logic-flow-connection";
export { Coords } from "./types/Coords";
export { LogicFlowConnection } from "./components/logic-flow-connection/logic-flow-connection";
export namespace Components {
    interface LogicFlowConnection {
        "connectors": Set<HTMLLogicFlowConnectorElement>;
        "end": Coords;
        "isVisible": boolean;
        "start": Coords;
        "type": 'input' | 'output';
    }
    interface LogicFlowConnector {
        "connectingConnector": LogicFlowConnector | null;
        "connections": LogicFlowConnection[];
        "type": 'input' | 'output';
    }
    interface LogicFlowNode {
        "isVisible": boolean;
        "position": Coords;
        "type": string;
    }
    interface LogicFlowViewport {
        "connectorSnappingDistance": number;
        "cursors": Record<string, string>;
        "getCamera": () => Promise<import("/home/zach/src/logic-flow/packages/logic-flow/src/types/Camera").Camera>;
        "gridBgColor": string;
        "gridLineColor": string;
        "gridSize": number;
        "gridType": 'line' | 'dot';
        "maxZoom": number;
        "minZoom": number;
        "screenToWorldCoords": (screenCoords: Coords) => Promise<Coords>;
        "showGrid": boolean;
        "snapToGrid": boolean;
        "zoomSpeed": number;
    }
}
declare global {
    interface HTMLLogicFlowConnectionElement extends Components.LogicFlowConnection, HTMLStencilElement {
    }
    var HTMLLogicFlowConnectionElement: {
        prototype: HTMLLogicFlowConnectionElement;
        new (): HTMLLogicFlowConnectionElement;
    };
    interface HTMLLogicFlowConnectorElement extends Components.LogicFlowConnector, HTMLStencilElement {
    }
    var HTMLLogicFlowConnectorElement: {
        prototype: HTMLLogicFlowConnectorElement;
        new (): HTMLLogicFlowConnectorElement;
    };
    interface HTMLLogicFlowNodeElement extends Components.LogicFlowNode, HTMLStencilElement {
    }
    var HTMLLogicFlowNodeElement: {
        prototype: HTMLLogicFlowNodeElement;
        new (): HTMLLogicFlowNodeElement;
    };
    interface HTMLLogicFlowViewportElement extends Components.LogicFlowViewport, HTMLStencilElement {
    }
    var HTMLLogicFlowViewportElement: {
        prototype: HTMLLogicFlowViewportElement;
        new (): HTMLLogicFlowViewportElement;
    };
    interface HTMLElementTagNameMap {
        "logic-flow-connection": HTMLLogicFlowConnectionElement;
        "logic-flow-connector": HTMLLogicFlowConnectorElement;
        "logic-flow-node": HTMLLogicFlowNodeElement;
        "logic-flow-viewport": HTMLLogicFlowViewportElement;
    }
}
declare namespace LocalJSX {
    interface LogicFlowConnection {
        "connectors"?: Set<HTMLLogicFlowConnectorElement>;
        "end"?: Coords;
        "isVisible"?: boolean;
        "start"?: Coords;
        "type"?: 'input' | 'output';
    }
    interface LogicFlowConnector {
        "connectingConnector"?: LogicFlowConnector | null;
        "connections"?: LogicFlowConnection[];
        "type"?: 'input' | 'output';
    }
    interface LogicFlowNode {
        "isVisible"?: boolean;
        "position"?: Coords;
        "type"?: string;
    }
    interface LogicFlowViewport {
        "connectorSnappingDistance"?: number;
        "cursors"?: Record<string, string>;
        "gridBgColor"?: string;
        "gridLineColor"?: string;
        "gridSize"?: number;
        "gridType"?: 'line' | 'dot';
        "maxZoom"?: number;
        "minZoom"?: number;
        "showGrid"?: boolean;
        "snapToGrid"?: boolean;
        "zoomSpeed"?: number;
    }
    interface IntrinsicElements {
        "logic-flow-connection": LogicFlowConnection;
        "logic-flow-connector": LogicFlowConnector;
        "logic-flow-node": LogicFlowNode;
        "logic-flow-viewport": LogicFlowViewport;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "logic-flow-connection": LocalJSX.LogicFlowConnection & JSXBase.HTMLAttributes<HTMLLogicFlowConnectionElement>;
            "logic-flow-connector": LocalJSX.LogicFlowConnector & JSXBase.HTMLAttributes<HTMLLogicFlowConnectorElement>;
            "logic-flow-node": LocalJSX.LogicFlowNode & JSXBase.HTMLAttributes<HTMLLogicFlowNodeElement>;
            "logic-flow-viewport": LocalJSX.LogicFlowViewport & JSXBase.HTMLAttributes<HTMLLogicFlowViewportElement>;
        }
    }
}
