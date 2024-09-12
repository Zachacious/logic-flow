import { r as registerInstance, h, a as Host, g as getElement } from './index-2e7362b2.js';
import { t as throttle } from './throttle-2ef1c0d0.js';
import { g as getDefaultExportFromCjs, c as commonjsGlobal } from './_commonjsHelpers-bc8ff177.js';

var lib = {};

var types = {};

"use strict";
Object.defineProperty(types, "__esModule", { value: true });

var ee = {};

var taskCollection$1 = {};

var taskCollection = {};

var bakeCollection$1 = {};

(function (exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bakeCollectionVariadic = exports.bakeCollectionAwait = exports.bakeCollection = exports.BAKED_EMPTY_FUNC = void 0;
exports.BAKED_EMPTY_FUNC = (function () { });
var FORLOOP_FALLBACK = 1500;
function generateArgsDefCode(numArgs) {
    var argsDefCode = '';
    if (numArgs === 0)
        return argsDefCode;
    for (var i = 0; i < numArgs - 1; ++i) {
        argsDefCode += ('arg' + String(i) + ', ');
    }
    argsDefCode += ('arg' + String(numArgs - 1));
    return argsDefCode;
}
function generateBodyPartsCode(argsDefCode, collectionLength) {
    var funcDefCode = '', funcCallCode = '';
    for (var i = 0; i < collectionLength; ++i) {
        funcDefCode += "var f".concat(i, " = collection[").concat(i, "];\n");
        funcCallCode += "f".concat(i, "(").concat(argsDefCode, ")\n");
    }
    return { funcDefCode: funcDefCode, funcCallCode: funcCallCode };
}
function generateBodyPartsVariadicCode(collectionLength) {
    var funcDefCode = '', funcCallCode = '';
    for (var i = 0; i < collectionLength; ++i) {
        funcDefCode += "var f".concat(i, " = collection[").concat(i, "];\n");
        funcCallCode += "f".concat(i, ".apply(undefined, arguments)\n");
    }
    return { funcDefCode: funcDefCode, funcCallCode: funcCallCode };
}
function bakeCollection(collection, fixedArgsNum) {
    if (collection.length === 0)
        return exports.BAKED_EMPTY_FUNC;
    else if (collection.length === 1)
        return collection[0];
    var funcFactoryCode;
    if (collection.length < FORLOOP_FALLBACK) {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                ").concat(funcCallCode, "\n            });\n        })");
    }
    else {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        // loop unroll
        if (collection.length % 10 === 0) {
            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 10) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                        collection[i+4](").concat(argsDefCode, ");\n                        collection[i+5](").concat(argsDefCode, ");\n                        collection[i+6](").concat(argsDefCode, ");\n                        collection[i+7](").concat(argsDefCode, ");\n                        collection[i+8](").concat(argsDefCode, ");\n                        collection[i+9](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        }
        else if (collection.length % 4 === 0) {
            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 4) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                        collection[i+3](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        }
        else if (collection.length % 3 === 0) {
            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; i += 3) {\n                        collection[i](").concat(argsDefCode, ");\n                        collection[i+1](").concat(argsDefCode, ");\n                        collection[i+2](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        }
        else {
            funcFactoryCode = "(function(collection) {\n                return (function(".concat(argsDefCode, ") {\n                    for (var i = 0; i < collection.length; ++i) {\n                        collection[i](").concat(argsDefCode, ");\n                    }\n                });\n            })");
        }
    }
    {
        // isolate
        var bakeCollection_1 = undefined;
        var fixedArgsNum_1 = undefined;
        var bakeCollectionVariadic_1 = undefined;
        var bakeCollectionAwait_1 = undefined;
        var funcFactory = eval(funcFactoryCode);
        return funcFactory(collection);
    }
}
exports.bakeCollection = bakeCollection;
function bakeCollectionAwait(collection, fixedArgsNum) {
    if (collection.length === 0)
        return exports.BAKED_EMPTY_FUNC;
    else if (collection.length === 1)
        return collection[0];
    var funcFactoryCode;
    if (collection.length < FORLOOP_FALLBACK) {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        var _a = generateBodyPartsCode(argsDefCode, collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function(").concat(argsDefCode, ") {\n                return Promise.all([ ").concat(funcCallCode, " ]);\n            });\n        })");
    }
    else {
        var argsDefCode = generateArgsDefCode(fixedArgsNum);
        funcFactoryCode = "(function(collection) {\n            return (function(".concat(argsDefCode, ") {\n                var promises = Array(collection.length);\n                for (var i = 0; i < collection.length; ++i) {\n                    promises[i] = collection[i](").concat(argsDefCode, ");\n                }\n                return Promise.all(promises);\n            });\n        })");
    }
    {
        // isolate
        var bakeCollection_2 = undefined;
        var fixedArgsNum_2 = undefined;
        var bakeCollectionVariadic_2 = undefined;
        var bakeCollectionAwait_2 = undefined;
        var funcFactory = eval(funcFactoryCode);
        return funcFactory(collection);
    }
}
exports.bakeCollectionAwait = bakeCollectionAwait;
function bakeCollectionVariadic(collection) {
    if (collection.length === 0)
        return exports.BAKED_EMPTY_FUNC;
    else if (collection.length === 1)
        return collection[0];
    var funcFactoryCode;
    if (collection.length < FORLOOP_FALLBACK) {
        var _a = generateBodyPartsVariadicCode(collection.length), funcDefCode = _a.funcDefCode, funcCallCode = _a.funcCallCode;
        funcFactoryCode = "(function(collection) {\n            ".concat(funcDefCode, "\n            collection = undefined;\n            return (function() {\n                ").concat(funcCallCode, "\n            });\n        })");
    }
    else {
        funcFactoryCode = "(function(collection) {\n            return (function() {\n                for (var i = 0; i < collection.length; ++i) {\n                    collection[i].apply(undefined, arguments);\n                }\n            });\n        })";
    }
    {
        // isolate
        var bakeCollection_3 = undefined;
        var fixedArgsNum = undefined;
        var bakeCollectionVariadic_3 = undefined;
        var bakeCollectionAwait_3 = undefined;
        var funcFactory = eval(funcFactoryCode);
        return funcFactory(collection);
    }
}
exports.bakeCollectionVariadic = bakeCollectionVariadic;

}(bakeCollection$1));

