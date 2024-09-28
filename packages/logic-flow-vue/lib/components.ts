/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from 'logic-flow';

import { defineCustomElements } from 'logic-flow/loader';

defineCustomElements();

export const LogicFlowConnection = /*@__PURE__*/ defineContainer<JSX.LogicFlowConnection>('logic-flow-connection', undefined, [
  'start',
  'end',
  'type'
]);


export const LogicFlowConnector = /*@__PURE__*/ defineContainer<JSX.LogicFlowConnector>('logic-flow-connector', undefined, [
  'type',
  'connectingConnector',
  'connections'
]);


export const LogicFlowNode = /*@__PURE__*/ defineContainer<JSX.LogicFlowNode>('logic-flow-node', undefined, [
  'type',
  'name',
  'position',
  'isVisible'
]);


export const LogicFlowViewport = /*@__PURE__*/ defineContainer<JSX.LogicFlowViewport>('logic-flow-viewport', undefined, [
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

