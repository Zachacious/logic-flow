const e="logic-flow";const t={allRenderFn:true,appendChildSlotFix:false,asyncLoading:true,asyncQueue:false,attachStyles:true,cloneNodeFix:false,cmpDidLoad:true,cmpDidRender:false,cmpDidUnload:false,cmpDidUpdate:false,cmpShouldUpdate:false,cmpWillLoad:true,cmpWillRender:true,cmpWillUpdate:false,connectedCallback:false,constructableCSS:true,cssAnnotations:true,devTools:false,disconnectedCallback:true,element:false,event:false,experimentalScopedSlotChanges:false,experimentalSlotFixes:false,formAssociated:false,hasRenderFn:true,hostListener:false,hostListenerTarget:false,hostListenerTargetBody:false,hostListenerTargetDocument:false,hostListenerTargetParent:false,hostListenerTargetWindow:false,hotModuleReplacement:false,hydrateClientSide:false,hydrateServerSide:false,hydratedAttribute:false,hydratedClass:true,hydratedSelectorName:"hydrated",initializeNextTick:false,invisiblePrehydration:true,isDebug:false,isDev:false,isTesting:false,lazyLoad:true,lifecycle:true,lifecycleDOMEvents:false,member:true,method:true,mode:false,observeAttribute:true,profile:false,prop:true,propBoolean:true,propMutable:true,propNumber:true,propString:true,reflect:false,scoped:false,scopedSlotTextContentFix:false,scriptDataOpts:false,shadowDelegatesFocus:false,shadowDom:false,slot:true,slotChildNodesFix:false,slotRelocation:true,state:true,style:true,svg:true,taskQueue:true,transformTagName:false,updatable:true,vdomAttribute:true,vdomClass:true,vdomFunctional:false,vdomKey:true,vdomListener:false,vdomPropOrAttr:true,vdomRef:false,vdomRender:true,vdomStyle:true,vdomText:false,vdomXlink:false,watchCallback:true};var l=Object.defineProperty;var r=(e,t)=>{for(var r in t)l(e,r,{get:t[r],enumerable:true})};var n=new WeakMap;var s=e=>n.get(e);var o=(e,t)=>n.set(t.t=e,t);var i=(e,t)=>{const l={l:0,$hostElement$:e,o:t,i:new Map};{l.u=new Promise((e=>l.v=e))}{l.h=new Promise((e=>l.p=e));e["s-p"]=[];e["s-rc"]=[]}return n.set(e,l)};var a=(e,t)=>t in e;var f=(e,t)=>(0,console.error)(e,t);var c=new Map;var u=(e,t,l)=>{const r=e.m.replace(/-/g,"_");const n=e.$;if(!n){return void 0}const s=c.get(n);if(s){return s[r]}
/*!__STENCIL_STATIC_IMPORT_SWITCH__*/return import(`./${n}.entry.js${""}`).then((e=>{{c.set(n,e)}return e[r]}),f)};var v=new Map;var d="{visibility:hidden}.hydrated{visibility:inherit}";var h="slot-fb{display:contents}slot-fb[hidden]{display:none}";var p=typeof window!=="undefined"?window:{};var m=p.document||{head:{}};var y={l:0,S:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,l,r)=>e.addEventListener(t,l,r),rel:(e,t,l,r)=>e.removeEventListener(t,l,r),ce:(e,t)=>new CustomEvent(e,t)};var b=t.shadowDom;var w=e=>Promise.resolve(e);var g=(()=>{try{new CSSStyleSheet;return typeof(new CSSStyleSheet).replaceSync==="function"}catch(e){}return false})();var $=false;var S=[];var k=[];var C=(e,t)=>l=>{e.push(l);if(!$){$=true;if(t&&y.l&4){T(O)}else{y.raf(O)}}};var j=e=>{for(let t=0;t<e.length;t++){try{e[t](performance.now())}catch(e){f(e)}}e.length=0};var O=()=>{j(S);{j(k);if($=S.length>0){y.raf(O)}}};var T=e=>w().then(e);var x=C(k,true);var D={};var L="http://www.w3.org/2000/svg";var R="http://www.w3.org/1999/xhtml";var E=e=>e!=null;var A=e=>{e=typeof e;return e==="object"||e==="function"};function F(e){var t,l,r;return(r=(l=(t=e.head)==null?void 0:t.querySelector('meta[name="csp-nonce"]'))==null?void 0:l.getAttribute("content"))!=null?r:void 0}var M={};r(M,{err:()=>N,map:()=>U,ok:()=>P,unwrap:()=>W,unwrapErr:()=>H});var P=e=>({isOk:true,isErr:false,value:e});var N=e=>({isOk:false,isErr:true,value:e});function U(e,t){if(e.isOk){const l=t(e.value);if(l instanceof Promise){return l.then((e=>P(e)))}else{return P(l)}}if(e.isErr){const t=e.value;return N(t)}throw"should never get here"}var W=e=>{if(e.isOk){return e.value}else{throw e.value}};var H=e=>{if(e.isErr){return e.value}else{throw e.value}};var z=(e,t="")=>{{return()=>{}}};var B=(e,t)=>{{return()=>{}}};var I=(e,t,...l)=>{let r=null;let n=null;let s=null;let o=false;let i=false;const a=[];const f=t=>{for(let l=0;l<t.length;l++){r=t[l];if(Array.isArray(r)){f(r)}else if(r!=null&&typeof r!=="boolean"){if(o=typeof e!=="function"&&!A(r)){r=String(r)}if(o&&i){a[a.length-1].k+=r}else{a.push(o?Q(null,r):r)}i=o}}};f(l);if(t){if(t.key){n=t.key}if(t.name){s=t.name}{const e=t.className||t.class;if(e){t.class=typeof e!=="object"?e:Object.keys(e).filter((t=>e[t])).join(" ")}}}const c=Q(e,null);c.C=t;if(a.length>0){c.j=a}{c.O=n}{c.T=s}return c};var Q=(e,t)=>{const l={l:0,D:e,k:t,L:null,j:null};{l.C=null}{l.O=null}{l.T=null}return l};var q={};var G=e=>e&&e.D===q;var K=(e,t)=>{if(e!=null&&!A(e)){if(t&4){return e==="false"?false:e===""||!!e}if(t&2){return parseFloat(e)}if(t&1){return String(e)}return e}return e};var V=e=>s(e).$hostElement$;var X=(e,t,l)=>{const r=y.ce(t,l);e.dispatchEvent(r);return r};var _=new WeakMap;var J=(e,t,l)=>{let r=v.get(e);if(g&&l){r=r||new CSSStyleSheet;if(typeof r==="string"){r=t}else{r.replaceSync(t)}}else{r=t}v.set(e,r)};var Y=(e,t,l)=>{var r;const n=ee(t);const s=v.get(n);e=e.nodeType===11?e:m;if(s){if(typeof s==="string"){e=e.head||e;let l=_.get(e);let o;if(!l){_.set(e,l=new Set)}if(!l.has(n)){{o=m.createElement("style");o.innerHTML=s;const l=(r=y.R)!=null?r:F(m);if(l!=null){o.setAttribute("nonce",l)}if(!(t.l&1)){if(e.nodeName==="HEAD"){const t=e.querySelectorAll("link[rel=preconnect]");const l=t.length>0?t[t.length-1].nextSibling:document.querySelector("style");e.insertBefore(o,l)}else if("host"in e){e.prepend(o)}else{e.append(o)}}if(t.l&1&&e.nodeName!=="HEAD"){e.insertBefore(o,null)}}if(t.l&4){o.innerHTML+=h}if(l){l.add(n)}}}else if(!e.adoptedStyleSheets.includes(s)){e.adoptedStyleSheets=[...e.adoptedStyleSheets,s]}}return n};var Z=e=>{const t=e.o;const l=e.$hostElement$;const r=z("attachStyles",t.m);Y(l.getRootNode(),t);r()};var ee=(e,t)=>"sc-"+e.m;var te=(e,t,l,r,n,s)=>{if(l!==r){let o=a(e,t);t.toLowerCase();if(t==="class"){const t=e.classList;const n=re(l);const s=re(r);t.remove(...n.filter((e=>e&&!s.includes(e))));t.add(...s.filter((e=>e&&!n.includes(e))))}else if(t==="style"){{for(const t in l){if(!r||r[t]==null){if(t.includes("-")){e.style.removeProperty(t)}else{e.style[t]=""}}}}for(const t in r){if(!l||r[t]!==l[t]){if(t.includes("-")){e.style.setProperty(t,r[t])}else{e.style[t]=r[t]}}}}else if(t==="key");else{const i=A(r);if((o||i&&r!==null)&&!n){try{if(!e.tagName.includes("-")){const n=r==null?"":r;if(t==="list"){o=false}else if(l==null||e[t]!=n){if(typeof e.__lookupSetter__(t)==="function"){e[t]=n}else{e.setAttribute(t,n)}}}else{e[t]=r}}catch(e){}}if(r==null||r===false){if(r!==false||e.getAttribute(t)===""){{e.removeAttribute(t)}}}else if((!o||s&4||n)&&!i){r=r===true?"":r;{e.setAttribute(t,r)}}}}};var le=/\s/;var re=e=>!e?[]:e.split(le);var ne=(e,t,l)=>{const r=t.L.nodeType===11&&t.L.host?t.L.host:t.L;const n=e&&e.C||D;const s=t.C||D;{for(const e of se(Object.keys(n))){if(!(e in s)){te(r,e,n[e],void 0,l,t.l)}}}for(const e of se(Object.keys(s))){te(r,e,n[e],s[e],l,t.l)}};function se(e){return e.includes("ref")?[...e.filter((e=>e!=="ref")),"ref"]:e}var oe;var ie;var ae;var fe=false;var ce=false;var ue=false;var ve=false;var de=(e,l,r,n)=>{var s;const o=l.j[r];let i=0;let a;let f;let c;if(!fe){ue=true;if(o.D==="slot"){o.l|=o.j?2:1}}if(o.l&1){a=o.L=m.createTextNode("")}else{if(!ve){ve=o.D==="svg"}a=o.L=m.createElementNS(ve?L:R,!fe&&t.slotRelocation&&o.l&2?"slot-fb":o.D);if(ve&&o.D==="foreignObject"){ve=false}{ne(null,o,ve)}const l=a.getRootNode();const r=!l.querySelector("body");if(!r&&t.scoped&&E(oe)&&a["s-si"]!==oe){a.classList.add(a["s-si"]=oe)}if(o.j){for(i=0;i<o.j.length;++i){f=de(e,o,i);if(f){a.appendChild(f)}}}{if(o.D==="svg"){ve=false}else if(a.tagName==="foreignObject"){ve=true}}}a["s-hn"]=ae;{if(o.l&(2|1)){a["s-sr"]=true;a["s-cr"]=ie;a["s-sn"]=o.T||"";a["s-rf"]=(s=o.C)==null?void 0:s.ref;c=e&&e.j&&e.j[r];if(c&&c.D===o.D&&e.L){{he(e.L,false)}}}}return a};var he=(e,l)=>{y.l|=1;const r=Array.from(e.childNodes);if(e["s-sr"]&&t.experimentalSlotFixes){let t=e;while(t=t.nextSibling){if(t&&t["s-sn"]===e["s-sn"]&&t["s-sh"]===ae){r.push(t)}}}for(let e=r.length-1;e>=0;e--){const t=r[e];if(t["s-hn"]!==ae&&t["s-ol"]){Oe(ge(t),t,we(t));t["s-ol"].remove();t["s-ol"]=void 0;t["s-sh"]=void 0;ue=true}if(l){he(t,l)}}y.l&=~1};var pe=(e,t,l,r,n,s)=>{let o=e["s-cr"]&&e["s-cr"].parentNode||e;let i;for(;n<=s;++n){if(r[n]){i=de(null,l,n);if(i){r[n].L=i;Oe(o,i,we(t))}}}};var me=(e,t,l)=>{for(let r=t;r<=l;++r){const t=e[r];if(t){const e=t.L;if(e){{ce=true;if(e["s-ol"]){e["s-ol"].remove()}else{he(e,true)}}e.remove()}}}};var ye=(e,t,l,r,n=false)=>{let s=0;let o=0;let i=0;let a=0;let f=t.length-1;let c=t[0];let u=t[f];let v=r.length-1;let d=r[0];let h=r[v];let p;let m;while(s<=f&&o<=v){if(c==null){c=t[++s]}else if(u==null){u=t[--f]}else if(d==null){d=r[++o]}else if(h==null){h=r[--v]}else if(be(c,d,n)){$e(c,d,n);c=t[++s];d=r[++o]}else if(be(u,h,n)){$e(u,h,n);u=t[--f];h=r[--v]}else if(be(c,h,n)){if(c.D==="slot"||h.D==="slot"){he(c.L.parentNode,false)}$e(c,h,n);Oe(e,c.L,u.L.nextSibling);c=t[++s];h=r[--v]}else if(be(u,d,n)){if(c.D==="slot"||h.D==="slot"){he(u.L.parentNode,false)}$e(u,d,n);Oe(e,u.L,c.L);u=t[--f];d=r[++o]}else{i=-1;{for(a=s;a<=f;++a){if(t[a]&&t[a].O!==null&&t[a].O===d.O){i=a;break}}}if(i>=0){m=t[i];if(m.D!==d.D){p=de(t&&t[o],l,i)}else{$e(m,d,n);t[i]=void 0;p=m.L}d=r[++o]}else{p=de(t&&t[o],l,o);d=r[++o]}if(p){{Oe(ge(c.L),p,we(c.L))}}}}if(s>f){pe(e,r[v+1]==null?null:r[v+1].L,l,r,o,v)}else if(o>v){me(t,s,f)}};var be=(e,t,l=false)=>{if(e.D===t.D){if(e.D==="slot"){if("A"in e&&l&&e.L.nodeType!==8){return false}return e.T===t.T}if(!l){return e.O===t.O}return true}return false};var we=e=>e&&e["s-ol"]||e;var ge=e=>(e["s-ol"]?e["s-ol"]:e).parentNode;var $e=(e,l,r=false)=>{const n=l.L=e.L;const s=e.j;const o=l.j;const i=l.D;{{ve=i==="svg"?true:i==="foreignObject"?false:ve}{if(i==="slot"&&!fe);else{ne(e,l,ve)}}if(s!==null&&o!==null){ye(n,s,l,o,r)}else if(o!==null){pe(n,null,l,o,0,o.length-1)}else if(!r&&t.updatable&&s!==null){me(s,0,s.length-1)}if(ve&&i==="svg"){ve=false}}};var Se=e=>{const t=e.childNodes;for(const e of t){if(e.nodeType===1){if(e["s-sr"]){const l=e["s-sn"];e.hidden=false;for(const r of t){if(r!==e){if(r["s-hn"]!==e["s-hn"]||l!==""){if(r.nodeType===1&&(l===r.getAttribute("slot")||l===r["s-sn"])||r.nodeType===3&&l===r["s-sn"]){e.hidden=true;break}}else{if(r.nodeType===1||r.nodeType===3&&r.textContent.trim()!==""){e.hidden=true;break}}}}}Se(e)}}};var ke=[];var Ce=e=>{let l;let r;let n;for(const s of e.childNodes){if(s["s-sr"]&&(l=s["s-cr"])&&l.parentNode){r=l.parentNode.childNodes;const e=s["s-sn"];for(n=r.length-1;n>=0;n--){l=r[n];if(!l["s-cn"]&&!l["s-nr"]&&l["s-hn"]!==s["s-hn"]&&!t.experimentalSlotFixes){if(je(l,e)){let t=ke.find((e=>e.F===l));ce=true;l["s-sn"]=l["s-sn"]||e;if(t){t.F["s-sh"]=s["s-hn"];t.M=s}else{l["s-sh"]=s["s-hn"];ke.push({M:s,F:l})}if(l["s-sr"]){ke.map((e=>{if(je(e.F,l["s-sn"])){t=ke.find((e=>e.F===l));if(t&&!e.M){e.M=t.M}}}))}}else if(!ke.some((e=>e.F===l))){ke.push({F:l})}}}}if(s.nodeType===1){Ce(s)}}};var je=(e,t)=>{if(e.nodeType===1){if(e.getAttribute("slot")===null&&t===""){return true}if(e.getAttribute("slot")===t){return true}return false}if(e["s-sn"]===t){return true}return t===""};var Oe=(e,t,l)=>{const r=e==null?void 0:e.insertBefore(t,l);return r};var Te=(e,t,l=false)=>{var r,n,s,o;const i=e.$hostElement$;const a=e.P||Q(null,null);const f=G(t)?t:I(null,null,t);ae=i.tagName;if(l&&f.C){for(const e of Object.keys(f.C)){if(i.hasAttribute(e)&&!["key","ref","style","class"].includes(e)){f.C[e]=i[e]}}}f.D=null;f.l|=4;e.P=f;f.L=a.L=i;fe=b;{ie=i["s-cr"];ce=false}$e(a,f,l);{y.l|=1;if(ue){Ce(f.L);for(const e of ke){const t=e.F;if(!t["s-ol"]){const e=m.createTextNode("");e["s-nr"]=t;Oe(t.parentNode,t["s-ol"]=e,t)}}for(const e of ke){const t=e.F;const i=e.M;if(i){const e=i.parentNode;let l=i.nextSibling;{let s=(r=t["s-ol"])==null?void 0:r.previousSibling;while(s){let r=(n=s["s-nr"])!=null?n:null;if(r&&r["s-sn"]===t["s-sn"]&&e===r.parentNode){r=r.nextSibling;while(r===t||(r==null?void 0:r["s-sr"])){r=r==null?void 0:r.nextSibling}if(!r||!r["s-nr"]){l=r;break}}s=s.previousSibling}}if(!l&&e!==t.parentNode||t.nextSibling!==l){if(t!==l){if(!t["s-hn"]&&t["s-ol"]){t["s-hn"]=t["s-ol"].parentNode.nodeName}Oe(e,t,l);if(t.nodeType===1){t.hidden=(s=t["s-ih"])!=null?s:false}}}t&&typeof i["s-rf"]==="function"&&i["s-rf"](t)}else{if(t.nodeType===1){if(l){t["s-ih"]=(o=t.hidden)!=null?o:false}t.hidden=true}}}}if(ce){Se(f.L)}y.l&=~1;ke.length=0}ie=void 0};var xe=(e,t)=>{if(t&&!e.N&&t["s-p"]){t["s-p"].push(new Promise((t=>e.N=t)))}};var De=(e,t)=>{{e.l|=16}if(e.l&4){e.l|=512;return}xe(e,e.U);const l=()=>Le(e,t);return x(l)};var Le=(e,t)=>{const l=e.$hostElement$;const r=z("scheduleUpdate",e.o.m);const n=e.t;if(!n){throw new Error(`Can't render component <${l.tagName.toLowerCase()} /> with invalid Stencil runtime! Make sure this imported component is compiled with a \`externalRuntime: true\` flag. For more information, please refer to https://stenciljs.com/docs/custom-elements#externalruntime`)}let s;if(t){{s=Ne(n,"componentWillLoad")}}{s=Re(s,(()=>Ne(n,"componentWillRender")))}r();return Re(s,(()=>Ae(e,n,t)))};var Re=(e,t)=>Ee(e)?e.then(t).catch((e=>{console.error(e);t()})):t();var Ee=e=>e instanceof Promise||e&&e.then&&typeof e.then==="function";var Ae=async(e,t,l)=>{var r;const n=e.$hostElement$;const s=z("update",e.o.m);const o=n["s-rc"];if(l){Z(e)}const i=z("render",e.o.m);{Fe(e,t,n,l)}if(o){o.map((e=>e()));n["s-rc"]=void 0}i();s();{const t=(r=n["s-p"])!=null?r:[];const l=()=>Me(e);if(t.length===0){l()}else{Promise.all(t).then(l);e.l|=4;t.length=0}}};var Fe=(e,t,l,r)=>{try{t=t.render();{e.l&=~16}{e.l|=2}{{{Te(e,t,r)}}}}catch(t){f(t,e.$hostElement$)}return null};var Me=e=>{const t=e.o.m;const l=e.$hostElement$;const r=z("postUpdate",t);const n=e.t;const s=e.U;if(!(e.l&64)){e.l|=64;{Ue(l)}{Ne(n,"componentDidLoad")}r();{e.p(l);if(!s){Pe()}}}else{r()}{e.v(l)}{if(e.N){e.N();e.N=void 0}if(e.l&512){T((()=>De(e,false)))}e.l&=~(4|512)}};var Pe=t=>{{Ue(m.documentElement)}T((()=>X(p,"appload",{detail:{namespace:e}})))};var Ne=(e,t,l)=>{if(e&&e[t]){try{return e[t](l)}catch(e){f(e)}}return void 0};var Ue=e=>{var l;return e.classList.add((l=t.hydratedSelectorName)!=null?l:"hydrated")};var We=(e,t)=>s(e).i.get(t);var He=(e,t,l,r)=>{const n=s(e);if(!n){throw new Error(`Couldn't find host element for "${r.m}" as it is unknown to this Stencil runtime. This usually happens when integrating a 3rd party Stencil component with another Stencil component or application. Please reach out to the maintainers of the 3rd party Stencil component or report this on the Stencil Discord server (https://chat.stenciljs.com) or comment on this similar [GitHub issue](https://github.com/ionic-team/stencil/issues/5457).`)}const o=n.$hostElement$;const i=n.i.get(t);const a=n.l;const c=n.t;l=K(l,r.W[t][0]);const u=Number.isNaN(i)&&Number.isNaN(l);const v=l!==i&&!u;if((!(a&8)||i===void 0)&&v){n.i.set(t,l);if(c){if(r.H&&a&128){const e=r.H[t];if(e){e.map((e=>{try{c[e](l,i,t)}catch(e){f(e,o)}}))}}if((a&(2|16))===2){De(n,false)}}}};var ze=(e,t,l)=>{var r,n;const o=e.prototype;if(t.W||(t.H||e.watchers)){if(e.watchers&&!t.H){t.H=e.watchers}const i=Object.entries((r=t.W)!=null?r:{});i.map((([e,[r]])=>{if(r&31||l&2&&r&32){Object.defineProperty(o,e,{get(){return We(this,e)},set(l){He(this,e,l,t)},configurable:true,enumerable:true})}else if(l&1&&r&64){Object.defineProperty(o,e,{value(...t){var l;const r=s(this);return(l=r==null?void 0:r.u)==null?void 0:l.then((()=>{var l;return(l=r.t)==null?void 0:l[e](...t)}))}})}}));if(l&1){const l=new Map;o.attributeChangedCallback=function(e,r,n){y.jmp((()=>{var i;const a=l.get(e);if(this.hasOwnProperty(a)){n=this[a];delete this[a]}else if(o.hasOwnProperty(a)&&typeof this[a]==="number"&&this[a]==n){return}else if(a==null){const l=s(this);const o=l==null?void 0:l.l;if(o&&!(o&8)&&o&128&&n!==r){const s=l.t;const o=(i=t.H)==null?void 0:i[e];o==null?void 0:o.forEach((t=>{if(s[t]!=null){s[t].call(s,n,r,e)}}))}return}this[a]=n===null&&typeof this[a]==="boolean"?false:n}))};e.observedAttributes=Array.from(new Set([...Object.keys((n=t.H)!=null?n:{}),...i.filter((([e,t])=>t[0]&15)).map((([e,t])=>{const r=t[1]||e;l.set(r,e);return r}))]))}}return e};var Be=async(e,t,l,r)=>{let n;if((t.l&32)===0){t.l|=32;const r=l.$;if(r){const e=u(l);if(e&&"then"in e){const t=B();n=await e;t()}else{n=e}if(!n){throw new Error(`Constructor for "${l.m}#${t.B}" was not found`)}if(!n.isProxied){{l.H=n.watchers}ze(n,l,2);n.isProxied=true}const r=z("createInstance",l.m);{t.l|=8}try{new n(t)}catch(e){f(e)}{t.l&=~8}{t.l|=128}r()}else{n=e.constructor;const l=e.localName;customElements.whenDefined(l).then((()=>t.l|=128))}if(n&&n.style){let e;if(typeof n.style==="string"){e=n.style}const t=ee(l);if(!v.has(t)){const r=z("registerStyles",l.m);J(t,e,!!(l.l&1));r()}}}const s=t.U;const o=()=>De(t,true);if(s&&s["s-rc"]){s["s-rc"].push(o)}else{o()}};var Ie=e=>{};var Qe=e=>{if((y.l&1)===0){const t=s(e);const l=t.o;const r=z("connectedCallback",l.m);if(!(t.l&1)){t.l|=1;{if(l.l&(4|8)){qe(e)}}{let l=e;while(l=l.parentNode||l.host){if(l["s-p"]){xe(t,t.U=l);break}}}if(l.W){Object.entries(l.W).map((([t,[l]])=>{if(l&31&&e.hasOwnProperty(t)){const l=e[t];delete e[t];e[t]=l}}))}{Be(e,t,l)}}else{if(t==null?void 0:t.t);else if(t==null?void 0:t.h){t.h.then((()=>Ie()))}}r()}};var qe=e=>{const t=e["s-cr"]=m.createComment("");t["s-cn"]=true;Oe(e,t,e.firstChild)};var Ge=e=>{{Ne(e,"disconnectedCallback")}};var Ke=async e=>{if((y.l&1)===0){const t=s(e);if(t==null?void 0:t.t){Ge(t.t)}else if(t==null?void 0:t.h){t.h.then((()=>Ge(t.t)))}}};var Ve=(e,t={})=>{var l;const r=z();const n=[];const o=t.exclude||[];const a=p.customElements;const f=m.head;const c=f.querySelector("meta[charset]");const u=m.createElement("style");const v=[];let b;let w=true;Object.assign(y,t);y.S=new URL(t.resourcesUrl||"./",m.baseURI).href;let g=false;e.map((e=>{e[1].map((t=>{var l;const r={l:t[0],m:t[1],W:t[2],I:t[3]};if(r.l&4){g=true}{r.W=t[2]}{r.H=(l=t[4])!=null?l:{}}const f=r.m;const c=class extends HTMLElement{constructor(e){super(e);this.hasRegisteredEventListeners=false;e=this;i(e,r)}connectedCallback(){s(this);if(!this.hasRegisteredEventListeners){this.hasRegisteredEventListeners=true}if(b){clearTimeout(b);b=null}if(w){v.push(this)}else{y.jmp((()=>Qe(this)))}}disconnectedCallback(){y.jmp((()=>Ke(this)))}componentOnReady(){return s(this).h}};r.$=e[0];if(!o.includes(f)&&!a.get(f)){n.push(f);a.define(f,ze(c,r,1))}}))}));if(n.length>0){if(g){u.textContent+=h}{u.textContent+=n.sort()+d}if(u.innerHTML.length){u.setAttribute("data-styles","");const e=(l=y.R)!=null?l:F(m);if(e!=null){u.setAttribute("nonce",e)}f.insertBefore(u,c?c.nextSibling:f.firstChild)}}w=false;if(v.length){v.map((e=>e.connectedCallback()))}else{{y.jmp((()=>b=setTimeout(Pe,30)))}}r()};var Xe=e=>y.R=e;export{q as H,Ve as b,V as g,I as h,w as p,o as r,Xe as s};
//# sourceMappingURL=p-d9de4f93.js.map