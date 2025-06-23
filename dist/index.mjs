import { createConnectTransport } from '@connectrpc/connect-node';
import { fetchSubstream, createRegistry, createAuthInterceptor, createRequest, streamBlocks } from '@substreams/core';
import { Connection } from '@solana/web3.js';
import 'dotenv/config';

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/tslib@2.6.2/node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __addDisposableResource: () => __addDisposableResource,
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldIn: () => __classPrivateFieldIn,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __disposeResources: () => __disposeResources,
  __esDecorate: () => __esDecorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __propKey: () => __propKey,
  __read: () => __read,
  __rest: () => __rest,
  __runInitializers: () => __runInitializers,
  __setFunctionName: () => __setFunctionName,
  __spread: () => __spread,
  __spreadArray: () => __spreadArray,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values,
  default: () => tslib_es6_default
});
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env2, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env2.stack.push({ value, dispose, async });
  } else if (async) {
    env2.stack.push({ async: true });
  }
  return value;
}
function __disposeResources(env2) {
  function fail(e) {
    env2.error = env2.hasError ? new _SuppressedError(e, env2.error, "An error was suppressed during disposal.") : e;
    env2.hasError = true;
  }
  function next() {
    while (env2.stack.length) {
      var rec = env2.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) {
          fail(e);
          return next();
        });
      } catch (e) {
        fail(e);
      }
    }
    if (env2.hasError) throw env2.error;
  }
  return next();
}
var extendStatics, __assign, __createBinding, __setModuleDefault, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esm({
  "node_modules/.pnpm/tslib@2.6.2/node_modules/tslib/tslib.es6.mjs"() {
    extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    __createBinding = Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    };
    __setModuleDefault = Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    };
    _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    tslib_es6_default = {
      __extends,
      __assign,
      __rest,
      __decorate,
      __param,
      __metadata,
      __awaiter,
      __generator,
      __createBinding,
      __exportStar,
      __values,
      __read,
      __spread,
      __spreadArrays,
      __spreadArray,
      __await,
      __asyncGenerator,
      __asyncDelegator,
      __asyncValues,
      __makeTemplateObject,
      __importStar,
      __importDefault,
      __classPrivateFieldGet,
      __classPrivateFieldSet,
      __classPrivateFieldIn,
      __addDisposableResource,
      __disposeResources
    };
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/errors.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EnvMissingError = exports.EnvError = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var EnvError = (
      /** @class */
      function(_super) {
        tslib_1.__extends(EnvError2, _super);
        function EnvError2(message) {
          var _newTarget = this.constructor;
          var _this = _super.call(this, message) || this;
          Object.setPrototypeOf(_this, _newTarget.prototype);
          Error.captureStackTrace(_this, EnvError2);
          _this.name = _this.constructor.name;
          return _this;
        }
        return EnvError2;
      }(TypeError)
    );
    exports.EnvError = EnvError;
    var EnvMissingError = (
      /** @class */
      function(_super) {
        tslib_1.__extends(EnvMissingError2, _super);
        function EnvMissingError2(message) {
          var _newTarget = this.constructor;
          var _this = _super.call(this, message) || this;
          Object.setPrototypeOf(_this, _newTarget.prototype);
          Error.captureStackTrace(_this, EnvMissingError2);
          _this.name = _this.constructor.name;
          return _this;
        }
        return EnvMissingError2;
      }(ReferenceError)
    );
    exports.EnvMissingError = EnvMissingError;
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/reporter.js
var require_reporter = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/reporter.js"(exports) {
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultReporter = exports.envalidErrorFormatter = void 0;
    var errors_1 = require_errors();
    var defaultLogger = console.error.bind(console);
    var isNode = !!(typeof process === "object" && ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node));
    var colorWith = function(colorCode) {
      return function(str2) {
        return isNode ? "\x1B[".concat(colorCode, "m").concat(str2, "\x1B[0m") : str2;
      };
    };
    var colors = {
      blue: colorWith("34"),
      white: colorWith("37"),
      yellow: colorWith("33")
    };
    var RULE = colors.white("================================");
    var envalidErrorFormatter = function(errors, logger) {
      if (logger === void 0) {
        logger = defaultLogger;
      }
      var missingVarsOutput = [];
      var invalidVarsOutput = [];
      for (var _i = 0, _a2 = Object.entries(errors); _i < _a2.length; _i++) {
        var _b = _a2[_i], k = _b[0], err = _b[1];
        if (err instanceof errors_1.EnvMissingError) {
          missingVarsOutput.push("    ".concat(colors.blue(k), ": ").concat(err.message || "(required)"));
        } else
          invalidVarsOutput.push("    ".concat(colors.blue(k), ": ").concat((err === null || err === void 0 ? void 0 : err.message) || "(invalid format)"));
      }
      if (invalidVarsOutput.length) {
        invalidVarsOutput.unshift(" ".concat(colors.yellow("Invalid"), " environment variables:"));
      }
      if (missingVarsOutput.length) {
        missingVarsOutput.unshift(" ".concat(colors.yellow("Missing"), " environment variables:"));
      }
      var output = [
        RULE,
        invalidVarsOutput.sort().join("\n"),
        missingVarsOutput.sort().join("\n"),
        RULE
      ].filter(function(x) {
        return !!x;
      }).join("\n");
      logger(output);
    };
    exports.envalidErrorFormatter = envalidErrorFormatter;
    var defaultReporter = function(_a2, _b) {
      var _c = _a2.errors, errors = _c === void 0 ? {} : _c;
      var _d = _b === void 0 ? { logger: defaultLogger } : _b, onError = _d.onError, logger = _d.logger;
      if (!Object.keys(errors).length)
        return;
      (0, exports.envalidErrorFormatter)(errors, logger);
      if (onError) {
        onError(errors);
      } else if (isNode) {
        logger(colors.yellow("\n Exiting with error code 1"));
        process.exit(1);
      } else {
        throw new TypeError("Environment validation failed");
      }
    };
    exports.defaultReporter = defaultReporter;
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/core.js
var require_core = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/core.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSanitizedEnv = exports.testOnlySymbol = void 0;
    var errors_1 = require_errors();
    var reporter_1 = require_reporter();
    exports.testOnlySymbol = Symbol("envalid - test only");
    function validateVar(_a) {
      var spec = _a.spec, name = _a.name, rawValue = _a.rawValue;
      if (typeof spec._parse !== "function") {
        throw new errors_1.EnvError('Invalid spec for "'.concat(name, '"'));
      }
      var value = spec._parse(rawValue);
      if (spec.choices) {
        if (!Array.isArray(spec.choices)) {
          throw new TypeError('"choices" must be an array (in spec for "'.concat(name, '")'));
        } else if (!spec.choices.includes(value)) {
          throw new errors_1.EnvError('Value "'.concat(value, '" not in choices [').concat(spec.choices, "]"));
        }
      }
      if (value == null)
        throw new errors_1.EnvError('Invalid value for env var "'.concat(name, '"'));
      return value;
    }
    function formatSpecDescription(spec) {
      var egText = spec.example ? ' (eg. "'.concat(spec.example, '")') : "";
      var docsText = spec.docs ? ". See ".concat(spec.docs) : "";
      return "".concat(spec.desc).concat(egText).concat(docsText);
    }
    var readRawEnvValue = function(env2, k) {
      return env2[k];
    };
    var isTestOnlySymbol = function(value) {
      return value === exports.testOnlySymbol;
    };
    function getSanitizedEnv(environment, specs, options) {
      if (options === void 0) {
        options = {};
      }
      var cleanedEnv = {};
      var castedSpecs = specs;
      var errors = {};
      var varKeys = Object.keys(castedSpecs);
      var rawNodeEnv = readRawEnvValue(environment, "NODE_ENV");
      for (var _i = 0, varKeys_1 = varKeys; _i < varKeys_1.length; _i++) {
        var k = varKeys_1[_i];
        var spec = castedSpecs[k];
        var rawValue = readRawEnvValue(environment, k);
        if (rawValue === void 0) {
          var usingDevDefault = rawNodeEnv && rawNodeEnv !== "production" && spec.hasOwnProperty("devDefault");
          if (usingDevDefault) {
            cleanedEnv[k] = spec.devDefault;
            if (isTestOnlySymbol(spec.devDefault) && rawNodeEnv != "test") {
              throw new errors_1.EnvMissingError(formatSpecDescription(spec));
            }
            continue;
          }
          if ("default" in spec) {
            cleanedEnv[k] = spec.default;
            continue;
          }
        }
        try {
          if (rawValue === void 0) {
            cleanedEnv[k] = void 0;
            throw new errors_1.EnvMissingError(formatSpecDescription(spec));
          } else {
            cleanedEnv[k] = validateVar({ name: k, spec, rawValue });
          }
        } catch (err) {
          if ((options === null || options === void 0 ? void 0 : options.reporter) === null)
            throw err;
          if (err instanceof Error)
            errors[k] = err;
        }
      }
      var reporter = (options === null || options === void 0 ? void 0 : options.reporter) || reporter_1.defaultReporter;
      reporter({ errors, env: cleanedEnv });
      return cleanedEnv;
    }
    exports.getSanitizedEnv = getSanitizedEnv;
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/middleware.js
var require_middleware = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/middleware.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyDefaultMiddleware = exports.accessorMiddleware = exports.strictProxyMiddleware = void 0;
    var strictProxyMiddleware = function(envObj, rawEnv, options) {
      if (options === void 0) {
        options = {};
      }
      var _a = options.extraInspectables, extraInspectables = _a === void 0 ? [] : _a;
      var inspectables = [
        "length",
        "inspect",
        "hasOwnProperty",
        "toJSON",
        Symbol.toStringTag,
        Symbol.iterator,
        // For jest
        "asymmetricMatch",
        "nodeType",
        // For react-refresh, see #150
        "$$typeof",
        // For libs that use `then` checks to see if objects are Promises (see #74):
        "then",
        // For usage with TypeScript esModuleInterop flag
        "__esModule"
      ];
      var inspectSymbolStrings = ["Symbol(util.inspect.custom)", "Symbol(nodejs.util.inspect.custom)"];
      return new Proxy(envObj, {
        get: function(target, name) {
          var _a2;
          if (inspectables.includes(name) || inspectSymbolStrings.includes(name.toString()) || extraInspectables.includes(name)) {
            return target[name];
          }
          var varExists = target.hasOwnProperty(name);
          if (!varExists) {
            if (typeof rawEnv === "object" && ((_a2 = rawEnv === null || rawEnv === void 0 ? void 0 : rawEnv.hasOwnProperty) === null || _a2 === void 0 ? void 0 : _a2.call(rawEnv, name))) {
              throw new ReferenceError("[envalid] Env var ".concat(name, " was accessed but not validated. This var is set in the environment; please add an envalid validator for it."));
            }
            throw new ReferenceError("[envalid] Env var not found: ".concat(name));
          }
          return target[name];
        },
        set: function(_target, name) {
          throw new TypeError("[envalid] Attempt to mutate environment value: ".concat(name));
        }
      });
    };
    exports.strictProxyMiddleware = strictProxyMiddleware;
    var accessorMiddleware = function(envObj, rawEnv) {
      var computedNodeEnv = envObj.NODE_ENV || rawEnv.NODE_ENV;
      var isProd = !computedNodeEnv || computedNodeEnv === "production";
      Object.defineProperties(envObj, {
        isDevelopment: { value: computedNodeEnv === "development" },
        isDev: { value: computedNodeEnv === "development" },
        isProduction: { value: isProd },
        isProd: { value: isProd },
        isTest: { value: computedNodeEnv === "test" }
      });
      return envObj;
    };
    exports.accessorMiddleware = accessorMiddleware;
    var applyDefaultMiddleware = function(cleanedEnv, rawEnv) {
      return (0, exports.strictProxyMiddleware)((0, exports.accessorMiddleware)(cleanedEnv, rawEnv), rawEnv);
    };
    exports.applyDefaultMiddleware = applyDefaultMiddleware;
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/envalid.js
var require_envalid = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/envalid.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testOnly = exports.customCleanEnv = exports.cleanEnv = void 0;
    var core_1 = require_core();
    var middleware_1 = require_middleware();
    function cleanEnv2(environment, specs, options) {
      if (options === void 0) {
        options = {};
      }
      var cleaned = (0, core_1.getSanitizedEnv)(environment, specs, options);
      return Object.freeze((0, middleware_1.applyDefaultMiddleware)(cleaned, environment));
    }
    exports.cleanEnv = cleanEnv2;
    function customCleanEnv(environment, specs, applyMiddleware, options) {
      if (options === void 0) {
        options = {};
      }
      var cleaned = (0, core_1.getSanitizedEnv)(environment, specs, options);
      return Object.freeze(applyMiddleware(cleaned, environment));
    }
    exports.customCleanEnv = customCleanEnv;
    var testOnly = function(defaultValueForTests) {
      return process.env.NODE_ENV === "test" ? defaultValueForTests : core_1.testOnlySymbol;
    };
    exports.testOnly = testOnly;
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/types.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/makers.js
var require_makers = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/makers.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeStructuredValidator = exports.makeExactValidator = exports.makeValidator = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var internalMakeValidator = function(parseFn) {
      return function(spec) {
        return tslib_1.__assign(tslib_1.__assign({}, spec), { _parse: parseFn });
      };
    };
    var makeValidator = function(parseFn) {
      return internalMakeValidator(parseFn);
    };
    exports.makeValidator = makeValidator;
    var makeExactValidator = function(parseFn) {
      return internalMakeValidator(parseFn);
    };
    exports.makeExactValidator = makeExactValidator;
    var makeStructuredValidator = function(parseFn) {
      return internalMakeValidator(parseFn);
    };
    exports.makeStructuredValidator = makeStructuredValidator;
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/validators.js
var require_validators = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/validators.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.json = exports.url = exports.port = exports.host = exports.email = exports.str = exports.num = exports.bool = void 0;
    var errors_1 = require_errors();
    var makers_1 = require_makers();
    var isFQDN = function(input) {
      if (!input.length)
        return false;
      var parts = input.split(".");
      for (var part = void 0, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part))
          return false;
        if (/[\uff01-\uff5e]/.test(part))
          return false;
        if (part[0] === "-" || part[part.length - 1] === "-")
          return false;
      }
      return true;
    };
    var ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    var ipv6Regex = /([a-f0-9]+:+)+[a-f0-9]+/;
    var isIP = function(input) {
      if (!input.length)
        return false;
      return ipv4Regex.test(input) || ipv6Regex.test(input);
    };
    var EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    exports.bool = (0, makers_1.makeExactValidator)(function(input) {
      switch (input) {
        case true:
        case "true":
        case "t":
        case "1":
          return true;
        case false:
        case "false":
        case "f":
        case "0":
          return false;
        default:
          throw new errors_1.EnvError('Invalid bool input: "'.concat(input, '"'));
      }
    });
    exports.num = (0, makers_1.makeValidator)(function(input) {
      var coerced = parseFloat(input);
      if (Number.isNaN(coerced))
        throw new errors_1.EnvError('Invalid number input: "'.concat(input, '"'));
      return coerced;
    });
    exports.str = (0, makers_1.makeValidator)(function(input) {
      if (typeof input === "string")
        return input;
      throw new errors_1.EnvError('Not a string: "'.concat(input, '"'));
    });
    exports.email = (0, makers_1.makeValidator)(function(x) {
      if (EMAIL_REGEX.test(x))
        return x;
      throw new errors_1.EnvError('Invalid email address: "'.concat(x, '"'));
    });
    exports.host = (0, makers_1.makeValidator)(function(input) {
      if (!isFQDN(input) && !isIP(input)) {
        throw new errors_1.EnvError('Invalid host (domain or ip): "'.concat(input, '"'));
      }
      return input;
    });
    exports.port = (0, makers_1.makeValidator)(function(input) {
      var coerced = +input;
      if (Number.isNaN(coerced) || "".concat(coerced) !== "".concat(input) || coerced % 1 !== 0 || coerced < 1 || coerced > 65535) {
        throw new errors_1.EnvError('Invalid port input: "'.concat(input, '"'));
      }
      return coerced;
    });
    exports.url = (0, makers_1.makeValidator)(function(x) {
      try {
        new URL(x);
        return x;
      } catch (e) {
        throw new errors_1.EnvError('Invalid url: "'.concat(x, '"'));
      }
    });
    exports.json = (0, makers_1.makeStructuredValidator)(function(x) {
      try {
        return JSON.parse(x);
      } catch (e) {
        throw new errors_1.EnvError('Invalid json: "'.concat(x, '"'));
      }
    });
  }
});

