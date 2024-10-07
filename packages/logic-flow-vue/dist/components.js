import { defineContainer } from './vue-component-lib/utils';
import { defineCustomElements } from 'logic-flow/loader';
defineCustomElements();
export const LogicFlowConnection = defineContainer('logic-flow-connection', undefined, [
    'start',
    'end',
    'type',
    'isVisible',
    'connectors'
]);
export const LogicFlowConnector = defineContainer('logic-flow-connector', undefined, [
    'type',
    'connectingConnector',
    'connections',
    'onConnection',
    'onDisconnection',
    'onUpdateFromConnectedNode'
]);
export const LogicFlowNode = defineContainer('logic-flow-node', undefined, [
    'type',
    'startX',
    'startY',
    'position',
    'isVisible'
]);
export const LogicFlowViewport = defineContainer('logic-flow-viewport', undefined, [
    'showGrid',
    'gridType',
    'gridSize',
    'gridBgColor',
    'gridLineColor',
    'maxZoom',
    'minZoom',
    'zoomSpeed',
    'snapToGrid',
    'connectorSnappingDistance',
    'cursors'
]);
//# sourceMappingURL=components.js.map