const bakeCollection = /*@__PURE__*/getDefaultExportFromCjs(bakeCollection$1);

"use strict";
var __spreadArray$1 = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(taskCollection, "__esModule", { value: true });
var TaskCollection_1 = taskCollection.TaskCollection = _fast_remove_single_1 = taskCollection._fast_remove_single = void 0;
var bake_collection_1 = bakeCollection$1;
function push_norebuild(a, b /*, ...func: Func[] */) {
    var len = this.length;
    if (len > 1) { // tasks is array
        if (b) { // if multiple args
            var _a;
            (_a = this._tasks).push.apply(_a, arguments);
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            this._tasks.push(a);
            this.length++;
        }
    }
    else { // tasks is (function or null)
        if (b) { // if multiple args
            if (len === 1) { // if this._tasks is function
                var newAr = Array(1 + arguments.length);
                newAr.push(newAr);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            else {
                var newAr = Array(arguments.length);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            if (len === 1)
                this._tasks = [this._tasks, a];
            else
                this._tasks = a;
            this.length++;
        }
    }
}
function push_rebuild(a, b /*, ...func: Func[] */) {
    var len = this.length;
    if (len > 1) { // tasks is array
        if (b) { // if multiple args
            var _a;
            (_a = this._tasks).push.apply(_a, arguments);
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            this._tasks.push(a);
            this.length++;
        }
    }
    else { // tasks is (function or null)
        if (b) { // if multiple args
            if (len === 1) { // if this._tasks is function
                var newAr = Array(1 + arguments.length);
                newAr.push(newAr);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            else {
                var newAr = Array(arguments.length);
                newAr.push.apply(newAr, arguments);
                this._tasks = newAr;
            }
            this.length += arguments.length;
        }
        else { // if single arg (most often case)
            if (len === 1)
                this._tasks = [this._tasks, a];
            else
                this._tasks = a;
            this.length++;
        }
    }
    if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
    else
        this.rebuild();
}
function _fast_remove_single(arr, index) {
    if (index === -1)
        return;
    if (index === 0)
        arr.shift();
    else if (index === arr.length - 1)
        arr.length = arr.length - 1;
    else
        arr.splice(index, 1);
}
var _fast_remove_single_1 = taskCollection._fast_remove_single = _fast_remove_single;
function removeLast_norebuild(a) {
    if (this.length === 0)
        return;
    if (this.length === 1) {
        if (this._tasks === a) {
            this.length = 0;
        }
    }
    else {
        _fast_remove_single(this._tasks, this._tasks.lastIndexOf(a));
        if (this._tasks.length === 1) {
            this._tasks = this._tasks[0];
            this.length = 1;
        }
        else
            this.length = this._tasks.length;
    }
}
function removeLast_rebuild(a) {
    if (this.length === 0)
        return;
    if (this.length === 1) {
        if (this._tasks === a) {
            this.length = 0;
        }
        if (this.firstEmitBuildStrategy) {
            this.call = bake_collection_1.BAKED_EMPTY_FUNC;
            return;
        }
        else {
            this.rebuild();
            return;
        }
    }
    else {
        _fast_remove_single(this._tasks, this._tasks.lastIndexOf(a));
        if (this._tasks.length === 1) {
            this._tasks = this._tasks[0];
            this.length = 1;
        }
        else
            this.length = this._tasks.length;
    }
    if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
    else
        this.rebuild();
}
function insert_norebuild(index) {
    var _b;
    var func = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        func[_i - 1] = arguments[_i];
    }
    if (this.length === 0) {
        this._tasks = func;
        this.length = 1;
    }
    else if (this.length === 1) {
        func.unshift(this._tasks);
        this._tasks = func;
        this.length = this._tasks.length;
    }
    else {
        (_b = this._tasks).splice.apply(_b, __spreadArray$1([index, 0], func, false));
        this.length = this._tasks.length;
    }
}
function insert_rebuild(index) {
    var _b;
    var func = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        func[_i - 1] = arguments[_i];
    }
    if (this.length === 0) {
        this._tasks = func;
        this.length = 1;
    }
    else if (this.length === 1) {
        func.unshift(this._tasks);
        this._tasks = func;
        this.length = this._tasks.length;
    }
    else {
        (_b = this._tasks).splice.apply(_b, __spreadArray$1([index, 0], func, false));
        this.length = this._tasks.length;
    }
    if (this.firstEmitBuildStrategy)
        this.call = rebuild_on_first_call;
    else
        this.rebuild();
}
function rebuild_noawait() {
    if (this.length === 0)
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    else if (this.length === 1)
        this.call = this._tasks;
    else
        this.call = (0, bake_collection_1.bakeCollection)(this._tasks, this.argsNum);
}
function rebuild_await() {
    if (this.length === 0)
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    else if (this.length === 1)
        this.call = this._tasks;
    else
        this.call = (0, bake_collection_1.bakeCollectionAwait)(this._tasks, this.argsNum);
}
function rebuild_on_first_call() {
    this.rebuild();
    this.call.apply(undefined, arguments);
}
var TaskCollection = /** @class */ (function () {
    function TaskCollection(argsNum, autoRebuild, initialTasks, awaitTasks) {
        if (autoRebuild === void 0) { autoRebuild = true; }
        if (initialTasks === void 0) { initialTasks = null; }
        if (awaitTasks === void 0) { awaitTasks = false; }
        this.awaitTasks = awaitTasks;
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
        this.argsNum = argsNum;
        this.firstEmitBuildStrategy = true;
        if (awaitTasks)
            this.rebuild = rebuild_await.bind(this);
        else
            this.rebuild = rebuild_noawait.bind(this);
        this.setAutoRebuild(autoRebuild);
        if (initialTasks) {
            if (typeof initialTasks === 'function') {
                this._tasks = initialTasks;
                this.length = 1;
            }
            else {
                this._tasks = initialTasks;
                this.length = initialTasks.length;
            }
        }
        else {
            this._tasks = null;
            this.length = 0;
        }
        if (autoRebuild)
            this.rebuild();
    }
    return TaskCollection;
}());
TaskCollection_1 = taskCollection.TaskCollection = TaskCollection;
function fastClear() {
    this._tasks = null;
    this.length = 0;
    this.call = bake_collection_1.BAKED_EMPTY_FUNC;
}
function clear() {
    this._tasks = null;
    this.length = 0;
    this.call = bake_collection_1.BAKED_EMPTY_FUNC;
}
function growArgsNum(argsNum) {
    if (this.argsNum < argsNum) {
        this.argsNum = argsNum;
        if (this.firstEmitBuildStrategy)
            this.call = rebuild_on_first_call;
        else
            this.rebuild();
    }
}
function setAutoRebuild(newVal) {
    if (newVal) {
        this.push = push_rebuild.bind(this);
        this.insert = insert_rebuild.bind(this);
        this.removeLast = removeLast_rebuild.bind(this);
    }
    else {
        this.push = push_norebuild.bind(this);
        this.insert = insert_norebuild.bind(this);
        this.removeLast = removeLast_norebuild.bind(this);
    }
}
;
function tasksAsArray() {
    if (this.length === 0)
        return [];
    if (this.length === 1)
        return [this._tasks];
    return this._tasks;
}
function setTasks(tasks) {
    if (tasks.length === 0) {
        this.length = 0;
        this.call = bake_collection_1.BAKED_EMPTY_FUNC;
    }
    else if (tasks.length === 1) {
        this.length = 1;
        this.call = tasks[0];
        this._tasks = tasks[0];
    }
    else {
        this.length = tasks.length;
        this._tasks = tasks;
        if (this.firstEmitBuildStrategy)
            this.call = rebuild_on_first_call;
        else
            this.rebuild();
    }
}
TaskCollection.prototype.fastClear = fastClear;
TaskCollection.prototype.clear = clear;
TaskCollection.prototype.growArgsNum = growArgsNum;
TaskCollection.prototype.setAutoRebuild = setAutoRebuild;
TaskCollection.prototype.tasksAsArray = tasksAsArray;
TaskCollection.prototype.setTasks = setTasks;

(function (exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(taskCollection, exports);

}(taskCollection$1));

const index$1 = /*@__PURE__*/getDefaultExportFromCjs(taskCollection$1);

var utils = {};

"use strict";
Object.defineProperty(utils, "__esModule", { value: true });
var nullObj_1 = utils.nullObj = void 0;
function nullObj() {
    var x = {};
    x.__proto__ = null;
    x.prototype = null;
    return x;
}
nullObj_1 = utils.nullObj = nullObj;

"use strict";
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(ee, "__esModule", { value: true });
var EventEmitter_1 = ee.EventEmitter = void 0;
var task_collection_1 = taskCollection$1;
var utils_1 = utils;
function emit(event, a, b, c, d, e) {
    var ev = this.events[event];
    if (ev) {
        if (ev.length === 0)
            return false;
        if (ev.argsNum < 6) {
            ev.call(a, b, c, d, e);
        }
        else {
            ev.call.apply(undefined, arguments);
        }
        return true;
    }
    return false;
}
function emitHasOnce(event, a, b, c, d, e) {
    var ev = this.events[event];
    if (ev) {
        if (ev.length === 0)
            return false;
        if (ev.argsNum < 6) {
            ev.call(a, b, c, d, e);
        }
        else {
            ev.call.apply(undefined, arguments);
        }
    }
    var oev = this.onceEvents[event];
    if (oev) {
        if (typeof oev === 'function') {
            this.onceEvents[event] = undefined;
            if (arguments.length < 6) {
                oev(a, b, c, d, e);
            }
            else {
                oev.apply(undefined, arguments);
            }
        }
        else {
            var fncs = oev;
            this.onceEvents[event] = undefined;
            if (arguments.length < 6) {
                for (var i = 0; i < fncs.length; ++i)
                    fncs[i](a, b, c, d, e);
            }
            else {
                for (var i = 0; i < fncs.length; ++i)
                    fncs[i].apply(undefined, arguments);
            }
        }
        return true;
    }
    return !!ev;
}
/** Implemented event emitter */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = (0, utils_1.nullObj)();
        this.onceEvents = (0, utils_1.nullObj)();
        this._symbolKeys = new Set;
        this.maxListeners = Infinity;
    }
    Object.defineProperty(EventEmitter.prototype, "_eventsCount", {
        get: function () {
            return this.eventNames().length;
        },
        enumerable: false,
        configurable: true
    });
    return EventEmitter;
}());
EventEmitter_1 = ee.EventEmitter = EventEmitter;
function once(event, listener) {
    if (this.emit === emit) {
        this.emit = emitHasOnce;
    }
    switch (typeof this.onceEvents[event]) {
        case 'undefined':
            this.onceEvents[event] = listener;
            if (typeof event === 'symbol')
                this._symbolKeys.add(event);
            break;
        case 'function':
            this.onceEvents[event] = [this.onceEvents[event], listener];
            break;
        case 'object':
            this.onceEvents[event].push(listener);
    }
    return this;
}
function addListener(event, listener, argsNum) {
    if (argsNum === void 0) { argsNum = listener.length; }
    if (typeof listener !== 'function')
        throw new TypeError('The listener must be a function');
    var evtmap = this.events[event];
    if (!evtmap) {
        this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else {
        evtmap.push(listener);
        evtmap.growArgsNum(argsNum);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
            console.warn("Maximum event listeners for \"".concat(String(event), "\" event!"));
    }
    return this;
}
function removeListener(event, listener) {
    var evt = this.events[event];
    if (evt) {
        evt.removeLast(listener);
    }
    var evto = this.onceEvents[event];
    if (evto) {
        if (typeof evto === 'function') {
            this.onceEvents[event] = undefined;
        }
        else if (typeof evto === 'object') {
            if (evto.length === 1 && evto[0] === listener) {
                this.onceEvents[event] = undefined;
            }
            else {
                (0, task_collection_1._fast_remove_single)(evto, evto.lastIndexOf(listener));
            }
        }
    }
    return this;
}
function addListenerBound(event, listener, bindTo, argsNum) {
    if (bindTo === void 0) { bindTo = this; }
    if (argsNum === void 0) { argsNum = listener.length; }
    if (!this.boundFuncs)
        this.boundFuncs = new Map;
    var bound = listener.bind(bindTo);
    this.boundFuncs.set(listener, bound);
    return this.addListener(event, bound, argsNum);
}
function removeListenerBound(event, listener) {
    var _a, _b;
    var bound = (_a = this.boundFuncs) === null || _a === void 0 ? void 0 : _a.get(listener);
    (_b = this.boundFuncs) === null || _b === void 0 ? void 0 : _b.delete(listener);
    return this.removeListener(event, bound);
}
function hasListeners(event) {
    return this.events[event] && !!this.events[event].length;
}
function prependListener(event, listener, argsNum) {
    if (argsNum === void 0) { argsNum = listener.length; }
    if (typeof listener !== 'function')
        throw new TypeError('The listener must be a function');
    var evtmap = this.events[event];
    if (!evtmap || !(evtmap instanceof task_collection_1.TaskCollection)) {
        evtmap = this.events[event] = new task_collection_1.TaskCollection(argsNum, true, listener, false);
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else {
        evtmap.insert(0, listener);
        evtmap.growArgsNum(argsNum);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length)
            console.warn("Maximum event listeners for \"".concat(String(event), "\" event!"));
    }
    return this;
}
function prependOnceListener(event, listener) {
    if (this.emit === emit) {
        this.emit = emitHasOnce;
    }
    var evtmap = this.onceEvents[event];
    if (!evtmap) {
        this.onceEvents[event] = [listener];
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else if (typeof evtmap !== 'object') {
        this.onceEvents[event] = [listener, evtmap];
        if (typeof event === 'symbol')
            this._symbolKeys.add(event);
    }
    else {
        evtmap.unshift(listener);
        if (this.maxListeners !== Infinity && this.maxListeners <= evtmap.length) {
            console.warn("Maximum event listeners for \"".concat(String(event), "\" once event!"));
        }
    }
    return this;
}
function removeAllListeners(event) {
    if (event === undefined) {
        this.events = (0, utils_1.nullObj)();
        this.onceEvents = (0, utils_1.nullObj)();
        this._symbolKeys = new Set;
    }
    else {
        this.events[event] = undefined;
        this.onceEvents[event] = undefined;
        if (typeof event === 'symbol')
            this._symbolKeys.delete(event);
    }
    return this;
}
function setMaxListeners(n) {
    this.maxListeners = n;
    return this;
}
function getMaxListeners() {
    return this.maxListeners;
}
function listeners(event) {
    if (this.emit === emit)
        return this.events[event] ? this.events[event].tasksAsArray().slice() : [];
    else {
        if (this.events[event] && this.onceEvents[event]) {
            return __spreadArray(__spreadArray([], this.events[event].tasksAsArray(), true), (typeof this.onceEvents[event] === 'function' ? [this.onceEvents[event]] : this.onceEvents[event]), true);
        }
        else if (this.events[event])
            return this.events[event].tasksAsArray();
        else if (this.onceEvents[event])
            return (typeof this.onceEvents[event] === 'function' ? [this.onceEvents[event]] : this.onceEvents[event]);
        else
            return [];
    }
}
function eventNames() {
    var _this = this;
    if (this.emit === emit) {
        var keys = Object.keys(this.events);
        return __spreadArray(__spreadArray([], keys, true), Array.from(this._symbolKeys), true).filter(function (x) { return (x in _this.events) && _this.events[x] && _this.events[x].length; });
    }
    else {
        var keys = Object.keys(this.events).filter(function (x) { return _this.events[x] && _this.events[x].length; });
        var keysO = Object.keys(this.onceEvents).filter(function (x) { return _this.onceEvents[x] && _this.onceEvents[x].length; });
        return __spreadArray(__spreadArray(__spreadArray([], keys, true), keysO, true), Array.from(this._symbolKeys).filter(function (x) { return (((x in _this.events) && _this.events[x] && _this.events[x].length) ||
            ((x in _this.onceEvents) && _this.onceEvents[x] && _this.onceEvents[x].length)); }), true);
    }
}
function listenerCount(type) {
    if (this.emit === emit)
        return this.events[type] && this.events[type].length || 0;
    else
        return (this.events[type] && this.events[type].length || 0) + (this.onceEvents[type] && this.onceEvents[type].length || 0);
}
EventEmitter.prototype.emit = emit;
EventEmitter.prototype.on = addListener;
EventEmitter.prototype.once = once;
EventEmitter.prototype.addListener = addListener;
EventEmitter.prototype.removeListener = removeListener;
EventEmitter.prototype.addListenerBound = addListenerBound;
EventEmitter.prototype.removeListenerBound = removeListenerBound;
EventEmitter.prototype.hasListeners = hasListeners;
EventEmitter.prototype.prependListener = prependListener;
EventEmitter.prototype.prependOnceListener = prependOnceListener;
EventEmitter.prototype.off = removeListener;
EventEmitter.prototype.removeAllListeners = removeAllListeners;
EventEmitter.prototype.setMaxListeners = setMaxListeners;
EventEmitter.prototype.getMaxListeners = getMaxListeners;
EventEmitter.prototype.listeners = listeners;
EventEmitter.prototype.eventNames = eventNames;
EventEmitter.prototype.listenerCount = listenerCount;

(function (exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(types, exports);
__exportStar(ee, exports);

}(lib));

const index = /*@__PURE__*/getDefaultExportFromCjs(lib);

const events = new lib.EventEmitter();

const logicNodeCss = ":host{display:block}";

const LogicNode = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this._canvasZoom = 1;
        this._canvasPan = { x: 0, y: 0 };
        this._dragStart = { x: 0, y: 0 };
        this._throttledPointerMove = throttle(e => this.onPointerMove(e), 30);
        this._throttledTouchMove = throttle(e => this.handleTouchMove(e), 30);
        this._elMouseDown = (e) => this.onPointerDown(e);
        this._elMouseUp = () => this.onPointerUp();
        this._elMouseMove = (e) => this._throttledPointerMove(e);
        this._elTouchStart = (e) => this.handleTouchStart(e);
        this._elTouchMove = (e) => this._throttledTouchMove(e);
        this._elTouchEnd = () => this.onPointerUp();
        // Get event location utility (mouse or touch)
        this.getEventLocation = (e) => {
            if (e instanceof MouseEvent) {
                return { x: e.clientX, y: e.clientY };
            }
            else if (e instanceof TouchEvent && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: 0, y: 0 };
        };
        this.type = 'default';
        this.title = 'Node';
        this.position = { x: 0, y: 0 };
        this.isDragging = false;
    }
    componentDidLoad() {
        window.addEventListener('mouseup', this._elMouseUp, { passive: true });
        window.addEventListener('mousemove', this._elMouseMove, { passive: true });
        this.el.addEventListener('mousedown', this._elMouseDown, { passive: true });
        this.el.addEventListener('touchstart', this._elTouchStart, {
            passive: true,
        });
        this.el.addEventListener('touchend', this._elTouchEnd, { passive: true });
        this.el.addEventListener('touchmove', this._elTouchMove, { passive: true });
    }
    onIsDraggingChange() {
        if (this.isDragging) {
            // rect
            const originOffset = {
                x: this._dragStart.x,
                y: this._dragStart.y,
            };
            events.emit('nodeDragStart', this.el, this.position, originOffset);
        }
        else {
            events.emit('nodeDragStopped', this.el);
        }
    }
    onPositionChange() {
        // update transform
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
    // handle drag and drop positioning
    onPointerDown(e) {
        e.stopPropagation();
        this.isDragging = true;
        const loc = this.getEventLocation(e);
        // Get the current position of the node
        const nodeRect = this.el.getBoundingClientRect();
        // Get canvas bounding rect for pan/zoom calculations
        const contentEl = this.el.closest('.flowy-content');
        if (!contentEl)
            return;
        // const canvasRect = canvasEl.getBoundingClientRect();
        // Store the current canvas zoom level
        const zoomMatches = contentEl.style.transform.match(/scale\((\d+(?:\.\d+)?)\)/);
        this._canvasZoom = zoomMatches ? parseFloat(zoomMatches[1]) : 1;
        // Store the current canvas pan position
        const panMatches = contentEl.style.transform.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/);
        this._canvasPan = {
            x: panMatches ? parseInt(panMatches[1], 10) : 0,
            y: panMatches ? parseInt(panMatches[2], 10) : 0,
        };
        this._dragStart = {
            x: (loc.x - nodeRect.left) / this._canvasZoom,
            y: (loc.y - nodeRect.top) / this._canvasZoom,
        };
    }
    onPointerMove(e) {
        if (!this.isDragging)
            return;
        e.stopPropagation();
        const loc = this.getEventLocation(e);
        const newX = loc.x / this._canvasZoom - this._dragStart.x - this._canvasPan.x;
        const newY = loc.y / this._canvasZoom - this._dragStart.y - this._canvasPan.y;
        // Update the node's position
        this.position = {
            x: newX,
            y: newY,
        };
    }
    onPointerUp() {
        this.isDragging = false;
    }
    handleTouchStart(e) {
        e.preventDefault();
        this.onPointerDown(e);
    }
    handleTouchMove(e) {
        e.preventDefault();
        this.onPointerMove(e);
    }
    render() {
        return (h(Host, { key: '094b79ed9d8b0044a3191f730b470f64a823175f', class: "flowy-node" }, h("div", { key: 'da4de12559e23f703474c59f8eacab73a4e5163f', class: "flowy-node-header" }, this.title, h("slot", { key: '69633f6d3014bf852a79c05e0772826da3569f11', name: "header" })), h("slot", { key: '53aa35313fc584d7da12256684d594f4370352e0' }), h("div", { key: '030d1e03533ba278bd0352f2a365c50cd599fd17', class: "flowy-node-footer" })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "isDragging": ["onIsDraggingChange"],
        "position": ["onPositionChange"]
    }; }
};
LogicNode.style = logicNodeCss;

export { LogicNode as logic_node };

//# sourceMappingURL=logic-node.entry.js.map