// node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/envalid@8.0.0/node_modules/envalid/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeValidator = exports.makeExactValidator = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_envalid(), exports);
    tslib_1.__exportStar(require_errors(), exports);
    tslib_1.__exportStar(require_middleware(), exports);
    tslib_1.__exportStar(require_types(), exports);
    tslib_1.__exportStar(require_validators(), exports);
    tslib_1.__exportStar(require_reporter(), exports);
    var makers_1 = require_makers();
    Object.defineProperty(exports, "makeExactValidator", { enumerable: true, get: function() {
      return makers_1.makeExactValidator;
    } });
    Object.defineProperty(exports, "makeValidator", { enumerable: true, get: function() {
      return makers_1.makeValidator;
    } });
  }
});

// src/config.ts
var import_envalid = __toESM(require_dist());
var env = (0, import_envalid.cleanEnv)(process.env, {
  STREAMING_FAST_TOKEN: (0, import_envalid.str)(),
  RPC_URL: (0, import_envalid.url)(),
  DATABASE_URL: (0, import_envalid.url)(),
  START_BLOCK: (0, import_envalid.num)({
    default: -1
  }),
  STOP_BLOCK: (0, import_envalid.num)({
    default: -1
  })
});

// src/index.ts
new Connection(env.RPC_URL);
var TOKEN = env.STREAMING_FAST_TOKEN;
var ENDPOINT = "https://mainnet.sol.streamingfast.io:443";
var SPKG = "https://github.com/cleopetrafun/spkgs/raw/refs/heads/main/meteora-dlmm-v1-0-1-v1.0.1.spkg";
var MODULE = "map_block";
var processBatch = async (pkg, transport, registry, start, stop) => {
  console.log(`processing blocks from ${start} to ${stop}`);
  const request = createRequest({
    substreamPackage: pkg,
    outputModule: MODULE,
    productionMode: true,
    startBlockNum: start,
    stopBlockNum: stop
  });
  for await (const response of streamBlocks(transport, request)) {
    if (response.message.case === "blockScopedData") {
      const block = response.message.value;
      if (block.output) {
        console.log(block.output.mapOutput);
      }
    }
  }
};
var main = async () => {
  const pkg = await fetchSubstream(SPKG);
  if (!pkg.modules) {
    console.log(
      "the given substream package doesn't have any modules. exiting..."
    );
    return;
  }
  const registry = createRegistry(pkg);
  const transport = createConnectTransport({
    httpVersion: "2",
    baseUrl: ENDPOINT,
    interceptors: [createAuthInterceptor(TOKEN)],
    useBinaryFormat: true,
    jsonOptions: { typeRegistry: registry }
  });
  let start = env.START_BLOCK;
  let stop = env.STOP_BLOCK;
  await processBatch(pkg, transport, registry, start, stop);
};
main();
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map