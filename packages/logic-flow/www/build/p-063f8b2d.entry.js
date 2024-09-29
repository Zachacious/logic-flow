import{r as t,h as s,H as i,g as h}from"./p-d9de4f93.js";const e=":host{display:block}";const n=e;const o=class{constructor(s){t(this,s);this.type="input";this.connectingConnector=null;this.connections=[]}render(){const t=this.type==="input"?"left-connector":"right-connector";const h=this.type==="input"?"input-connector":"output-connector";return s(i,{key:"fac695b607bd9ff5f462b5fea0b4ea4659a5bf3f",class:`logic-flow-connector ${h}`},s("div",{key:"b98483bafdd03fef1746509f73cb8cd1696a6679",class:`connector ${t} ${this.connections.length>0&&"connected"||""}`}),s("div",{key:"7f878cc9f641d0d3e331f18fa58516fed5d7c0a7",class:`connector-content ${t}`},s("slot",{key:"583028291f911011c4d8016862b9bb5cb11e745a"})))}get el(){return h(this)}};o.style=n;const c=":host{display:block}";const r=c;const l=class{constructor(s){t(this,s);this.style={};this.type="default";this.position={x:0,y:0};this.isVisible=true;this.isDragging=false}componentWillLoad(){this.updateTransform();this.onPositionChange(this.position)}onPositionChange(t){if(typeof t==="string"){this.position=JSON.parse(t)}this.updateTransform()}updateTransform(){this.el.style.transform=`translate(${this.position.x}px, ${this.position.y}px )`}componentWillRender(){if(!this.isVisible){this.style={display:"none"}}else{this.style={}}}render(){return s(i,{key:"406c4834fd0c0d01e548dfa83efce3d72b059fbd",class:"logic-flow-node",style:this.style,tabIndex:"0"},s("slot",{key:"8022168c2fadfaf703748755b3553f0cea1132a5"}))}get el(){return h(this)}static get watchers(){return{position:["onPositionChange"]}}};l.style=r;const f=(t,s)=>{let i;return(...h)=>{clearTimeout(i);i=setTimeout((()=>{t(...h)}),s)}};const a=(t,s)=>{let i;let h;return(...e)=>{if(!h){t(...e);h=Date.now()}else{clearTimeout(i);i=setTimeout((()=>{if(Date.now()-h>=s){t(...e);h=Date.now()}}),s-(Date.now()-h))}}};const u=t=>{if(t instanceof MouseEvent){return{x:t.clientX,y:t.clientY}}else if(t instanceof TouchEvent&&t.touches.length>0){return{x:t.touches[0].clientX,y:t.touches[0].clientY}}else if(t instanceof TouchEvent&&t.changedTouches.length>0){return{x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY}}return{x:0,y:0}};const d="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";let p=(t=21)=>{let s="";let i=crypto.getRandomValues(new Uint8Array(t));while(t--){s+=d[i[t]&63]}return s};class w{constructor(t,s,i){this.boundary=t;this.capacity=s;this.objects=[];this.divided=false;this.northeast=null;this.northwest=null;this.southeast=null;this.southwest=null;this.camera=i}subdivide(){const{left:t,top:s,width:i,height:h}=this.boundary;const e=i/2;const n=h/2;this.northeast=new w({left:t+e,top:s,width:e,height:n},this.capacity,this.camera);this.northwest=new w({left:t,top:s,width:e,height:n},this.capacity,this.camera);this.southeast=new w({left:t+e,top:s+n,width:e,height:n},this.capacity,this.camera);this.southwest=new w({left:t,top:s+n,width:e,height:n},this.capacity,this.camera);this.divided=true}insert(t){if(this.objects.length<this.capacity){this.objects.push(t);return true}else{if(!this.divided)this.subdivide();return this.northeast.insert(t)||this.northwest.insert(t)||this.southeast.insert(t)||this.southwest.insert(t)}}remove(t){const s=i=>{if(!i)return false;const h=i.objects.length;i.objects=i.objects.filter((s=>s.id!==t));if(h!==i.objects.length)return true;if(i.divided){return s(i.northwest)||s(i.northeast)||s(i.southwest)||s(i.southeast)}return false};return s(this)}contains(t){if("x"in t&&"y"in t){return this.containsPoint(t)}else{return this.containsRect(t)}}containsPoint(t){const{left:s,top:i,width:h,height:e}=this.boundary;return t.x>=s&&t.x<s+h&&t.y>=i&&t.y<i+e}containsRect(t){const{left:s,top:i,width:h,height:e}=this.boundary;return t.left>=s&&t.left+t.width<=s+h&&t.top>=i&&t.top+t.height<=i+e}query(t,s=[],i,h){if(!this.intersects(t))return s;this.objects.forEach((e=>{if(this.inRange(e,t,i,h)){s.push(e)}}));if(this.divided){this.northwest.query(t,s,i,h);this.northeast.query(t,s,i,h);this.southwest.query(t,s,i,h);this.southeast.query(t,s,i,h)}return s}inRange(t,s,i,h){if("x"in t&&"y"in t){return this.pointInRange(t,s,i,h)}else{return this.rectInRange(t,s,i,h)}}pointInRange(t,s,i,h){const e=(t.x+i.x)*h;const n=(t.y+i.y)*h;return e>=s.left&&e<s.left+s.width&&n>=s.top&&n<s.top+s.height}rectInRange(t,s,i,h){const e=(t.left+i.x)*h;const n=(t.top+i.y)*h;const o=e+t.width*h;const c=n+t.height*h;return!(o<s.left||e>s.left+s.width||c<s.top||n>s.top+s.height)}intersects(t){const{left:s,top:i,width:h,height:e}=this.boundary;return!(t.left>s+h||t.left+t.width<s||t.top>i+e||t.top+t.height<i)}checkNearby(t,s){const i={left:t.x-s/2,top:t.y-s/2,width:s,height:s};const h=this.query(i,[],this.camera.pos,this.camera.zoom);return h.length>0?h[0]:null}}class g{constructor(){this.uid=p();this.pos={x:0,y:0};this.zoom=1}toScreenCoords(t){return{x:(t.x-this.pos.x)*this.zoom,y:(t.y-this.pos.y)*this.zoom}}toWorldCoords(t){return{x:t.x/this.zoom-this.pos.x,y:t.y/this.zoom-this.pos.y}}}class C{constructor(t){this.nodes=new Map;this.connectors=new Map;this.connectorSnapDistance=10;this.connections=new Map;this.connectorRects={};this.connectionRects={};this.nodeRects={};this.camera=new g;this.visibleElements=[];this.prevVisibleElements=[];this.needsRedraw=true;this.initialPinchDistance=0;this.isPanning=false;this.snapToGrid=false;this.dragStart={x:0,y:0};this.activeNodeDragging=false;this.activeNodeDragStart={x:0,y:0};this.activeConnectorStartPos={x:0,y:0};this.viewportOffset={top:0,left:0};this.bringingToFront=false;this.debouncedUpdateVisibleElements=a((()=>this.updateVisibleElements()),100);const s=t.id||p();t.id=s;const i=s;if(C.instances.has(i)){return C.instances.get(i)}this.uid=i;C.instances.set(this.uid,this);if(!this.viewportRect){const s=t.getBoundingClientRect();this.viewportOffset={top:s.top,left:s.left};this.viewportRect={left:s.left-s.left,top:s.top-s.top,width:s.width-s.left,height:s.height-s.top}}const h={left:this.viewportRect.left,top:this.viewportRect.top,width:this.viewportRect.width,height:this.viewportRect.height};this.connectorQuadtree=new w(h,4,this.camera);this.viewportQuadtree=new w(h,4,this.camera);C.initializeViewport(t);this.observer=new MutationObserver((t=>this.viewportMutation(t)));this.observer.observe(t,{childList:true,subtree:true})}destroy(){this.observer.disconnect();C.instances.delete(this.uid)}updateViewportRect(){const t=this.viewportEl.getBoundingClientRect();this.viewportOffset={top:t.top,left:t.left};this.viewportRect={left:t.left-t.left,top:t.top-t.top,width:t.width-t.left,height:t.height-t.top}}addNode(t){const s=p();t.id=s;this.nodes.set(s,t);t.setAttribute("data-viewport",this.uid);const i=t.getBoundingClientRect();this.nodeRects[s]={left:t.position.x,top:t.position.y,width:i.width,height:i.height};this.updateViewportQuadtree(t);requestAnimationFrame((()=>{this.updateNodeConnectorsQuadtree(t)}));return s}removeNode(t){console.log("remove node",t);const s=this.nodes.get(t);if(s){const i=s.querySelectorAll("logic-flow-connector");i.forEach((t=>{const s=t.id;t.connections.forEach((t=>{const s=t.id;if(s)this.removeConnection(s)}));this.removeConnector(s)}));this.viewportQuadtree.remove(t);delete this.nodeRects[t];this.nodes.delete(t)}}addConnector(t){const s=p();t.id=s;this.connectors.set(s,t);const i=t.querySelector(".connector");const h=i.getBoundingClientRect();this.connectorRects[s]={left:h.x-this.viewportOffset.left,top:h.y-this.viewportOffset.top,width:h.width,height:h.height};return s}removeConnector(t){const s=this.connectors.get(t);if(!s)return;s.connections.forEach((t=>{const s=t.id;if(s)this.removeConnection(s)}));this.connectors.delete(t);this.connectorQuadtree.remove(t);delete this.connectorRects[t]}addConnection(t){const s=p();t.id=s;this.connections.set(s,t);t.setAttribute("data-viewport",this.uid);return s}removeConnection(t){const s=this.connections.get(t);if(!s)return;const i=s.connectors;if(i.size>0){for(const t of i){const i=t.connections.indexOf(s);if(i>-1){t.connections.splice(i,1)}t.connectingConnector=null}}delete this.connectionRects[t];this.viewportQuadtree.remove(t);this.connections.delete(t);s.remove()}viewportMutation(t){if(!t.length)return;if(this.bringingToFront){this.bringingToFront=false;return}t.forEach((t=>{if(t.type==="childList"){for(let s=0;s<t.addedNodes.length;s++){const i=t.addedNodes[s];if(i instanceof HTMLElement){if(i.tagName==="LOGIC-FLOW-NODE"){const t=i;this.addNode(t)}else if(i.tagName==="LOGIC-FLOW-CONNECTOR"){const t=i;this.addConnector(t)}else if(i.tagName==="LOGIC-FLOW-CONNECTION"){const t=i;this.addConnection(t)}}}for(let s=0;s<t.removedNodes.length;s++){const i=t.removedNodes[s];if(i instanceof HTMLElement){if(i.tagName==="LOGIC-FLOW-NODE"){const t=i;this.removeNode(t.getAttribute("id"))}else if(i.tagName==="LOGIC-FLOW-CONNECTOR"){const t=i;this.removeConnector(t.getAttribute("id"))}else if(i.tagName==="LOGIC-FLOW-CONNECTION"){const t=i;this.removeConnection(t.getAttribute("id"))}}}}}))}static initializeViewport(t){const s=t.id;const i=C.instances.get(s);const h=t.querySelector(".viewport-content");const e=h.children;const n=t=>{if(t.tagName==="LOGIC-FLOW-NODE"){const s=t;i.addNode(s)}else if(t.tagName==="LOGIC-FLOW-CONNECTOR"){const s=t;i.addConnector(s)}else if(t.tagName==="LOGIC-FLOW-CONNECTION"){const s=t;i.addConnection(s)}const s=t.children;for(let t=0;t<s.length;t++){n(s[t])}};for(let t=0;t<e.length;t++){n(e[t])}}bringToFront(t){var s;this.bringingToFront=true;(s=t.parentElement)===null||s===void 0?void 0:s.appendChild(t)}static setCursor(t){document.body.style.cursor=t}static resetCursor(){document.body.style.cursor="default"}getRectCenter(t){return{x:t.left+t.width/2,y:t.top+t.height/2}}startPanning(t,s="grabbing"){C.setCursor(s);this.isPanning=true;this.dragStart=t}panCamera(t){this.camera.pos={x:t.x/this.camera.zoom-this.dragStart.x,y:t.y/this.camera.zoom-this.dragStart.y};this.debouncedUpdateVisibleElements()}resetPointerStates(){this.isPanning=false;this.initialPinchDistance=0;C.resetCursor()}startNodeDrag(t,s,i="grabbing"){if(!t)return false;const h=t.closest("logic-flow-node");if(!h)return false;C.setCursor(i);this.activeNode=h;this.bringToFront(h);const e=this.activeNode.position;this.activeNodeDragging=true;this.activeNodeDragStart={x:s.x-e.x,y:s.y-e.y};return true}updateNodeConnectorPos(t,s){const i=t.querySelectorAll("logic-flow-connector");for(let t=0;t<i.length;t++){const h=i[t];const e=Object.assign({},this.connectorRects[h.id]);e.left+=s.x;e.top+=s.y;this.connectorRects[h.id]=e;this.updateNodeConnectorConnectionsPos(h,e)}}updateNodeConnectorConnectionsPos(t,s){if(t.connections.length){const i=this.getRectCenter(s);for(let s=0;s<t.connections.length;s++){const h=t.connections[s];if(t.type==="input"){h.end=i}else{h.start=i}}}}calcSnapToGrid(t,s){return{x:Math.round(t.x/s)*s,y:Math.round(t.y/s)*s}}calcNodePos(t){const s={x:t.x-this.activeNodeDragStart.x,y:t.y-this.activeNodeDragStart.y};if(!this.snapToGrid)return s;return this.calcSnapToGrid(s,this.connectorSnapDistance)}moveNode(t,s){const i=this.activeNode;const h=this.camera.toWorldCoords(t);const e=i.position;let n=this.calcNodePos(h);if(this.snapToGrid){n=this.calcSnapToGrid(n,s)}const o={x:n.x-e.x,y:n.y-e.y};const c=this.nodeRects[i.id];c.left=n.x;c.top=n.y;c.width=i.clientWidth||c.width;c.height=i.clientHeight||c.height;this.nodeRects[i.id]=c;this.updateNodeConnectorPos(i,o);i.position=n}endNodeDrag(){this.activeNodeDragging=false;this.updateNodeConnectorsQuadtree(this.activeNode);const t=this.activeNode.querySelectorAll("logic-flow-connector");let s=[];for(let i=0;i<t.length;i++){const h=t[i];s=s.concat(h.connections)}for(let t=0;t<s.length;t++){const i=s[t];const h=i.querySelector("path");const e=h.getBoundingClientRect();this.connectionRects[i.id]={left:(e.x-this.viewportOffset.left)/this.camera.zoom-this.camera.pos.x,top:(e.y-this.viewportOffset.top)/this.camera.zoom-this.camera.pos.y,width:e.width/this.camera.zoom,height:e.height/this.camera.zoom};this.updateViewportQuadtree(i)}this.updateViewportQuadtree(this.activeNode);this.activeNode=null}createNewConnection(t,s){const i=document.createElement("logic-flow-connection");i.start=t;i.end=t;i.type=s;this.activeConnection=i;this.contentEl.appendChild(i)}moveActiveConnection(t,s){const i=this.activeConnection;const h=this.camera.toWorldCoords({x:t.x-this.viewportOffset.left,y:t.y-this.viewportOffset.top});const e=this.connectorQuadtree.checkNearby({x:t.x-this.viewportOffset.left,y:t.y-this.viewportOffset.top},s*this.camera.zoom);if(e){const t=this.connectorRects[e.id];i.end=this.getRectCenter(t)}else{i.end=h}}getTargetConnector(t,s,i){let h=t.closest("logic-flow-connector .connector");const e=this.connectorQuadtree.checkNearby({x:s.x-this.viewportOffset.left,y:s.y-this.viewportOffset.top},i*this.camera.zoom);if(e){h=this.connectors.get(e.id)}return h}startNewConnection(t,s="grabbing"){if(!t)return false;const i=t.closest("logic-flow-connector .connector");if(!i)return false;C.setCursor(s);this.activeConnector=i;const h=i.closest("logic-flow-connector");const e=this.connectorRects[h.id];const n=this.getRectCenter(e);this.createNewConnection(n,h.type);return true}processConnection(t){const s=this.activeConnector.closest("logic-flow-connector");const i=t.closest("logic-flow-connector");const h=s.closest("logic-flow-node");const e=i.closest("logic-flow-node");if(!this.isValidConnection(s,i,h,e,t)){this.activeConnection.remove();delete this.connectionRects[this.activeConnection.id];return}this.updateConnectionEndpoints(s,i);this.finalizeConnection(s,i);const n=this.activeConnection.querySelector("path");const o=n.getBoundingClientRect();this.connectionRects[this.activeConnection.id]={left:(o.x-this.viewportOffset.left)/this.camera.zoom-this.camera.pos.x,top:(o.y-this.viewportOffset.top)/this.camera.zoom-this.camera.pos.y,width:o.width/this.camera.zoom,height:o.height/this.camera.zoom};this.updateViewportQuadtree(this.activeConnection)}isValidConnection(t,s,i,h,e){if(this.activeConnector.connectingConnector===s||s.connectingConnector===t){return false}if(i===h||this.activeConnector===e){return false}if(t.type===s.type){return false}return true}updateConnectionEndpoints(t,s){const i=this.connectorRects[s.id];if(t.type==="input"){this.activeConnection.start=this.getRectCenter(i);this.activeConnection.end=this.activeConnectorStartPos;this.activeConnection.type="output";const s=this.connectorRects[t.id];this.activeConnection.end=this.getRectCenter(s)}else{this.activeConnection.end=this.getRectCenter(i)}}finalizeConnection(t,s){t.connectingConnector=s;t.connections.push(this.activeConnection);s.connectingConnector=t;s.connections.push(this.activeConnection);this.activeConnection.connectors.clear();this.activeConnection.connectors.add(t);this.activeConnection.connectors.add(s)}startDisconnectConnection(t,s,i,h="grabbing"){if(!t)return false;const e=t.closest("logic-flow-connection");if(!e)return false;this.bringToFront(e);const n=this.connectorQuadtree.checkNearby({x:s.x-this.viewportOffset.left,y:s.y-this.viewportOffset.top},i*this.camera.zoom);if(!n)return false;C.setCursor(h);this.activeConnection=e;const o=this.connectors.get(n.id);this.activeConnector=o.connectingConnector;this.disconnectConnector(this.activeConnection,this.activeConnector,o);if(this.activeConnector.type==="input"){this.swapConnectionEndpoints(this.activeConnection);this.activeConnection.type="input"}return true}disconnectConnector(t,s,i){s.connections=s.connections.filter((s=>s!==t));i.connections=i.connections.filter((s=>s!==t));s.connectingConnector=null;i.connectingConnector=null}swapConnectionEndpoints(t){const{start:s,end:i}=t;t.start=i;t.end=s}updateNodeConnectorsQuadtree(t){const s=t.querySelectorAll("logic-flow-connector");for(let t=0;t<s.length;t++){const i=s[t];let h=this.connectorRects[i.id];if(!h){let t=i.querySelector(".connector");const s=t.getBoundingClientRect();this.connectorRects[i.id]={left:s.x,top:s.y,width:s.width,height:s.height};h=this.connectorRects[i.id]}this.connectorQuadtree.remove(i.id);this.connectorQuadtree.insert({id:i.id,x:h.left+h.width/2,y:h.top+h.height/2})}}updateViewportQuadtree(t){if(t.tagName==="LOGIC-FLOW-NODE"){const s=this.nodeRects[t.id];this.viewportQuadtree.remove(t.id);this.viewportQuadtree.insert({id:t.id,top:s.top,left:s.left,width:s.width,height:s.height})}else if(t.tagName==="LOGIC-FLOW-CONNECTION"){const s=this.connectionRects[t.id];this.viewportQuadtree.remove(t.id);this.viewportQuadtree.insert({id:t.id,top:s.top,left:s.left,width:s.width,height:s.height})}}updateVisibleElements(){let t=this.viewportRect;t={left:t.left,top:t.top,width:t.width,height:t.height};const s=this.viewportQuadtree.query(t,[],this.camera.pos,this.camera.zoom);const i=s.map((t=>t.id));const h=new Set([...this.prevVisibleElements,...i]);this.prevVisibleElements=i;for(const t of h){const s=document.getElementById(t);if(s){const h=s;const e=h.isVisible;const n=this.prevVisibleElements.includes(t);const o=i.includes(t);if(n===e&&o===e){continue}h.isVisible=i.includes(t)}}}}C.instances=new Map;const y=(t,s,i,h,e,n,o)=>{const c=t.getContext("2d");if(!c){return}let r=h*o.zoom;if(r<10){r*=2}c.strokeStyle=e;c.lineWidth=1;c.fillStyle=n;c.fillRect(0,0,s,i);const l=-o.pos.x%h*o.zoom;const f=-o.pos.y%h*o.zoom;c.beginPath();for(let t=-l;t<s;t+=r){c.moveTo(t,0);c.lineTo(t,i)}for(let t=-f;t<i;t+=r){c.moveTo(0,t);c.lineTo(s,t)}c.stroke()};const b=(t,s,i,h,e,n,o)=>{const c=t.getContext("2d");if(!c){return}let r=h*o.zoom;if(r<10){r*=2}c.strokeStyle=e;c.lineWidth=1;c.fillStyle=n;c.fillRect(0,0,s,i);const l=-o.pos.x%h*o.zoom;const f=-o.pos.y%h*o.zoom;c.beginPath();c.fillStyle=e;for(let t=-l;t<s;t+=r){for(let s=-f;s<i;s+=r){c.fillRect(t-1,s-1,2,2)}}c.stroke()};const v=":host{display:block}";const m=v;const O=class{constructor(s){t(this,s);this.debouncedResize=f((()=>this.onResize()),16);this.debouncedUpdateScreen=f((()=>this.updateScreen()),1);this.debouncedUpdateViewportRect=f((()=>this.ctx.updateViewportRect()),100);this.throttledTouchMove=a((t=>this.handleTouchMove(t)),1);this.forceContentReflowDebounced=f((()=>this.forceContentReflow()),30);this.elMouseDown=t=>this.onPointerDown(t);this.elMouseUp=t=>this.onPointerUp(t);this.elMouseMove=t=>this.onPointerMove(t);this.elTouchStart=t=>this.handleTouchStart(t);this.elTouchMove=t=>this.throttledTouchMove(t);this.elTouchEnd=t=>this.onPointerUp(t);this.elWheel=t=>this.handleWheel(t);this.elScroll=()=>this.debouncedUpdateViewportRect();this.elKeyPress=t=>this.onKeyPress(t);this.showGrid=true;this.gridType="line";this.gridSize=20;this.gridBgColor="#f7f7f7";this.gridLineColor="#555555";this.maxZoom=3;this.minZoom=.2;this.zoomSpeed=.08;this.snapToGrid=false;this.connectorSnappingDistance=37;this.cursors={default:"auto",panning:"grabbing",moving:"grabbing"}}componentDidLoad(){this.ctx=new C(this.el);this.ctx.viewportEl=this.el.querySelector(".logic-flow-viewport");this.ctx.contentEl=this.el.querySelector(".viewport-content");this.ctx.gridEl=this.el.querySelector(".logic-flow-grid");this.ctx.initialPinchDistance=0;this.ctx.snapToGrid=this.snapToGrid;this.ctx.connectorSnapDistance=this.connectorSnappingDistance;const t=this.ctx.viewportEl;window.addEventListener("mousedown",this.elMouseDown,{passive:true});t.addEventListener("mouseup",this.elMouseUp,{passive:true});t.addEventListener("mousemove",this.elMouseMove,{passive:true});t.addEventListener("touchstart",this.elTouchStart,{passive:false});t.addEventListener("touchmove",this.elTouchMove,{passive:false});t.addEventListener("touchend",this.elTouchEnd,{passive:true});t.addEventListener("wheel",this.elWheel,{passive:false});window.addEventListener("scroll",this.elScroll,{passive:true});window.addEventListener("keydown",this.elKeyPress,{passive:true});this.resizeObserver=new ResizeObserver((()=>this.debouncedResize()));this.resizeObserver.observe(this.ctx.viewportEl);this.renderGrid()}disconnectedCallback(){if(this.resizeObserver){this.resizeObserver.disconnect()}const t=this.ctx.viewportEl;window.removeEventListener("mousedown",this.elMouseDown);t.removeEventListener("mouseup",this.elMouseUp);t.removeEventListener("mousemove",this.elMouseMove);t.removeEventListener("touchstart",this.elTouchStart);t.removeEventListener("touchmove",this.elTouchMove);t.removeEventListener("touchend",this.elTouchEnd);t.removeEventListener("wheel",this.elWheel);window.removeEventListener("scroll",this.elScroll);window.removeEventListener("keydown",this.elKeyPress);this.ctx.destroy()}async getCamera(){return this.ctx.camera}async screenToWorldCoords(t){const s={x:t.x-this.ctx.viewportOffset.left,y:t.y-this.ctx.viewportOffset.top};return this.ctx.camera.toWorldCoords(s)}onSnapToGridChange(){this.ctx.snapToGrid=this.snapToGrid}onGridTypeChange(){this.ctx.needsRedraw=true;this.renderGrid()}scheduleComponentUpdate(){this.ctx.needsRedraw=true;this.ctx.debouncedUpdateVisibleElements();this.debouncedUpdateScreen()}onResize(){this.ctx.needsRedraw=true;this.ctx.viewportRect=this.ctx.viewportEl.getBoundingClientRect();this.ctx.gridEl.width=this.ctx.viewportRect.width;this.ctx.gridEl.height=this.ctx.viewportRect.height;this.ctx.viewportOffset={top:this.ctx.viewportRect.top,left:this.ctx.viewportRect.left};const t={left:this.ctx.viewportRect.left-this.ctx.viewportRect.left,top:this.ctx.viewportRect.top-this.ctx.viewportRect.top,width:this.ctx.viewportRect.width,height:this.ctx.viewportRect.height};this.ctx.viewportRect=t;this.ctx.connectorQuadtree.boundary=this.ctx.viewportRect;this.ctx.viewportQuadtree.boundary=this.ctx.viewportRect;this.renderGrid()}renderGrid(){if(!this.showGrid||!this.ctx.needsRedraw)return;requestAnimationFrame((()=>{if(this.gridType==="line"){y(this.ctx.gridEl,this.ctx.viewportRect.width,this.ctx.viewportRect.height,this.gridSize,this.gridLineColor,this.gridBgColor,this.ctx.camera)}if(this.gridType==="dot"){b(this.ctx.gridEl,this.ctx.viewportRect.width,this.ctx.viewportRect.height,this.gridSize,this.gridLineColor,this.gridBgColor,this.ctx.camera)}}));this.ctx.needsRedraw=false}updateScreen(){requestAnimationFrame((()=>{const t=this.ctx.contentEl;t.style.transform=`perspective(1px) scale(${this.ctx.camera.zoom}) translate(${this.ctx.camera.pos.x}px, ${this.ctx.camera.pos.y}px)`;this.renderGrid()}))}onKeyPress(t){if(t.key==="Delete"){const t=document.activeElement;if(t.tagName==="LOGIC-FLOW-NODE"){t.remove()}else if(t.closest("logic-flow-connection")){const s=t.closest("logic-flow-connection");s.remove()}}}onPointerDown(t){const s=u(t);const i=this.ctx.camera.toWorldCoords(s);const h=document.elementFromPoint(s.x,s.y);if(s.x>this.ctx.viewportOffset.left+this.ctx.viewportRect.width||s.x<this.ctx.viewportOffset.left||s.y>this.ctx.viewportOffset.top+this.ctx.viewportRect.height||s.y<this.ctx.viewportOffset.top){return}if(!h||!h.closest("logic-flow-node, logic-flow-connector, logic-flow-connection, logic-flow-viewport")){return}if(this.ctx.startDisconnectConnection(h,s,this.connectorSnappingDistance,this.cursors.moving))return;if(this.ctx.startNewConnection(h))return;if(this.ctx.startNodeDrag(h,i))return;this.ctx.startPanning(i)}onPointerUp(t){if(this.ctx.activeConnector&&this.ctx.activeConnection){this.onEndActiveConnection(t)}else if(this.ctx.activeNode&&this.ctx.activeNodeDragging){this.ctx.endNodeDrag()}this.ctx.resetPointerStates()}onEndActiveConnection(t){const s=u(t);let i=t.target;if(t instanceof TouchEvent){i=document.elementFromPoint(s.x,s.y)}let h=this.ctx.getTargetConnector(i,s,this.connectorSnappingDistance);if(h){this.ctx.processConnection(h)}else{this.ctx.activeConnection.remove()}this.ctx.activeConnector=null;this.ctx.activeConnection=null}onPointerMove(t){const s=u(t);if(this.ctx.activeConnector&&this.ctx.activeConnection){this.ctx.moveActiveConnection(s,this.connectorSnappingDistance)}else if(this.ctx.activeNode&&this.ctx.activeNodeDragging){this.ctx.moveNode(s,this.gridSize)}else if(this.ctx.isPanning){this.ctx.panCamera(s);this.scheduleComponentUpdate()}}handleWheel(t){t.preventDefault();const s=this.ctx.viewportRect;const i=t.clientX-s.left-this.ctx.viewportOffset.left;const h=t.clientY-s.top-this.ctx.viewportOffset.top;const e=t.deltaY<0?this.zoomSpeed:-this.zoomSpeed;const n=Math.min(this.maxZoom,Math.max(this.minZoom,this.ctx.camera.zoom+e));const o=n/this.ctx.camera.zoom;const c=i-(i-this.ctx.camera.pos.x*this.ctx.camera.zoom)*o;const r=h-(h-this.ctx.camera.pos.y*this.ctx.camera.zoom)*o;this.ctx.camera.pos={x:c/n,y:r/n};this.ctx.camera.zoom=n;if(e>0){this.forceContentReflowDebounced()}this.scheduleComponentUpdate()}handleTouchStart(t){if(t.touches.length===1){this.onPointerDown(t)}else if(t.touches.length===2){this.ctx.initialPinchDistance=0;this.handlePinch(t)}}handleTouchMove(t){if(t.touches.length===1){this.onPointerMove(t)}else if(t.touches.length===2){this.handlePinch(t)}}handlePinch(t){if(t.touches.length!==2)return;this.onPointerMove(t);t.preventDefault();const s=t.touches[0];const i=t.touches[1];const h=Math.sqrt((s.clientX-i.clientX)**2+(s.clientY-i.clientY)**2);if(this.ctx.initialPinchDistance===0){this.ctx.initialPinchDistance=h}else{const t=h/this.ctx.initialPinchDistance;const e=(s.clientX+i.clientX)/2;const n=(s.clientY+i.clientY)/2;this.adjustZoomOnPinch(t,e,n);this.ctx.initialPinchDistance=h}}adjustZoomOnPinch(t,s,i){const h=Math.min(this.maxZoom,Math.max(this.minZoom,this.ctx.camera.zoom*t));const e=(s-this.ctx.camera.pos.x*this.ctx.camera.zoom)/this.ctx.camera.zoom;const n=(i-this.ctx.camera.pos.y*this.ctx.camera.zoom)/this.ctx.camera.zoom;this.ctx.camera.pos={x:s/h-e,y:i/h-n};this.ctx.camera.zoom=h;this.debouncedUpdateScreen()}forceContentReflow(){const t=this.ctx.contentEl.style.display;this.ctx.contentEl.style.display="none";this.ctx.contentEl.style.display=t}render(){return s("div",{key:"bbe223421b87421dd1d1a5f7c44822d4331e15c6",class:"logic-flow-viewport"},s("canvas",{key:"06f92e8938c1ed63e7efb994fbc4ebd676dab02e",class:"logic-flow-grid",style:{display:this.showGrid?"block":"none"}}),s("div",{key:"97cfc08b3ae6ada0302356d9d73aa21b56881433",class:"viewport-content"},s("slot",{key:"b388cd2e2d62aea37b6bb14a2fb311469ae7b01a"})))}get el(){return h(this)}static get watchers(){return{snapToGrid:["onSnapToGridChange"],gridType:["onGridTypeChange"]}}};O.style=m;export{o as logic_flow_connector,l as logic_flow_node,O as logic_flow_viewport};
//# sourceMappingURL=p-063f8b2d.entry.js.map