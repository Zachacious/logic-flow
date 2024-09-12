import { B as BUILD, c as consoleDevInfo, H, d as doc, N as NAMESPACE, p as promiseResolve, b as bootstrapLazy } from './index-2e7362b2.js';
export { s as setNonce } from './index-2e7362b2.js';
import { g as globalScripts } from './app-globals-0f993ce5.js';

/*
 Stencil Client Patch Browser v4.21.0 | MIT Licensed | https://stenciljs.com
 */
var patchBrowser = () => {
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo("Running in development mode.");
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix(H.prototype);
  }
  const scriptElm = BUILD.scriptDataOpts ? Array.from(doc.querySelectorAll("script")).find(
    (s) => new RegExp(`/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute("data-stencil-namespace") === NAMESPACE
  ) : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? (scriptElm || {})["data-opts"] || {} : {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};
var patchCloneNodeFix = (HTMLElementPrototype) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
  HTMLElementPrototype.cloneNode = function(deep) {
    if (this.nodeName === "TEMPLATE") {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["flowy-canvas",[[4,"flowy-canvas",{"renderGrid":[4,"render-grid"],"gridSize":[2,"grid-size"],"gridBgColor":[1,"grid-bg-color"],"gridLineColor":[1,"grid-line-color"],"maxZoom":[2,"max-zoom"],"minZoom":[2,"min-zoom"],"zoomSpeed":[2,"zoom-speed"],"zoom":[32],"pan":[32]},null,{"zoom":["zoomChanged"],"pan":["panChanged"]}]]],["flowy-canvas-old",[[4,"flowy-canvas-old",{"renderGrid":[4,"render-grid"],"gridSize":[2,"grid-size"],"gridBgColor":[1,"grid-bg-color"],"gridLineColor":[1,"grid-line-color"],"maxZoom":[2,"max-zoom"],"minZoom":[2,"min-zoom"],"zoomSpeed":[2,"zoom-speed"],"zoom":[32],"pan":[32]},null,{"zoom":["zoomChanged"],"pan":["panChanged"]}]]],["logic-node",[[4,"logic-node",{"type":[1],"title":[1],"position":[1040],"isDragging":[32]},null,{"isDragging":["onIsDraggingChange"],"position":["onPositionChange"]}]]],["my-component",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]]], options);
});

//# sourceMappingURL=flowy.esm.js.map