import{p as o,H as n,b as t}from"./p-ff9cdfbc.js";export{s as setNonce}from"./p-ff9cdfbc.js";import{g as e}from"./p-e1255160.js";var i=()=>{{r(n.prototype)}const t=import.meta.url;const e={};if(t!==""){e.resourcesUrl=new URL(".",t).href}return o(e)};var r=o=>{const n=o.cloneNode;o.cloneNode=function(o){if(this.nodeName==="TEMPLATE"){return n.call(this,o)}const t=n.call(this,false);const e=this.childNodes;if(o){for(let o=0;o<e.length;o++){if(e[o].nodeType!==2){t.appendChild(e[o].cloneNode(true))}}}return t}};i().then((async o=>{await e();return t([["p-e2b9c472",[[4,"logic-flow-connector",{type:[1],connectingConnector:[16],connections:[16],onConnection:[16],onDisconnection:[16],onUpdateFromConnectedNode:[16],getNode:[64]}],[4,"logic-flow-node",{type:[1],startX:[2,"start-x"],startY:[2,"start-y"],position:[1040],isVisible:[1028,"is-visible"],isDragging:[32],getConnectors:[64],getConnectedNodes:[64],notifyConnectedConnectors:[64]},null,{position:["onPositionChange"]}],[4,"logic-flow-viewport",{showGrid:[4,"show-grid"],gridType:[1,"grid-type"],gridSize:[2,"grid-size"],gridBgColor:[1,"grid-bg-color"],gridLineColor:[1,"grid-line-color"],maxZoom:[2,"max-zoom"],minZoom:[2,"min-zoom"],zoomSpeed:[2,"zoom-speed"],snapToGrid:[4,"snap-to-grid"],connectorSnappingDistance:[2,"connector-snapping-distance"],cursors:[16],getContext:[64],screenToWorldCoords:[64]},null,{snapToGrid:["onSnapToGridChange"],gridType:["onGridTypeChange"]}]]],["p-54f15865",[[0,"logic-flow-connection",{start:[16],end:[16],type:[1],isVisible:[1028,"is-visible"],connectors:[16]},null,{start:["updatePath"],end:["updatePath"],type:["updatePath"]}]]]],o)}));
//# sourceMappingURL=logic-flow.esm.js.map