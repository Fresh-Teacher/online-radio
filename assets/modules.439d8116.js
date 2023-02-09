var W0 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};

function af(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}
const et = new WeakMap,
    ni = new WeakMap,
    qn = new WeakMap,
    el = Symbol("anyProducer"),
    la = Promise.resolve(),
    yi = Symbol("listenerAdded"),
    wi = Symbol("listenerRemoved");
let yo = !1;

function Gt(e) {
    if (typeof e != "string" && typeof e != "symbol") throw new TypeError("eventName must be a string or a symbol")
}

function zr(e) {
    if (typeof e != "function") throw new TypeError("listener must be a function")
}

function Ht(e, t) {
    const n = ni.get(e);
    return n.has(t) || n.set(t, new Set), n.get(t)
}

function Zn(e, t) {
    const n = typeof t == "string" || typeof t == "symbol" ? t : el,
        r = qn.get(e);
    return r.has(n) || r.set(n, new Set), r.get(n)
}

function Ad(e, t, n) {
    const r = qn.get(e);
    if (r.has(t))
        for (const o of r.get(t)) o.enqueue(n);
    if (r.has(el)) {
        const o = Promise.all([t, n]);
        for (const i of r.get(el)) i.enqueue(o)
    }
}

function ua(e, t) {
    t = Array.isArray(t) ? t : [t];
    let n = !1,
        r = () => {},
        o = [];
    const i = {
        enqueue(l) {
            o.push(l), r()
        },
        finish() {
            n = !0, r()
        }
    };
    for (const l of t) Zn(e, l).add(i);
    return {
        async next() {
            return o ? o.length === 0 ? n ? (o = void 0, this.next()) : (await new Promise(l => {
                r = l
            }), this.next()) : {
                done: !1,
                value: await o.shift()
            } : {
                done: !0
            }
        },
        async
        return (l) {
            o = void 0;
            for (const u of t) Zn(e, u).delete(i);
            return r(), arguments.length > 0 ? {
                done: !0,
                value: await l
            } : {
                done: !0
            }
        },
        [Symbol.asyncIterator]() {
            return this
        }
    }
}

function aa(e) {
    if (e === void 0) return sa;
    if (!Array.isArray(e)) throw new TypeError("`methodNames` must be an array of strings");
    for (const t of e)
        if (!sa.includes(t)) throw typeof t != "string" ? new TypeError("`methodNames` element must be a string") : new Error(`${t} is not Emittery method`);
    return e
}
const wo = e => e === yi || e === wi;
class Lt {
    static mixin(t, n) {
        return n = aa(n), r => {
            if (typeof r != "function") throw new TypeError("`target` must be function");
            for (const l of n)
                if (r.prototype[l] !== void 0) throw new Error(`The property \`${l}\` already exists on \`target\``);

            function o() {
                return Object.defineProperty(this, t, {
                    enumerable: !1,
                    value: new Lt
                }), this[t]
            }
            Object.defineProperty(r.prototype, t, {
                enumerable: !1,
                get: o
            });
            const i = l => function(...u) {
                return this[t][l](...u)
            };
            for (const l of n) Object.defineProperty(r.prototype, l, {
                enumerable: !1,
                value: i(l)
            });
            return r
        }
    }
    static get isDebugEnabled() {
        if (typeof process != "object") return yo;
        const {
            env: t
        } = process || {
            env: {}
        };
        return t.DEBUG === "emittery" || t.DEBUG === "*" || yo
    }
    static set isDebugEnabled(t) {
        yo = t
    }
    constructor(t = {}) {
        et.set(this, new Set), ni.set(this, new Map), qn.set(this, new Map), this.debug = t.debug || {}, this.debug.enabled === void 0 && (this.debug.enabled = !1), this.debug.logger || (this.debug.logger = (n, r, o, i) => {
            try {
                i = JSON.stringify(i)
            } catch {
                i = `Object with the following keys failed to stringify: ${Object.keys(i).join(",")}`
            }
            typeof o == "symbol" && (o = o.toString());
            const l = new Date,
                u = `${l.getHours()}:${l.getMinutes()}:${l.getSeconds()}.${l.getMilliseconds()}`;
            console.log(`[${u}][emittery:${n}][${r}] Event Name: ${o}
	data: ${i}`)
        })
    }
    logIfDebugEnabled(t, n, r) {
        (Lt.isDebugEnabled || this.debug.enabled) && this.debug.logger(t, this.debug.name, n, r)
    }
    on(t, n) {
        zr(n), t = Array.isArray(t) ? t : [t];
        for (const r of t) Gt(r), Ht(this, r).add(n), this.logIfDebugEnabled("subscribe", r, void 0), wo(r) || this.emit(yi, {
            eventName: r,
            listener: n
        });
        return this.off.bind(this, t, n)
    }
    off(t, n) {
        zr(n), t = Array.isArray(t) ? t : [t];
        for (const r of t) Gt(r), Ht(this, r).delete(n), this.logIfDebugEnabled("unsubscribe", r, void 0), wo(r) || this.emit(wi, {
            eventName: r,
            listener: n
        })
    }
    once(t) {
        return new Promise(n => {
            const r = this.on(t, o => {
                r(), n(o)
            })
        })
    }
    events(t) {
        t = Array.isArray(t) ? t : [t];
        for (const n of t) Gt(n);
        return ua(this, t)
    }
    async emit(t, n) {
        Gt(t), this.logIfDebugEnabled("emit", t, n), Ad(this, t, n);
        const r = Ht(this, t),
            o = et.get(this),
            i = [...r],
            l = wo(t) ? [] : [...o];
        await la, await Promise.all([...i.map(async u => {
            if (r.has(u)) return u(n)
        }), ...l.map(async u => {
            if (o.has(u)) return u(t, n)
        })])
    }
    async emitSerial(t, n) {
        Gt(t), this.logIfDebugEnabled("emitSerial", t, n);
        const r = Ht(this, t),
            o = et.get(this),
            i = [...r],
            l = [...o];
        await la;
        for (const u of i) r.has(u) && await u(n);
        for (const u of l) o.has(u) && await u(t, n)
    }
    onAny(t) {
        return zr(t), this.logIfDebugEnabled("subscribeAny", void 0, void 0), et.get(this).add(t), this.emit(yi, {
            listener: t
        }), this.offAny.bind(this, t)
    }
    anyEvent() {
        return ua(this)
    }
    offAny(t) {
        zr(t), this.logIfDebugEnabled("unsubscribeAny", void 0, void 0), this.emit(wi, {
            listener: t
        }), et.get(this).delete(t)
    }
    clearListeners(t) {
        t = Array.isArray(t) ? t : [t];
        for (const n of t)
            if (this.logIfDebugEnabled("clear", n, void 0), typeof n == "string" || typeof n == "symbol") {
                Ht(this, n).clear();
                const r = Zn(this, n);
                for (const o of r) o.finish();
                r.clear()
            } else {
                et.get(this).clear();
                for (const r of ni.get(this).values()) r.clear();
                for (const r of qn.get(this).values()) {
                    for (const o of r) o.finish();
                    r.clear()
                }
            }
    }
    listenerCount(t) {
        t = Array.isArray(t) ? t : [t];
        let n = 0;
        for (const r of t) {
            if (typeof r == "string") {
                n += et.get(this).size + Ht(this, r).size + Zn(this, r).size + Zn(this).size;
                continue
            }
            typeof r < "u" && Gt(r), n += et.get(this).size;
            for (const o of ni.get(this).values()) n += o.size;
            for (const o of qn.get(this).values()) n += o.size
        }
        return n
    }
    bindMethods(t, n) {
        if (typeof t != "object" || t === null) throw new TypeError("`target` must be an object");
        n = aa(n);
        for (const r of n) {
            if (t[r] !== void 0) throw new Error(`The property \`${r}\` already exists on \`target\``);
            Object.defineProperty(t, r, {
                enumerable: !1,
                value: this[r].bind(this)
            })
        }
    }
}
const sa = Object.getOwnPropertyNames(Lt.prototype).filter(e => e !== "constructor");
Object.defineProperty(Lt, "listenerAdded", {
    value: yi,
    writable: !1,
    enumerable: !0,
    configurable: !1
});
Object.defineProperty(Lt, "listenerRemoved", {
    value: wi,
    writable: !1,
    enumerable: !0,
    configurable: !1
});
var Id = Lt;
const G0 = Id;
var $ = {
        exports: {}
    },
    N = {},
    fa = Object.getOwnPropertySymbols,
    Nd = Object.prototype.hasOwnProperty,
    $d = Object.prototype.propertyIsEnumerable;

function Fd(e) {
    if (e == null) throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(e)
}

function zd() {
    try {
        if (!Object.assign) return !1;
        var e = new String("abc");
        if (e[5] = "de", Object.getOwnPropertyNames(e)[0] === "5") return !1;
        for (var t = {}, n = 0; n < 10; n++) t["_" + String.fromCharCode(n)] = n;
        var r = Object.getOwnPropertyNames(t).map(function(i) {
            return t[i]
        });
        if (r.join("") !== "0123456789") return !1;
        var o = {};
        return "abcdefghijklmnopqrst".split("").forEach(function(i) {
            o[i] = i
        }), Object.keys(Object.assign({}, o)).join("") === "abcdefghijklmnopqrst"
    } catch {
        return !1
    }
}
var sf = zd() ? Object.assign : function(e, t) {
        for (var n, r = Fd(e), o, i = 1; i < arguments.length; i++) {
            n = Object(arguments[i]);
            for (var l in n) Nd.call(n, l) && (r[l] = n[l]);
            if (fa) {
                o = fa(n);
                for (var u = 0; u < o.length; u++) $d.call(n, o[u]) && (r[o[u]] = n[o[u]])
            }
        }
        return r
    },
    Yl = sf,
    kn = 60103,
    ff = 60106;
N.Fragment = 60107;
N.StrictMode = 60108;
N.Profiler = 60114;
var cf = 60109,
    df = 60110,
    pf = 60112;
N.Suspense = 60113;
var hf = 60115,
    mf = 60116;
if (typeof Symbol == "function" && Symbol.for) {
    var Le = Symbol.for;
    kn = Le("react.element"), ff = Le("react.portal"), N.Fragment = Le("react.fragment"), N.StrictMode = Le("react.strict_mode"), N.Profiler = Le("react.profiler"), cf = Le("react.provider"), df = Le("react.context"), pf = Le("react.forward_ref"), N.Suspense = Le("react.suspense"), hf = Le("react.memo"), mf = Le("react.lazy")
}
var ca = typeof Symbol == "function" && Symbol.iterator;

function Vd(e) {
    return e === null || typeof e != "object" ? null : (e = ca && e[ca] || e["@@iterator"], typeof e == "function" ? e : null)
}

function Dr(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
}
var vf = {
        isMounted: function() {
            return !1
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    },
    gf = {};

function _n(e, t, n) {
    this.props = e, this.context = t, this.refs = gf, this.updater = n || vf
}
_n.prototype.isReactComponent = {};
_n.prototype.setState = function(e, t) {
    if (typeof e != "object" && typeof e != "function" && e != null) throw Error(Dr(85));
    this.updater.enqueueSetState(this, e, t, "setState")
};
_n.prototype.forceUpdate = function(e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate")
};

function yf() {}
yf.prototype = _n.prototype;

function Xl(e, t, n) {
    this.props = e, this.context = t, this.refs = gf, this.updater = n || vf
}
var ql = Xl.prototype = new yf;
ql.constructor = Xl;
Yl(ql, _n.prototype);
ql.isPureReactComponent = !0;
var Zl = {
        current: null
    },
    wf = Object.prototype.hasOwnProperty,
    Sf = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };

function Ef(e, t, n) {
    var r, o = {},
        i = null,
        l = null;
    if (t != null)
        for (r in t.ref !== void 0 && (l = t.ref), t.key !== void 0 && (i = "" + t.key), t) wf.call(t, r) && !Sf.hasOwnProperty(r) && (o[r] = t[r]);
    var u = arguments.length - 2;
    if (u === 1) o.children = n;
    else if (1 < u) {
        for (var a = Array(u), s = 0; s < u; s++) a[s] = arguments[s + 2];
        o.children = a
    }
    if (e && e.defaultProps)
        for (r in u = e.defaultProps, u) o[r] === void 0 && (o[r] = u[r]);
    return {
        $$typeof: kn,
        type: e,
        key: i,
        ref: l,
        props: o,
        _owner: Zl.current
    }
}

function bd(e, t) {
    return {
        $$typeof: kn,
        type: e.type,
        key: t,
        ref: e.ref,
        props: e.props,
        _owner: e._owner
    }
}

function Jl(e) {
    return typeof e == "object" && e !== null && e.$$typeof === kn
}

function Ud(e) {
    var t = {
        "=": "=0",
        ":": "=2"
    };
    return "$" + e.replace(/[=:]/g, function(n) {
        return t[n]
    })
}
var da = /\/+/g;

function So(e, t) {
    return typeof e == "object" && e !== null && e.key != null ? Ud("" + e.key) : t.toString(36)
}

function ri(e, t, n, r, o) {
    var i = typeof e;
    (i === "undefined" || i === "boolean") && (e = null);
    var l = !1;
    if (e === null) l = !0;
    else switch (i) {
        case "string":
        case "number":
            l = !0;
            break;
        case "object":
            switch (e.$$typeof) {
                case kn:
                case ff:
                    l = !0
            }
    }
    if (l) return l = e, o = o(l), e = r === "" ? "." + So(l, 0) : r, Array.isArray(o) ? (n = "", e != null && (n = e.replace(da, "$&/") + "/"), ri(o, t, n, "", function(s) {
        return s
    })) : o != null && (Jl(o) && (o = bd(o, n + (!o.key || l && l.key === o.key ? "" : ("" + o.key).replace(da, "$&/") + "/") + e)), t.push(o)), 1;
    if (l = 0, r = r === "" ? "." : r + ":", Array.isArray(e))
        for (var u = 0; u < e.length; u++) {
            i = e[u];
            var a = r + So(i, u);
            l += ri(i, t, n, a, o)
        } else if (a = Vd(e), typeof a == "function")
            for (e = a.call(e), u = 0; !(i = e.next()).done;) i = i.value, a = r + So(i, u++), l += ri(i, t, n, a, o);
        else if (i === "object") throw t = "" + e, Error(Dr(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
    return l
}

function Vr(e, t, n) {
    if (e == null) return e;
    var r = [],
        o = 0;
    return ri(e, r, "", "", function(i) {
        return t.call(n, i, o++)
    }), r
}

function Bd(e) {
    if (e._status === -1) {
        var t = e._result;
        t = t(), e._status = 0, e._result = t, t.then(function(n) {
            e._status === 0 && (n = n.default, e._status = 1, e._result = n)
        }, function(n) {
            e._status === 0 && (e._status = 2, e._result = n)
        })
    }
    if (e._status === 1) return e._result;
    throw e._result
}
var xf = {
    current: null
};

function Je() {
    var e = xf.current;
    if (e === null) throw Error(Dr(321));
    return e
}
var Wd = {
    ReactCurrentDispatcher: xf,
    ReactCurrentBatchConfig: {
        transition: 0
    },
    ReactCurrentOwner: Zl,
    IsSomeRendererActing: {
        current: !1
    },
    assign: Yl
};
N.Children = {
    map: Vr,
    forEach: function(e, t, n) {
        Vr(e, function() {
            t.apply(this, arguments)
        }, n)
    },
    count: function(e) {
        var t = 0;
        return Vr(e, function() {
            t++
        }), t
    },
    toArray: function(e) {
        return Vr(e, function(t) {
            return t
        }) || []
    },
    only: function(e) {
        if (!Jl(e)) throw Error(Dr(143));
        return e
    }
};
N.Component = _n;
N.PureComponent = Xl;
N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Wd;
N.cloneElement = function(e, t, n) {
    if (e == null) throw Error(Dr(267, e));
    var r = Yl({}, e.props),
        o = e.key,
        i = e.ref,
        l = e._owner;
    if (t != null) {
        if (t.ref !== void 0 && (i = t.ref, l = Zl.current), t.key !== void 0 && (o = "" + t.key), e.type && e.type.defaultProps) var u = e.type.defaultProps;
        for (a in t) wf.call(t, a) && !Sf.hasOwnProperty(a) && (r[a] = t[a] === void 0 && u !== void 0 ? u[a] : t[a])
    }
    var a = arguments.length - 2;
    if (a === 1) r.children = n;
    else if (1 < a) {
        u = Array(a);
        for (var s = 0; s < a; s++) u[s] = arguments[s + 2];
        r.children = u
    }
    return {
        $$typeof: kn,
        type: e.type,
        key: o,
        ref: i,
        props: r,
        _owner: l
    }
};
N.createContext = function(e, t) {
    return t === void 0 && (t = null), e = {
        $$typeof: df,
        _calculateChangedBits: t,
        _currentValue: e,
        _currentValue2: e,
        _threadCount: 0,
        Provider: null,
        Consumer: null
    }, e.Provider = {
        $$typeof: cf,
        _context: e
    }, e.Consumer = e
};
N.createElement = Ef;
N.createFactory = function(e) {
    var t = Ef.bind(null, e);
    return t.type = e, t
};
N.createRef = function() {
    return {
        current: null
    }
};
N.forwardRef = function(e) {
    return {
        $$typeof: pf,
        render: e
    }
};
N.isValidElement = Jl;
N.lazy = function(e) {
    return {
        $$typeof: mf,
        _payload: {
            _status: -1,
            _result: e
        },
        _init: Bd
    }
};
N.memo = function(e, t) {
    return {
        $$typeof: hf,
        type: e,
        compare: t === void 0 ? null : t
    }
};
N.useCallback = function(e, t) {
    return Je().useCallback(e, t)
};
N.useContext = function(e, t) {
    return Je().useContext(e, t)
};
N.useDebugValue = function() {};
N.useEffect = function(e, t) {
    return Je().useEffect(e, t)
};
N.useImperativeHandle = function(e, t, n) {
    return Je().useImperativeHandle(e, t, n)
};
N.useLayoutEffect = function(e, t) {
    return Je().useLayoutEffect(e, t)
};
N.useMemo = function(e, t) {
    return Je().useMemo(e, t)
};
N.useReducer = function(e, t, n) {
    return Je().useReducer(e, t, n)
};
N.useRef = function(e) {
    return Je().useRef(e)
};
N.useState = function(e) {
    return Je().useState(e)
};
N.version = "17.0.2";
(function(e) {
    e.exports = N
})($);
const Si = af($.exports);

function Ie(e) {
    for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
    throw Error("[Immer] minified error nr: " + e + (n.length ? " " + n.map(function(o) {
        return "'" + o + "'"
    }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf")
}

function vn(e) {
    return !!e && !!e[ke]
}

function At(e) {
    return !!e && (function(t) {
        if (!t || typeof t != "object") return !1;
        var n = Object.getPrototypeOf(t);
        if (n === null) return !0;
        var r = Object.hasOwnProperty.call(n, "constructor") && n.constructor;
        return r === Object || typeof r == "function" && Function.toString.call(r) === Zd
    }(e) || Array.isArray(e) || !!e[Sa] || !!e.constructor[Sa] || eu(e) || tu(e))
}

function pr(e, t, n) {
    n === void 0 && (n = !1), Pn(e) === 0 ? (n ? Object.keys : lu)(e).forEach(function(r) {
        n && typeof r == "symbol" || t(r, e[r], e)
    }) : e.forEach(function(r, o) {
        return t(o, r, e)
    })
}

function Pn(e) {
    var t = e[ke];
    return t ? t.i > 3 ? t.i - 4 : t.i : Array.isArray(e) ? 1 : eu(e) ? 2 : tu(e) ? 3 : 0
}

function tl(e, t) {
    return Pn(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t)
}

function Gd(e, t) {
    return Pn(e) === 2 ? e.get(t) : e[t]
}

function kf(e, t, n) {
    var r = Pn(e);
    r === 2 ? e.set(t, n) : r === 3 ? (e.delete(t), e.add(n)) : e[t] = n
}

function Hd(e, t) {
    return e === t ? e !== 0 || 1 / e == 1 / t : e != e && t != t
}

function eu(e) {
    return Xd && e instanceof Map
}

function tu(e) {
    return qd && e instanceof Set
}

function _t(e) {
    return e.o || e.t
}

function nu(e) {
    if (Array.isArray(e)) return Array.prototype.slice.call(e);
    var t = Jd(e);
    delete t[ke];
    for (var n = lu(t), r = 0; r < n.length; r++) {
        var o = n[r],
            i = t[o];
        i.writable === !1 && (i.writable = !0, i.configurable = !0), (i.get || i.set) && (t[o] = {
            configurable: !0,
            writable: !0,
            enumerable: i.enumerable,
            value: e[o]
        })
    }
    return Object.create(Object.getPrototypeOf(e), t)
}

function ru(e, t) {
    return t === void 0 && (t = !1), iu(e) || vn(e) || !At(e) || (Pn(e) > 1 && (e.set = e.add = e.clear = e.delete = Kd), Object.freeze(e), t && pr(e, function(n, r) {
        return ru(r, !0)
    }, !0)), e
}

function Kd() {
    Ie(2)
}

function iu(e) {
    return e == null || typeof e != "object" || Object.isFrozen(e)
}

function Xe(e) {
    var t = ep[e];
    return t || Ie(18, e), t
}

function pa() {
    return hr
}

function Eo(e, t) {
    t && (Xe("Patches"), e.u = [], e.s = [], e.v = t)
}

function Ei(e) {
    nl(e), e.p.forEach(Qd), e.p = null
}

function nl(e) {
    e === hr && (hr = e.l)
}

function ha(e) {
    return hr = {
        p: [],
        l: hr,
        h: e,
        m: !0,
        _: 0
    }
}

function Qd(e) {
    var t = e[ke];
    t.i === 0 || t.i === 1 ? t.j() : t.O = !0
}

function xo(e, t) {
    t._ = t.p.length;
    var n = t.p[0],
        r = e !== void 0 && e !== n;
    return t.h.g || Xe("ES5").S(t, e, r), r ? (n[ke].P && (Ei(t), Ie(4)), At(e) && (e = xi(t, e), t.l || ki(t, e)), t.u && Xe("Patches").M(n[ke], e, t.u, t.s)) : e = xi(t, n, []), Ei(t), t.u && t.v(t.u, t.s), e !== _f ? e : void 0
}

function xi(e, t, n) {
    if (iu(t)) return t;
    var r = t[ke];
    if (!r) return pr(t, function(i, l) {
        return ma(e, r, t, i, l, n)
    }, !0), t;
    if (r.A !== e) return t;
    if (!r.P) return ki(e, r.t, !0), r.t;
    if (!r.I) {
        r.I = !0, r.A._--;
        var o = r.i === 4 || r.i === 5 ? r.o = nu(r.k) : r.o;
        pr(r.i === 3 ? new Set(o) : o, function(i, l) {
            return ma(e, r, o, i, l, n)
        }), ki(e, o, !1), n && e.u && Xe("Patches").R(r, n, e.u, e.s)
    }
    return r.o
}

function ma(e, t, n, r, o, i) {
    if (vn(o)) {
        var l = xi(e, o, i && t && t.i !== 3 && !tl(t.D, r) ? i.concat(r) : void 0);
        if (kf(n, r, l), !vn(l)) return;
        e.m = !1
    }
    if (At(o) && !iu(o)) {
        if (!e.h.F && e._ < 1) return;
        xi(e, o), t && t.A.l || ki(e, o)
    }
}

function ki(e, t, n) {
    n === void 0 && (n = !1), e.h.F && e.m && ru(t, n)
}

function ko(e, t) {
    var n = e[ke];
    return (n ? _t(n) : e)[t]
}

function va(e, t) {
    if (t in e)
        for (var n = Object.getPrototypeOf(e); n;) {
            var r = Object.getOwnPropertyDescriptor(n, t);
            if (r) return r;
            n = Object.getPrototypeOf(n)
        }
}

function rl(e) {
    e.P || (e.P = !0, e.l && rl(e.l))
}

function _o(e) {
    e.o || (e.o = nu(e.t))
}

function il(e, t, n) {
    var r = eu(t) ? Xe("MapSet").N(t, n) : tu(t) ? Xe("MapSet").T(t, n) : e.g ? function(o, i) {
        var l = Array.isArray(o),
            u = {
                i: l ? 1 : 0,
                A: i ? i.A : pa(),
                P: !1,
                I: !1,
                D: {},
                l: i,
                t: o,
                k: null,
                o: null,
                j: null,
                C: !1
            },
            a = u,
            s = ii;
        l && (a = [u], s = oi);
        var c = Proxy.revocable(a, s),
            m = c.revoke,
            h = c.proxy;
        return u.k = h, u.j = m, h
    }(t, n) : Xe("ES5").J(t, n);
    return (n ? n.A : pa()).p.push(r), r
}

function Yd(e) {
    return vn(e) || Ie(22, e),
        function t(n) {
            if (!At(n)) return n;
            var r, o = n[ke],
                i = Pn(n);
            if (o) {
                if (!o.P && (o.i < 4 || !Xe("ES5").K(o))) return o.t;
                o.I = !0, r = ga(n, i), o.I = !1
            } else r = ga(n, i);
            return pr(r, function(l, u) {
                o && Gd(o.t, l) === u || kf(r, l, t(u))
            }), i === 3 ? new Set(r) : r
        }(e)
}

function ga(e, t) {
    switch (t) {
        case 2:
            return new Map(e);
        case 3:
            return Array.from(e)
    }
    return nu(e)
}
var ya, hr, ou = typeof Symbol < "u" && typeof Symbol("x") == "symbol",
    Xd = typeof Map < "u",
    qd = typeof Set < "u",
    wa = typeof Proxy < "u" && Proxy.revocable !== void 0 && typeof Reflect < "u",
    _f = ou ? Symbol.for("immer-nothing") : ((ya = {})["immer-nothing"] = !0, ya),
    Sa = ou ? Symbol.for("immer-draftable") : "__$immer_draftable",
    ke = ou ? Symbol.for("immer-state") : "__$immer_state",
    Zd = "" + Object.prototype.constructor,
    lu = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols !== void 0 ? function(e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
    } : Object.getOwnPropertyNames,
    Jd = Object.getOwnPropertyDescriptors || function(e) {
        var t = {};
        return lu(e).forEach(function(n) {
            t[n] = Object.getOwnPropertyDescriptor(e, n)
        }), t
    },
    ep = {},
    ii = {
        get: function(e, t) {
            if (t === ke) return e;
            var n = _t(e);
            if (!tl(n, t)) return function(o, i, l) {
                var u, a = va(i, l);
                return a ? "value" in a ? a.value : (u = a.get) === null || u === void 0 ? void 0 : u.call(o.k) : void 0
            }(e, n, t);
            var r = n[t];
            return e.I || !At(r) ? r : r === ko(e.t, t) ? (_o(e), e.o[t] = il(e.A.h, r, e)) : r
        },
        has: function(e, t) {
            return t in _t(e)
        },
        ownKeys: function(e) {
            return Reflect.ownKeys(_t(e))
        },
        set: function(e, t, n) {
            var r = va(_t(e), t);
            if (r != null && r.set) return r.set.call(e.k, n), !0;
            if (!e.P) {
                var o = ko(_t(e), t),
                    i = o == null ? void 0 : o[ke];
                if (i && i.t === n) return e.o[t] = n, e.D[t] = !1, !0;
                if (Hd(n, o) && (n !== void 0 || tl(e.t, t))) return !0;
                _o(e), rl(e)
            }
            return e.o[t] === n && typeof n != "number" && (n !== void 0 || t in e.o) || (e.o[t] = n, e.D[t] = !0, !0)
        },
        deleteProperty: function(e, t) {
            return ko(e.t, t) !== void 0 || t in e.t ? (e.D[t] = !1, _o(e), rl(e)) : delete e.D[t], e.o && delete e.o[t], !0
        },
        getOwnPropertyDescriptor: function(e, t) {
            var n = _t(e),
                r = Reflect.getOwnPropertyDescriptor(n, t);
            return r && {
                writable: !0,
                configurable: e.i !== 1 || t !== "length",
                enumerable: r.enumerable,
                value: n[t]
            }
        },
        defineProperty: function() {
            Ie(11)
        },
        getPrototypeOf: function(e) {
            return Object.getPrototypeOf(e.t)
        },
        setPrototypeOf: function() {
            Ie(12)
        }
    },
    oi = {};
pr(ii, function(e, t) {
    oi[e] = function() {
        return arguments[0] = arguments[0][0], t.apply(this, arguments)
    }
}), oi.deleteProperty = function(e, t) {
    return ii.deleteProperty.call(this, e[0], t)
}, oi.set = function(e, t, n) {
    return ii.set.call(this, e[0], t, n, e[0])
};
var tp = function() {
        function e(n) {
            var r = this;
            this.g = wa, this.F = !0, this.produce = function(o, i, l) {
                if (typeof o == "function" && typeof i != "function") {
                    var u = i;
                    i = o;
                    var a = r;
                    return function(g) {
                        var E = this;
                        g === void 0 && (g = u);
                        for (var S = arguments.length, p = Array(S > 1 ? S - 1 : 0), f = 1; f < S; f++) p[f - 1] = arguments[f];
                        return a.produce(g, function(d) {
                            var v;
                            return (v = i).call.apply(v, [E, d].concat(p))
                        })
                    }
                }
                var s;
                if (typeof i != "function" && Ie(6), l !== void 0 && typeof l != "function" && Ie(7), At(o)) {
                    var c = ha(r),
                        m = il(r, o, void 0),
                        h = !0;
                    try {
                        s = i(m), h = !1
                    } finally {
                        h ? Ei(c) : nl(c)
                    }
                    return typeof Promise < "u" && s instanceof Promise ? s.then(function(g) {
                        return Eo(c, l), xo(g, c)
                    }, function(g) {
                        throw Ei(c), g
                    }) : (Eo(c, l), xo(s, c))
                }
                if (!o || typeof o != "object") return (s = i(o)) === _f ? void 0 : (s === void 0 && (s = o), r.F && ru(s, !0), s);
                Ie(21, o)
            }, this.produceWithPatches = function(o, i) {
                return typeof o == "function" ? function(a) {
                    for (var s = arguments.length, c = Array(s > 1 ? s - 1 : 0), m = 1; m < s; m++) c[m - 1] = arguments[m];
                    return r.produceWithPatches(a, function(h) {
                        return o.apply(void 0, [h].concat(c))
                    })
                } : [r.produce(o, i, function(a, s) {
                    l = a, u = s
                }), l, u];
                var l, u
            }, typeof(n == null ? void 0 : n.useProxies) == "boolean" && this.setUseProxies(n.useProxies), typeof(n == null ? void 0 : n.autoFreeze) == "boolean" && this.setAutoFreeze(n.autoFreeze)
        }
        var t = e.prototype;
        return t.createDraft = function(n) {
            At(n) || Ie(8), vn(n) && (n = Yd(n));
            var r = ha(this),
                o = il(this, n, void 0);
            return o[ke].C = !0, nl(r), o
        }, t.finishDraft = function(n, r) {
            var o = n && n[ke],
                i = o.A;
            return Eo(i, r), xo(void 0, i)
        }, t.setAutoFreeze = function(n) {
            this.F = n
        }, t.setUseProxies = function(n) {
            n && !wa && Ie(20), this.g = n
        }, t.applyPatches = function(n, r) {
            var o;
            for (o = r.length - 1; o >= 0; o--) {
                var i = r[o];
                if (i.path.length === 0 && i.op === "replace") {
                    n = i.value;
                    break
                }
            }
            o > -1 && (r = r.slice(o + 1));
            var l = Xe("Patches").$;
            return vn(n) ? l(n, r) : this.produce(n, function(u) {
                return l(u, r)
            })
        }, e
    }(),
    _e = new tp,
    np = _e.produce;
_e.produceWithPatches.bind(_e);
var H0 = _e.setAutoFreeze.bind(_e);
_e.setUseProxies.bind(_e);
_e.applyPatches.bind(_e);
_e.createDraft.bind(_e);
_e.finishDraft.bind(_e);
const K0 = np;
var Pf = {
        exports: {}
    },
    De = {},
    Of = {
        exports: {}
    },
    Cf = {};
(function(e) {
    var t, n, r, o;
    if (typeof performance == "object" && typeof performance.now == "function") {
        var i = performance;
        e.unstable_now = function() {
            return i.now()
        }
    } else {
        var l = Date,
            u = l.now();
        e.unstable_now = function() {
            return l.now() - u
        }
    }
    if (typeof window > "u" || typeof MessageChannel != "function") {
        var a = null,
            s = null,
            c = function() {
                if (a !== null) try {
                    var _ = e.unstable_now();
                    a(!0, _), a = null
                } catch (O) {
                    throw setTimeout(c, 0), O
                }
            };
        t = function(_) {
            a !== null ? setTimeout(t, 0, _) : (a = _, setTimeout(c, 0))
        }, n = function(_, O) {
            s = setTimeout(_, O)
        }, r = function() {
            clearTimeout(s)
        }, e.unstable_shouldYield = function() {
            return !1
        }, o = e.unstable_forceFrameRate = function() {}
    } else {
        var m = window.setTimeout,
            h = window.clearTimeout;
        if (typeof console < "u") {
            var g = window.cancelAnimationFrame;
            typeof window.requestAnimationFrame != "function" && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), typeof g != "function" && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")
        }
        var E = !1,
            S = null,
            p = -1,
            f = 5,
            d = 0;
        e.unstable_shouldYield = function() {
            return e.unstable_now() >= d
        }, o = function() {}, e.unstable_forceFrameRate = function(_) {
            0 > _ || 125 < _ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : f = 0 < _ ? Math.floor(1e3 / _) : 5
        };
        var v = new MessageChannel,
            y = v.port2;
        v.port1.onmessage = function() {
            if (S !== null) {
                var _ = e.unstable_now();
                d = _ + f;
                try {
                    S(!0, _) ? y.postMessage(null) : (E = !1, S = null)
                } catch (O) {
                    throw y.postMessage(null), O
                }
            } else E = !1
        }, t = function(_) {
            S = _, E || (E = !0, y.postMessage(null))
        }, n = function(_, O) {
            p = m(function() {
                _(e.unstable_now())
            }, O)
        }, r = function() {
            h(p), p = -1
        }
    }

    function C(_, O) {
        var L = _.length;
        _.push(O);
        e: for (;;) {
            var q = L - 1 >>> 1,
                re = _[q];
            if (re !== void 0 && 0 < M(re, O)) _[q] = O, _[L] = re, L = q;
            else break e
        }
    }

    function x(_) {
        return _ = _[0], _ === void 0 ? null : _
    }

    function T(_) {
        var O = _[0];
        if (O !== void 0) {
            var L = _.pop();
            if (L !== O) {
                _[0] = L;
                e: for (var q = 0, re = _.length; q < re;) {
                    var Et = 2 * (q + 1) - 1,
                        xt = _[Et],
                        Dn = Et + 1,
                        Wt = _[Dn];
                    if (xt !== void 0 && 0 > M(xt, L)) Wt !== void 0 && 0 > M(Wt, xt) ? (_[q] = Wt, _[Dn] = L, q = Dn) : (_[q] = xt, _[Et] = L, q = Et);
                    else if (Wt !== void 0 && 0 > M(Wt, L)) _[q] = Wt, _[Dn] = L, q = Dn;
                    else break e
                }
            }
            return O
        }
        return null
    }

    function M(_, O) {
        var L = _.sortIndex - O.sortIndex;
        return L !== 0 ? L : _.id - O.id
    }
    var P = [],
        D = [],
        F = 1,
        A = null,
        b = 3,
        J = !1,
        H = !1,
        W = !1;

    function X(_) {
        for (var O = x(D); O !== null;) {
            if (O.callback === null) T(D);
            else if (O.startTime <= _) T(D), O.sortIndex = O.expirationTime, C(P, O);
            else break;
            O = x(D)
        }
    }

    function he(_) {
        if (W = !1, X(_), !H)
            if (x(P) !== null) H = !0, t(K);
            else {
                var O = x(D);
                O !== null && n(he, O.startTime - _)
            }
    }

    function K(_, O) {
        H = !1, W && (W = !1, r()), J = !0;
        var L = b;
        try {
            for (X(O), A = x(P); A !== null && (!(A.expirationTime > O) || _ && !e.unstable_shouldYield());) {
                var q = A.callback;
                if (typeof q == "function") {
                    A.callback = null, b = A.priorityLevel;
                    var re = q(A.expirationTime <= O);
                    O = e.unstable_now(), typeof re == "function" ? A.callback = re : A === x(P) && T(P), X(O)
                } else T(P);
                A = x(P)
            }
            if (A !== null) var Et = !0;
            else {
                var xt = x(D);
                xt !== null && n(he, xt.startTime - O), Et = !1
            }
            return Et
        } finally {
            A = null, b = L, J = !1
        }
    }
    var ae = o;
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(_) {
        _.callback = null
    }, e.unstable_continueExecution = function() {
        H || J || (H = !0, t(K))
    }, e.unstable_getCurrentPriorityLevel = function() {
        return b
    }, e.unstable_getFirstCallbackNode = function() {
        return x(P)
    }, e.unstable_next = function(_) {
        switch (b) {
            case 1:
            case 2:
            case 3:
                var O = 3;
                break;
            default:
                O = b
        }
        var L = b;
        b = O;
        try {
            return _()
        } finally {
            b = L
        }
    }, e.unstable_pauseExecution = function() {}, e.unstable_requestPaint = ae, e.unstable_runWithPriority = function(_, O) {
        switch (_) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                _ = 3
        }
        var L = b;
        b = _;
        try {
            return O()
        } finally {
            b = L
        }
    }, e.unstable_scheduleCallback = function(_, O, L) {
        var q = e.unstable_now();
        switch (typeof L == "object" && L !== null ? (L = L.delay, L = typeof L == "number" && 0 < L ? q + L : q) : L = q, _) {
            case 1:
                var re = -1;
                break;
            case 2:
                re = 250;
                break;
            case 5:
                re = 1073741823;
                break;
            case 4:
                re = 1e4;
                break;
            default:
                re = 5e3
        }
        return re = L + re, _ = {
            id: F++,
            callback: O,
            priorityLevel: _,
            startTime: L,
            expirationTime: re,
            sortIndex: -1
        }, L > q ? (_.sortIndex = L, C(D, _), x(P) === null && _ === x(D) && (W ? r() : W = !0, n(he, L - q))) : (_.sortIndex = re, C(P, _), H || J || (H = !0, t(K))), _
    }, e.unstable_wrapCallback = function(_) {
        var O = b;
        return function() {
            var L = b;
            b = O;
            try {
                return _.apply(this, arguments)
            } finally {
                b = L
            }
        }
    }
})(Cf);
(function(e) {
    e.exports = Cf
})(Of);
var qi = $.exports,
    G = sf,
    ne = Of.exports;

function k(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
}
if (!qi) throw Error(k(227));
var Tf = new Set,
    mr = {};

function zt(e, t) {
    gn(e, t), gn(e + "Capture", t)
}

function gn(e, t) {
    for (mr[e] = t, e = 0; e < t.length; e++) Tf.add(t[e])
}
var Ze = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    rp = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    Ea = Object.prototype.hasOwnProperty,
    xa = {},
    ka = {};

function ip(e) {
    return Ea.call(ka, e) ? !0 : Ea.call(xa, e) ? !1 : rp.test(e) ? ka[e] = !0 : (xa[e] = !0, !1)
}

function op(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
        case "function":
        case "symbol":
            return !0;
        case "boolean":
            return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
        default:
            return !1
    }
}

function lp(e, t, n, r) {
    if (t === null || typeof t > "u" || op(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null) switch (n.type) {
        case 3:
            return !t;
        case 4:
            return t === !1;
        case 5:
            return isNaN(t);
        case 6:
            return isNaN(t) || 1 > t
    }
    return !1
}

function ve(e, t, n, r, o, i, l) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = l
}
var ue = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    ue[e] = new ve(e, 0, !1, e, null, !1, !1)
});
[
    ["acceptCharset", "accept-charset"],
    ["className", "class"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"]
].forEach(function(e) {
    var t = e[0];
    ue[t] = new ve(t, 1, !1, e[1], null, !1, !1)
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    ue[e] = new ve(e, 2, !1, e.toLowerCase(), null, !1, !1)
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    ue[e] = new ve(e, 2, !1, e, null, !1, !1)
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    ue[e] = new ve(e, 3, !1, e.toLowerCase(), null, !1, !1)
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
    ue[e] = new ve(e, 3, !0, e, null, !1, !1)
});
["capture", "download"].forEach(function(e) {
    ue[e] = new ve(e, 4, !1, e, null, !1, !1)
});
["cols", "rows", "size", "span"].forEach(function(e) {
    ue[e] = new ve(e, 6, !1, e, null, !1, !1)
});
["rowSpan", "start"].forEach(function(e) {
    ue[e] = new ve(e, 5, !1, e.toLowerCase(), null, !1, !1)
});
var uu = /[\-:]([a-z])/g;

function au(e) {
    return e[1].toUpperCase()
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(uu, au);
    ue[t] = new ve(t, 1, !1, e, null, !1, !1)
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(uu, au);
    ue[t] = new ve(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1)
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(uu, au);
    ue[t] = new ve(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1)
});
["tabIndex", "crossOrigin"].forEach(function(e) {
    ue[e] = new ve(e, 1, !1, e.toLowerCase(), null, !1, !1)
});
ue.xlinkHref = new ve("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
    ue[e] = new ve(e, 1, !1, e.toLowerCase(), null, !0, !0)
});

function su(e, t, n, r) {
    var o = ue.hasOwnProperty(t) ? ue[t] : null,
        i = o !== null ? o.type === 0 : r ? !1 : !(!(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N");
    i || (lp(t, n, o, r) && (n = null), r || o === null ? ip(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (t = o.attributeName, r = o.attributeNamespace, n === null ? e.removeAttribute(t) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))))
}
var Vt = qi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    Hn = 60103,
    Ot = 60106,
    nt = 60107,
    fu = 60108,
    Jn = 60114,
    cu = 60109,
    du = 60110,
    Zi = 60112,
    er = 60113,
    _i = 60120,
    Ji = 60115,
    pu = 60116,
    hu = 60121,
    mu = 60128,
    Rf = 60129,
    vu = 60130,
    ol = 60131;
if (typeof Symbol == "function" && Symbol.for) {
    var te = Symbol.for;
    Hn = te("react.element"), Ot = te("react.portal"), nt = te("react.fragment"), fu = te("react.strict_mode"), Jn = te("react.profiler"), cu = te("react.provider"), du = te("react.context"), Zi = te("react.forward_ref"), er = te("react.suspense"), _i = te("react.suspense_list"), Ji = te("react.memo"), pu = te("react.lazy"), hu = te("react.block"), te("react.scope"), mu = te("react.opaque.id"), Rf = te("react.debug_trace_mode"), vu = te("react.offscreen"), ol = te("react.legacy_hidden")
}
var _a = typeof Symbol == "function" && Symbol.iterator;

function Ln(e) {
    return e === null || typeof e != "object" ? null : (e = _a && e[_a] || e["@@iterator"], typeof e == "function" ? e : null)
}
var Po;

function Kn(e) {
    if (Po === void 0) try {
        throw Error()
    } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        Po = t && t[1] || ""
    }
    return `
` + Po + e
}
var Oo = !1;

function br(e, t) {
    if (!e || Oo) return "";
    Oo = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
        if (t)
            if (t = function() {
                    throw Error()
                }, Object.defineProperty(t.prototype, "props", {
                    set: function() {
                        throw Error()
                    }
                }), typeof Reflect == "object" && Reflect.construct) {
                try {
                    Reflect.construct(t, [])
                } catch (a) {
                    var r = a
                }
                Reflect.construct(e, [], t)
            } else {
                try {
                    t.call()
                } catch (a) {
                    r = a
                }
                e.call(t.prototype)
            }
        else {
            try {
                throw Error()
            } catch (a) {
                r = a
            }
            e()
        }
    } catch (a) {
        if (a && r && typeof a.stack == "string") {
            for (var o = a.stack.split(`
`), i = r.stack.split(`
`), l = o.length - 1, u = i.length - 1; 1 <= l && 0 <= u && o[l] !== i[u];) u--;
            for (; 1 <= l && 0 <= u; l--, u--)
                if (o[l] !== i[u]) {
                    if (l !== 1 || u !== 1)
                        do
                            if (l--, u--, 0 > u || o[l] !== i[u]) return `
` + o[l].replace(" at new ", " at "); while (1 <= l && 0 <= u);
                    break
                }
        }
    } finally {
        Oo = !1, Error.prepareStackTrace = n
    }
    return (e = e ? e.displayName || e.name : "") ? Kn(e) : ""
}

function up(e) {
    switch (e.tag) {
        case 5:
            return Kn(e.type);
        case 16:
            return Kn("Lazy");
        case 13:
            return Kn("Suspense");
        case 19:
            return Kn("SuspenseList");
        case 0:
        case 2:
        case 15:
            return e = br(e.type, !1), e;
        case 11:
            return e = br(e.type.render, !1), e;
        case 22:
            return e = br(e.type._render, !1), e;
        case 1:
            return e = br(e.type, !0), e;
        default:
            return ""
    }
}

function ln(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
        case nt:
            return "Fragment";
        case Ot:
            return "Portal";
        case Jn:
            return "Profiler";
        case fu:
            return "StrictMode";
        case er:
            return "Suspense";
        case _i:
            return "SuspenseList"
    }
    if (typeof e == "object") switch (e.$$typeof) {
        case du:
            return (e.displayName || "Context") + ".Consumer";
        case cu:
            return (e._context.displayName || "Context") + ".Provider";
        case Zi:
            var t = e.render;
            return t = t.displayName || t.name || "", e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
        case Ji:
            return ln(e.type);
        case hu:
            return ln(e._render);
        case pu:
            t = e._payload, e = e._init;
            try {
                return ln(e(t))
            } catch {}
    }
    return null
}

function ht(e) {
    switch (typeof e) {
        case "boolean":
        case "number":
        case "object":
        case "string":
        case "undefined":
            return e;
        default:
            return ""
    }
}

function Mf(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio")
}

function ap(e) {
    var t = Mf(e) ? "checked" : "value",
        n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
        r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
        var o = n.get,
            i = n.set;
        return Object.defineProperty(e, t, {
            configurable: !0,
            get: function() {
                return o.call(this)
            },
            set: function(l) {
                r = "" + l, i.call(this, l)
            }
        }), Object.defineProperty(e, t, {
            enumerable: n.enumerable
        }), {
            getValue: function() {
                return r
            },
            setValue: function(l) {
                r = "" + l
            },
            stopTracking: function() {
                e._valueTracker = null, delete e[t]
            }
        }
    }
}

function Ur(e) {
    e._valueTracker || (e._valueTracker = ap(e))
}

function jf(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
        r = "";
    return e && (r = Mf(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1
}

function Pi(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
        return e.activeElement || e.body
    } catch {
        return e.body
    }
}

function ll(e, t) {
    var n = t.checked;
    return G({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: n != null ? n : e._wrapperState.initialChecked
    })
}

function Pa(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue,
        r = t.checked != null ? t.checked : t.defaultChecked;
    n = ht(t.value != null ? t.value : n), e._wrapperState = {
        initialChecked: r,
        initialValue: n,
        controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null
    }
}

function Df(e, t) {
    t = t.checked, t != null && su(e, "checked", t, !1)
}

function ul(e, t) {
    Df(e, t);
    var n = ht(t.value),
        r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
        e.removeAttribute("value");
        return
    }
    t.hasOwnProperty("value") ? al(e, t.type, n) : t.hasOwnProperty("defaultValue") && al(e, t.type, ht(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked)
}

function Oa(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var r = t.type;
        if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
        t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n)
}

function al(e, t, n) {
    (t !== "number" || Pi(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n))
}

function sp(e) {
    var t = "";
    return qi.Children.forEach(e, function(n) {
        n != null && (t += n)
    }), t
}

function sl(e, t) {
    return e = G({
        children: void 0
    }, t), (t = sp(t.children)) && (e.children = t), e
}

function un(e, t, n, r) {
    if (e = e.options, t) {
        t = {};
        for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
        for (n = 0; n < e.length; n++) o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0)
    } else {
        for (n = "" + ht(n), t = null, o = 0; o < e.length; o++) {
            if (e[o].value === n) {
                e[o].selected = !0, r && (e[o].defaultSelected = !0);
                return
            }
            t !== null || e[o].disabled || (t = e[o])
        }
        t !== null && (t.selected = !0)
    }
}

function fl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(k(91));
    return G({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: "" + e._wrapperState.initialValue
    })
}

function Ca(e, t) {
    var n = t.value;
    if (n == null) {
        if (n = t.children, t = t.defaultValue, n != null) {
            if (t != null) throw Error(k(92));
            if (Array.isArray(n)) {
                if (!(1 >= n.length)) throw Error(k(93));
                n = n[0]
            }
            t = n
        }
        t == null && (t = ""), n = t
    }
    e._wrapperState = {
        initialValue: ht(n)
    }
}

function Lf(e, t) {
    var n = ht(t.value),
        r = ht(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r)
}

function Ta(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t)
}
var cl = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg"
};

function Af(e) {
    switch (e) {
        case "svg":
            return "http://www.w3.org/2000/svg";
        case "math":
            return "http://www.w3.org/1998/Math/MathML";
        default:
            return "http://www.w3.org/1999/xhtml"
    }
}

function dl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Af(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e
}
var Br, If = function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, o) {
        MSApp.execUnsafeLocalFunction(function() {
            return e(t, n, r, o)
        })
    } : e
}(function(e, t) {
    if (e.namespaceURI !== cl.svg || "innerHTML" in e) e.innerHTML = t;
    else {
        for (Br = Br || document.createElement("div"), Br.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Br.firstChild; e.firstChild;) e.removeChild(e.firstChild);
        for (; t.firstChild;) e.appendChild(t.firstChild)
    }
});

function vr(e, t) {
    if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
            n.nodeValue = t;
            return
        }
    }
    e.textContent = t
}
var tr = {
        animationIterationCount: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0
    },
    fp = ["Webkit", "ms", "Moz", "O"];
Object.keys(tr).forEach(function(e) {
    fp.forEach(function(t) {
        t = t + e.charAt(0).toUpperCase() + e.substring(1), tr[t] = tr[e]
    })
});

function Nf(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || tr.hasOwnProperty(e) && tr[e] ? ("" + t).trim() : t + "px"
}

function $f(e, t) {
    e = e.style;
    for (var n in t)
        if (t.hasOwnProperty(n)) {
            var r = n.indexOf("--") === 0,
                o = Nf(n, t[n], r);
            n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o
        }
}
var cp = G({
    menuitem: !0
}, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
});

function pl(e, t) {
    if (t) {
        if (cp[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(k(137, e));
        if (t.dangerouslySetInnerHTML != null) {
            if (t.children != null) throw Error(k(60));
            if (!(typeof t.dangerouslySetInnerHTML == "object" && "__html" in t.dangerouslySetInnerHTML)) throw Error(k(61))
        }
        if (t.style != null && typeof t.style != "object") throw Error(k(62))
    }
}

function hl(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0
    }
}

function gu(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e
}
var ml = null,
    an = null,
    sn = null;

function Ra(e) {
    if (e = Ar(e)) {
        if (typeof ml != "function") throw Error(k(280));
        var t = e.stateNode;
        t && (t = oo(t), ml(e.stateNode, e.type, t))
    }
}

function Ff(e) {
    an ? sn ? sn.push(e) : sn = [e] : an = e
}

function zf() {
    if (an) {
        var e = an,
            t = sn;
        if (sn = an = null, Ra(e), t)
            for (e = 0; e < t.length; e++) Ra(t[e])
    }
}

function yu(e, t) {
    return e(t)
}

function Vf(e, t, n, r, o) {
    return e(t, n, r, o)
}

function wu() {}
var bf = yu,
    Ct = !1,
    Co = !1;

function Su() {
    (an !== null || sn !== null) && (wu(), zf())
}

function dp(e, t, n) {
    if (Co) return e(t, n);
    Co = !0;
    try {
        return bf(e, t, n)
    } finally {
        Co = !1, Su()
    }
}

function gr(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = oo(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
            break e;
        default:
            e = !1
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(k(231, t, typeof n));
    return n
}
var vl = !1;
if (Ze) try {
    var An = {};
    Object.defineProperty(An, "passive", {
        get: function() {
            vl = !0
        }
    }), window.addEventListener("test", An, An), window.removeEventListener("test", An, An)
} catch {
    vl = !1
}

function pp(e, t, n, r, o, i, l, u, a) {
    var s = Array.prototype.slice.call(arguments, 3);
    try {
        t.apply(n, s)
    } catch (c) {
        this.onError(c)
    }
}
var nr = !1,
    Oi = null,
    Ci = !1,
    gl = null,
    hp = {
        onError: function(e) {
            nr = !0, Oi = e
        }
    };

function mp(e, t, n, r, o, i, l, u, a) {
    nr = !1, Oi = null, pp.apply(hp, arguments)
}

function vp(e, t, n, r, o, i, l, u, a) {
    if (mp.apply(this, arguments), nr) {
        if (nr) {
            var s = Oi;
            nr = !1, Oi = null
        } else throw Error(k(198));
        Ci || (Ci = !0, gl = s)
    }
}

function bt(e) {
    var t = e,
        n = e;
    if (e.alternate)
        for (; t.return;) t = t.return;
    else {
        e = t;
        do t = e, (t.flags & 1026) !== 0 && (n = t.return), e = t.return; while (e)
    }
    return t.tag === 3 ? n : null
}

function Uf(e) {
    if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated
    }
    return null
}

function Ma(e) {
    if (bt(e) !== e) throw Error(k(188))
}

function gp(e) {
    var t = e.alternate;
    if (!t) {
        if (t = bt(e), t === null) throw Error(k(188));
        return t !== e ? null : e
    }
    for (var n = e, r = t;;) {
        var o = n.return;
        if (o === null) break;
        var i = o.alternate;
        if (i === null) {
            if (r = o.return, r !== null) {
                n = r;
                continue
            }
            break
        }
        if (o.child === i.child) {
            for (i = o.child; i;) {
                if (i === n) return Ma(o), e;
                if (i === r) return Ma(o), t;
                i = i.sibling
            }
            throw Error(k(188))
        }
        if (n.return !== r.return) n = o, r = i;
        else {
            for (var l = !1, u = o.child; u;) {
                if (u === n) {
                    l = !0, n = o, r = i;
                    break
                }
                if (u === r) {
                    l = !0, r = o, n = i;
                    break
                }
                u = u.sibling
            }
            if (!l) {
                for (u = i.child; u;) {
                    if (u === n) {
                        l = !0, n = i, r = o;
                        break
                    }
                    if (u === r) {
                        l = !0, r = i, n = o;
                        break
                    }
                    u = u.sibling
                }
                if (!l) throw Error(k(189))
            }
        }
        if (n.alternate !== r) throw Error(k(190))
    }
    if (n.tag !== 3) throw Error(k(188));
    return n.stateNode.current === n ? e : t
}

function Bf(e) {
    if (e = gp(e), !e) return null;
    for (var t = e;;) {
        if (t.tag === 5 || t.tag === 6) return t;
        if (t.child) t.child.return = t, t = t.child;
        else {
            if (t === e) break;
            for (; !t.sibling;) {
                if (!t.return || t.return === e) return null;
                t = t.return
            }
            t.sibling.return = t.return, t = t.sibling
        }
    }
    return null
}

function ja(e, t) {
    for (var n = e.alternate; t !== null;) {
        if (t === e || t === n) return !0;
        t = t.return
    }
    return !1
}
var Wf, Eu, Gf, Hf, yl = !1,
    ze = [],
    lt = null,
    ut = null,
    at = null,
    yr = new Map,
    wr = new Map,
    In = [],
    Da = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");

function wl(e, t, n, r, o) {
    return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: n | 16,
        nativeEvent: o,
        targetContainers: [r]
    }
}

function La(e, t) {
    switch (e) {
        case "focusin":
        case "focusout":
            lt = null;
            break;
        case "dragenter":
        case "dragleave":
            ut = null;
            break;
        case "mouseover":
        case "mouseout":
            at = null;
            break;
        case "pointerover":
        case "pointerout":
            yr.delete(t.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            wr.delete(t.pointerId)
    }
}

function Nn(e, t, n, r, o, i) {
    return e === null || e.nativeEvent !== i ? (e = wl(t, n, r, o, i), t !== null && (t = Ar(t), t !== null && Eu(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e)
}

function yp(e, t, n, r, o) {
    switch (t) {
        case "focusin":
            return lt = Nn(lt, e, t, n, r, o), !0;
        case "dragenter":
            return ut = Nn(ut, e, t, n, r, o), !0;
        case "mouseover":
            return at = Nn(at, e, t, n, r, o), !0;
        case "pointerover":
            var i = o.pointerId;
            return yr.set(i, Nn(yr.get(i) || null, e, t, n, r, o)), !0;
        case "gotpointercapture":
            return i = o.pointerId, wr.set(i, Nn(wr.get(i) || null, e, t, n, r, o)), !0
    }
    return !1
}

function wp(e) {
    var t = Tt(e.target);
    if (t !== null) {
        var n = bt(t);
        if (n !== null) {
            if (t = n.tag, t === 13) {
                if (t = Uf(n), t !== null) {
                    e.blockedOn = t, Hf(e.lanePriority, function() {
                        ne.unstable_runWithPriority(e.priority, function() {
                            Gf(n)
                        })
                    });
                    return
                }
            } else if (t === 3 && n.stateNode.hydrate) {
                e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
                return
            }
        }
    }
    e.blockedOn = null
}

function li(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
        var n = Pu(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
        if (n !== null) return t = Ar(n), t !== null && Eu(t), e.blockedOn = n, !1;
        t.shift()
    }
    return !0
}

function Aa(e, t, n) {
    li(e) && n.delete(t)
}

function Sp() {
    for (yl = !1; 0 < ze.length;) {
        var e = ze[0];
        if (e.blockedOn !== null) {
            e = Ar(e.blockedOn), e !== null && Wf(e);
            break
        }
        for (var t = e.targetContainers; 0 < t.length;) {
            var n = Pu(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
            if (n !== null) {
                e.blockedOn = n;
                break
            }
            t.shift()
        }
        e.blockedOn === null && ze.shift()
    }
    lt !== null && li(lt) && (lt = null), ut !== null && li(ut) && (ut = null), at !== null && li(at) && (at = null), yr.forEach(Aa), wr.forEach(Aa)
}

function $n(e, t) {
    e.blockedOn === t && (e.blockedOn = null, yl || (yl = !0, ne.unstable_scheduleCallback(ne.unstable_NormalPriority, Sp)))
}

function Kf(e) {
    function t(o) {
        return $n(o, e)
    }
    if (0 < ze.length) {
        $n(ze[0], e);
        for (var n = 1; n < ze.length; n++) {
            var r = ze[n];
            r.blockedOn === e && (r.blockedOn = null)
        }
    }
    for (lt !== null && $n(lt, e), ut !== null && $n(ut, e), at !== null && $n(at, e), yr.forEach(t), wr.forEach(t), n = 0; n < In.length; n++) r = In[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < In.length && (n = In[0], n.blockedOn === null);) wp(n), n.blockedOn === null && In.shift()
}

function Wr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n
}
var qt = {
        animationend: Wr("Animation", "AnimationEnd"),
        animationiteration: Wr("Animation", "AnimationIteration"),
        animationstart: Wr("Animation", "AnimationStart"),
        transitionend: Wr("Transition", "TransitionEnd")
    },
    To = {},
    Qf = {};
Ze && (Qf = document.createElement("div").style, "AnimationEvent" in window || (delete qt.animationend.animation, delete qt.animationiteration.animation, delete qt.animationstart.animation), "TransitionEvent" in window || delete qt.transitionend.transition);

function eo(e) {
    if (To[e]) return To[e];
    if (!qt[e]) return e;
    var t = qt[e],
        n;
    for (n in t)
        if (t.hasOwnProperty(n) && n in Qf) return To[e] = t[n];
    return e
}
var Yf = eo("animationend"),
    Xf = eo("animationiteration"),
    qf = eo("animationstart"),
    Zf = eo("transitionend"),
    Jf = new Map,
    xu = new Map,
    Ep = ["abort", "abort", Yf, "animationEnd", Xf, "animationIteration", qf, "animationStart", "canplay", "canPlay", "canplaythrough", "canPlayThrough", "durationchange", "durationChange", "emptied", "emptied", "encrypted", "encrypted", "ended", "ended", "error", "error", "gotpointercapture", "gotPointerCapture", "load", "load", "loadeddata", "loadedData", "loadedmetadata", "loadedMetadata", "loadstart", "loadStart", "lostpointercapture", "lostPointerCapture", "playing", "playing", "progress", "progress", "seeking", "seeking", "stalled", "stalled", "suspend", "suspend", "timeupdate", "timeUpdate", Zf, "transitionEnd", "waiting", "waiting"];

function ku(e, t) {
    for (var n = 0; n < e.length; n += 2) {
        var r = e[n],
            o = e[n + 1];
        o = "on" + (o[0].toUpperCase() + o.slice(1)), xu.set(r, t), Jf.set(r, o), zt(o, [r])
    }
}
var xp = ne.unstable_now;
xp();
var V = 8;

function Yt(e) {
    if ((1 & e) !== 0) return V = 15, 1;
    if ((2 & e) !== 0) return V = 14, 2;
    if ((4 & e) !== 0) return V = 13, 4;
    var t = 24 & e;
    return t !== 0 ? (V = 12, t) : (e & 32) !== 0 ? (V = 11, 32) : (t = 192 & e, t !== 0 ? (V = 10, t) : (e & 256) !== 0 ? (V = 9, 256) : (t = 3584 & e, t !== 0 ? (V = 8, t) : (e & 4096) !== 0 ? (V = 7, 4096) : (t = 4186112 & e, t !== 0 ? (V = 6, t) : (t = 62914560 & e, t !== 0 ? (V = 5, t) : e & 67108864 ? (V = 4, 67108864) : (e & 134217728) !== 0 ? (V = 3, 134217728) : (t = 805306368 & e, t !== 0 ? (V = 2, t) : (1073741824 & e) !== 0 ? (V = 1, 1073741824) : (V = 8, e))))))
}

function kp(e) {
    switch (e) {
        case 99:
            return 15;
        case 98:
            return 10;
        case 97:
        case 96:
            return 8;
        case 95:
            return 2;
        default:
            return 0
    }
}

function _p(e) {
    switch (e) {
        case 15:
        case 14:
            return 99;
        case 13:
        case 12:
        case 11:
        case 10:
            return 98;
        case 9:
        case 8:
        case 7:
        case 6:
        case 4:
        case 5:
            return 97;
        case 3:
        case 2:
        case 1:
            return 95;
        case 0:
            return 90;
        default:
            throw Error(k(358, e))
    }
}

function Sr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return V = 0;
    var r = 0,
        o = 0,
        i = e.expiredLanes,
        l = e.suspendedLanes,
        u = e.pingedLanes;
    if (i !== 0) r = i, o = V = 15;
    else if (i = n & 134217727, i !== 0) {
        var a = i & ~l;
        a !== 0 ? (r = Yt(a), o = V) : (u &= i, u !== 0 && (r = Yt(u), o = V))
    } else i = n & ~l, i !== 0 ? (r = Yt(i), o = V) : u !== 0 && (r = Yt(u), o = V);
    if (r === 0) return 0;
    if (r = 31 - mt(r), r = n & ((0 > r ? 0 : 1 << r) << 1) - 1, t !== 0 && t !== r && (t & l) === 0) {
        if (Yt(t), o <= V) return t;
        V = o
    }
    if (t = e.entangledLanes, t !== 0)
        for (e = e.entanglements, t &= r; 0 < t;) n = 31 - mt(t), o = 1 << n, r |= e[n], t &= ~o;
    return r
}

function ec(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
}

function Ti(e, t) {
    switch (e) {
        case 15:
            return 1;
        case 14:
            return 2;
        case 12:
            return e = Xt(24 & ~t), e === 0 ? Ti(10, t) : e;
        case 10:
            return e = Xt(192 & ~t), e === 0 ? Ti(8, t) : e;
        case 8:
            return e = Xt(3584 & ~t), e === 0 && (e = Xt(4186112 & ~t), e === 0 && (e = 512)), e;
        case 2:
            return t = Xt(805306368 & ~t), t === 0 && (t = 268435456), t
    }
    throw Error(k(358, e))
}

function Xt(e) {
    return e & -e
}

function Ro(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t
}

function to(e, t, n) {
    e.pendingLanes |= t;
    var r = t - 1;
    e.suspendedLanes &= r, e.pingedLanes &= r, e = e.eventTimes, t = 31 - mt(t), e[t] = n
}
var mt = Math.clz32 ? Math.clz32 : Cp,
    Pp = Math.log,
    Op = Math.LN2;

function Cp(e) {
    return e === 0 ? 32 : 31 - (Pp(e) / Op | 0) | 0
}
var Tp = ne.unstable_UserBlockingPriority,
    Rp = ne.unstable_runWithPriority,
    ui = !0;

function Mp(e, t, n, r) {
    Ct || wu();
    var o = _u,
        i = Ct;
    Ct = !0;
    try {
        Vf(o, e, t, n, r)
    } finally {
        (Ct = i) || Su()
    }
}

function jp(e, t, n, r) {
    Rp(Tp, _u.bind(null, e, t, n, r))
}

function _u(e, t, n, r) {
    if (ui) {
        var o;
        if ((o = (t & 4) === 0) && 0 < ze.length && -1 < Da.indexOf(e)) e = wl(null, e, t, n, r), ze.push(e);
        else {
            var i = Pu(e, t, n, r);
            if (i === null) o && La(e, r);
            else {
                if (o) {
                    if (-1 < Da.indexOf(e)) {
                        e = wl(i, e, t, n, r), ze.push(e);
                        return
                    }
                    if (yp(i, e, t, n, r)) return;
                    La(e, r)
                }
                pc(e, t, r, null, n)
            }
        }
    }
}

function Pu(e, t, n, r) {
    var o = gu(r);
    if (o = Tt(o), o !== null) {
        var i = bt(o);
        if (i === null) o = null;
        else {
            var l = i.tag;
            if (l === 13) {
                if (o = Uf(i), o !== null) return o;
                o = null
            } else if (l === 3) {
                if (i.stateNode.hydrate) return i.tag === 3 ? i.stateNode.containerInfo : null;
                o = null
            } else i !== o && (o = null)
        }
    }
    return pc(e, t, r, o, n), null
}
var rt = null,
    Ou = null,
    ai = null;

function tc() {
    if (ai) return ai;
    var e, t = Ou,
        n = t.length,
        r, o = "value" in rt ? rt.value : rt.textContent,
        i = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++);
    var l = n - e;
    for (r = 1; r <= l && t[n - r] === o[i - r]; r++);
    return ai = o.slice(e, 1 < r ? 1 - r : void 0)
}

function si(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0
}

function Gr() {
    return !0
}

function Ia() {
    return !1
}

function Pe(e) {
    function t(n, r, o, i, l) {
        this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = l, this.currentTarget = null;
        for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
        return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Gr : Ia, this.isPropagationStopped = Ia, this
    }
    return G(t.prototype, {
        preventDefault: function() {
            this.defaultPrevented = !0;
            var n = this.nativeEvent;
            n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Gr)
        },
        stopPropagation: function() {
            var n = this.nativeEvent;
            n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Gr)
        },
        persist: function() {},
        isPersistent: Gr
    }), t
}
var On = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(e) {
            return e.timeStamp || Date.now()
        },
        defaultPrevented: 0,
        isTrusted: 0
    },
    Cu = Pe(On),
    Lr = G({}, On, {
        view: 0,
        detail: 0
    }),
    Dp = Pe(Lr),
    Mo, jo, Fn, no = G({}, Lr, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Tu,
        button: 0,
        buttons: 0,
        relatedTarget: function(e) {
            return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget
        },
        movementX: function(e) {
            return "movementX" in e ? e.movementX : (e !== Fn && (Fn && e.type === "mousemove" ? (Mo = e.screenX - Fn.screenX, jo = e.screenY - Fn.screenY) : jo = Mo = 0, Fn = e), Mo)
        },
        movementY: function(e) {
            return "movementY" in e ? e.movementY : jo
        }
    }),
    Na = Pe(no),
    Lp = G({}, no, {
        dataTransfer: 0
    }),
    Ap = Pe(Lp),
    Ip = G({}, Lr, {
        relatedTarget: 0
    }),
    Do = Pe(Ip),
    Np = G({}, On, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }),
    $p = Pe(Np),
    Fp = G({}, On, {
        clipboardData: function(e) {
            return "clipboardData" in e ? e.clipboardData : window.clipboardData
        }
    }),
    zp = Pe(Fp),
    Vp = G({}, On, {
        data: 0
    }),
    $a = Pe(Vp),
    bp = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    },
    Up = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    },
    Bp = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };

function Wp(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Bp[e]) ? !!t[e] : !1
}

function Tu() {
    return Wp
}
var Gp = G({}, Lr, {
        key: function(e) {
            if (e.key) {
                var t = bp[e.key] || e.key;
                if (t !== "Unidentified") return t
            }
            return e.type === "keypress" ? (e = si(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Up[e.keyCode] || "Unidentified" : ""
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: Tu,
        charCode: function(e) {
            return e.type === "keypress" ? si(e) : 0
        },
        keyCode: function(e) {
            return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
        },
        which: function(e) {
            return e.type === "keypress" ? si(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
        }
    }),
    Hp = Pe(Gp),
    Kp = G({}, no, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    }),
    Fa = Pe(Kp),
    Qp = G({}, Lr, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: Tu
    }),
    Yp = Pe(Qp),
    Xp = G({}, On, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }),
    qp = Pe(Xp),
    Zp = G({}, no, {
        deltaX: function(e) {
            return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        },
        deltaY: function(e) {
            return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0
        },
        deltaZ: 0,
        deltaMode: 0
    }),
    Jp = Pe(Zp),
    eh = [9, 13, 27, 32],
    Ru = Ze && "CompositionEvent" in window,
    rr = null;
Ze && "documentMode" in document && (rr = document.documentMode);
var th = Ze && "TextEvent" in window && !rr,
    nc = Ze && (!Ru || rr && 8 < rr && 11 >= rr),
    za = String.fromCharCode(32),
    Va = !1;

function rc(e, t) {
    switch (e) {
        case "keyup":
            return eh.indexOf(t.keyCode) !== -1;
        case "keydown":
            return t.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1
    }
}

function ic(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null
}
var Zt = !1;

function nh(e, t) {
    switch (e) {
        case "compositionend":
            return ic(t);
        case "keypress":
            return t.which !== 32 ? null : (Va = !0, za);
        case "textInput":
            return e = t.data, e === za && Va ? null : e;
        default:
            return null
    }
}

function rh(e, t) {
    if (Zt) return e === "compositionend" || !Ru && rc(e, t) ? (e = tc(), ai = Ou = rt = null, Zt = !1, e) : null;
    switch (e) {
        case "paste":
            return null;
        case "keypress":
            if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                if (t.char && 1 < t.char.length) return t.char;
                if (t.which) return String.fromCharCode(t.which)
            }
            return null;
        case "compositionend":
            return nc && t.locale !== "ko" ? null : t.data;
        default:
            return null
    }
}
var ih = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
};

function ba(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!ih[e.type] : t === "textarea"
}

function oc(e, t, n, r) {
    Ff(r), t = Ri(t, "onChange"), 0 < t.length && (n = new Cu("onChange", "change", null, n, r), e.push({
        event: n,
        listeners: t
    }))
}
var ir = null,
    Er = null;

function oh(e) {
    fc(e, 0)
}

function ro(e) {
    var t = en(e);
    if (jf(t)) return e
}

function lh(e, t) {
    if (e === "change") return t
}
var lc = !1;
if (Ze) {
    var Lo;
    if (Ze) {
        var Ao = "oninput" in document;
        if (!Ao) {
            var Ua = document.createElement("div");
            Ua.setAttribute("oninput", "return;"), Ao = typeof Ua.oninput == "function"
        }
        Lo = Ao
    } else Lo = !1;
    lc = Lo && (!document.documentMode || 9 < document.documentMode)
}

function Ba() {
    ir && (ir.detachEvent("onpropertychange", uc), Er = ir = null)
}

function uc(e) {
    if (e.propertyName === "value" && ro(Er)) {
        var t = [];
        if (oc(t, Er, e, gu(e)), e = oh, Ct) e(t);
        else {
            Ct = !0;
            try {
                yu(e, t)
            } finally {
                Ct = !1, Su()
            }
        }
    }
}

function uh(e, t, n) {
    e === "focusin" ? (Ba(), ir = t, Er = n, ir.attachEvent("onpropertychange", uc)) : e === "focusout" && Ba()
}

function ah(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ro(Er)
}

function sh(e, t) {
    if (e === "click") return ro(t)
}

function fh(e, t) {
    if (e === "input" || e === "change") return ro(t)
}

function ch(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
}
var Oe = typeof Object.is == "function" ? Object.is : ch,
    dh = Object.prototype.hasOwnProperty;

function xr(e, t) {
    if (Oe(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e),
        r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++)
        if (!dh.call(t, n[r]) || !Oe(e[n[r]], t[n[r]])) return !1;
    return !0
}

function Wa(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e
}

function Ga(e, t) {
    var n = Wa(e);
    e = 0;
    for (var r; n;) {
        if (n.nodeType === 3) {
            if (r = e + n.textContent.length, e <= t && r >= t) return {
                node: n,
                offset: t - e
            };
            e = r
        }
        e: {
            for (; n;) {
                if (n.nextSibling) {
                    n = n.nextSibling;
                    break e
                }
                n = n.parentNode
            }
            n = void 0
        }
        n = Wa(n)
    }
}

function ac(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ac(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1
}

function Ha() {
    for (var e = window, t = Pi(); t instanceof e.HTMLIFrameElement;) {
        try {
            var n = typeof t.contentWindow.location.href == "string"
        } catch {
            n = !1
        }
        if (n) e = t.contentWindow;
        else break;
        t = Pi(e.document)
    }
    return t
}

function Sl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true")
}
var ph = Ze && "documentMode" in document && 11 >= document.documentMode,
    Jt = null,
    El = null,
    or = null,
    xl = !1;

function Ka(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    xl || Jt == null || Jt !== Pi(r) || (r = Jt, "selectionStart" in r && Sl(r) ? r = {
        start: r.selectionStart,
        end: r.selectionEnd
    } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
        anchorNode: r.anchorNode,
        anchorOffset: r.anchorOffset,
        focusNode: r.focusNode,
        focusOffset: r.focusOffset
    }), or && xr(or, r) || (or = r, r = Ri(El, "onSelect"), 0 < r.length && (t = new Cu("onSelect", "select", null, t, n), e.push({
        event: t,
        listeners: r
    }), t.target = Jt)))
}
ku("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "), 0);
ku("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "), 1);
ku(Ep, 2);
for (var Qa = "change selectionchange textInput compositionstart compositionend compositionupdate".split(" "), Io = 0; Io < Qa.length; Io++) xu.set(Qa[Io], 0);
gn("onMouseEnter", ["mouseout", "mouseover"]);
gn("onMouseLeave", ["mouseout", "mouseover"]);
gn("onPointerEnter", ["pointerout", "pointerover"]);
gn("onPointerLeave", ["pointerout", "pointerover"]);
zt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
zt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
zt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
zt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
zt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
zt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Qn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
    sc = new Set("cancel close invalid load scroll toggle".split(" ").concat(Qn));

function Ya(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, vp(r, t, void 0, e), e.currentTarget = null
}

function fc(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
        var r = e[n],
            o = r.event;
        r = r.listeners;
        e: {
            var i = void 0;
            if (t)
                for (var l = r.length - 1; 0 <= l; l--) {
                    var u = r[l],
                        a = u.instance,
                        s = u.currentTarget;
                    if (u = u.listener, a !== i && o.isPropagationStopped()) break e;
                    Ya(o, u, s), i = a
                } else
                    for (l = 0; l < r.length; l++) {
                        if (u = r[l], a = u.instance, s = u.currentTarget, u = u.listener, a !== i && o.isPropagationStopped()) break e;
                        Ya(o, u, s), i = a
                    }
        }
    }
    if (Ci) throw e = gl, Ci = !1, gl = null, e
}

function U(e, t) {
    var n = mc(t),
        r = e + "__bubble";
    n.has(r) || (dc(t, e, 2, !1), n.add(r))
}
var Xa = "_reactListening" + Math.random().toString(36).slice(2);

function cc(e) {
    e[Xa] || (e[Xa] = !0, Tf.forEach(function(t) {
        sc.has(t) || qa(t, !1, e, null), qa(t, !0, e, null)
    }))
}

function qa(e, t, n, r) {
    var o = 4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : 0,
        i = n;
    if (e === "selectionchange" && n.nodeType !== 9 && (i = n.ownerDocument), r !== null && !t && sc.has(e)) {
        if (e !== "scroll") return;
        o |= 2, i = r
    }
    var l = mc(i),
        u = e + "__" + (t ? "capture" : "bubble");
    l.has(u) || (t && (o |= 4), dc(i, e, o, t), l.add(u))
}

function dc(e, t, n, r) {
    var o = xu.get(t);
    switch (o === void 0 ? 2 : o) {
        case 0:
            o = Mp;
            break;
        case 1:
            o = jp;
            break;
        default:
            o = _u
    }
    n = o.bind(null, t, n, e), o = void 0, !vl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), r ? o !== void 0 ? e.addEventListener(t, n, {
        capture: !0,
        passive: o
    }) : e.addEventListener(t, n, !0) : o !== void 0 ? e.addEventListener(t, n, {
        passive: o
    }) : e.addEventListener(t, n, !1)
}

function pc(e, t, n, r, o) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (;;) {
        if (r === null) return;
        var l = r.tag;
        if (l === 3 || l === 4) {
            var u = r.stateNode.containerInfo;
            if (u === o || u.nodeType === 8 && u.parentNode === o) break;
            if (l === 4)
                for (l = r.return; l !== null;) {
                    var a = l.tag;
                    if ((a === 3 || a === 4) && (a = l.stateNode.containerInfo, a === o || a.nodeType === 8 && a.parentNode === o)) return;
                    l = l.return
                }
            for (; u !== null;) {
                if (l = Tt(u), l === null) return;
                if (a = l.tag, a === 5 || a === 6) {
                    r = i = l;
                    continue e
                }
                u = u.parentNode
            }
        }
        r = r.return
    }
    dp(function() {
        var s = i,
            c = gu(n),
            m = [];
        e: {
            var h = Jf.get(e);
            if (h !== void 0) {
                var g = Cu,
                    E = e;
                switch (e) {
                    case "keypress":
                        if (si(n) === 0) break e;
                    case "keydown":
                    case "keyup":
                        g = Hp;
                        break;
                    case "focusin":
                        E = "focus", g = Do;
                        break;
                    case "focusout":
                        E = "blur", g = Do;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        g = Do;
                        break;
                    case "click":
                        if (n.button === 2) break e;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        g = Na;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        g = Ap;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        g = Yp;
                        break;
                    case Yf:
                    case Xf:
                    case qf:
                        g = $p;
                        break;
                    case Zf:
                        g = qp;
                        break;
                    case "scroll":
                        g = Dp;
                        break;
                    case "wheel":
                        g = Jp;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        g = zp;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        g = Fa
                }
                var S = (t & 4) !== 0,
                    p = !S && e === "scroll",
                    f = S ? h !== null ? h + "Capture" : null : h;
                S = [];
                for (var d = s, v; d !== null;) {
                    v = d;
                    var y = v.stateNode;
                    if (v.tag === 5 && y !== null && (v = y, f !== null && (y = gr(d, f), y != null && S.push(kr(d, y, v)))), p) break;
                    d = d.return
                }
                0 < S.length && (h = new g(h, E, null, n, c), m.push({
                    event: h,
                    listeners: S
                }))
            }
        }
        if ((t & 7) === 0) {
            e: {
                if (h = e === "mouseover" || e === "pointerover", g = e === "mouseout" || e === "pointerout", h && (t & 16) === 0 && (E = n.relatedTarget || n.fromElement) && (Tt(E) || E[Cn])) break e;
                if ((g || h) && (h = c.window === c ? c : (h = c.ownerDocument) ? h.defaultView || h.parentWindow : window, g ? (E = n.relatedTarget || n.toElement, g = s, E = E ? Tt(E) : null, E !== null && (p = bt(E), E !== p || E.tag !== 5 && E.tag !== 6) && (E = null)) : (g = null, E = s), g !== E)) {
                    if (S = Na, y = "onMouseLeave", f = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (S = Fa, y = "onPointerLeave", f = "onPointerEnter", d = "pointer"), p = g == null ? h : en(g), v = E == null ? h : en(E), h = new S(y, d + "leave", g, n, c), h.target = p, h.relatedTarget = v, y = null, Tt(c) === s && (S = new S(f, d + "enter", E, n, c), S.target = v, S.relatedTarget = p, y = S), p = y, g && E) t: {
                        for (S = g, f = E, d = 0, v = S; v; v = Kt(v)) d++;
                        for (v = 0, y = f; y; y = Kt(y)) v++;
                        for (; 0 < d - v;) S = Kt(S),
                        d--;
                        for (; 0 < v - d;) f = Kt(f),
                        v--;
                        for (; d--;) {
                            if (S === f || f !== null && S === f.alternate) break t;
                            S = Kt(S), f = Kt(f)
                        }
                        S = null
                    }
                    else S = null;
                    g !== null && Za(m, h, g, S, !1), E !== null && p !== null && Za(m, p, E, S, !0)
                }
            }
            e: {
                if (h = s ? en(s) : window, g = h.nodeName && h.nodeName.toLowerCase(), g === "select" || g === "input" && h.type === "file") var C = lh;
                else if (ba(h))
                    if (lc) C = fh;
                    else {
                        C = ah;
                        var x = uh
                    }
                else(g = h.nodeName) && g.toLowerCase() === "input" && (h.type === "checkbox" || h.type === "radio") && (C = sh);
                if (C && (C = C(e, s))) {
                    oc(m, C, n, c);
                    break e
                }
                x && x(e, h, s),
                e === "focusout" && (x = h._wrapperState) && x.controlled && h.type === "number" && al(h, "number", h.value)
            }
            switch (x = s ? en(s) : window, e) {
                case "focusin":
                    (ba(x) || x.contentEditable === "true") && (Jt = x, El = s, or = null);
                    break;
                case "focusout":
                    or = El = Jt = null;
                    break;
                case "mousedown":
                    xl = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    xl = !1, Ka(m, n, c);
                    break;
                case "selectionchange":
                    if (ph) break;
                case "keydown":
                case "keyup":
                    Ka(m, n, c)
            }
            var T;
            if (Ru) e: {
                switch (e) {
                    case "compositionstart":
                        var M = "onCompositionStart";
                        break e;
                    case "compositionend":
                        M = "onCompositionEnd";
                        break e;
                    case "compositionupdate":
                        M = "onCompositionUpdate";
                        break e
                }
                M = void 0
            }
            else Zt ? rc(e, n) && (M = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (M = "onCompositionStart");M && (nc && n.locale !== "ko" && (Zt || M !== "onCompositionStart" ? M === "onCompositionEnd" && Zt && (T = tc()) : (rt = c, Ou = "value" in rt ? rt.value : rt.textContent, Zt = !0)), x = Ri(s, M), 0 < x.length && (M = new $a(M, e, null, n, c), m.push({
                event: M,
                listeners: x
            }), T ? M.data = T : (T = ic(n), T !== null && (M.data = T)))),
            (T = th ? nh(e, n) : rh(e, n)) && (s = Ri(s, "onBeforeInput"), 0 < s.length && (c = new $a("onBeforeInput", "beforeinput", null, n, c), m.push({
                event: c,
                listeners: s
            }), c.data = T))
        }
        fc(m, t)
    })
}

function kr(e, t, n) {
    return {
        instance: e,
        listener: t,
        currentTarget: n
    }
}

function Ri(e, t) {
    for (var n = t + "Capture", r = []; e !== null;) {
        var o = e,
            i = o.stateNode;
        o.tag === 5 && i !== null && (o = i, i = gr(e, n), i != null && r.unshift(kr(e, i, o)), i = gr(e, t), i != null && r.push(kr(e, i, o))), e = e.return
    }
    return r
}

function Kt(e) {
    if (e === null) return null;
    do e = e.return; while (e && e.tag !== 5);
    return e || null
}

function Za(e, t, n, r, o) {
    for (var i = t._reactName, l = []; n !== null && n !== r;) {
        var u = n,
            a = u.alternate,
            s = u.stateNode;
        if (a !== null && a === r) break;
        u.tag === 5 && s !== null && (u = s, o ? (a = gr(n, i), a != null && l.unshift(kr(n, a, u))) : o || (a = gr(n, i), a != null && l.push(kr(n, a, u)))), n = n.return
    }
    l.length !== 0 && e.push({
        event: t,
        listeners: l
    })
}

function Mi() {}
var No = null,
    $o = null;

function hc(e, t) {
    switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
            return !!t.autoFocus
    }
    return !1
}

function kl(e, t) {
    return e === "textarea" || e === "option" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null
}
var Ja = typeof setTimeout == "function" ? setTimeout : void 0,
    hh = typeof clearTimeout == "function" ? clearTimeout : void 0;

function Mu(e) {
    e.nodeType === 1 ? e.textContent = "" : e.nodeType === 9 && (e = e.body, e != null && (e.textContent = ""))
}

function fn(e) {
    for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break
    }
    return e
}

function es(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
        if (e.nodeType === 8) {
            var n = e.data;
            if (n === "$" || n === "$!" || n === "$?") {
                if (t === 0) return e;
                t--
            } else n === "/$" && t++
        }
        e = e.previousSibling
    }
    return null
}
var Fo = 0;

function mh(e) {
    return {
        $$typeof: mu,
        toString: e,
        valueOf: e
    }
}
var io = Math.random().toString(36).slice(2),
    it = "__reactFiber$" + io,
    ji = "__reactProps$" + io,
    Cn = "__reactContainer$" + io,
    ts = "__reactEvents$" + io;

function Tt(e) {
    var t = e[it];
    if (t) return t;
    for (var n = e.parentNode; n;) {
        if (t = n[Cn] || n[it]) {
            if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
                for (e = es(e); e !== null;) {
                    if (n = e[it]) return n;
                    e = es(e)
                }
            return t
        }
        e = n, n = e.parentNode
    }
    return null
}

function Ar(e) {
    return e = e[it] || e[Cn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e
}

function en(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(k(33))
}

function oo(e) {
    return e[ji] || null
}

function mc(e) {
    var t = e[ts];
    return t === void 0 && (t = e[ts] = new Set), t
}
var _l = [],
    tn = -1;

function wt(e) {
    return {
        current: e
    }
}

function B(e) {
    0 > tn || (e.current = _l[tn], _l[tn] = null, tn--)
}

function Y(e, t) {
    tn++, _l[tn] = e.current, e.current = t
}
var vt = {},
    pe = wt(vt),
    we = wt(!1),
    It = vt;

function yn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return vt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o = {},
        i;
    for (i in n) o[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = o), o
}

function Se(e) {
    return e = e.childContextTypes, e != null
}

function Di() {
    B(we), B(pe)
}

function ns(e, t, n) {
    if (pe.current !== vt) throw Error(k(168));
    Y(pe, t), Y(we, n)
}

function vc(e, t, n) {
    var r = e.stateNode;
    if (e = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var o in r)
        if (!(o in e)) throw Error(k(108, ln(t) || "Unknown", o));
    return G({}, n, r)
}

function fi(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || vt, It = pe.current, Y(pe, e), Y(we, we.current), !0
}

function rs(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(k(169));
    n ? (e = vc(e, t, It), r.__reactInternalMemoizedMergedChildContext = e, B(we), B(pe), Y(pe, e)) : B(we), Y(we, n)
}
var ju = null,
    jt = null,
    vh = ne.unstable_runWithPriority,
    Du = ne.unstable_scheduleCallback,
    Pl = ne.unstable_cancelCallback,
    gh = ne.unstable_shouldYield,
    is = ne.unstable_requestPaint,
    Ol = ne.unstable_now,
    yh = ne.unstable_getCurrentPriorityLevel,
    lo = ne.unstable_ImmediatePriority,
    gc = ne.unstable_UserBlockingPriority,
    yc = ne.unstable_NormalPriority,
    wc = ne.unstable_LowPriority,
    Sc = ne.unstable_IdlePriority,
    zo = {},
    wh = is !== void 0 ? is : function() {},
    He = null,
    ci = null,
    Vo = !1,
    os = Ol(),
    ce = 1e4 > os ? Ol : function() {
        return Ol() - os
    };

function wn() {
    switch (yh()) {
        case lo:
            return 99;
        case gc:
            return 98;
        case yc:
            return 97;
        case wc:
            return 96;
        case Sc:
            return 95;
        default:
            throw Error(k(332))
    }
}

function Ec(e) {
    switch (e) {
        case 99:
            return lo;
        case 98:
            return gc;
        case 97:
            return yc;
        case 96:
            return wc;
        case 95:
            return Sc;
        default:
            throw Error(k(332))
    }
}

function Nt(e, t) {
    return e = Ec(e), vh(e, t)
}

function _r(e, t, n) {
    return e = Ec(e), Du(e, t, n)
}

function Ge() {
    if (ci !== null) {
        var e = ci;
        ci = null, Pl(e)
    }
    xc()
}

function xc() {
    if (!Vo && He !== null) {
        Vo = !0;
        var e = 0;
        try {
            var t = He;
            Nt(99, function() {
                for (; e < t.length; e++) {
                    var n = t[e];
                    do n = n(!0); while (n !== null)
                }
            }), He = null
        } catch (n) {
            throw He !== null && (He = He.slice(e + 1)), Du(lo, Ge), n
        } finally {
            Vo = !1
        }
    }
}
var Sh = Vt.ReactCurrentBatchConfig;

function Ae(e, t) {
    if (e && e.defaultProps) {
        t = G({}, t), e = e.defaultProps;
        for (var n in e) t[n] === void 0 && (t[n] = e[n]);
        return t
    }
    return t
}
var Li = wt(null),
    Ai = null,
    nn = null,
    Ii = null;

function Lu() {
    Ii = nn = Ai = null
}

function Au(e) {
    var t = Li.current;
    B(Li), e.type._context._currentValue = t
}

function kc(e, t) {
    for (; e !== null;) {
        var n = e.alternate;
        if ((e.childLanes & t) === t) {
            if (n === null || (n.childLanes & t) === t) break;
            n.childLanes |= t
        } else e.childLanes |= t, n !== null && (n.childLanes |= t);
        e = e.return
    }
}

function cn(e, t) {
    Ai = e, Ii = nn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && ($e = !0), e.firstContext = null)
}

function Me(e, t) {
    if (Ii !== e && t !== !1 && t !== 0)
        if ((typeof t != "number" || t === 1073741823) && (Ii = e, t = 1073741823), t = {
                context: e,
                observedBits: t,
                next: null
            }, nn === null) {
            if (Ai === null) throw Error(k(308));
            nn = t, Ai.dependencies = {
                lanes: 0,
                firstContext: t,
                responders: null
            }
        } else nn = nn.next = t;
    return e._currentValue
}
var tt = !1;

function Iu(e) {
    e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null
        },
        effects: null
    }
}

function _c(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects
    })
}

function st(e, t) {
    return {
        eventTime: e,
        lane: t,
        tag: 0,
        payload: null,
        callback: null,
        next: null
    }
}

function ft(e, t) {
    if (e = e.updateQueue, e !== null) {
        e = e.shared;
        var n = e.pending;
        n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t
    }
}

function ls(e, t) {
    var n = e.updateQueue,
        r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
        var o = null,
            i = null;
        if (n = n.firstBaseUpdate, n !== null) {
            do {
                var l = {
                    eventTime: n.eventTime,
                    lane: n.lane,
                    tag: n.tag,
                    payload: n.payload,
                    callback: n.callback,
                    next: null
                };
                i === null ? o = i = l : i = i.next = l, n = n.next
            } while (n !== null);
            i === null ? o = i = t : i = i.next = t
        } else o = i = t;
        n = {
            baseState: r.baseState,
            firstBaseUpdate: o,
            lastBaseUpdate: i,
            shared: r.shared,
            effects: r.effects
        }, e.updateQueue = n;
        return
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t
}

function Pr(e, t, n, r) {
    var o = e.updateQueue;
    tt = !1;
    var i = o.firstBaseUpdate,
        l = o.lastBaseUpdate,
        u = o.shared.pending;
    if (u !== null) {
        o.shared.pending = null;
        var a = u,
            s = a.next;
        a.next = null, l === null ? i = s : l.next = s, l = a;
        var c = e.alternate;
        if (c !== null) {
            c = c.updateQueue;
            var m = c.lastBaseUpdate;
            m !== l && (m === null ? c.firstBaseUpdate = s : m.next = s, c.lastBaseUpdate = a)
        }
    }
    if (i !== null) {
        m = o.baseState, l = 0, c = s = a = null;
        do {
            u = i.lane;
            var h = i.eventTime;
            if ((r & u) === u) {
                c !== null && (c = c.next = {
                    eventTime: h,
                    lane: 0,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                });
                e: {
                    var g = e,
                        E = i;
                    switch (u = t, h = n, E.tag) {
                        case 1:
                            if (g = E.payload, typeof g == "function") {
                                m = g.call(h, m, u);
                                break e
                            }
                            m = g;
                            break e;
                        case 3:
                            g.flags = g.flags & -4097 | 64;
                        case 0:
                            if (g = E.payload, u = typeof g == "function" ? g.call(h, m, u) : g, u == null) break e;
                            m = G({}, m, u);
                            break e;
                        case 2:
                            tt = !0
                    }
                }
                i.callback !== null && (e.flags |= 32, u = o.effects, u === null ? o.effects = [i] : u.push(i))
            } else h = {
                eventTime: h,
                lane: u,
                tag: i.tag,
                payload: i.payload,
                callback: i.callback,
                next: null
            }, c === null ? (s = c = h, a = m) : c = c.next = h, l |= u;
            if (i = i.next, i === null) {
                if (u = o.shared.pending, u === null) break;
                i = u.next, u.next = null, o.lastBaseUpdate = u, o.shared.pending = null
            }
        } while (1);
        c === null && (a = m), o.baseState = a, o.firstBaseUpdate = s, o.lastBaseUpdate = c, Nr |= l, e.lanes = l, e.memoizedState = m
    }
}

function us(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null)
        for (t = 0; t < e.length; t++) {
            var r = e[t],
                o = r.callback;
            if (o !== null) {
                if (r.callback = null, r = n, typeof o != "function") throw Error(k(191, o));
                o.call(r)
            }
        }
}
var Pc = new qi.Component().refs;

function Ni(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : G({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n)
}
var uo = {
    isMounted: function(e) {
        return (e = e._reactInternals) ? bt(e) === e : !1
    },
    enqueueSetState: function(e, t, n) {
        e = e._reactInternals;
        var r = xe(),
            o = ct(e),
            i = st(r, o);
        i.payload = t, n != null && (i.callback = n), ft(e, i), dt(e, o, r)
    },
    enqueueReplaceState: function(e, t, n) {
        e = e._reactInternals;
        var r = xe(),
            o = ct(e),
            i = st(r, o);
        i.tag = 1, i.payload = t, n != null && (i.callback = n), ft(e, i), dt(e, o, r)
    },
    enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var n = xe(),
            r = ct(e),
            o = st(n, r);
        o.tag = 2, t != null && (o.callback = t), ft(e, o), dt(e, r, n)
    }
};

function as(e, t, n, r, o, i, l) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, l) : t.prototype && t.prototype.isPureReactComponent ? !xr(n, r) || !xr(o, i) : !0
}

function Oc(e, t, n) {
    var r = !1,
        o = vt,
        i = t.contextType;
    return typeof i == "object" && i !== null ? i = Me(i) : (o = Se(t) ? It : pe.current, r = t.contextTypes, i = (r = r != null) ? yn(e, o) : vt), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = uo, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t
}

function ss(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && uo.enqueueReplaceState(t, t.state, null)
}

function Cl(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = Pc, Iu(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? o.context = Me(i) : (i = Se(t) ? It : pe.current, o.context = yn(e, i)), Pr(e, n, o, r), o.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (Ni(e, t, i, n), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (t = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), t !== o.state && uo.enqueueReplaceState(o, o.state, null), Pr(e, n, o, r), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4)
}
var Hr = Array.isArray;

function zn(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
        if (n._owner) {
            if (n = n._owner, n) {
                if (n.tag !== 1) throw Error(k(309));
                var r = n.stateNode
            }
            if (!r) throw Error(k(147, e));
            var o = "" + e;
            return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
                var l = r.refs;
                l === Pc && (l = r.refs = {}), i === null ? delete l[o] : l[o] = i
            }, t._stringRef = o, t)
        }
        if (typeof e != "string") throw Error(k(284));
        if (!n._owner) throw Error(k(290, e))
    }
    return e
}

function Kr(e, t) {
    if (e.type !== "textarea") throw Error(k(31, Object.prototype.toString.call(t) === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : t))
}

function Cc(e) {
    function t(p, f) {
        if (e) {
            var d = p.lastEffect;
            d !== null ? (d.nextEffect = f, p.lastEffect = f) : p.firstEffect = p.lastEffect = f, f.nextEffect = null, f.flags = 8
        }
    }

    function n(p, f) {
        if (!e) return null;
        for (; f !== null;) t(p, f), f = f.sibling;
        return null
    }

    function r(p, f) {
        for (p = new Map; f !== null;) f.key !== null ? p.set(f.key, f) : p.set(f.index, f), f = f.sibling;
        return p
    }

    function o(p, f) {
        return p = yt(p, f), p.index = 0, p.sibling = null, p
    }

    function i(p, f, d) {
        return p.index = d, e ? (d = p.alternate, d !== null ? (d = d.index, d < f ? (p.flags = 2, f) : d) : (p.flags = 2, f)) : f
    }

    function l(p) {
        return e && p.alternate === null && (p.flags = 2), p
    }

    function u(p, f, d, v) {
        return f === null || f.tag !== 6 ? (f = Go(d, p.mode, v), f.return = p, f) : (f = o(f, d), f.return = p, f)
    }

    function a(p, f, d, v) {
        return f !== null && f.elementType === d.type ? (v = o(f, d.props), v.ref = zn(p, f, d), v.return = p, v) : (v = mi(d.type, d.key, d.props, null, p.mode, v), v.ref = zn(p, f, d), v.return = p, v)
    }

    function s(p, f, d, v) {
        return f === null || f.tag !== 4 || f.stateNode.containerInfo !== d.containerInfo || f.stateNode.implementation !== d.implementation ? (f = Ho(d, p.mode, v), f.return = p, f) : (f = o(f, d.children || []), f.return = p, f)
    }

    function c(p, f, d, v, y) {
        return f === null || f.tag !== 7 ? (f = mn(d, p.mode, v, y), f.return = p, f) : (f = o(f, d), f.return = p, f)
    }

    function m(p, f, d) {
        if (typeof f == "string" || typeof f == "number") return f = Go("" + f, p.mode, d), f.return = p, f;
        if (typeof f == "object" && f !== null) {
            switch (f.$$typeof) {
                case Hn:
                    return d = mi(f.type, f.key, f.props, null, p.mode, d), d.ref = zn(p, null, f), d.return = p, d;
                case Ot:
                    return f = Ho(f, p.mode, d), f.return = p, f
            }
            if (Hr(f) || Ln(f)) return f = mn(f, p.mode, d, null), f.return = p, f;
            Kr(p, f)
        }
        return null
    }

    function h(p, f, d, v) {
        var y = f !== null ? f.key : null;
        if (typeof d == "string" || typeof d == "number") return y !== null ? null : u(p, f, "" + d, v);
        if (typeof d == "object" && d !== null) {
            switch (d.$$typeof) {
                case Hn:
                    return d.key === y ? d.type === nt ? c(p, f, d.props.children, v, y) : a(p, f, d, v) : null;
                case Ot:
                    return d.key === y ? s(p, f, d, v) : null
            }
            if (Hr(d) || Ln(d)) return y !== null ? null : c(p, f, d, v, null);
            Kr(p, d)
        }
        return null
    }

    function g(p, f, d, v, y) {
        if (typeof v == "string" || typeof v == "number") return p = p.get(d) || null, u(f, p, "" + v, y);
        if (typeof v == "object" && v !== null) {
            switch (v.$$typeof) {
                case Hn:
                    return p = p.get(v.key === null ? d : v.key) || null, v.type === nt ? c(f, p, v.props.children, y, v.key) : a(f, p, v, y);
                case Ot:
                    return p = p.get(v.key === null ? d : v.key) || null, s(f, p, v, y)
            }
            if (Hr(v) || Ln(v)) return p = p.get(d) || null, c(f, p, v, y, null);
            Kr(f, v)
        }
        return null
    }

    function E(p, f, d, v) {
        for (var y = null, C = null, x = f, T = f = 0, M = null; x !== null && T < d.length; T++) {
            x.index > T ? (M = x, x = null) : M = x.sibling;
            var P = h(p, x, d[T], v);
            if (P === null) {
                x === null && (x = M);
                break
            }
            e && x && P.alternate === null && t(p, x), f = i(P, f, T), C === null ? y = P : C.sibling = P, C = P, x = M
        }
        if (T === d.length) return n(p, x), y;
        if (x === null) {
            for (; T < d.length; T++) x = m(p, d[T], v), x !== null && (f = i(x, f, T), C === null ? y = x : C.sibling = x, C = x);
            return y
        }
        for (x = r(p, x); T < d.length; T++) M = g(x, p, T, d[T], v), M !== null && (e && M.alternate !== null && x.delete(M.key === null ? T : M.key), f = i(M, f, T), C === null ? y = M : C.sibling = M, C = M);
        return e && x.forEach(function(D) {
            return t(p, D)
        }), y
    }

    function S(p, f, d, v) {
        var y = Ln(d);
        if (typeof y != "function") throw Error(k(150));
        if (d = y.call(d), d == null) throw Error(k(151));
        for (var C = y = null, x = f, T = f = 0, M = null, P = d.next(); x !== null && !P.done; T++, P = d.next()) {
            x.index > T ? (M = x, x = null) : M = x.sibling;
            var D = h(p, x, P.value, v);
            if (D === null) {
                x === null && (x = M);
                break
            }
            e && x && D.alternate === null && t(p, x), f = i(D, f, T), C === null ? y = D : C.sibling = D, C = D, x = M
        }
        if (P.done) return n(p, x), y;
        if (x === null) {
            for (; !P.done; T++, P = d.next()) P = m(p, P.value, v), P !== null && (f = i(P, f, T), C === null ? y = P : C.sibling = P, C = P);
            return y
        }
        for (x = r(p, x); !P.done; T++, P = d.next()) P = g(x, p, T, P.value, v), P !== null && (e && P.alternate !== null && x.delete(P.key === null ? T : P.key), f = i(P, f, T), C === null ? y = P : C.sibling = P, C = P);
        return e && x.forEach(function(F) {
            return t(p, F)
        }), y
    }
    return function(p, f, d, v) {
        var y = typeof d == "object" && d !== null && d.type === nt && d.key === null;
        y && (d = d.props.children);
        var C = typeof d == "object" && d !== null;
        if (C) switch (d.$$typeof) {
            case Hn:
                e: {
                    for (C = d.key, y = f; y !== null;) {
                        if (y.key === C) {
                            switch (y.tag) {
                                case 7:
                                    if (d.type === nt) {
                                        n(p, y.sibling), f = o(y, d.props.children), f.return = p, p = f;
                                        break e
                                    }
                                    break;
                                default:
                                    if (y.elementType === d.type) {
                                        n(p, y.sibling), f = o(y, d.props), f.ref = zn(p, y, d), f.return = p, p = f;
                                        break e
                                    }
                            }
                            n(p, y);
                            break
                        } else t(p, y);
                        y = y.sibling
                    }
                    d.type === nt ? (f = mn(d.props.children, p.mode, v, d.key), f.return = p, p = f) : (v = mi(d.type, d.key, d.props, null, p.mode, v), v.ref = zn(p, f, d), v.return = p, p = v)
                }
                return l(p);
            case Ot:
                e: {
                    for (y = d.key; f !== null;) {
                        if (f.key === y)
                            if (f.tag === 4 && f.stateNode.containerInfo === d.containerInfo && f.stateNode.implementation === d.implementation) {
                                n(p, f.sibling), f = o(f, d.children || []), f.return = p, p = f;
                                break e
                            } else {
                                n(p, f);
                                break
                            }
                        else t(p, f);
                        f = f.sibling
                    }
                    f = Ho(d, p.mode, v),
                    f.return = p,
                    p = f
                }
                return l(p)
        }
        if (typeof d == "string" || typeof d == "number") return d = "" + d, f !== null && f.tag === 6 ? (n(p, f.sibling), f = o(f, d), f.return = p, p = f) : (n(p, f), f = Go(d, p.mode, v), f.return = p, p = f), l(p);
        if (Hr(d)) return E(p, f, d, v);
        if (Ln(d)) return S(p, f, d, v);
        if (C && Kr(p, d), typeof d > "u" && !y) switch (p.tag) {
            case 1:
            case 22:
            case 0:
            case 11:
            case 15:
                throw Error(k(152, ln(p.type) || "Component"))
        }
        return n(p, f)
    }
}
var $i = Cc(!0),
    Tc = Cc(!1),
    Ir = {},
    Ue = wt(Ir),
    Or = wt(Ir),
    Cr = wt(Ir);

function Rt(e) {
    if (e === Ir) throw Error(k(174));
    return e
}

function Tl(e, t) {
    switch (Y(Cr, t), Y(Or, e), Y(Ue, Ir), e = t.nodeType, e) {
        case 9:
        case 11:
            t = (t = t.documentElement) ? t.namespaceURI : dl(null, "");
            break;
        default:
            e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = dl(t, e)
    }
    B(Ue), Y(Ue, t)
}

function Sn() {
    B(Ue), B(Or), B(Cr)
}

function fs(e) {
    Rt(Cr.current);
    var t = Rt(Ue.current),
        n = dl(t, e.type);
    t !== n && (Y(Or, e), Y(Ue, n))
}

function Nu(e) {
    Or.current === e && (B(Ue), B(Or))
}
var Q = wt(0);

function Fi(e) {
    for (var t = e; t !== null;) {
        if (t.tag === 13) {
            var n = t.memoizedState;
            if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t
        } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
            if ((t.flags & 64) !== 0) return t
        } else if (t.child !== null) {
            t.child.return = t, t = t.child;
            continue
        }
        if (t === e) break;
        for (; t.sibling === null;) {
            if (t.return === null || t.return === e) return null;
            t = t.return
        }
        t.sibling.return = t.return, t = t.sibling
    }
    return null
}
var Qe = null,
    ot = null,
    Be = !1;

function Rc(e, t) {
    var n = Ce(5, null, null, 0);
    n.elementType = "DELETED", n.type = "DELETED", n.stateNode = t, n.return = e, n.flags = 8, e.lastEffect !== null ? (e.lastEffect.nextEffect = n, e.lastEffect = n) : e.firstEffect = e.lastEffect = n
}

function cs(e, t) {
    switch (e.tag) {
        case 5:
            var n = e.type;
            return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, !0) : !1;
        case 6:
            return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, !0) : !1;
        case 13:
            return !1;
        default:
            return !1
    }
}

function Rl(e) {
    if (Be) {
        var t = ot;
        if (t) {
            var n = t;
            if (!cs(e, t)) {
                if (t = fn(n.nextSibling), !t || !cs(e, t)) {
                    e.flags = e.flags & -1025 | 2, Be = !1, Qe = e;
                    return
                }
                Rc(Qe, n)
            }
            Qe = e, ot = fn(t.firstChild)
        } else e.flags = e.flags & -1025 | 2, Be = !1, Qe = e
    }
}

function ds(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return;
    Qe = e
}

function Qr(e) {
    if (e !== Qe) return !1;
    if (!Be) return ds(e), Be = !0, !1;
    var t = e.type;
    if (e.tag !== 5 || t !== "head" && t !== "body" && !kl(t, e.memoizedProps))
        for (t = ot; t;) Rc(e, t), t = fn(t.nextSibling);
    if (ds(e), e.tag === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(k(317));
        e: {
            for (e = e.nextSibling, t = 0; e;) {
                if (e.nodeType === 8) {
                    var n = e.data;
                    if (n === "/$") {
                        if (t === 0) {
                            ot = fn(e.nextSibling);
                            break e
                        }
                        t--
                    } else n !== "$" && n !== "$!" && n !== "$?" || t++
                }
                e = e.nextSibling
            }
            ot = null
        }
    } else ot = Qe ? fn(e.stateNode.nextSibling) : null;
    return !0
}

function bo() {
    ot = Qe = null, Be = !1
}
var dn = [];

function $u() {
    for (var e = 0; e < dn.length; e++) dn[e]._workInProgressVersionPrimary = null;
    dn.length = 0
}
var lr = Vt.ReactCurrentDispatcher,
    Re = Vt.ReactCurrentBatchConfig,
    Tr = 0,
    Z = null,
    se = null,
    oe = null,
    zi = !1,
    ur = !1;

function ge() {
    throw Error(k(321))
}

function Fu(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
        if (!Oe(e[n], t[n])) return !1;
    return !0
}

function zu(e, t, n, r, o, i) {
    if (Tr = i, Z = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, lr.current = e === null || e.memoizedState === null ? xh : kh, e = n(r, o), ur) {
        i = 0;
        do {
            if (ur = !1, !(25 > i)) throw Error(k(301));
            i += 1, oe = se = null, t.updateQueue = null, lr.current = _h, e = n(r, o)
        } while (ur)
    }
    if (lr.current = Bi, t = se !== null && se.next !== null, Tr = 0, oe = se = Z = null, zi = !1, t) throw Error(k(300));
    return e
}

function Mt() {
    var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
    };
    return oe === null ? Z.memoizedState = oe = e : oe = oe.next = e, oe
}

function Ut() {
    if (se === null) {
        var e = Z.alternate;
        e = e !== null ? e.memoizedState : null
    } else e = se.next;
    var t = oe === null ? Z.memoizedState : oe.next;
    if (t !== null) oe = t, se = e;
    else {
        if (e === null) throw Error(k(310));
        se = e, e = {
            memoizedState: se.memoizedState,
            baseState: se.baseState,
            baseQueue: se.baseQueue,
            queue: se.queue,
            next: null
        }, oe === null ? Z.memoizedState = oe = e : oe = oe.next = e
    }
    return oe
}

function Ve(e, t) {
    return typeof t == "function" ? t(e) : t
}

function Vn(e) {
    var t = Ut(),
        n = t.queue;
    if (n === null) throw Error(k(311));
    n.lastRenderedReducer = e;
    var r = se,
        o = r.baseQueue,
        i = n.pending;
    if (i !== null) {
        if (o !== null) {
            var l = o.next;
            o.next = i.next, i.next = l
        }
        r.baseQueue = o = i, n.pending = null
    }
    if (o !== null) {
        o = o.next, r = r.baseState;
        var u = l = i = null,
            a = o;
        do {
            var s = a.lane;
            if ((Tr & s) === s) u !== null && (u = u.next = {
                lane: 0,
                action: a.action,
                eagerReducer: a.eagerReducer,
                eagerState: a.eagerState,
                next: null
            }), r = a.eagerReducer === e ? a.eagerState : e(r, a.action);
            else {
                var c = {
                    lane: s,
                    action: a.action,
                    eagerReducer: a.eagerReducer,
                    eagerState: a.eagerState,
                    next: null
                };
                u === null ? (l = u = c, i = r) : u = u.next = c, Z.lanes |= s, Nr |= s
            }
            a = a.next
        } while (a !== null && a !== o);
        u === null ? i = r : u.next = l, Oe(r, t.memoizedState) || ($e = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = u, n.lastRenderedState = r
    }
    return [t.memoizedState, n.dispatch]
}

function bn(e) {
    var t = Ut(),
        n = t.queue;
    if (n === null) throw Error(k(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch,
        o = n.pending,
        i = t.memoizedState;
    if (o !== null) {
        n.pending = null;
        var l = o = o.next;
        do i = e(i, l.action), l = l.next; while (l !== o);
        Oe(i, t.memoizedState) || ($e = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i
    }
    return [i, r]
}

function ps(e, t, n) {
    var r = t._getVersion;
    r = r(t._source);
    var o = t._workInProgressVersionPrimary;
    if (o !== null ? e = o === r : (e = e.mutableReadLanes, (e = (Tr & e) === e) && (t._workInProgressVersionPrimary = r, dn.push(t))), e) return n(t._source);
    throw dn.push(t), Error(k(350))
}

function Mc(e, t, n, r) {
    var o = me;
    if (o === null) throw Error(k(349));
    var i = t._getVersion,
        l = i(t._source),
        u = lr.current,
        a = u.useState(function() {
            return ps(o, t, n)
        }),
        s = a[1],
        c = a[0];
    a = oe;
    var m = e.memoizedState,
        h = m.refs,
        g = h.getSnapshot,
        E = m.source;
    m = m.subscribe;
    var S = Z;
    return e.memoizedState = {
        refs: h,
        source: t,
        subscribe: r
    }, u.useEffect(function() {
        h.getSnapshot = n, h.setSnapshot = s;
        var p = i(t._source);
        if (!Oe(l, p)) {
            p = n(t._source), Oe(c, p) || (s(p), p = ct(S), o.mutableReadLanes |= p & o.pendingLanes), p = o.mutableReadLanes, o.entangledLanes |= p;
            for (var f = o.entanglements, d = p; 0 < d;) {
                var v = 31 - mt(d),
                    y = 1 << v;
                f[v] |= p, d &= ~y
            }
        }
    }, [n, t, r]), u.useEffect(function() {
        return r(t._source, function() {
            var p = h.getSnapshot,
                f = h.setSnapshot;
            try {
                f(p(t._source));
                var d = ct(S);
                o.mutableReadLanes |= d & o.pendingLanes
            } catch (v) {
                f(function() {
                    throw v
                })
            }
        })
    }, [t, r]), Oe(g, n) && Oe(E, t) && Oe(m, r) || (e = {
        pending: null,
        dispatch: null,
        lastRenderedReducer: Ve,
        lastRenderedState: c
    }, e.dispatch = s = Uu.bind(null, Z, e), a.queue = e, a.baseQueue = null, c = ps(o, t, n), a.memoizedState = a.baseState = c), c
}

function jc(e, t, n) {
    var r = Ut();
    return Mc(r, e, t, n)
}

function Un(e) {
    var t = Mt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = t.queue = {
        pending: null,
        dispatch: null,
        lastRenderedReducer: Ve,
        lastRenderedState: e
    }, e = e.dispatch = Uu.bind(null, Z, e), [t.memoizedState, e]
}

function Vi(e, t, n, r) {
    return e = {
        tag: e,
        create: t,
        destroy: n,
        deps: r,
        next: null
    }, t = Z.updateQueue, t === null ? (t = {
        lastEffect: null
    }, Z.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e
}

function hs(e) {
    var t = Mt();
    return e = {
        current: e
    }, t.memoizedState = e
}

function bi() {
    return Ut().memoizedState
}

function Ml(e, t, n, r) {
    var o = Mt();
    Z.flags |= e, o.memoizedState = Vi(1 | t, n, void 0, r === void 0 ? null : r)
}

function Vu(e, t, n, r) {
    var o = Ut();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (se !== null) {
        var l = se.memoizedState;
        if (i = l.destroy, r !== null && Fu(r, l.deps)) {
            Vi(t, n, i, r);
            return
        }
    }
    Z.flags |= e, o.memoizedState = Vi(1 | t, n, i, r)
}

function ms(e, t) {
    return Ml(516, 4, e, t)
}

function Ui(e, t) {
    return Vu(516, 4, e, t)
}

function Dc(e, t) {
    return Vu(4, 2, e, t)
}

function Lc(e, t) {
    if (typeof t == "function") return e = e(), t(e),
        function() {
            t(null)
        };
    if (t != null) return e = e(), t.current = e,
        function() {
            t.current = null
        }
}

function Ac(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Vu(4, 2, Lc.bind(null, t, e), n)
}

function bu() {}

function Ic(e, t) {
    var n = Ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Fu(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e)
}

function Nc(e, t) {
    var n = Ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Fu(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e)
}

function Eh(e, t) {
    var n = wn();
    Nt(98 > n ? 98 : n, function() {
        e(!0)
    }), Nt(97 < n ? 97 : n, function() {
        var r = Re.transition;
        Re.transition = 1;
        try {
            e(!1), t()
        } finally {
            Re.transition = r
        }
    })
}

function Uu(e, t, n) {
    var r = xe(),
        o = ct(e),
        i = {
            lane: o,
            action: n,
            eagerReducer: null,
            eagerState: null,
            next: null
        },
        l = t.pending;
    if (l === null ? i.next = i : (i.next = l.next, l.next = i), t.pending = i, l = e.alternate, e === Z || l !== null && l === Z) ur = zi = !0;
    else {
        if (e.lanes === 0 && (l === null || l.lanes === 0) && (l = t.lastRenderedReducer, l !== null)) try {
            var u = t.lastRenderedState,
                a = l(u, n);
            if (i.eagerReducer = l, i.eagerState = a, Oe(a, u)) return
        } catch {} finally {}
        dt(e, o, r)
    }
}
var Bi = {
        readContext: Me,
        useCallback: ge,
        useContext: ge,
        useEffect: ge,
        useImperativeHandle: ge,
        useLayoutEffect: ge,
        useMemo: ge,
        useReducer: ge,
        useRef: ge,
        useState: ge,
        useDebugValue: ge,
        useDeferredValue: ge,
        useTransition: ge,
        useMutableSource: ge,
        useOpaqueIdentifier: ge,
        unstable_isNewReconciler: !1
    },
    xh = {
        readContext: Me,
        useCallback: function(e, t) {
            return Mt().memoizedState = [e, t === void 0 ? null : t], e
        },
        useContext: Me,
        useEffect: ms,
        useImperativeHandle: function(e, t, n) {
            return n = n != null ? n.concat([e]) : null, Ml(4, 2, Lc.bind(null, t, e), n)
        },
        useLayoutEffect: function(e, t) {
            return Ml(4, 2, e, t)
        },
        useMemo: function(e, t) {
            var n = Mt();
            return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e
        },
        useReducer: function(e, t, n) {
            var r = Mt();
            return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = r.queue = {
                pending: null,
                dispatch: null,
                lastRenderedReducer: e,
                lastRenderedState: t
            }, e = e.dispatch = Uu.bind(null, Z, e), [r.memoizedState, e]
        },
        useRef: hs,
        useState: Un,
        useDebugValue: bu,
        useDeferredValue: function(e) {
            var t = Un(e),
                n = t[0],
                r = t[1];
            return ms(function() {
                var o = Re.transition;
                Re.transition = 1;
                try {
                    r(e)
                } finally {
                    Re.transition = o
                }
            }, [e]), n
        },
        useTransition: function() {
            var e = Un(!1),
                t = e[0];
            return e = Eh.bind(null, e[1]), hs(e), [e, t]
        },
        useMutableSource: function(e, t, n) {
            var r = Mt();
            return r.memoizedState = {
                refs: {
                    getSnapshot: t,
                    setSnapshot: null
                },
                source: e,
                subscribe: n
            }, Mc(r, e, t, n)
        },
        useOpaqueIdentifier: function() {
            if (Be) {
                var e = !1,
                    t = mh(function() {
                        throw e || (e = !0, n("r:" + (Fo++).toString(36))), Error(k(355))
                    }),
                    n = Un(t)[1];
                return (Z.mode & 2) === 0 && (Z.flags |= 516, Vi(5, function() {
                    n("r:" + (Fo++).toString(36))
                }, void 0, null)), t
            }
            return t = "r:" + (Fo++).toString(36), Un(t), t
        },
        unstable_isNewReconciler: !1
    },
    kh = {
        readContext: Me,
        useCallback: Ic,
        useContext: Me,
        useEffect: Ui,
        useImperativeHandle: Ac,
        useLayoutEffect: Dc,
        useMemo: Nc,
        useReducer: Vn,
        useRef: bi,
        useState: function() {
            return Vn(Ve)
        },
        useDebugValue: bu,
        useDeferredValue: function(e) {
            var t = Vn(Ve),
                n = t[0],
                r = t[1];
            return Ui(function() {
                var o = Re.transition;
                Re.transition = 1;
                try {
                    r(e)
                } finally {
                    Re.transition = o
                }
            }, [e]), n
        },
        useTransition: function() {
            var e = Vn(Ve)[0];
            return [bi().current, e]
        },
        useMutableSource: jc,
        useOpaqueIdentifier: function() {
            return Vn(Ve)[0]
        },
        unstable_isNewReconciler: !1
    },
    _h = {
        readContext: Me,
        useCallback: Ic,
        useContext: Me,
        useEffect: Ui,
        useImperativeHandle: Ac,
        useLayoutEffect: Dc,
        useMemo: Nc,
        useReducer: bn,
        useRef: bi,
        useState: function() {
            return bn(Ve)
        },
        useDebugValue: bu,
        useDeferredValue: function(e) {
            var t = bn(Ve),
                n = t[0],
                r = t[1];
            return Ui(function() {
                var o = Re.transition;
                Re.transition = 1;
                try {
                    r(e)
                } finally {
                    Re.transition = o
                }
            }, [e]), n
        },
        useTransition: function() {
            var e = bn(Ve)[0];
            return [bi().current, e]
        },
        useMutableSource: jc,
        useOpaqueIdentifier: function() {
            return bn(Ve)[0]
        },
        unstable_isNewReconciler: !1
    },
    Ph = Vt.ReactCurrentOwner,
    $e = !1;

function ye(e, t, n, r) {
    t.child = e === null ? Tc(t, null, n, r) : $i(t, e.child, n, r)
}

function vs(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return cn(t, o), r = zu(e, t, n, r, i, o), e !== null && !$e ? (t.updateQueue = e.updateQueue, t.flags &= -517, e.lanes &= ~o, Ye(e, t, o)) : (t.flags |= 1, ye(e, t, r, o), t.child)
}

function gs(e, t, n, r, o, i) {
    if (e === null) {
        var l = n.type;
        return typeof l == "function" && !Qu(l) && l.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = l, $c(e, t, l, r, o, i)) : (e = mi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e)
    }
    return l = e.child, (o & i) === 0 && (o = l.memoizedProps, n = n.compare, n = n !== null ? n : xr, n(o, r) && e.ref === t.ref) ? Ye(e, t, i) : (t.flags |= 1, e = yt(l, r), e.ref = t.ref, e.return = t, t.child = e)
}

function $c(e, t, n, r, o, i) {
    if (e !== null && xr(e.memoizedProps, r) && e.ref === t.ref)
        if ($e = !1, (i & o) !== 0)(e.flags & 16384) !== 0 && ($e = !0);
        else return t.lanes = e.lanes, Ye(e, t, i);
    return jl(e, t, n, r, i)
}

function Uo(e, t, n) {
    var r = t.pendingProps,
        o = r.children,
        i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden" || r.mode === "unstable-defer-without-hiding")
        if ((t.mode & 4) === 0) t.memoizedState = {
            baseLanes: 0
        }, Xr(t, n);
        else if ((n & 1073741824) !== 0) t.memoizedState = {
        baseLanes: 0
    }, Xr(t, i !== null ? i.baseLanes : n);
    else return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = {
        baseLanes: e
    }, Xr(t, e), null;
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, Xr(t, r);
    return ye(e, t, o, n), t.child
}

function Fc(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 128)
}

function jl(e, t, n, r, o) {
    var i = Se(n) ? It : pe.current;
    return i = yn(t, i), cn(t, o), n = zu(e, t, n, r, i, o), e !== null && !$e ? (t.updateQueue = e.updateQueue, t.flags &= -517, e.lanes &= ~o, Ye(e, t, o)) : (t.flags |= 1, ye(e, t, n, o), t.child)
}

function ys(e, t, n, r, o) {
    if (Se(n)) {
        var i = !0;
        fi(t)
    } else i = !1;
    if (cn(t, o), t.stateNode === null) e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2), Oc(t, n, r), Cl(t, n, r, o), r = !0;
    else if (e === null) {
        var l = t.stateNode,
            u = t.memoizedProps;
        l.props = u;
        var a = l.context,
            s = n.contextType;
        typeof s == "object" && s !== null ? s = Me(s) : (s = Se(n) ? It : pe.current, s = yn(t, s));
        var c = n.getDerivedStateFromProps,
            m = typeof c == "function" || typeof l.getSnapshotBeforeUpdate == "function";
        m || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (u !== r || a !== s) && ss(t, l, r, s), tt = !1;
        var h = t.memoizedState;
        l.state = h, Pr(t, r, l, o), a = t.memoizedState, u !== r || h !== a || we.current || tt ? (typeof c == "function" && (Ni(t, n, c, r), a = t.memoizedState), (u = tt || as(t, n, u, r, h, a, s)) ? (m || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount()), typeof l.componentDidMount == "function" && (t.flags |= 4)) : (typeof l.componentDidMount == "function" && (t.flags |= 4), t.memoizedProps = r, t.memoizedState = a), l.props = r, l.state = a, l.context = s, r = u) : (typeof l.componentDidMount == "function" && (t.flags |= 4), r = !1)
    } else {
        l = t.stateNode, _c(e, t), u = t.memoizedProps, s = t.type === t.elementType ? u : Ae(t.type, u), l.props = s, m = t.pendingProps, h = l.context, a = n.contextType, typeof a == "object" && a !== null ? a = Me(a) : (a = Se(n) ? It : pe.current, a = yn(t, a));
        var g = n.getDerivedStateFromProps;
        (c = typeof g == "function" || typeof l.getSnapshotBeforeUpdate == "function") || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (u !== m || h !== a) && ss(t, l, r, a), tt = !1, h = t.memoizedState, l.state = h, Pr(t, r, l, o);
        var E = t.memoizedState;
        u !== m || h !== E || we.current || tt ? (typeof g == "function" && (Ni(t, n, g, r), E = t.memoizedState), (s = tt || as(t, n, s, r, h, E, a)) ? (c || typeof l.UNSAFE_componentWillUpdate != "function" && typeof l.componentWillUpdate != "function" || (typeof l.componentWillUpdate == "function" && l.componentWillUpdate(r, E, a), typeof l.UNSAFE_componentWillUpdate == "function" && l.UNSAFE_componentWillUpdate(r, E, a)), typeof l.componentDidUpdate == "function" && (t.flags |= 4), typeof l.getSnapshotBeforeUpdate == "function" && (t.flags |= 256)) : (typeof l.componentDidUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 256), t.memoizedProps = r, t.memoizedState = E), l.props = r, l.state = E, l.context = a, r = s) : (typeof l.componentDidUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && h === e.memoizedState || (t.flags |= 256), r = !1)
    }
    return Dl(e, t, n, r, i, o)
}

function Dl(e, t, n, r, o, i) {
    Fc(e, t);
    var l = (t.flags & 64) !== 0;
    if (!r && !l) return o && rs(t, n, !1), Ye(e, t, i);
    r = t.stateNode, Ph.current = t;
    var u = l && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && l ? (t.child = $i(t, e.child, null, i), t.child = $i(t, null, u, i)) : ye(e, t, u, i), t.memoizedState = r.state, o && rs(t, n, !0), t.child
}

function ws(e) {
    var t = e.stateNode;
    t.pendingContext ? ns(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ns(e, t.context, !1), Tl(e, t.containerInfo)
}
var Yr = {
    dehydrated: null,
    retryLane: 0
};

function Ss(e, t, n) {
    var r = t.pendingProps,
        o = Q.current,
        i = !1,
        l;
    return (l = (t.flags & 64) !== 0) || (l = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0), l ? (i = !0, t.flags &= -65) : e !== null && e.memoizedState === null || r.fallback === void 0 || r.unstable_avoidThisFallback === !0 || (o |= 1), Y(Q, o & 1), e === null ? (r.fallback !== void 0 && Rl(t), e = r.children, o = r.fallback, i ? (e = Es(t, e, o, n), t.child.memoizedState = {
        baseLanes: n
    }, t.memoizedState = Yr, e) : typeof r.unstable_expectedLoadTime == "number" ? (e = Es(t, e, o, n), t.child.memoizedState = {
        baseLanes: n
    }, t.memoizedState = Yr, t.lanes = 33554432, e) : (n = Yu({
        mode: "visible",
        children: e
    }, t.mode, n, null), n.return = t, t.child = n)) : e.memoizedState !== null ? i ? (r = ks(e, t, r.children, r.fallback, n), i = t.child, o = e.child.memoizedState, i.memoizedState = o === null ? {
        baseLanes: n
    } : {
        baseLanes: o.baseLanes | n
    }, i.childLanes = e.childLanes & ~n, t.memoizedState = Yr, r) : (n = xs(e, t, r.children, n), t.memoizedState = null, n) : i ? (r = ks(e, t, r.children, r.fallback, n), i = t.child, o = e.child.memoizedState, i.memoizedState = o === null ? {
        baseLanes: n
    } : {
        baseLanes: o.baseLanes | n
    }, i.childLanes = e.childLanes & ~n, t.memoizedState = Yr, r) : (n = xs(e, t, r.children, n), t.memoizedState = null, n)
}

function Es(e, t, n, r) {
    var o = e.mode,
        i = e.child;
    return t = {
        mode: "hidden",
        children: t
    }, (o & 2) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = t) : i = Yu(t, o, 0, null), n = mn(n, o, r, null), i.return = e, n.return = e, i.sibling = n, e.child = i, n
}

function xs(e, t, n, r) {
    var o = e.child;
    return e = o.sibling, n = yt(o, {
        mode: "visible",
        children: n
    }), (t.mode & 2) === 0 && (n.lanes = r), n.return = t, n.sibling = null, e !== null && (e.nextEffect = null, e.flags = 8, t.firstEffect = t.lastEffect = e), t.child = n
}

function ks(e, t, n, r, o) {
    var i = t.mode,
        l = e.child;
    e = l.sibling;
    var u = {
        mode: "hidden",
        children: n
    };
    return (i & 2) === 0 && t.child !== l ? (n = t.child, n.childLanes = 0, n.pendingProps = u, l = n.lastEffect, l !== null ? (t.firstEffect = n.firstEffect, t.lastEffect = l, l.nextEffect = null) : t.firstEffect = t.lastEffect = null) : n = yt(l, u), e !== null ? r = yt(e, r) : (r = mn(r, i, o, null), r.flags |= 2), r.return = t, n.return = t, n.sibling = r, t.child = n, r
}

function _s(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    n !== null && (n.lanes |= t), kc(e.return, t)
}

function Bo(e, t, n, r, o, i) {
    var l = e.memoizedState;
    l === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: o,
        lastEffect: i
    } : (l.isBackwards = t, l.rendering = null, l.renderingStartTime = 0, l.last = r, l.tail = n, l.tailMode = o, l.lastEffect = i)
}

function Ps(e, t, n) {
    var r = t.pendingProps,
        o = r.revealOrder,
        i = r.tail;
    if (ye(e, t, r.children, n), r = Q.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 64;
    else {
        if (e !== null && (e.flags & 64) !== 0) e: for (e = t.child; e !== null;) {
            if (e.tag === 13) e.memoizedState !== null && _s(e, n);
            else if (e.tag === 19) _s(e, n);
            else if (e.child !== null) {
                e.child.return = e, e = e.child;
                continue
            }
            if (e === t) break e;
            for (; e.sibling === null;) {
                if (e.return === null || e.return === t) break e;
                e = e.return
            }
            e.sibling.return = e.return, e = e.sibling
        }
        r &= 1
    }
    if (Y(Q, r), (t.mode & 2) === 0) t.memoizedState = null;
    else switch (o) {
        case "forwards":
            for (n = t.child, o = null; n !== null;) e = n.alternate, e !== null && Fi(e) === null && (o = n), n = n.sibling;
            n = o, n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), Bo(t, !1, o, n, i, t.lastEffect);
            break;
        case "backwards":
            for (n = null, o = t.child, t.child = null; o !== null;) {
                if (e = o.alternate, e !== null && Fi(e) === null) {
                    t.child = o;
                    break
                }
                e = o.sibling, o.sibling = n, n = o, o = e
            }
            Bo(t, !0, n, null, i, t.lastEffect);
            break;
        case "together":
            Bo(t, !1, null, null, void 0, t.lastEffect);
            break;
        default:
            t.memoizedState = null
    }
    return t.child
}

function Ye(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Nr |= t.lanes, (n & t.childLanes) !== 0) {
        if (e !== null && t.child !== e.child) throw Error(k(153));
        if (t.child !== null) {
            for (e = t.child, n = yt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = yt(e, e.pendingProps), n.return = t;
            n.sibling = null
        }
        return t.child
    }
    return null
}
var zc, Ll, Vc, bc;
zc = function(e, t) {
    for (var n = t.child; n !== null;) {
        if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
        else if (n.tag !== 4 && n.child !== null) {
            n.child.return = n, n = n.child;
            continue
        }
        if (n === t) break;
        for (; n.sibling === null;) {
            if (n.return === null || n.return === t) return;
            n = n.return
        }
        n.sibling.return = n.return, n = n.sibling
    }
};
Ll = function() {};
Vc = function(e, t, n, r) {
    var o = e.memoizedProps;
    if (o !== r) {
        e = t.stateNode, Rt(Ue.current);
        var i = null;
        switch (n) {
            case "input":
                o = ll(e, o), r = ll(e, r), i = [];
                break;
            case "option":
                o = sl(e, o), r = sl(e, r), i = [];
                break;
            case "select":
                o = G({}, o, {
                    value: void 0
                }), r = G({}, r, {
                    value: void 0
                }), i = [];
                break;
            case "textarea":
                o = fl(e, o), r = fl(e, r), i = [];
                break;
            default:
                typeof o.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Mi)
        }
        pl(n, r);
        var l;
        n = null;
        for (s in o)
            if (!r.hasOwnProperty(s) && o.hasOwnProperty(s) && o[s] != null)
                if (s === "style") {
                    var u = o[s];
                    for (l in u) u.hasOwnProperty(l) && (n || (n = {}), n[l] = "")
                } else s !== "dangerouslySetInnerHTML" && s !== "children" && s !== "suppressContentEditableWarning" && s !== "suppressHydrationWarning" && s !== "autoFocus" && (mr.hasOwnProperty(s) ? i || (i = []) : (i = i || []).push(s, null));
        for (s in r) {
            var a = r[s];
            if (u = o != null ? o[s] : void 0, r.hasOwnProperty(s) && a !== u && (a != null || u != null))
                if (s === "style")
                    if (u) {
                        for (l in u) !u.hasOwnProperty(l) || a && a.hasOwnProperty(l) || (n || (n = {}), n[l] = "");
                        for (l in a) a.hasOwnProperty(l) && u[l] !== a[l] && (n || (n = {}), n[l] = a[l])
                    } else n || (i || (i = []), i.push(s, n)), n = a;
            else s === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, u = u ? u.__html : void 0, a != null && u !== a && (i = i || []).push(s, a)) : s === "children" ? typeof a != "string" && typeof a != "number" || (i = i || []).push(s, "" + a) : s !== "suppressContentEditableWarning" && s !== "suppressHydrationWarning" && (mr.hasOwnProperty(s) ? (a != null && s === "onScroll" && U("scroll", e), i || u === a || (i = [])) : typeof a == "object" && a !== null && a.$$typeof === mu ? a.toString() : (i = i || []).push(s, a))
        }
        n && (i = i || []).push("style", n);
        var s = i;
        (t.updateQueue = s) && (t.flags |= 4)
    }
};
bc = function(e, t, n, r) {
    n !== r && (t.flags |= 4)
};

function Bn(e, t) {
    if (!Be) switch (e.tailMode) {
        case "hidden":
            t = e.tail;
            for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
            n === null ? e.tail = null : n.sibling = null;
            break;
        case "collapsed":
            n = e.tail;
            for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
            r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null
    }
}

function Oh(e, t, n) {
    var r = t.pendingProps;
    switch (t.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return null;
        case 1:
            return Se(t.type) && Di(), null;
        case 3:
            return Sn(), B(we), B(pe), $u(), r = t.stateNode, r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Qr(t) ? t.flags |= 4 : r.hydrate || (t.flags |= 256)), Ll(t), null;
        case 5:
            Nu(t);
            var o = Rt(Cr.current);
            if (n = t.type, e !== null && t.stateNode != null) Vc(e, t, n, r, o), e.ref !== t.ref && (t.flags |= 128);
            else {
                if (!r) {
                    if (t.stateNode === null) throw Error(k(166));
                    return null
                }
                if (e = Rt(Ue.current), Qr(t)) {
                    r = t.stateNode, n = t.type;
                    var i = t.memoizedProps;
                    switch (r[it] = t, r[ji] = i, n) {
                        case "dialog":
                            U("cancel", r), U("close", r);
                            break;
                        case "iframe":
                        case "object":
                        case "embed":
                            U("load", r);
                            break;
                        case "video":
                        case "audio":
                            for (e = 0; e < Qn.length; e++) U(Qn[e], r);
                            break;
                        case "source":
                            U("error", r);
                            break;
                        case "img":
                        case "image":
                        case "link":
                            U("error", r), U("load", r);
                            break;
                        case "details":
                            U("toggle", r);
                            break;
                        case "input":
                            Pa(r, i), U("invalid", r);
                            break;
                        case "select":
                            r._wrapperState = {
                                wasMultiple: !!i.multiple
                            }, U("invalid", r);
                            break;
                        case "textarea":
                            Ca(r, i), U("invalid", r)
                    }
                    pl(n, i), e = null;
                    for (var l in i) i.hasOwnProperty(l) && (o = i[l], l === "children" ? typeof o == "string" ? r.textContent !== o && (e = ["children", o]) : typeof o == "number" && r.textContent !== "" + o && (e = ["children", "" + o]) : mr.hasOwnProperty(l) && o != null && l === "onScroll" && U("scroll", r));
                    switch (n) {
                        case "input":
                            Ur(r), Oa(r, i, !0);
                            break;
                        case "textarea":
                            Ur(r), Ta(r);
                            break;
                        case "select":
                        case "option":
                            break;
                        default:
                            typeof i.onClick == "function" && (r.onclick = Mi)
                    }
                    r = e, t.updateQueue = r, r !== null && (t.flags |= 4)
                } else {
                    switch (l = o.nodeType === 9 ? o : o.ownerDocument, e === cl.html && (e = Af(n)), e === cl.html ? n === "script" ? (e = l.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = l.createElement(n, {
                        is: r.is
                    }) : (e = l.createElement(n), n === "select" && (l = e, r.multiple ? l.multiple = !0 : r.size && (l.size = r.size))) : e = l.createElementNS(e, n), e[it] = t, e[ji] = r, zc(e, t, !1, !1), t.stateNode = e, l = hl(n, r), n) {
                        case "dialog":
                            U("cancel", e), U("close", e), o = r;
                            break;
                        case "iframe":
                        case "object":
                        case "embed":
                            U("load", e), o = r;
                            break;
                        case "video":
                        case "audio":
                            for (o = 0; o < Qn.length; o++) U(Qn[o], e);
                            o = r;
                            break;
                        case "source":
                            U("error", e), o = r;
                            break;
                        case "img":
                        case "image":
                        case "link":
                            U("error", e), U("load", e), o = r;
                            break;
                        case "details":
                            U("toggle", e), o = r;
                            break;
                        case "input":
                            Pa(e, r), o = ll(e, r), U("invalid", e);
                            break;
                        case "option":
                            o = sl(e, r);
                            break;
                        case "select":
                            e._wrapperState = {
                                wasMultiple: !!r.multiple
                            }, o = G({}, r, {
                                value: void 0
                            }), U("invalid", e);
                            break;
                        case "textarea":
                            Ca(e, r), o = fl(e, r), U("invalid", e);
                            break;
                        default:
                            o = r
                    }
                    pl(n, o);
                    var u = o;
                    for (i in u)
                        if (u.hasOwnProperty(i)) {
                            var a = u[i];
                            i === "style" ? $f(e, a) : i === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && If(e, a)) : i === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && vr(e, a) : typeof a == "number" && vr(e, "" + a) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (mr.hasOwnProperty(i) ? a != null && i === "onScroll" && U("scroll", e) : a != null && su(e, i, a, l))
                        }
                    switch (n) {
                        case "input":
                            Ur(e), Oa(e, r, !1);
                            break;
                        case "textarea":
                            Ur(e), Ta(e);
                            break;
                        case "option":
                            r.value != null && e.setAttribute("value", "" + ht(r.value));
                            break;
                        case "select":
                            e.multiple = !!r.multiple, i = r.value, i != null ? un(e, !!r.multiple, i, !1) : r.defaultValue != null && un(e, !!r.multiple, r.defaultValue, !0);
                            break;
                        default:
                            typeof o.onClick == "function" && (e.onclick = Mi)
                    }
                    hc(n, r) && (t.flags |= 4)
                }
                t.ref !== null && (t.flags |= 128)
            }
            return null;
        case 6:
            if (e && t.stateNode != null) bc(e, t, e.memoizedProps, r);
            else {
                if (typeof r != "string" && t.stateNode === null) throw Error(k(166));
                n = Rt(Cr.current), Rt(Ue.current), Qr(t) ? (r = t.stateNode, n = t.memoizedProps, r[it] = t, r.nodeValue !== n && (t.flags |= 4)) : (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[it] = t, t.stateNode = r)
            }
            return null;
        case 13:
            return B(Q), r = t.memoizedState, (t.flags & 64) !== 0 ? (t.lanes = n, t) : (r = r !== null, n = !1, e === null ? t.memoizedProps.fallback !== void 0 && Qr(t) : n = e.memoizedState !== null, r && !n && (t.mode & 2) !== 0 && (e === null && t.memoizedProps.unstable_avoidThisFallback !== !0 || (Q.current & 1) !== 0 ? le === 0 && (le = 3) : ((le === 0 || le === 3) && (le = 4), me === null || (Nr & 134217727) === 0 && (Rn & 134217727) === 0 || pn(me, de))), (r || n) && (t.flags |= 4), null);
        case 4:
            return Sn(), Ll(t), e === null && cc(t.stateNode.containerInfo), null;
        case 10:
            return Au(t), null;
        case 17:
            return Se(t.type) && Di(), null;
        case 19:
            if (B(Q), r = t.memoizedState, r === null) return null;
            if (i = (t.flags & 64) !== 0, l = r.rendering, l === null)
                if (i) Bn(r, !1);
                else {
                    if (le !== 0 || e !== null && (e.flags & 64) !== 0)
                        for (e = t.child; e !== null;) {
                            if (l = Fi(e), l !== null) {
                                for (t.flags |= 64, Bn(r, !1), i = l.updateQueue, i !== null && (t.updateQueue = i, t.flags |= 4), r.lastEffect === null && (t.firstEffect = null), t.lastEffect = r.lastEffect, r = n, n = t.child; n !== null;) i = n, e = r, i.flags &= 2, i.nextEffect = null, i.firstEffect = null, i.lastEffect = null, l = i.alternate, l === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = l.childLanes, i.lanes = l.lanes, i.child = l.child, i.memoizedProps = l.memoizedProps, i.memoizedState = l.memoizedState, i.updateQueue = l.updateQueue, i.type = l.type, e = l.dependencies, i.dependencies = e === null ? null : {
                                    lanes: e.lanes,
                                    firstContext: e.firstContext
                                }), n = n.sibling;
                                return Y(Q, Q.current & 1 | 2), t.child
                            }
                            e = e.sibling
                        }
                    r.tail !== null && ce() > zl && (t.flags |= 64, i = !0, Bn(r, !1), t.lanes = 33554432)
                }
            else {
                if (!i)
                    if (e = Fi(l), e !== null) {
                        if (t.flags |= 64, i = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Bn(r, !0), r.tail === null && r.tailMode === "hidden" && !l.alternate && !Be) return t = t.lastEffect = r.lastEffect, t !== null && (t.nextEffect = null), null
                    } else 2 * ce() - r.renderingStartTime > zl && n !== 1073741824 && (t.flags |= 64, i = !0, Bn(r, !1), t.lanes = 33554432);
                r.isBackwards ? (l.sibling = t.child, t.child = l) : (n = r.last, n !== null ? n.sibling = l : t.child = l, r.last = l)
            }
            return r.tail !== null ? (n = r.tail, r.rendering = n, r.tail = n.sibling, r.lastEffect = t.lastEffect, r.renderingStartTime = ce(), n.sibling = null, t = Q.current, Y(Q, i ? t & 1 | 2 : t & 1), n) : null;
        case 23:
        case 24:
            return Ku(), e !== null && e.memoizedState !== null != (t.memoizedState !== null) && r.mode !== "unstable-defer-without-hiding" && (t.flags |= 4), null
    }
    throw Error(k(156, t.tag))
}

function Ch(e) {
    switch (e.tag) {
        case 1:
            Se(e.type) && Di();
            var t = e.flags;
            return t & 4096 ? (e.flags = t & -4097 | 64, e) : null;
        case 3:
            if (Sn(), B(we), B(pe), $u(), t = e.flags, (t & 64) !== 0) throw Error(k(285));
            return e.flags = t & -4097 | 64, e;
        case 5:
            return Nu(e), null;
        case 13:
            return B(Q), t = e.flags, t & 4096 ? (e.flags = t & -4097 | 64, e) : null;
        case 19:
            return B(Q), null;
        case 4:
            return Sn(), null;
        case 10:
            return Au(e), null;
        case 23:
        case 24:
            return Ku(), null;
        default:
            return null
    }
}

function Bu(e, t) {
    try {
        var n = "",
            r = t;
        do n += up(r), r = r.return; while (r);
        var o = n
    } catch (i) {
        o = `
Error generating stack: ` + i.message + `
` + i.stack
    }
    return {
        value: e,
        source: t,
        stack: o
    }
}

function Al(e, t) {
    try {
        console.error(t.value)
    } catch (n) {
        setTimeout(function() {
            throw n
        })
    }
}
var Th = typeof WeakMap == "function" ? WeakMap : Map;

function Uc(e, t, n) {
    n = st(-1, n), n.tag = 3, n.payload = {
        element: null
    };
    var r = t.value;
    return n.callback = function() {
        Gi || (Gi = !0, Vl = r), Al(e, t)
    }, n
}

function Bc(e, t, n) {
    n = st(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
        var o = t.value;
        n.payload = function() {
            return Al(e, t), r(o)
        }
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
        typeof r != "function" && (be === null ? be = new Set([this]) : be.add(this), Al(e, t));
        var l = t.stack;
        this.componentDidCatch(t.value, {
            componentStack: l !== null ? l : ""
        })
    }), n
}
var Rh = typeof WeakSet == "function" ? WeakSet : Set;

function Os(e) {
    var t = e.ref;
    if (t !== null)
        if (typeof t == "function") try {
            t(null)
        } catch (n) {
            pt(e, n)
        } else t.current = null
}

function Mh(e, t) {
    switch (t.tag) {
        case 0:
        case 11:
        case 15:
        case 22:
            return;
        case 1:
            if (t.flags & 256 && e !== null) {
                var n = e.memoizedProps,
                    r = e.memoizedState;
                e = t.stateNode, t = e.getSnapshotBeforeUpdate(t.elementType === t.type ? n : Ae(t.type, n), r), e.__reactInternalSnapshotBeforeUpdate = t
            }
            return;
        case 3:
            t.flags & 256 && Mu(t.stateNode.containerInfo);
            return;
        case 5:
        case 6:
        case 4:
        case 17:
            return
    }
    throw Error(k(163))
}

function jh(e, t, n) {
    switch (n.tag) {
        case 0:
        case 11:
        case 15:
        case 22:
            if (t = n.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
                e = t = t.next;
                do {
                    if ((e.tag & 3) === 3) {
                        var r = e.create;
                        e.destroy = r()
                    }
                    e = e.next
                } while (e !== t)
            }
            if (t = n.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
                e = t = t.next;
                do {
                    var o = e;
                    r = o.next, o = o.tag, (o & 4) !== 0 && (o & 1) !== 0 && (Zc(n, e), zh(n, e)), e = r
                } while (e !== t)
            }
            return;
        case 1:
            e = n.stateNode, n.flags & 4 && (t === null ? e.componentDidMount() : (r = n.elementType === n.type ? t.memoizedProps : Ae(n.type, t.memoizedProps), e.componentDidUpdate(r, t.memoizedState, e.__reactInternalSnapshotBeforeUpdate))), t = n.updateQueue, t !== null && us(n, t, e);
            return;
        case 3:
            if (t = n.updateQueue, t !== null) {
                if (e = null, n.child !== null) switch (n.child.tag) {
                    case 5:
                        e = n.child.stateNode;
                        break;
                    case 1:
                        e = n.child.stateNode
                }
                us(n, t, e)
            }
            return;
        case 5:
            e = n.stateNode, t === null && n.flags & 4 && hc(n.type, n.memoizedProps) && e.focus();
            return;
        case 6:
            return;
        case 4:
            return;
        case 12:
            return;
        case 13:
            n.memoizedState === null && (n = n.alternate, n !== null && (n = n.memoizedState, n !== null && (n = n.dehydrated, n !== null && Kf(n))));
            return;
        case 19:
        case 17:
        case 20:
        case 21:
        case 23:
        case 24:
            return
    }
    throw Error(k(163))
}

function Cs(e, t) {
    for (var n = e;;) {
        if (n.tag === 5) {
            var r = n.stateNode;
            if (t) r = r.style, typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
            else {
                r = n.stateNode;
                var o = n.memoizedProps.style;
                o = o != null && o.hasOwnProperty("display") ? o.display : null, r.style.display = Nf("display", o)
            }
        } else if (n.tag === 6) n.stateNode.nodeValue = t ? "" : n.memoizedProps;
        else if ((n.tag !== 23 && n.tag !== 24 || n.memoizedState === null || n === e) && n.child !== null) {
            n.child.return = n, n = n.child;
            continue
        }
        if (n === e) break;
        for (; n.sibling === null;) {
            if (n.return === null || n.return === e) return;
            n = n.return
        }
        n.sibling.return = n.return, n = n.sibling
    }
}

function Ts(e, t) {
    if (jt && typeof jt.onCommitFiberUnmount == "function") try {
        jt.onCommitFiberUnmount(ju, t)
    } catch {}
    switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
        case 22:
            if (e = t.updateQueue, e !== null && (e = e.lastEffect, e !== null)) {
                var n = e = e.next;
                do {
                    var r = n,
                        o = r.destroy;
                    if (r = r.tag, o !== void 0)
                        if ((r & 4) !== 0) Zc(t, n);
                        else {
                            r = t;
                            try {
                                o()
                            } catch (i) {
                                pt(r, i)
                            }
                        }
                    n = n.next
                } while (n !== e)
            }
            break;
        case 1:
            if (Os(t), e = t.stateNode, typeof e.componentWillUnmount == "function") try {
                e.props = t.memoizedProps, e.state = t.memoizedState, e.componentWillUnmount()
            } catch (i) {
                pt(t, i)
            }
            break;
        case 5:
            Os(t);
            break;
        case 4:
            Wc(e, t)
    }
}

function Rs(e) {
    e.alternate = null, e.child = null, e.dependencies = null, e.firstEffect = null, e.lastEffect = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.return = null, e.updateQueue = null
}

function Ms(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4
}

function js(e) {
    e: {
        for (var t = e.return; t !== null;) {
            if (Ms(t)) break e;
            t = t.return
        }
        throw Error(k(160))
    }
    var n = t;
    switch (t = n.stateNode, n.tag) {
        case 5:
            var r = !1;
            break;
        case 3:
            t = t.containerInfo, r = !0;
            break;
        case 4:
            t = t.containerInfo, r = !0;
            break;
        default:
            throw Error(k(161))
    }
    n.flags & 16 && (vr(t, ""), n.flags &= -17);e: t: for (n = e;;) {
        for (; n.sibling === null;) {
            if (n.return === null || Ms(n.return)) {
                n = null;
                break e
            }
            n = n.return
        }
        for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18;) {
            if (n.flags & 2 || n.child === null || n.tag === 4) continue t;
            n.child.return = n, n = n.child
        }
        if (!(n.flags & 2)) {
            n = n.stateNode;
            break e
        }
    }
    r ? Il(e, n, t) : Nl(e, n, t)
}

function Il(e, t, n) {
    var r = e.tag,
        o = r === 5 || r === 6;
    if (o) e = o ? e.stateNode : e.stateNode.instance, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Mi));
    else if (r !== 4 && (e = e.child, e !== null))
        for (Il(e, t, n), e = e.sibling; e !== null;) Il(e, t, n), e = e.sibling
}

function Nl(e, t, n) {
    var r = e.tag,
        o = r === 5 || r === 6;
    if (o) e = o ? e.stateNode : e.stateNode.instance, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null))
        for (Nl(e, t, n), e = e.sibling; e !== null;) Nl(e, t, n), e = e.sibling
}

function Wc(e, t) {
    for (var n = t, r = !1, o, i;;) {
        if (!r) {
            r = n.return;
            e: for (;;) {
                if (r === null) throw Error(k(160));
                switch (o = r.stateNode, r.tag) {
                    case 5:
                        i = !1;
                        break e;
                    case 3:
                        o = o.containerInfo, i = !0;
                        break e;
                    case 4:
                        o = o.containerInfo, i = !0;
                        break e
                }
                r = r.return
            }
            r = !0
        }
        if (n.tag === 5 || n.tag === 6) {
            e: for (var l = e, u = n, a = u;;)
                if (Ts(l, a), a.child !== null && a.tag !== 4) a.child.return = a, a = a.child;
                else {
                    if (a === u) break e;
                    for (; a.sibling === null;) {
                        if (a.return === null || a.return === u) break e;
                        a = a.return
                    }
                    a.sibling.return = a.return, a = a.sibling
                }i ? (l = o, u = n.stateNode, l.nodeType === 8 ? l.parentNode.removeChild(u) : l.removeChild(u)) : o.removeChild(n.stateNode)
        }
        else if (n.tag === 4) {
            if (n.child !== null) {
                o = n.stateNode.containerInfo, i = !0, n.child.return = n, n = n.child;
                continue
            }
        } else if (Ts(e, n), n.child !== null) {
            n.child.return = n, n = n.child;
            continue
        }
        if (n === t) break;
        for (; n.sibling === null;) {
            if (n.return === null || n.return === t) return;
            n = n.return, n.tag === 4 && (r = !1)
        }
        n.sibling.return = n.return, n = n.sibling
    }
}

function Wo(e, t) {
    switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
        case 22:
            var n = t.updateQueue;
            if (n = n !== null ? n.lastEffect : null, n !== null) {
                var r = n = n.next;
                do(r.tag & 3) === 3 && (e = r.destroy, r.destroy = void 0, e !== void 0 && e()), r = r.next; while (r !== n)
            }
            return;
        case 1:
            return;
        case 5:
            if (n = t.stateNode, n != null) {
                r = t.memoizedProps;
                var o = e !== null ? e.memoizedProps : r;
                e = t.type;
                var i = t.updateQueue;
                if (t.updateQueue = null, i !== null) {
                    for (n[ji] = r, e === "input" && r.type === "radio" && r.name != null && Df(n, r), hl(e, o), t = hl(e, r), o = 0; o < i.length; o += 2) {
                        var l = i[o],
                            u = i[o + 1];
                        l === "style" ? $f(n, u) : l === "dangerouslySetInnerHTML" ? If(n, u) : l === "children" ? vr(n, u) : su(n, l, u, t)
                    }
                    switch (e) {
                        case "input":
                            ul(n, r);
                            break;
                        case "textarea":
                            Lf(n, r);
                            break;
                        case "select":
                            e = n._wrapperState.wasMultiple, n._wrapperState.wasMultiple = !!r.multiple, i = r.value, i != null ? un(n, !!r.multiple, i, !1) : e !== !!r.multiple && (r.defaultValue != null ? un(n, !!r.multiple, r.defaultValue, !0) : un(n, !!r.multiple, r.multiple ? [] : "", !1))
                    }
                }
            }
            return;
        case 6:
            if (t.stateNode === null) throw Error(k(162));
            t.stateNode.nodeValue = t.memoizedProps;
            return;
        case 3:
            n = t.stateNode, n.hydrate && (n.hydrate = !1, Kf(n.containerInfo));
            return;
        case 12:
            return;
        case 13:
            t.memoizedState !== null && (Hu = ce(), Cs(t.child, !0)), Ds(t);
            return;
        case 19:
            Ds(t);
            return;
        case 17:
            return;
        case 23:
        case 24:
            Cs(t, t.memoizedState !== null);
            return
    }
    throw Error(k(163))
}

function Ds(e) {
    var t = e.updateQueue;
    if (t !== null) {
        e.updateQueue = null;
        var n = e.stateNode;
        n === null && (n = e.stateNode = new Rh), t.forEach(function(r) {
            var o = Uh.bind(null, e, r);
            n.has(r) || (n.add(r), r.then(o, o))
        })
    }
}

function Dh(e, t) {
    return e !== null && (e = e.memoizedState, e === null || e.dehydrated !== null) ? (t = t.memoizedState, t !== null && t.dehydrated === null) : !1
}
var Lh = Math.ceil,
    Wi = Vt.ReactCurrentDispatcher,
    Wu = Vt.ReactCurrentOwner,
    j = 0,
    me = null,
    ee = null,
    de = 0,
    $t = 0,
    $l = wt(0),
    le = 0,
    ao = null,
    Tn = 0,
    Nr = 0,
    Rn = 0,
    Gu = 0,
    Fl = null,
    Hu = 0,
    zl = 1 / 0;

function Mn() {
    zl = ce() + 500
}
var R = null,
    Gi = !1,
    Vl = null,
    be = null,
    gt = !1,
    ar = null,
    Yn = 90,
    bl = [],
    Ul = [],
    qe = null,
    sr = 0,
    Bl = null,
    di = -1,
    Ke = 0,
    pi = 0,
    fr = null,
    hi = !1;

function xe() {
    return (j & 48) !== 0 ? ce() : di !== -1 ? di : di = ce()
}

function ct(e) {
    if (e = e.mode, (e & 2) === 0) return 1;
    if ((e & 4) === 0) return wn() === 99 ? 1 : 2;
    if (Ke === 0 && (Ke = Tn), Sh.transition !== 0) {
        pi !== 0 && (pi = Fl !== null ? Fl.pendingLanes : 0), e = Ke;
        var t = 4186112 & ~pi;
        return t &= -t, t === 0 && (e = 4186112 & ~e, t = e & -e, t === 0 && (t = 8192)), t
    }
    return e = wn(), (j & 4) !== 0 && e === 98 ? e = Ti(12, Ke) : (e = kp(e), e = Ti(e, Ke)), e
}

function dt(e, t, n) {
    if (50 < sr) throw sr = 0, Bl = null, Error(k(185));
    if (e = so(e, t), e === null) return null;
    to(e, t, n), e === me && (Rn |= t, le === 4 && pn(e, de));
    var r = wn();
    t === 1 ? (j & 8) !== 0 && (j & 48) === 0 ? Wl(e) : (je(e, n), j === 0 && (Mn(), Ge())) : ((j & 4) === 0 || r !== 98 && r !== 99 || (qe === null ? qe = new Set([e]) : qe.add(e)), je(e, n)), Fl = e
}

function so(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null
}

function je(e, t) {
    for (var n = e.callbackNode, r = e.suspendedLanes, o = e.pingedLanes, i = e.expirationTimes, l = e.pendingLanes; 0 < l;) {
        var u = 31 - mt(l),
            a = 1 << u,
            s = i[u];
        if (s === -1) {
            if ((a & r) === 0 || (a & o) !== 0) {
                s = t, Yt(a);
                var c = V;
                i[u] = 10 <= c ? s + 250 : 6 <= c ? s + 5e3 : -1
            }
        } else s <= t && (e.expiredLanes |= a);
        l &= ~a
    }
    if (r = Sr(e, e === me ? de : 0), t = V, r === 0) n !== null && (n !== zo && Pl(n), e.callbackNode = null, e.callbackPriority = 0);
    else {
        if (n !== null) {
            if (e.callbackPriority === t) return;
            n !== zo && Pl(n)
        }
        t === 15 ? (n = Wl.bind(null, e), He === null ? (He = [n], ci = Du(lo, xc)) : He.push(n), n = zo) : t === 14 ? n = _r(99, Wl.bind(null, e)) : (n = _p(t), n = _r(n, Gc.bind(null, e))), e.callbackPriority = t, e.callbackNode = n
    }
}

function Gc(e) {
    if (di = -1, pi = Ke = 0, (j & 48) !== 0) throw Error(k(327));
    var t = e.callbackNode;
    if (St() && e.callbackNode !== t) return null;
    var n = Sr(e, e === me ? de : 0);
    if (n === 0) return null;
    var r = n,
        o = j;
    j |= 16;
    var i = Yc();
    (me !== e || de !== r) && (Mn(), hn(e, r));
    do try {
        Nh();
        break
    } catch (u) {
        Qc(e, u)
    }
    while (1);
    if (Lu(), Wi.current = i, j = o, ee !== null ? r = 0 : (me = null, de = 0, r = le), (Tn & Rn) !== 0) hn(e, 0);
    else if (r !== 0) {
        if (r === 2 && (j |= 64, e.hydrate && (e.hydrate = !1, Mu(e.containerInfo)), n = ec(e), n !== 0 && (r = Xn(e, n))), r === 1) throw t = ao, hn(e, 0), pn(e, n), je(e, ce()), t;
        switch (e.finishedWork = e.current.alternate, e.finishedLanes = n, r) {
            case 0:
            case 1:
                throw Error(k(345));
            case 2:
                Pt(e);
                break;
            case 3:
                if (pn(e, n), (n & 62914560) === n && (r = Hu + 500 - ce(), 10 < r)) {
                    if (Sr(e, 0) !== 0) break;
                    if (o = e.suspendedLanes, (o & n) !== n) {
                        xe(), e.pingedLanes |= e.suspendedLanes & o;
                        break
                    }
                    e.timeoutHandle = Ja(Pt.bind(null, e), r);
                    break
                }
                Pt(e);
                break;
            case 4:
                if (pn(e, n), (n & 4186112) === n) break;
                for (r = e.eventTimes, o = -1; 0 < n;) {
                    var l = 31 - mt(n);
                    i = 1 << l, l = r[l], l > o && (o = l), n &= ~i
                }
                if (n = o, n = ce() - n, n = (120 > n ? 120 : 480 > n ? 480 : 1080 > n ? 1080 : 1920 > n ? 1920 : 3e3 > n ? 3e3 : 4320 > n ? 4320 : 1960 * Lh(n / 1960)) - n, 10 < n) {
                    e.timeoutHandle = Ja(Pt.bind(null, e), n);
                    break
                }
                Pt(e);
                break;
            case 5:
                Pt(e);
                break;
            default:
                throw Error(k(329))
        }
    }
    return je(e, ce()), e.callbackNode === t ? Gc.bind(null, e) : null
}

function pn(e, t) {
    for (t &= ~Gu, t &= ~Rn, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t;) {
        var n = 31 - mt(t),
            r = 1 << n;
        e[n] = -1, t &= ~r
    }
}

function Wl(e) {
    if ((j & 48) !== 0) throw Error(k(327));
    if (St(), e === me && (e.expiredLanes & de) !== 0) {
        var t = de,
            n = Xn(e, t);
        (Tn & Rn) !== 0 && (t = Sr(e, t), n = Xn(e, t))
    } else t = Sr(e, 0), n = Xn(e, t);
    if (e.tag !== 0 && n === 2 && (j |= 64, e.hydrate && (e.hydrate = !1, Mu(e.containerInfo)), t = ec(e), t !== 0 && (n = Xn(e, t))), n === 1) throw n = ao, hn(e, 0), pn(e, t), je(e, ce()), n;
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Pt(e), je(e, ce()), null
}

function Ah() {
    if (qe !== null) {
        var e = qe;
        qe = null, e.forEach(function(t) {
            t.expiredLanes |= 24 & t.pendingLanes, je(t, ce())
        })
    }
    Ge()
}

function Hc(e, t) {
    var n = j;
    j |= 1;
    try {
        return e(t)
    } finally {
        j = n, j === 0 && (Mn(), Ge())
    }
}

function Kc(e, t) {
    var n = j;
    j &= -2, j |= 8;
    try {
        return e(t)
    } finally {
        j = n, j === 0 && (Mn(), Ge())
    }
}

function Xr(e, t) {
    Y($l, $t), $t |= t, Tn |= t
}

function Ku() {
    $t = $l.current, B($l)
}

function hn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, hh(n)), ee !== null)
        for (n = ee.return; n !== null;) {
            var r = n;
            switch (r.tag) {
                case 1:
                    r = r.type.childContextTypes, r != null && Di();
                    break;
                case 3:
                    Sn(), B(we), B(pe), $u();
                    break;
                case 5:
                    Nu(r);
                    break;
                case 4:
                    Sn();
                    break;
                case 13:
                    B(Q);
                    break;
                case 19:
                    B(Q);
                    break;
                case 10:
                    Au(r);
                    break;
                case 23:
                case 24:
                    Ku()
            }
            n = n.return
        }
    me = e, ee = yt(e.current, null), de = $t = Tn = t, le = 0, ao = null, Gu = Rn = Nr = 0
}

function Qc(e, t) {
    do {
        var n = ee;
        try {
            if (Lu(), lr.current = Bi, zi) {
                for (var r = Z.memoizedState; r !== null;) {
                    var o = r.queue;
                    o !== null && (o.pending = null), r = r.next
                }
                zi = !1
            }
            if (Tr = 0, oe = se = Z = null, ur = !1, Wu.current = null, n === null || n.return === null) {
                le = 1, ao = t, ee = null;
                break
            }
            e: {
                var i = e,
                    l = n.return,
                    u = n,
                    a = t;
                if (t = de, u.flags |= 2048, u.firstEffect = u.lastEffect = null, a !== null && typeof a == "object" && typeof a.then == "function") {
                    var s = a;
                    if ((u.mode & 2) === 0) {
                        var c = u.alternate;
                        c ? (u.updateQueue = c.updateQueue, u.memoizedState = c.memoizedState, u.lanes = c.lanes) : (u.updateQueue = null, u.memoizedState = null)
                    }
                    var m = (Q.current & 1) !== 0,
                        h = l;
                    do {
                        var g;
                        if (g = h.tag === 13) {
                            var E = h.memoizedState;
                            if (E !== null) g = E.dehydrated !== null;
                            else {
                                var S = h.memoizedProps;
                                g = S.fallback === void 0 ? !1 : S.unstable_avoidThisFallback !== !0 ? !0 : !m
                            }
                        }
                        if (g) {
                            var p = h.updateQueue;
                            if (p === null) {
                                var f = new Set;
                                f.add(s), h.updateQueue = f
                            } else p.add(s);
                            if ((h.mode & 2) === 0) {
                                if (h.flags |= 64, u.flags |= 16384, u.flags &= -2981, u.tag === 1)
                                    if (u.alternate === null) u.tag = 17;
                                    else {
                                        var d = st(-1, 1);
                                        d.tag = 2, ft(u, d)
                                    }
                                u.lanes |= 1;
                                break e
                            }
                            a = void 0, u = t;
                            var v = i.pingCache;
                            if (v === null ? (v = i.pingCache = new Th, a = new Set, v.set(s, a)) : (a = v.get(s), a === void 0 && (a = new Set, v.set(s, a))), !a.has(u)) {
                                a.add(u);
                                var y = bh.bind(null, i, s, u);
                                s.then(y, y)
                            }
                            h.flags |= 4096, h.lanes = t;
                            break e
                        }
                        h = h.return
                    } while (h !== null);
                    a = Error((ln(u.type) || "A React component") + ` suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.`)
                }
                le !== 5 && (le = 2),
                a = Bu(a, u),
                h = l;do {
                    switch (h.tag) {
                        case 3:
                            i = a, h.flags |= 4096, t &= -t, h.lanes |= t;
                            var C = Uc(h, i, t);
                            ls(h, C);
                            break e;
                        case 1:
                            i = a;
                            var x = h.type,
                                T = h.stateNode;
                            if ((h.flags & 64) === 0 && (typeof x.getDerivedStateFromError == "function" || T !== null && typeof T.componentDidCatch == "function" && (be === null || !be.has(T)))) {
                                h.flags |= 4096, t &= -t, h.lanes |= t;
                                var M = Bc(h, i, t);
                                ls(h, M);
                                break e
                            }
                    }
                    h = h.return
                } while (h !== null)
            }
            qc(n)
        } catch (P) {
            t = P, ee === n && n !== null && (ee = n = n.return);
            continue
        }
        break
    } while (1)
}

function Yc() {
    var e = Wi.current;
    return Wi.current = Bi, e === null ? Bi : e
}

function Xn(e, t) {
    var n = j;
    j |= 16;
    var r = Yc();
    me === e && de === t || hn(e, t);
    do try {
        Ih();
        break
    } catch (o) {
        Qc(e, o)
    }
    while (1);
    if (Lu(), j = n, Wi.current = r, ee !== null) throw Error(k(261));
    return me = null, de = 0, le
}

function Ih() {
    for (; ee !== null;) Xc(ee)
}

function Nh() {
    for (; ee !== null && !gh();) Xc(ee)
}

function Xc(e) {
    var t = Jc(e.alternate, e, $t);
    e.memoizedProps = e.pendingProps, t === null ? qc(e) : ee = t, Wu.current = null
}

function qc(e) {
    var t = e;
    do {
        var n = t.alternate;
        if (e = t.return, (t.flags & 2048) === 0) {
            if (n = Oh(n, t, $t), n !== null) {
                ee = n;
                return
            }
            if (n = t, n.tag !== 24 && n.tag !== 23 || n.memoizedState === null || ($t & 1073741824) !== 0 || (n.mode & 4) === 0) {
                for (var r = 0, o = n.child; o !== null;) r |= o.lanes | o.childLanes, o = o.sibling;
                n.childLanes = r
            }
            e !== null && (e.flags & 2048) === 0 && (e.firstEffect === null && (e.firstEffect = t.firstEffect), t.lastEffect !== null && (e.lastEffect !== null && (e.lastEffect.nextEffect = t.firstEffect), e.lastEffect = t.lastEffect), 1 < t.flags && (e.lastEffect !== null ? e.lastEffect.nextEffect = t : e.firstEffect = t, e.lastEffect = t))
        } else {
            if (n = Ch(t), n !== null) {
                n.flags &= 2047, ee = n;
                return
            }
            e !== null && (e.firstEffect = e.lastEffect = null, e.flags |= 2048)
        }
        if (t = t.sibling, t !== null) {
            ee = t;
            return
        }
        ee = t = e
    } while (t !== null);
    le === 0 && (le = 5)
}

function Pt(e) {
    var t = wn();
    return Nt(99, $h.bind(null, e, t)), null
}

function $h(e, t) {
    do St(); while (ar !== null);
    if ((j & 48) !== 0) throw Error(k(327));
    var n = e.finishedWork;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(k(177));
    e.callbackNode = null;
    var r = n.lanes | n.childLanes,
        o = r,
        i = e.pendingLanes & ~o;
    e.pendingLanes = o, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= o, e.mutableReadLanes &= o, e.entangledLanes &= o, o = e.entanglements;
    for (var l = e.eventTimes, u = e.expirationTimes; 0 < i;) {
        var a = 31 - mt(i),
            s = 1 << a;
        o[a] = 0, l[a] = -1, u[a] = -1, i &= ~s
    }
    if (qe !== null && (r & 24) === 0 && qe.has(e) && qe.delete(e), e === me && (ee = me = null, de = 0), 1 < n.flags ? n.lastEffect !== null ? (n.lastEffect.nextEffect = n, r = n.firstEffect) : r = n : r = n.firstEffect, r !== null) {
        if (o = j, j |= 32, Wu.current = null, No = ui, l = Ha(), Sl(l)) {
            if ("selectionStart" in l) u = {
                start: l.selectionStart,
                end: l.selectionEnd
            };
            else e: if (u = (u = l.ownerDocument) && u.defaultView || window, (s = u.getSelection && u.getSelection()) && s.rangeCount !== 0) {
                u = s.anchorNode, i = s.anchorOffset, a = s.focusNode, s = s.focusOffset;
                try {
                    u.nodeType, a.nodeType
                } catch {
                    u = null;
                    break e
                }
                var c = 0,
                    m = -1,
                    h = -1,
                    g = 0,
                    E = 0,
                    S = l,
                    p = null;
                t: for (;;) {
                    for (var f; S !== u || i !== 0 && S.nodeType !== 3 || (m = c + i), S !== a || s !== 0 && S.nodeType !== 3 || (h = c + s), S.nodeType === 3 && (c += S.nodeValue.length), (f = S.firstChild) !== null;) p = S, S = f;
                    for (;;) {
                        if (S === l) break t;
                        if (p === u && ++g === i && (m = c), p === a && ++E === s && (h = c), (f = S.nextSibling) !== null) break;
                        S = p, p = S.parentNode
                    }
                    S = f
                }
                u = m === -1 || h === -1 ? null : {
                    start: m,
                    end: h
                }
            } else u = null;
            u = u || {
                start: 0,
                end: 0
            }
        } else u = null;
        $o = {
            focusedElem: l,
            selectionRange: u
        }, ui = !1, fr = null, hi = !1, R = r;
        do try {
            Fh()
        } catch (P) {
            if (R === null) throw Error(k(330));
            pt(R, P), R = R.nextEffect
        }
        while (R !== null);
        fr = null, R = r;
        do try {
            for (l = e; R !== null;) {
                var d = R.flags;
                if (d & 16 && vr(R.stateNode, ""), d & 128) {
                    var v = R.alternate;
                    if (v !== null) {
                        var y = v.ref;
                        y !== null && (typeof y == "function" ? y(null) : y.current = null)
                    }
                }
                switch (d & 1038) {
                    case 2:
                        js(R), R.flags &= -3;
                        break;
                    case 6:
                        js(R), R.flags &= -3, Wo(R.alternate, R);
                        break;
                    case 1024:
                        R.flags &= -1025;
                        break;
                    case 1028:
                        R.flags &= -1025, Wo(R.alternate, R);
                        break;
                    case 4:
                        Wo(R.alternate, R);
                        break;
                    case 8:
                        u = R, Wc(l, u);
                        var C = u.alternate;
                        Rs(u), C !== null && Rs(C)
                }
                R = R.nextEffect
            }
        } catch (P) {
            if (R === null) throw Error(k(330));
            pt(R, P), R = R.nextEffect
        }
        while (R !== null);
        if (y = $o, v = Ha(), d = y.focusedElem, l = y.selectionRange, v !== d && d && d.ownerDocument && ac(d.ownerDocument.documentElement, d)) {
            for (l !== null && Sl(d) && (v = l.start, y = l.end, y === void 0 && (y = v), "selectionStart" in d ? (d.selectionStart = v, d.selectionEnd = Math.min(y, d.value.length)) : (y = (v = d.ownerDocument || document) && v.defaultView || window, y.getSelection && (y = y.getSelection(), u = d.textContent.length, C = Math.min(l.start, u), l = l.end === void 0 ? C : Math.min(l.end, u), !y.extend && C > l && (u = l, l = C, C = u), u = Ga(d, C), i = Ga(d, l), u && i && (y.rangeCount !== 1 || y.anchorNode !== u.node || y.anchorOffset !== u.offset || y.focusNode !== i.node || y.focusOffset !== i.offset) && (v = v.createRange(), v.setStart(u.node, u.offset), y.removeAllRanges(), C > l ? (y.addRange(v), y.extend(i.node, i.offset)) : (v.setEnd(i.node, i.offset), y.addRange(v)))))), v = [], y = d; y = y.parentNode;) y.nodeType === 1 && v.push({
                element: y,
                left: y.scrollLeft,
                top: y.scrollTop
            });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < v.length; d++) y = v[d], y.element.scrollLeft = y.left, y.element.scrollTop = y.top
        }
        ui = !!No, $o = No = null, e.current = n, R = r;
        do try {
            for (d = e; R !== null;) {
                var x = R.flags;
                if (x & 36 && jh(d, R.alternate, R), x & 128) {
                    v = void 0;
                    var T = R.ref;
                    if (T !== null) {
                        var M = R.stateNode;
                        switch (R.tag) {
                            case 5:
                                v = M;
                                break;
                            default:
                                v = M
                        }
                        typeof T == "function" ? T(v) : T.current = v
                    }
                }
                R = R.nextEffect
            }
        } catch (P) {
            if (R === null) throw Error(k(330));
            pt(R, P), R = R.nextEffect
        }
        while (R !== null);
        R = null, wh(), j = o
    } else e.current = n;
    if (gt) gt = !1, ar = e, Yn = t;
    else
        for (R = r; R !== null;) t = R.nextEffect, R.nextEffect = null, R.flags & 8 && (x = R, x.sibling = null, x.stateNode = null), R = t;
    if (r = e.pendingLanes, r === 0 && (be = null), r === 1 ? e === Bl ? sr++ : (sr = 0, Bl = e) : sr = 0, n = n.stateNode, jt && typeof jt.onCommitFiberRoot == "function") try {
        jt.onCommitFiberRoot(ju, n, void 0, (n.current.flags & 64) === 64)
    } catch {}
    if (je(e, ce()), Gi) throw Gi = !1, e = Vl, Vl = null, e;
    return (j & 8) !== 0 || Ge(), null
}

function Fh() {
    for (; R !== null;) {
        var e = R.alternate;
        hi || fr === null || ((R.flags & 8) !== 0 ? ja(R, fr) && (hi = !0) : R.tag === 13 && Dh(e, R) && ja(R, fr) && (hi = !0));
        var t = R.flags;
        (t & 256) !== 0 && Mh(e, R), (t & 512) === 0 || gt || (gt = !0, _r(97, function() {
            return St(), null
        })), R = R.nextEffect
    }
}

function St() {
    if (Yn !== 90) {
        var e = 97 < Yn ? 97 : Yn;
        return Yn = 90, Nt(e, Vh)
    }
    return !1
}

function zh(e, t) {
    bl.push(t, e), gt || (gt = !0, _r(97, function() {
        return St(), null
    }))
}

function Zc(e, t) {
    Ul.push(t, e), gt || (gt = !0, _r(97, function() {
        return St(), null
    }))
}

function Vh() {
    if (ar === null) return !1;
    var e = ar;
    if (ar = null, (j & 48) !== 0) throw Error(k(331));
    var t = j;
    j |= 32;
    var n = Ul;
    Ul = [];
    for (var r = 0; r < n.length; r += 2) {
        var o = n[r],
            i = n[r + 1],
            l = o.destroy;
        if (o.destroy = void 0, typeof l == "function") try {
            l()
        } catch (a) {
            if (i === null) throw Error(k(330));
            pt(i, a)
        }
    }
    for (n = bl, bl = [], r = 0; r < n.length; r += 2) {
        o = n[r], i = n[r + 1];
        try {
            var u = o.create;
            o.destroy = u()
        } catch (a) {
            if (i === null) throw Error(k(330));
            pt(i, a)
        }
    }
    for (u = e.current.firstEffect; u !== null;) e = u.nextEffect, u.nextEffect = null, u.flags & 8 && (u.sibling = null, u.stateNode = null), u = e;
    return j = t, Ge(), !0
}

function Ls(e, t, n) {
    t = Bu(n, t), t = Uc(e, t, 1), ft(e, t), t = xe(), e = so(e, 1), e !== null && (to(e, 1, t), je(e, t))
}

function pt(e, t) {
    if (e.tag === 3) Ls(e, e, t);
    else
        for (var n = e.return; n !== null;) {
            if (n.tag === 3) {
                Ls(n, e, t);
                break
            } else if (n.tag === 1) {
                var r = n.stateNode;
                if (typeof n.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (be === null || !be.has(r))) {
                    e = Bu(t, e);
                    var o = Bc(n, e, 1);
                    if (ft(n, o), o = xe(), n = so(n, 1), n !== null) to(n, 1, o), je(n, o);
                    else if (typeof r.componentDidCatch == "function" && (be === null || !be.has(r))) try {
                        r.componentDidCatch(t, e)
                    } catch {}
                    break
                }
            }
            n = n.return
        }
}

function bh(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = xe(), e.pingedLanes |= e.suspendedLanes & n, me === e && (de & n) === n && (le === 4 || le === 3 && (de & 62914560) === de && 500 > ce() - Hu ? hn(e, 0) : Gu |= n), je(e, t)
}

function Uh(e, t) {
    var n = e.stateNode;
    n !== null && n.delete(t), t = 0, t === 0 && (t = e.mode, (t & 2) === 0 ? t = 1 : (t & 4) === 0 ? t = wn() === 99 ? 1 : 2 : (Ke === 0 && (Ke = Tn), t = Xt(62914560 & ~Ke), t === 0 && (t = 4194304))), n = xe(), e = so(e, t), e !== null && (to(e, t, n), je(e, n))
}
var Jc;
Jc = function(e, t, n) {
    var r = t.lanes;
    if (e !== null)
        if (e.memoizedProps !== t.pendingProps || we.current) $e = !0;
        else if ((n & r) !== 0) $e = (e.flags & 16384) !== 0;
    else {
        switch ($e = !1, t.tag) {
            case 3:
                ws(t), bo();
                break;
            case 5:
                fs(t);
                break;
            case 1:
                Se(t.type) && fi(t);
                break;
            case 4:
                Tl(t, t.stateNode.containerInfo);
                break;
            case 10:
                r = t.memoizedProps.value;
                var o = t.type._context;
                Y(Li, o._currentValue), o._currentValue = r;
                break;
            case 13:
                if (t.memoizedState !== null) return (n & t.child.childLanes) !== 0 ? Ss(e, t, n) : (Y(Q, Q.current & 1), t = Ye(e, t, n), t !== null ? t.sibling : null);
                Y(Q, Q.current & 1);
                break;
            case 19:
                if (r = (n & t.childLanes) !== 0, (e.flags & 64) !== 0) {
                    if (r) return Ps(e, t, n);
                    t.flags |= 64
                }
                if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Y(Q, Q.current), r) break;
                return null;
            case 23:
            case 24:
                return t.lanes = 0, Uo(e, t, n)
        }
        return Ye(e, t, n)
    } else $e = !1;
    switch (t.lanes = 0, t.tag) {
        case 2:
            if (r = t.type, e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2), e = t.pendingProps, o = yn(t, pe.current), cn(t, n), o = zu(null, t, r, e, o, n), t.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0) {
                if (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Se(r)) {
                    var i = !0;
                    fi(t)
                } else i = !1;
                t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, Iu(t);
                var l = r.getDerivedStateFromProps;
                typeof l == "function" && Ni(t, r, l, e), o.updater = uo, t.stateNode = o, o._reactInternals = t, Cl(t, r, e, n), t = Dl(null, t, r, !0, i, n)
            } else t.tag = 0, ye(null, t, o, n), t = t.child;
            return t;
        case 16:
            o = t.elementType;
            e: {
                switch (e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2), e = t.pendingProps, i = o._init, o = i(o._payload), t.type = o, i = t.tag = Wh(o), e = Ae(o, e), i) {
                    case 0:
                        t = jl(null, t, o, e, n);
                        break e;
                    case 1:
                        t = ys(null, t, o, e, n);
                        break e;
                    case 11:
                        t = vs(null, t, o, e, n);
                        break e;
                    case 14:
                        t = gs(null, t, o, Ae(o.type, e), r, n);
                        break e
                }
                throw Error(k(306, o, ""))
            }
            return t;
        case 0:
            return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ae(r, o), jl(e, t, r, o, n);
        case 1:
            return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ae(r, o), ys(e, t, r, o, n);
        case 3:
            if (ws(t), r = t.updateQueue, e === null || r === null) throw Error(k(282));
            if (r = t.pendingProps, o = t.memoizedState, o = o !== null ? o.element : null, _c(e, t), Pr(t, r, null, n), r = t.memoizedState.element, r === o) bo(), t = Ye(e, t, n);
            else {
                if (o = t.stateNode, (i = o.hydrate) && (ot = fn(t.stateNode.containerInfo.firstChild), Qe = t, i = Be = !0), i) {
                    if (e = o.mutableSourceEagerHydrationData, e != null)
                        for (o = 0; o < e.length; o += 2) i = e[o], i._workInProgressVersionPrimary = e[o + 1], dn.push(i);
                    for (n = Tc(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 1024, n = n.sibling
                } else ye(e, t, r, n), bo();
                t = t.child
            }
            return t;
        case 5:
            return fs(t), e === null && Rl(t), r = t.type, o = t.pendingProps, i = e !== null ? e.memoizedProps : null, l = o.children, kl(r, o) ? l = null : i !== null && kl(r, i) && (t.flags |= 16), Fc(e, t), ye(e, t, l, n), t.child;
        case 6:
            return e === null && Rl(t), null;
        case 13:
            return Ss(e, t, n);
        case 4:
            return Tl(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = $i(t, null, r, n) : ye(e, t, r, n), t.child;
        case 11:
            return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ae(r, o), vs(e, t, r, o, n);
        case 7:
            return ye(e, t, t.pendingProps, n), t.child;
        case 8:
            return ye(e, t, t.pendingProps.children, n), t.child;
        case 12:
            return ye(e, t, t.pendingProps.children, n), t.child;
        case 10:
            e: {
                r = t.type._context,
                o = t.pendingProps,
                l = t.memoizedProps,
                i = o.value;
                var u = t.type._context;
                if (Y(Li, u._currentValue), u._currentValue = i, l !== null)
                    if (u = l.value, i = Oe(u, i) ? 0 : (typeof r._calculateChangedBits == "function" ? r._calculateChangedBits(u, i) : 1073741823) | 0, i === 0) {
                        if (l.children === o.children && !we.current) {
                            t = Ye(e, t, n);
                            break e
                        }
                    } else
                        for (u = t.child, u !== null && (u.return = t); u !== null;) {
                            var a = u.dependencies;
                            if (a !== null) {
                                l = u.child;
                                for (var s = a.firstContext; s !== null;) {
                                    if (s.context === r && (s.observedBits & i) !== 0) {
                                        u.tag === 1 && (s = st(-1, n & -n), s.tag = 2, ft(u, s)), u.lanes |= n, s = u.alternate, s !== null && (s.lanes |= n), kc(u.return, n), a.lanes |= n;
                                        break
                                    }
                                    s = s.next
                                }
                            } else l = u.tag === 10 && u.type === t.type ? null : u.child;
                            if (l !== null) l.return = u;
                            else
                                for (l = u; l !== null;) {
                                    if (l === t) {
                                        l = null;
                                        break
                                    }
                                    if (u = l.sibling, u !== null) {
                                        u.return = l.return, l = u;
                                        break
                                    }
                                    l = l.return
                                }
                            u = l
                        }
                ye(e, t, o.children, n),
                t = t.child
            }
            return t;
        case 9:
            return o = t.type, i = t.pendingProps, r = i.children, cn(t, n), o = Me(o, i.unstable_observedBits), r = r(o), t.flags |= 1, ye(e, t, r, n), t.child;
        case 14:
            return o = t.type, i = Ae(o, t.pendingProps), i = Ae(o.type, i), gs(e, t, o, i, r, n);
        case 15:
            return $c(e, t, t.type, t.pendingProps, r, n);
        case 17:
            return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ae(r, o), e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2), t.tag = 1, Se(r) ? (e = !0, fi(t)) : e = !1, cn(t, n), Oc(t, r, o), Cl(t, r, o, n), Dl(null, t, r, !0, e, n);
        case 19:
            return Ps(e, t, n);
        case 23:
            return Uo(e, t, n);
        case 24:
            return Uo(e, t, n)
    }
    throw Error(k(156, t.tag))
};

function Bh(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.flags = 0, this.lastEffect = this.firstEffect = this.nextEffect = null, this.childLanes = this.lanes = 0, this.alternate = null
}

function Ce(e, t, n, r) {
    return new Bh(e, t, n, r)
}

function Qu(e) {
    return e = e.prototype, !(!e || !e.isReactComponent)
}

function Wh(e) {
    if (typeof e == "function") return Qu(e) ? 1 : 0;
    if (e != null) {
        if (e = e.$$typeof, e === Zi) return 11;
        if (e === Ji) return 14
    }
    return 2
}

function yt(e, t) {
    var n = e.alternate;
    return n === null ? (n = Ce(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.nextEffect = null, n.firstEffect = null, n.lastEffect = null), n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
    }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n
}

function mi(e, t, n, r, o, i) {
    var l = 2;
    if (r = e, typeof e == "function") Qu(e) && (l = 1);
    else if (typeof e == "string") l = 5;
    else e: switch (e) {
        case nt:
            return mn(n.children, o, i, t);
        case Rf:
            l = 8, o |= 16;
            break;
        case fu:
            l = 8, o |= 1;
            break;
        case Jn:
            return e = Ce(12, n, t, o | 8), e.elementType = Jn, e.type = Jn, e.lanes = i, e;
        case er:
            return e = Ce(13, n, t, o), e.type = er, e.elementType = er, e.lanes = i, e;
        case _i:
            return e = Ce(19, n, t, o), e.elementType = _i, e.lanes = i, e;
        case vu:
            return Yu(n, o, i, t);
        case ol:
            return e = Ce(24, n, t, o), e.elementType = ol, e.lanes = i, e;
        default:
            if (typeof e == "object" && e !== null) switch (e.$$typeof) {
                case cu:
                    l = 10;
                    break e;
                case du:
                    l = 9;
                    break e;
                case Zi:
                    l = 11;
                    break e;
                case Ji:
                    l = 14;
                    break e;
                case pu:
                    l = 16, r = null;
                    break e;
                case hu:
                    l = 22;
                    break e
            }
            throw Error(k(130, e == null ? e : typeof e, ""))
    }
    return t = Ce(l, n, t, o), t.elementType = e, t.type = r, t.lanes = i, t
}

function mn(e, t, n, r) {
    return e = Ce(7, e, r, t), e.lanes = n, e
}

function Yu(e, t, n, r) {
    return e = Ce(23, e, r, t), e.elementType = vu, e.lanes = n, e
}

function Go(e, t, n) {
    return e = Ce(6, e, null, t), e.lanes = n, e
}

function Ho(e, t, n) {
    return t = Ce(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
    }, t
}

function Gh(e, t, n) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.pendingContext = this.context = null, this.hydrate = n, this.callbackNode = null, this.callbackPriority = 0, this.eventTimes = Ro(0), this.expirationTimes = Ro(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ro(0), this.mutableSourceEagerHydrationData = null
}

function Hh(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
        $$typeof: Ot,
        key: r == null ? null : "" + r,
        children: e,
        containerInfo: t,
        implementation: n
    }
}

function Hi(e, t, n, r) {
    var o = t.current,
        i = xe(),
        l = ct(o);
    e: if (n) {
        n = n._reactInternals;
        t: {
            if (bt(n) !== n || n.tag !== 1) throw Error(k(170));
            var u = n;do {
                switch (u.tag) {
                    case 3:
                        u = u.stateNode.context;
                        break t;
                    case 1:
                        if (Se(u.type)) {
                            u = u.stateNode.__reactInternalMemoizedMergedChildContext;
                            break t
                        }
                }
                u = u.return
            } while (u !== null);
            throw Error(k(171))
        }
        if (n.tag === 1) {
            var a = n.type;
            if (Se(a)) {
                n = vc(n, a, u);
                break e
            }
        }
        n = u
    } else n = vt;
    return t.context === null ? t.context = n : t.pendingContext = n, t = st(i, l), t.payload = {
        element: e
    }, r = r === void 0 ? null : r, r !== null && (t.callback = r), ft(o, t), dt(o, l, i), l
}

function Ko(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
        case 5:
            return e.child.stateNode;
        default:
            return e.child.stateNode
    }
}

function As(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t
    }
}

function Xu(e, t) {
    As(e, t), (e = e.alternate) && As(e, t)
}

function Kh() {
    return null
}

function qu(e, t, n) {
    var r = n != null && n.hydrationOptions != null && n.hydrationOptions.mutableSources || null;
    if (n = new Gh(e, t, n != null && n.hydrate === !0), t = Ce(3, null, null, t === 2 ? 7 : t === 1 ? 3 : 0), n.current = t, t.stateNode = n, Iu(t), e[Cn] = n.current, cc(e.nodeType === 8 ? e.parentNode : e), r)
        for (e = 0; e < r.length; e++) {
            t = r[e];
            var o = t._getVersion;
            o = o(t._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [t, o] : n.mutableSourceEagerHydrationData.push(t, o)
        }
    this._internalRoot = n
}
qu.prototype.render = function(e) {
    Hi(e, this._internalRoot, null, null)
};
qu.prototype.unmount = function() {
    var e = this._internalRoot,
        t = e.containerInfo;
    Hi(null, e, null, function() {
        t[Cn] = null
    })
};

function $r(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
}

function Qh(e, t) {
    if (t || (t = e ? e.nodeType === 9 ? e.documentElement : e.firstChild : null, t = !(!t || t.nodeType !== 1 || !t.hasAttribute("data-reactroot"))), !t)
        for (var n; n = e.lastChild;) e.removeChild(n);
    return new qu(e, 0, t ? {
        hydrate: !0
    } : void 0)
}

function fo(e, t, n, r, o) {
    var i = n._reactRootContainer;
    if (i) {
        var l = i._internalRoot;
        if (typeof o == "function") {
            var u = o;
            o = function() {
                var s = Ko(l);
                u.call(s)
            }
        }
        Hi(t, l, e, o)
    } else {
        if (i = n._reactRootContainer = Qh(n, r), l = i._internalRoot, typeof o == "function") {
            var a = o;
            o = function() {
                var s = Ko(l);
                a.call(s)
            }
        }
        Kc(function() {
            Hi(t, l, e, o)
        })
    }
    return Ko(l)
}
Wf = function(e) {
    if (e.tag === 13) {
        var t = xe();
        dt(e, 4, t), Xu(e, 4)
    }
};
Eu = function(e) {
    if (e.tag === 13) {
        var t = xe();
        dt(e, 67108864, t), Xu(e, 67108864)
    }
};
Gf = function(e) {
    if (e.tag === 13) {
        var t = xe(),
            n = ct(e);
        dt(e, n, t), Xu(e, n)
    }
};
Hf = function(e, t) {
    return t()
};
ml = function(e, t, n) {
    switch (t) {
        case "input":
            if (ul(e, n), t = n.name, n.type === "radio" && t != null) {
                for (n = e; n.parentNode;) n = n.parentNode;
                for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
                    var r = n[t];
                    if (r !== e && r.form === e.form) {
                        var o = oo(r);
                        if (!o) throw Error(k(90));
                        jf(r), ul(r, o)
                    }
                }
            }
            break;
        case "textarea":
            Lf(e, n);
            break;
        case "select":
            t = n.value, t != null && un(e, !!n.multiple, t, !1)
    }
};
yu = Hc;
Vf = function(e, t, n, r, o) {
    var i = j;
    j |= 4;
    try {
        return Nt(98, e.bind(null, t, n, r, o))
    } finally {
        j = i, j === 0 && (Mn(), Ge())
    }
};
wu = function() {
    (j & 49) === 0 && (Ah(), St())
};
bf = function(e, t) {
    var n = j;
    j |= 2;
    try {
        return e(t)
    } finally {
        j = n, j === 0 && (Mn(), Ge())
    }
};

function ed(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!$r(t)) throw Error(k(200));
    return Hh(e, t, null, n)
}
var Yh = {
        Events: [Ar, en, oo, Ff, zf, St, {
            current: !1
        }]
    },
    Wn = {
        findFiberByHostInstance: Tt,
        bundleType: 0,
        version: "17.0.2",
        rendererPackageName: "react-dom"
    },
    Xh = {
        bundleType: Wn.bundleType,
        version: Wn.version,
        rendererPackageName: Wn.rendererPackageName,
        rendererConfig: Wn.rendererConfig,
        overrideHookState: null,
        overrideHookStateDeletePath: null,
        overrideHookStateRenamePath: null,
        overrideProps: null,
        overridePropsDeletePath: null,
        overridePropsRenamePath: null,
        setSuspenseHandler: null,
        scheduleUpdate: null,
        currentDispatcherRef: Vt.ReactCurrentDispatcher,
        findHostInstanceByFiber: function(e) {
            return e = Bf(e), e === null ? null : e.stateNode
        },
        findFiberByHostInstance: Wn.findFiberByHostInstance || Kh,
        findHostInstancesForRefresh: null,
        scheduleRefresh: null,
        scheduleRoot: null,
        setRefreshHandler: null,
        getCurrentFiber: null
    };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var qr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!qr.isDisabled && qr.supportsFiber) try {
        ju = qr.inject(Xh), jt = qr
    } catch {}
}
De.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Yh;
De.createPortal = ed;
De.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0) throw typeof e.render == "function" ? Error(k(188)) : Error(k(268, Object.keys(e)));
    return e = Bf(t), e = e === null ? null : e.stateNode, e
};
De.flushSync = function(e, t) {
    var n = j;
    if ((n & 48) !== 0) return e(t);
    j |= 1;
    try {
        if (e) return Nt(99, e.bind(null, t))
    } finally {
        j = n, Ge()
    }
};
De.hydrate = function(e, t, n) {
    if (!$r(t)) throw Error(k(200));
    return fo(null, e, t, !0, n)
};
De.render = function(e, t, n) {
    if (!$r(t)) throw Error(k(200));
    return fo(null, e, t, !1, n)
};
De.unmountComponentAtNode = function(e) {
    if (!$r(e)) throw Error(k(40));
    return e._reactRootContainer ? (Kc(function() {
        fo(null, null, e, !1, function() {
            e._reactRootContainer = null, e[Cn] = null
        })
    }), !0) : !1
};
De.unstable_batchedUpdates = Hc;
De.unstable_createPortal = function(e, t) {
    return ed(e, t, 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null)
};
De.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!$r(n)) throw Error(k(200));
    if (e == null || e._reactInternals === void 0) throw Error(k(38));
    return fo(e, t, n, !1, r)
};
De.version = "17.0.2";
(function(e) {
    function t() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t)
        } catch (n) {
            console.error(n)
        }
    }
    t(), e.exports = De
})(Pf);
const Q0 = af(Pf.exports);
var co = {
        exports: {}
    },
    Fr = {},
    qh = $.exports,
    td = 60103;
Fr.Fragment = 60107;
if (typeof Symbol == "function" && Symbol.for) {
    var Is = Symbol.for;
    td = Is("react.element"), Fr.Fragment = Is("react.fragment")
}
var Zh = qh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    Jh = Object.prototype.hasOwnProperty,
    em = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };

function nd(e, t, n) {
    var r, o = {},
        i = null,
        l = null;
    n !== void 0 && (i = "" + n), t.key !== void 0 && (i = "" + t.key), t.ref !== void 0 && (l = t.ref);
    for (r in t) Jh.call(t, r) && !em.hasOwnProperty(r) && (o[r] = t[r]);
    if (e && e.defaultProps)
        for (r in t = e.defaultProps, t) o[r] === void 0 && (o[r] = t[r]);
    return {
        $$typeof: td,
        type: e,
        key: i,
        ref: l,
        props: o,
        _owner: Zh.current
    }
}
Fr.jsx = nd;
Fr.jsxs = nd;
(function(e) {
    e.exports = Fr
})(co);
const Y0 = co.exports.Fragment,
    tm = co.exports.jsx,
    X0 = co.exports.jsxs;

function z() {
    return z = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    }, z.apply(this, arguments)
}

function We(e, t) {
    if (e == null) return {};
    var n = {},
        r = Object.keys(e),
        o, i;
    for (i = 0; i < r.length; i++) o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
    return n
}
const I = {
    arr: Array.isArray,
    obj: e => Object.prototype.toString.call(e) === "[object Object]",
    fun: e => typeof e == "function",
    str: e => typeof e == "string",
    num: e => typeof e == "number",
    und: e => e === void 0,
    nul: e => e === null,
    set: e => e instanceof Set,
    map: e => e instanceof Map,
    equ(e, t) {
        if (typeof e != typeof t) return !1;
        if (I.str(e) || I.num(e)) return e === t;
        if (I.obj(e) && I.obj(t) && Object.keys(e).length + Object.keys(t).length === 0) return !0;
        let n;
        for (n in e)
            if (!(n in t)) return !1;
        for (n in t)
            if (e[n] !== t[n]) return !1;
        return I.und(n) ? e === t : !0
    }
};

function nm(e, t) {
    return t === void 0 && (t = !0), n => (I.arr(n) ? n : Object.keys(n)).reduce((r, o) => {
        const i = t ? o[0].toLowerCase() + o.substring(1) : o;
        return r[i] = e(i), r
    }, e)
}

function rd() {
    const e = $.exports.useState(!1),
        t = e[1];
    return $.exports.useCallback(() => t(r => !r), [])
}

function kt(e, t) {
    return I.und(e) || I.nul(e) ? t : e
}

function rn(e) {
    return I.und(e) ? [] : I.arr(e) ? e : [e]
}

function Ee(e) {
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
    return I.fun(e) ? e(...n) : e
}

function rm(e) {
    return e.to, e.from, e.config, e.onStart, e.onRest, e.onFrame, e.children, e.reset, e.reverse, e.force, e.immediate, e.delay, e.attach, e.destroyed, e.interpolateTo, e.ref, e.lazy, We(e, ["to", "from", "config", "onStart", "onRest", "onFrame", "children", "reset", "reverse", "force", "immediate", "delay", "attach", "destroyed", "interpolateTo", "ref", "lazy"])
}

function Qo(e) {
    const t = rm(e);
    if (I.und(t)) return z({
        to: t
    }, e);
    const n = Object.keys(e).reduce((r, o) => I.und(t[o]) ? z({}, r, {
        [o]: e[o]
    }) : r, {});
    return z({
        to: t
    }, n)
}

function im(e, t) {
    return t && (I.fun(t) ? t(e) : I.obj(t) && (t.current = e)), e
}
class Ne {
    constructor() {
        this.payload = void 0, this.children = []
    }
    getAnimatedValue() {
        return this.getValue()
    }
    getPayload() {
        return this.payload || this
    }
    attach() {}
    detach() {}
    getChildren() {
        return this.children
    }
    addChild(t) {
        this.children.length === 0 && this.attach(), this.children.push(t)
    }
    removeChild(t) {
        const n = this.children.indexOf(t);
        this.children.splice(n, 1), this.children.length === 0 && this.detach()
    }
}
class Gl extends Ne {
    constructor() {
        super(...arguments), this.payload = [], this.attach = () => this.payload.forEach(t => t instanceof Ne && t.addChild(this)), this.detach = () => this.payload.forEach(t => t instanceof Ne && t.removeChild(this))
    }
}
class id extends Ne {
    constructor() {
        super(...arguments), this.payload = {}, this.attach = () => Object.values(this.payload).forEach(t => t instanceof Ne && t.addChild(this)), this.detach = () => Object.values(this.payload).forEach(t => t instanceof Ne && t.removeChild(this))
    }
    getValue(t) {
        t === void 0 && (t = !1);
        const n = {};
        for (const r in this.payload) {
            const o = this.payload[r];
            t && !(o instanceof Ne) || (n[r] = o instanceof Ne ? o[t ? "getAnimatedValue" : "getValue"]() : o)
        }
        return n
    }
    getAnimatedValue() {
        return this.getValue(!0)
    }
}
let po;

function od(e, t) {
    po = {
        fn: e,
        transform: t
    }
}
let Zu;

function ld(e) {
    Zu = e
}
let Rr = e => typeof window < "u" ? window.requestAnimationFrame(e) : -1,
    ud = e => {
        typeof window < "u" && window.cancelAnimationFrame(e)
    };

function om(e, t) {
    Rr = e, ud = t
}
let Mr;

function ad(e) {
    Mr = e
}
let ho = () => Date.now();

function lm(e) {
    ho = e
}
let sd;

function fd(e) {
    sd = e
}
let Ju = e => e.current;

function um(e) {
    Ju = e
}
let ea;

function cd(e) {
    ea = e
}
let En;

function am(e) {
    En = e
}
Object.freeze({
    get applyAnimatedValues() {
        return po
    },
    injectApplyAnimatedValues: od,
    get colorNames() {
        return Zu
    },
    injectColorNames: ld,
    get requestFrame() {
        return Rr
    },
    get cancelFrame() {
        return ud
    },
    injectFrame: om,
    get interpolation() {
        return Mr
    },
    injectStringInterpolator: ad,
    get now() {
        return ho
    },
    injectNow: lm,
    get defaultElement() {
        return sd
    },
    injectDefaultElement: fd,
    get animatedApi() {
        return Ju
    },
    injectAnimatedApi: um,
    get createAnimatedStyle() {
        return ea
    },
    injectCreateAnimatedStyle: cd,
    get manualFrameloop() {
        return En
    },
    injectManualFrameloop: am
});
class sm extends id {
    constructor(t, n) {
        super(), this.update = void 0, this.payload = t.style ? z({}, t, {
            style: ea(t.style)
        }) : t, this.update = n, this.attach()
    }
}
const fm = e => I.fun(e) && !(e.prototype instanceof Si.Component),
    cm = e => $.exports.forwardRef((n, r) => {
        const o = rd(),
            i = $.exports.useRef(!0),
            l = $.exports.useRef(null),
            u = $.exports.useRef(null),
            a = $.exports.useCallback(h => {
                const g = l.current,
                    E = () => {
                        let S = !1;
                        u.current && (S = po.fn(u.current, l.current.getAnimatedValue())), (!u.current || S === !1) && o()
                    };
                l.current = new sm(h, E), g && g.detach()
            }, []);
        $.exports.useEffect(() => () => {
            i.current = !1, l.current && l.current.detach()
        }, []), $.exports.useImperativeHandle(r, () => Ju(u, i, o)), a(n);
        const s = l.current.getValue();
        s.scrollTop, s.scrollLeft;
        const c = We(s, ["scrollTop", "scrollLeft"]),
            m = fm(e) ? void 0 : h => u.current = im(h, r);
        return tm(e, { ...c,
            ref: m
        })
    });
let cr = !1;
const Dt = new Set,
    dd = () => {
        if (!cr) return !1;
        let e = ho();
        for (let t of Dt) {
            let n = !1;
            for (let r = 0; r < t.configs.length; r++) {
                let o = t.configs[r],
                    i, l;
                for (let u = 0; u < o.animatedValues.length; u++) {
                    let a = o.animatedValues[u];
                    if (a.done) continue;
                    let s = o.fromValues[u],
                        c = o.toValues[u],
                        m = a.lastPosition,
                        h = c instanceof Ne,
                        g = Array.isArray(o.initialVelocity) ? o.initialVelocity[u] : o.initialVelocity;
                    if (h && (c = c.getValue()), o.immediate) {
                        a.setValue(c), a.done = !0;
                        continue
                    }
                    if (typeof s == "string" || typeof c == "string") {
                        a.setValue(c), a.done = !0;
                        continue
                    }
                    if (o.duration !== void 0) m = s + o.easing((e - a.startTime) / o.duration) * (c - s), i = e >= a.startTime + o.duration;
                    else if (o.decay) m = s + g / (1 - .998) * (1 - Math.exp(-(1 - .998) * (e - a.startTime))), i = Math.abs(a.lastPosition - m) < .1, i && (c = m);
                    else {
                        l = a.lastTime !== void 0 ? a.lastTime : e, g = a.lastVelocity !== void 0 ? a.lastVelocity : o.initialVelocity, e > l + 64 && (l = e);
                        let E = Math.floor(e - l);
                        for (let d = 0; d < E; ++d) {
                            let v = -o.tension * (m - c),
                                y = -o.friction * g,
                                C = (v + y) / o.mass;
                            g = g + C * 1 / 1e3, m = m + g * 1 / 1e3
                        }
                        let S = o.clamp && o.tension !== 0 ? s < c ? m > c : m < c : !1,
                            p = Math.abs(g) <= o.precision,
                            f = o.tension !== 0 ? Math.abs(c - m) <= o.precision : !0;
                        i = S || p && f, a.lastVelocity = g, a.lastTime = e
                    }
                    h && !o.toValues[u].done && (i = !1), i ? (a.value !== c && (m = c), a.done = !0) : n = !0, a.setValue(m), a.lastPosition = m
                }
                t.props.onFrame && (t.values[o.name] = o.interpolation.getValue())
            }
            t.props.onFrame && t.props.onFrame(t.values), n || (Dt.delete(t), t.stop(!0))
        }
        return Dt.size ? En ? En() : Rr(dd) : cr = !1, cr
    },
    dm = e => {
        Dt.has(e) || Dt.add(e), cr || (cr = !0, Rr(En || dd))
    },
    pm = e => {
        Dt.has(e) && Dt.delete(e)
    };

function Ki(e, t, n) {
    if (typeof e == "function") return e;
    if (Array.isArray(e)) return Ki({
        range: e,
        output: t,
        extrapolate: n
    });
    if (Mr && typeof e.output[0] == "string") return Mr(e);
    const r = e,
        o = r.output,
        i = r.range || [0, 1],
        l = r.extrapolateLeft || r.extrapolate || "extend",
        u = r.extrapolateRight || r.extrapolate || "extend",
        a = r.easing || (s => s);
    return s => {
        const c = mm(s, i);
        return hm(s, i[c], i[c + 1], o[c], o[c + 1], a, l, u, r.map)
    }
}

function hm(e, t, n, r, o, i, l, u, a) {
    let s = a ? a(e) : e;
    if (s < t) {
        if (l === "identity") return s;
        l === "clamp" && (s = t)
    }
    if (s > n) {
        if (u === "identity") return s;
        u === "clamp" && (s = n)
    }
    return r === o ? r : t === n ? e <= t ? r : o : (t === -1 / 0 ? s = -s : n === 1 / 0 ? s = s - t : s = (s - t) / (n - t), s = i(s), r === -1 / 0 ? s = -s : o === 1 / 0 ? s = s + r : s = s * (o - r) + r, s)
}

function mm(e, t) {
    for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n);
    return n - 1
}
class xn extends Gl {
    constructor(t, n, r, o) {
        super(), this.calc = void 0, this.payload = t instanceof Gl && !(t instanceof xn) ? t.getPayload() : Array.isArray(t) ? t : [t], this.calc = Ki(n, r, o)
    }
    getValue() {
        return this.calc(...this.payload.map(t => t.getValue()))
    }
    updateConfig(t, n, r) {
        this.calc = Ki(t, n, r)
    }
    interpolate(t, n, r) {
        return new xn(this, t, n, r)
    }
}
const q0 = (e, t, n) => e && new xn(e, t, n);

function pd(e, t) {
    "update" in e ? t.add(e) : e.getChildren().forEach(n => pd(n, t))
}
class Hl extends Ne {
    constructor(t) {
        var n;
        super(), n = this, this.animatedStyles = new Set, this.value = void 0, this.startPosition = void 0, this.lastPosition = void 0, this.lastVelocity = void 0, this.startTime = void 0, this.lastTime = void 0, this.done = !1, this.setValue = function(r, o) {
            o === void 0 && (o = !0), n.value = r, o && n.flush()
        }, this.value = t, this.startPosition = t, this.lastPosition = t
    }
    flush() {
        this.animatedStyles.size === 0 && pd(this, this.animatedStyles), this.animatedStyles.forEach(t => t.update())
    }
    clearStyles() {
        this.animatedStyles.clear()
    }
    getValue() {
        return this.value
    }
    interpolate(t, n, r) {
        return new xn(this, t, n, r)
    }
}
class vm extends Gl {
    constructor(t) {
        super(), this.payload = t.map(n => new Hl(n))
    }
    setValue(t, n) {
        n === void 0 && (n = !0), Array.isArray(t) ? t.length === this.payload.length && t.forEach((r, o) => this.payload[o].setValue(r, n)) : this.payload.forEach(r => r.setValue(t, n))
    }
    getValue() {
        return this.payload.map(t => t.getValue())
    }
    interpolate(t, n) {
        return new xn(this, t, n)
    }
}
let gm = 0;
class hd {
    constructor() {
        this.id = void 0, this.idle = !0, this.hasChanged = !1, this.guid = 0, this.local = 0, this.props = {}, this.merged = {}, this.animations = {}, this.interpolations = {}, this.values = {}, this.configs = [], this.listeners = [], this.queue = [], this.localQueue = void 0, this.getValues = () => this.interpolations, this.id = gm++
    }
    update(t) {
        if (!t) return this;
        const n = Qo(t),
            r = n.delay,
            o = r === void 0 ? 0 : r,
            i = n.to,
            l = We(n, ["delay", "to"]);
        if (I.arr(i) || I.fun(i)) this.queue.push(z({}, l, {
            delay: o,
            to: i
        }));
        else if (i) {
            let u = {};
            Object.entries(i).forEach(a => {
                let s = a[0],
                    c = a[1];
                const m = z({
                        to: {
                            [s]: c
                        },
                        delay: Ee(o, s)
                    }, l),
                    h = u[m.delay] && u[m.delay].to;
                u[m.delay] = z({}, u[m.delay], m, {
                    to: z({}, h, m.to)
                })
            }), this.queue = Object.values(u)
        }
        return this.queue = this.queue.sort((u, a) => u.delay - a.delay), this.diff(l), this
    }
    start(t) {
        if (this.queue.length) {
            this.idle = !1, this.localQueue && this.localQueue.forEach(o => {
                let i = o.from,
                    l = i === void 0 ? {} : i,
                    u = o.to,
                    a = u === void 0 ? {} : u;
                I.obj(l) && (this.merged = z({}, l, this.merged)), I.obj(a) && (this.merged = z({}, this.merged, a))
            });
            const n = this.local = ++this.guid,
                r = this.localQueue = this.queue;
            this.queue = [], r.forEach((o, i) => {
                let l = o.delay,
                    u = We(o, ["delay"]);
                const a = c => {
                    i === r.length - 1 && n === this.guid && c && (this.idle = !0, this.props.onRest && this.props.onRest(this.merged)), t && t()
                };
                let s = I.arr(u.to) || I.fun(u.to);
                l ? setTimeout(() => {
                    n === this.guid && (s ? this.runAsync(u, a) : this.diff(u).start(a))
                }, l) : s ? this.runAsync(u, a) : this.diff(u).start(a)
            })
        } else I.fun(t) && this.listeners.push(t), this.props.onStart && this.props.onStart(), dm(this);
        return this
    }
    stop(t) {
        return this.listeners.forEach(n => n(t)), this.listeners = [], this
    }
    pause(t) {
        return this.stop(!0), t && pm(this), this
    }
    runAsync(t, n) {
        var r = this;
        t.delay;
        let o = We(t, ["delay"]);
        const i = this.local;
        let l = Promise.resolve(void 0);
        if (I.arr(o.to))
            for (let u = 0; u < o.to.length; u++) {
                const a = u,
                    s = z({}, o, Qo(o.to[a]));
                I.arr(s.config) && (s.config = s.config[a]), l = l.then(() => {
                    if (i === this.guid) return new Promise(c => this.diff(s).start(c))
                })
            } else if (I.fun(o.to)) {
                let u = 0,
                    a;
                l = l.then(() => o.to(s => {
                    const c = z({}, o, Qo(s));
                    if (I.arr(c.config) && (c.config = c.config[u]), u++, i === this.guid) return a = new Promise(m => this.diff(c).start(m))
                }, function(s) {
                    return s === void 0 && (s = !0), r.stop(s)
                }).then(() => a))
            }
        l.then(n)
    }
    diff(t) {
        this.props = z({}, this.props, t);
        let n = this.props,
            r = n.from,
            o = r === void 0 ? {} : r,
            i = n.to,
            l = i === void 0 ? {} : i,
            u = n.config,
            a = u === void 0 ? {} : u,
            s = n.reverse,
            c = n.attach,
            m = n.reset,
            h = n.immediate;
        if (s) {
            var g = [l, o];
            o = g[0], l = g[1]
        }
        this.merged = z({}, o, this.merged, l), this.hasChanged = !1;
        let E = c && c(this);
        if (this.animations = Object.entries(this.merged).reduce((S, p) => {
                let f = p[0],
                    d = p[1],
                    v = S[f] || {};
                const y = I.num(d),
                    C = I.str(d) && !d.startsWith("#") && !/\d/.test(d) && !Zu[d],
                    x = I.arr(d),
                    T = !y && !x && !C;
                let M = I.und(o[f]) ? d : o[f],
                    P = y || x || C ? d : 1,
                    D = Ee(a, f);
                E && (P = E.animations[f].parent);
                let F = v.parent,
                    A = v.interpolation,
                    b = rn(E ? P.getPayload() : P),
                    J, H = d;
                T && (H = Mr({
                    range: [0, 1],
                    output: [d, d]
                })(1));
                let W = A && A.getValue();
                const he = !I.und(F) && v.animatedValues.some(O => !O.done),
                    K = !I.equ(H, W),
                    ae = !I.equ(H, v.previous),
                    _ = !I.equ(D, v.config);
                if (m || ae && K || _) {
                    if (y || C) F = A = v.parent || new Hl(M);
                    else if (x) F = A = v.parent || new vm(M);
                    else if (T) {
                        let O = v.interpolation && v.interpolation.calc(v.parent.value);
                        O = O !== void 0 && !m ? O : M, v.parent ? (F = v.parent, F.setValue(0, !1)) : F = new Hl(0);
                        const L = {
                            output: [O, d]
                        };
                        v.interpolation ? (A = v.interpolation, v.interpolation.updateConfig(L)) : A = F.interpolate(L)
                    }
                    return b = rn(E ? P.getPayload() : P), J = rn(F.getPayload()), m && !T && F.setValue(M, !1), this.hasChanged = !0, J.forEach(O => {
                        O.startPosition = O.value, O.lastPosition = O.value, O.lastVelocity = he ? O.lastVelocity : void 0, O.lastTime = he ? O.lastTime : void 0, O.startTime = ho(), O.done = !1, O.animatedStyles.clear()
                    }), Ee(h, f) && F.setValue(T ? P : d, !1), z({}, S, {
                        [f]: z({}, v, {
                            name: f,
                            parent: F,
                            interpolation: A,
                            animatedValues: J,
                            toValues: b,
                            previous: H,
                            config: D,
                            fromValues: rn(F.getValue()),
                            immediate: Ee(h, f),
                            initialVelocity: kt(D.velocity, 0),
                            clamp: kt(D.clamp, !1),
                            precision: kt(D.precision, .01),
                            tension: kt(D.tension, 170),
                            friction: kt(D.friction, 26),
                            mass: kt(D.mass, 1),
                            duration: D.duration,
                            easing: kt(D.easing, O => O),
                            decay: D.decay
                        })
                    })
                } else return K ? S : (T && (F.setValue(1, !1), A.updateConfig({
                    output: [H, H]
                })), F.done = !0, this.hasChanged = !0, z({}, S, {
                    [f]: z({}, S[f], {
                        previous: H
                    })
                }))
            }, this.animations), this.hasChanged) {
            this.configs = Object.values(this.animations), this.values = {}, this.interpolations = {};
            for (let S in this.animations) this.interpolations[S] = this.animations[S].interpolation, this.values[S] = this.animations[S].interpolation.getValue()
        }
        return this
    }
    destroy() {
        this.stop(), this.props = {}, this.merged = {}, this.animations = {}, this.interpolations = {}, this.values = {}, this.configs = [], this.local = 0
    }
}
const ym = (e, t) => {
        const n = $.exports.useRef(!1),
            r = $.exports.useRef(),
            o = I.fun(t),
            i = $.exports.useMemo(() => {
                r.current && (r.current.map(m => m.destroy()), r.current = void 0);
                let c;
                return [new Array(e).fill().map((m, h) => {
                    const g = new hd,
                        E = o ? Ee(t, h, g) : t[h];
                    return h === 0 && (c = E.ref), g.update(E), c || g.start(), g
                }), c]
            }, [e]),
            l = i[0],
            u = i[1];
        r.current = l, $.exports.useImperativeHandle(u, () => ({
            start: () => Promise.all(r.current.map(c => new Promise(m => c.start(m)))),
            stop: c => r.current.forEach(m => m.stop(c)),
            get controllers() {
                return r.current
            }
        }));
        const a = $.exports.useMemo(() => c => r.current.map((m, h) => {
            m.update(o ? Ee(c, h, m) : c[h]), u || m.start()
        }), [e]);
        $.exports.useEffect(() => {
            n.current ? o || a(t) : u || r.current.forEach(c => c.start())
        }), $.exports.useEffect(() => (n.current = !0, () => r.current.forEach(c => c.destroy())), []);
        const s = r.current.map(c => c.getValues());
        return o ? [s, a, c => r.current.forEach(m => m.pause(c))] : s
    },
    Z0 = e => {
        const t = I.fun(e),
            n = ym(1, t ? e : [e]),
            r = n[0],
            o = n[1],
            i = n[2];
        return t ? [r[0], o, i] : r
    };
let wm = 0;
const vi = "enter",
    Yo = "leave",
    Xo = "update",
    Sm = (e, t) => (typeof t == "function" ? e.map(t) : rn(t)).map(String),
    Kl = e => {
        let t = e.items,
            n = e.keys,
            r = n === void 0 ? i => i : n,
            o = We(e, ["items", "keys"]);
        return t = rn(t !== void 0 ? t : null), z({
            items: t,
            keys: Sm(t, r)
        }, o)
    };

function J0(e, t, n) {
    const r = z({
            items: e,
            keys: t || (d => d)
        }, n),
        o = Kl(r),
        i = o.lazy,
        l = i === void 0 ? !1 : i;
    o.unique;
    const u = o.reset,
        a = u === void 0 ? !1 : u;
    o.enter, o.leave, o.update;
    const s = o.onDestroyed;
    o.keys, o.items;
    const c = o.onFrame,
        m = o.onRest,
        h = o.onStart,
        g = o.ref,
        E = We(o, ["lazy", "unique", "reset", "enter", "leave", "update", "onDestroyed", "keys", "items", "onFrame", "onRest", "onStart", "ref"]),
        S = rd(),
        p = $.exports.useRef(!1),
        f = $.exports.useRef({
            mounted: !1,
            first: !0,
            deleted: [],
            current: {},
            transitions: [],
            prevProps: {},
            paused: !!r.ref,
            instances: !p.current && new Map,
            forceUpdate: S
        });
    return $.exports.useImperativeHandle(r.ref, () => ({
        start: () => Promise.all(Array.from(f.current.instances).map(d => {
            let v = d[1];
            return new Promise(y => v.start(y))
        })),
        stop: d => Array.from(f.current.instances).forEach(v => v[1].stop(d)),
        get controllers() {
            return Array.from(f.current.instances).map(d => d[1])
        }
    })), f.current = Em(f.current, r), f.current.changed && f.current.transitions.forEach(d => {
        const v = d.slot,
            y = d.from,
            C = d.to,
            x = d.config,
            T = d.trail,
            M = d.key,
            P = d.item;
        f.current.instances.has(M) || f.current.instances.set(M, new hd);
        const D = f.current.instances.get(M),
            F = z({}, E, {
                to: C,
                from: y,
                config: x,
                ref: g,
                onRest: A => {
                    f.current.mounted && (d.destroyed && (!g && !l && Ns(f, M), s && s(P)), !Array.from(f.current.instances).some(H => !H[1].idle) && (g || l) && f.current.deleted.length > 0 && Ns(f), m && m(P, v, A))
                },
                onStart: h && (() => h(P, v)),
                onFrame: c && (A => c(P, v, A)),
                delay: T,
                reset: a && v === vi
            });
        D.update(F), f.current.paused || D.start()
    }), $.exports.useEffect(() => (f.current.mounted = p.current = !0, () => {
        f.current.mounted = p.current = !1, Array.from(f.current.instances).map(d => d[1].destroy()), f.current.instances.clear()
    }), []), f.current.transitions.map(d => {
        let v = d.item,
            y = d.slot,
            C = d.key;
        return {
            item: v,
            key: C,
            state: y,
            props: f.current.instances.get(C).getValues()
        }
    })
}

function Ns(e, t) {
    const n = e.current.deleted;
    for (let r of n) {
        let o = r.key;
        const i = l => l.key !== o;
        (I.und(t) || t === o) && (e.current.instances.delete(o), e.current.transitions = e.current.transitions.filter(i), e.current.deleted = e.current.deleted.filter(i))
    }
    e.current.forceUpdate()
}

function Em(e, t) {
    let n = e.first,
        r = e.prevProps,
        o = We(e, ["first", "prevProps"]),
        i = Kl(t),
        l = i.items,
        u = i.keys,
        a = i.initial,
        s = i.from,
        c = i.enter,
        m = i.leave,
        h = i.update,
        g = i.trail,
        E = g === void 0 ? 0 : g,
        S = i.unique,
        p = i.config,
        f = i.order,
        d = f === void 0 ? [vi, Yo, Xo] : f,
        v = Kl(r),
        y = v.keys,
        C = v.items,
        x = z({}, o.current),
        T = [...o.deleted],
        M = Object.keys(x),
        P = new Set(M),
        D = new Set(u),
        F = u.filter(W => !P.has(W)),
        A = o.transitions.filter(W => !W.destroyed && !D.has(W.originalKey)).map(W => W.originalKey),
        b = u.filter(W => P.has(W)),
        J = -E;
    for (; d.length;) switch (d.shift()) {
        case vi:
            {
                F.forEach((X, he) => {
                    S && T.find(O => O.originalKey === X) && (T = T.filter(O => O.originalKey !== X));
                    const K = u.indexOf(X),
                        ae = l[K],
                        _ = n && a !== void 0 ? "initial" : vi;
                    x[X] = {
                        slot: _,
                        originalKey: X,
                        key: S ? String(X) : wm++,
                        item: ae,
                        trail: J = J + E,
                        config: Ee(p, ae, _),
                        from: Ee(n && a !== void 0 ? a || {} : s, ae),
                        to: Ee(c, ae)
                    }
                });
                break
            }
        case Yo:
            {
                A.forEach(X => {
                    const he = y.indexOf(X),
                        K = C[he],
                        ae = Yo;
                    T.unshift(z({}, x[X], {
                        slot: ae,
                        destroyed: !0,
                        left: y[Math.max(0, he - 1)],
                        right: y[Math.min(y.length, he + 1)],
                        trail: J = J + E,
                        config: Ee(p, K, ae),
                        to: Ee(m, K)
                    })), delete x[X]
                });
                break
            }
        case Xo:
            {
                b.forEach(X => {
                    const he = u.indexOf(X),
                        K = l[he],
                        ae = Xo;
                    x[X] = z({}, x[X], {
                        item: K,
                        slot: ae,
                        trail: J = J + E,
                        config: Ee(p, K, ae),
                        to: Ee(h, K)
                    })
                });
                break
            }
    }
    let H = u.map(W => x[W]);
    return T.forEach(W => {
        let X = W.left;
        W.right;
        let he = We(W, ["left", "right"]),
            K;
        (K = H.findIndex(ae => ae.originalKey === X)) !== -1 && (K += 1), K = Math.max(0, K), H = [...H.slice(0, K), he, ...H.slice(K)]
    }), z({}, o, {
        changed: F.length || A.length || b.length,
        first: n && F.length === 0,
        transitions: H,
        current: x,
        deleted: T,
        prevProps: t
    })
}
class xm extends id {
    constructor(t) {
        t === void 0 && (t = {}), super(), t.transform && !(t.transform instanceof Ne) && (t = po.transform(t)), this.payload = t
    }
}
const Qi = {
        transparent: 0,
        aliceblue: 4042850303,
        antiquewhite: 4209760255,
        aqua: 16777215,
        aquamarine: 2147472639,
        azure: 4043309055,
        beige: 4126530815,
        bisque: 4293182719,
        black: 255,
        blanchedalmond: 4293643775,
        blue: 65535,
        blueviolet: 2318131967,
        brown: 2771004159,
        burlywood: 3736635391,
        burntsienna: 3934150143,
        cadetblue: 1604231423,
        chartreuse: 2147418367,
        chocolate: 3530104575,
        coral: 4286533887,
        cornflowerblue: 1687547391,
        cornsilk: 4294499583,
        crimson: 3692313855,
        cyan: 16777215,
        darkblue: 35839,
        darkcyan: 9145343,
        darkgoldenrod: 3095792639,
        darkgray: 2846468607,
        darkgreen: 6553855,
        darkgrey: 2846468607,
        darkkhaki: 3182914559,
        darkmagenta: 2332068863,
        darkolivegreen: 1433087999,
        darkorange: 4287365375,
        darkorchid: 2570243327,
        darkred: 2332033279,
        darksalmon: 3918953215,
        darkseagreen: 2411499519,
        darkslateblue: 1211993087,
        darkslategray: 793726975,
        darkslategrey: 793726975,
        darkturquoise: 13554175,
        darkviolet: 2483082239,
        deeppink: 4279538687,
        deepskyblue: 12582911,
        dimgray: 1768516095,
        dimgrey: 1768516095,
        dodgerblue: 512819199,
        firebrick: 2988581631,
        floralwhite: 4294635775,
        forestgreen: 579543807,
        fuchsia: 4278255615,
        gainsboro: 3705462015,
        ghostwhite: 4177068031,
        gold: 4292280575,
        goldenrod: 3668254975,
        gray: 2155905279,
        green: 8388863,
        greenyellow: 2919182335,
        grey: 2155905279,
        honeydew: 4043305215,
        hotpink: 4285117695,
        indianred: 3445382399,
        indigo: 1258324735,
        ivory: 4294963455,
        khaki: 4041641215,
        lavender: 3873897215,
        lavenderblush: 4293981695,
        lawngreen: 2096890111,
        lemonchiffon: 4294626815,
        lightblue: 2916673279,
        lightcoral: 4034953471,
        lightcyan: 3774873599,
        lightgoldenrodyellow: 4210742015,
        lightgray: 3553874943,
        lightgreen: 2431553791,
        lightgrey: 3553874943,
        lightpink: 4290167295,
        lightsalmon: 4288707327,
        lightseagreen: 548580095,
        lightskyblue: 2278488831,
        lightslategray: 2005441023,
        lightslategrey: 2005441023,
        lightsteelblue: 2965692159,
        lightyellow: 4294959359,
        lime: 16711935,
        limegreen: 852308735,
        linen: 4210091775,
        magenta: 4278255615,
        maroon: 2147483903,
        mediumaquamarine: 1724754687,
        mediumblue: 52735,
        mediumorchid: 3126187007,
        mediumpurple: 2473647103,
        mediumseagreen: 1018393087,
        mediumslateblue: 2070474495,
        mediumspringgreen: 16423679,
        mediumturquoise: 1221709055,
        mediumvioletred: 3340076543,
        midnightblue: 421097727,
        mintcream: 4127193855,
        mistyrose: 4293190143,
        moccasin: 4293178879,
        navajowhite: 4292783615,
        navy: 33023,
        oldlace: 4260751103,
        olive: 2155872511,
        olivedrab: 1804477439,
        orange: 4289003775,
        orangered: 4282712319,
        orchid: 3664828159,
        palegoldenrod: 4008225535,
        palegreen: 2566625535,
        paleturquoise: 2951671551,
        palevioletred: 3681588223,
        papayawhip: 4293907967,
        peachpuff: 4292524543,
        peru: 3448061951,
        pink: 4290825215,
        plum: 3718307327,
        powderblue: 2967529215,
        purple: 2147516671,
        rebeccapurple: 1714657791,
        red: 4278190335,
        rosybrown: 3163525119,
        royalblue: 1097458175,
        saddlebrown: 2336560127,
        salmon: 4202722047,
        sandybrown: 4104413439,
        seagreen: 780883967,
        seashell: 4294307583,
        sienna: 2689740287,
        silver: 3233857791,
        skyblue: 2278484991,
        slateblue: 1784335871,
        slategray: 1887473919,
        slategrey: 1887473919,
        snow: 4294638335,
        springgreen: 16744447,
        steelblue: 1182971135,
        tan: 3535047935,
        teal: 8421631,
        thistle: 3636451583,
        tomato: 4284696575,
        turquoise: 1088475391,
        violet: 4001558271,
        wheat: 4125012991,
        white: 4294967295,
        whitesmoke: 4126537215,
        yellow: 4294902015,
        yellowgreen: 2597139199
    },
    Fe = "[-+]?\\d*\\.?\\d+",
    Yi = Fe + "%";

function mo() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return "\\(\\s*(" + t.join(")\\s*,\\s*(") + ")\\s*\\)"
}
const km = new RegExp("rgb" + mo(Fe, Fe, Fe)),
    _m = new RegExp("rgba" + mo(Fe, Fe, Fe, Fe)),
    Pm = new RegExp("hsl" + mo(Fe, Yi, Yi)),
    Om = new RegExp("hsla" + mo(Fe, Yi, Yi, Fe)),
    Cm = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    Tm = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    Rm = /^#([0-9a-fA-F]{6})$/,
    Mm = /^#([0-9a-fA-F]{8})$/;

function jm(e) {
    let t;
    return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = Rm.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Qi.hasOwnProperty(e) ? Qi[e] : (t = km.exec(e)) ? (Qt(t[1]) << 24 | Qt(t[2]) << 16 | Qt(t[3]) << 8 | 255) >>> 0 : (t = _m.exec(e)) ? (Qt(t[1]) << 24 | Qt(t[2]) << 16 | Qt(t[3]) << 8 | zs(t[4])) >>> 0 : (t = Cm.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = Mm.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = Tm.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = Pm.exec(e)) ? ($s(Fs(t[1]), Zr(t[2]), Zr(t[3])) | 255) >>> 0 : (t = Om.exec(e)) ? ($s(Fs(t[1]), Zr(t[2]), Zr(t[3])) | zs(t[4])) >>> 0 : null
}

function qo(e, t, n) {
    return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
}

function $s(e, t, n) {
    const r = n < .5 ? n * (1 + t) : n + t - n * t,
        o = 2 * n - r,
        i = qo(o, r, e + 1 / 3),
        l = qo(o, r, e),
        u = qo(o, r, e - 1 / 3);
    return Math.round(i * 255) << 24 | Math.round(l * 255) << 16 | Math.round(u * 255) << 8
}

function Qt(e) {
    const t = parseInt(e, 10);
    return t < 0 ? 0 : t > 255 ? 255 : t
}

function Fs(e) {
    return (parseFloat(e) % 360 + 360) % 360 / 360
}

function zs(e) {
    const t = parseFloat(e);
    return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255)
}

function Zr(e) {
    const t = parseFloat(e);
    return t < 0 ? 0 : t > 100 ? 1 : t / 100
}

function Vs(e) {
    let t = jm(e);
    if (t === null) return e;
    t = t || 0;
    let n = (t & 4278190080) >>> 24,
        r = (t & 16711680) >>> 16,
        o = (t & 65280) >>> 8,
        i = (t & 255) / 255;
    return `rgba(${n}, ${r}, ${o}, ${i})`
}
const Jr = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    Dm = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi,
    Lm = new RegExp(`(${Object.keys(Qi).join("|")})`, "g"),
    Am = e => {
        const t = e.output.map(o => o.replace(Dm, Vs)).map(o => o.replace(Lm, Vs)),
            n = t[0].match(Jr).map(() => []);
        t.forEach(o => {
            o.match(Jr).forEach((i, l) => n[l].push(+i))
        });
        const r = t[0].match(Jr).map((o, i) => Ki(z({}, e, {
            output: n[i]
        })));
        return o => {
            let i = 0;
            return t[0].replace(Jr, () => r[i++](o)).replace(/rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, (l, u, a, s, c) => `rgba(${Math.round(u)}, ${Math.round(a)}, ${Math.round(s)}, ${c})`)
        }
    };
let dr = {
    animationIterationCount: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
};
const Im = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1),
    Nm = ["Webkit", "Ms", "Moz", "O"];
dr = Object.keys(dr).reduce((e, t) => (Nm.forEach(n => e[Im(n, t)] = e[t]), e), dr);

function $m(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : !n && typeof t == "number" && t !== 0 && !(dr.hasOwnProperty(e) && dr[e]) ? t + "px" : ("" + t).trim()
}
const bs = {};
cd(e => new xm(e));
fd("div");
ad(Am);
ld(Qi);
od((e, t) => {
    if (e.nodeType && e.setAttribute !== void 0) {
        const o = t.style,
            i = t.children,
            l = t.scrollTop,
            u = t.scrollLeft,
            a = We(t, ["style", "children", "scrollTop", "scrollLeft"]),
            s = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter";
        l !== void 0 && (e.scrollTop = l), u !== void 0 && (e.scrollLeft = u), i !== void 0 && (e.textContent = i);
        for (let c in o)
            if (!!o.hasOwnProperty(c)) {
                var n = c.indexOf("--") === 0,
                    r = $m(c, o[c], n);
                c === "float" && (c = "cssFloat"), n ? e.style.setProperty(c, r) : e.style[c] = r
            }
        for (let c in a) {
            const m = s ? c : bs[c] || (bs[c] = c.replace(/([A-Z])/g, h => "-" + h.toLowerCase()));
            typeof e.getAttribute(m) < "u" && e.setAttribute(m, a[c])
        }
        return
    } else return !1
}, e => e);
const Fm = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"],
    zm = nm(cm, !1),
    ev = zm(Fm);

function Ql(e, t) {
    return e.map(function(n, r) {
        return n + t[r]
    })
}

function md(e, t) {
    return e.map(function(n, r) {
        return n - t[r]
    })
}

function Vm(e, t, n) {
    return n = n || Math.hypot.apply(Math, e), t ? n / t : 0
}

function bm(e, t) {
    return t ? e.map(function(n) {
        return n / t
    }) : Array(e.length).fill(0)
}

function vo(e) {
    return Math.hypot.apply(Math, e)
}

function ta(e, t) {
    return t = t || Math.hypot.apply(Math, e) || 1, e.map(function(n) {
        return n / t
    })
}

function vd(e, t, n) {
    var r = Math.hypot.apply(Math, t);
    return {
        velocities: bm(t, n),
        velocity: Vm(t, n, r),
        distance: vo(e),
        direction: ta(t, r)
    }
}

function Xi(e) {
    return Math.sign ? Math.sign(e) : Number(e > 0) - Number(e < 0) || +e
}

function Us(e, t) {
    var n = Math.abs(e);
    return n >= t ? Xi(e) * t : !1
}

function Um(e, t, n) {
    return Math.max(t, Math.min(e, n))
}

function Bm(e, t) {
    return Math.pow(e, t * 5)
}

function Bs(e, t, n) {
    return t === 0 || Math.abs(t) === 1 / 0 ? Bm(e, n) : e * t * n / (t + n * e)
}

function Wm(e, t, n, r) {
    return r === void 0 && (r = .15), r === 0 ? Um(e, t, n) : e < t ? -Bs(t - e, n - t, r) + t : e > n ? Bs(e - n, n - t, r) + n : e
}

function Ws(e, t) {
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
    }
}

function Gm(e, t, n) {
    return t && Ws(e.prototype, t), n && Ws(e, n), e
}

function w() {
    return w = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    }, w.apply(this, arguments)
}

function Bt(e, t) {
    e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t
}

function jn(e, t) {
    if (e == null) return {};
    var n = {},
        r = Object.keys(e),
        o, i;
    for (i = 0; i < r.length; i++) o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
    return n
}

function Hm(e) {
    if (e === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e
}

function Km(e, t) {
    if (!!e) {
        if (typeof e == "string") return Gs(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Gs(e, t)
    }
}

function Gs(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r
}

function Qm(e) {
    var t = 0;
    if (typeof Symbol > "u" || e[Symbol.iterator] == null) {
        if (Array.isArray(e) || (e = Km(e))) return function() {
            return t >= e.length ? {
                done: !0
            } : {
                done: !1,
                value: e[t++]
            }
        };
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
    }
    return t = e[Symbol.iterator](), t.next.bind(t)
}

function na() {}
var Hs = function() {
        for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];
        return function() {
            for (var o = arguments.length, i = new Array(o), l = 0; l < o; l++) i[l] = arguments[l];
            return n.forEach(function(u) {
                return u.apply(void 0, i)
            })
        }
    },
    Te = {
        array: function(t) {
            return Array.isArray(t) ? t : [t, t]
        },
        withDefault: function(t, n) {
            return t !== void 0 ? t : n
        }
    };

function gd(e, t) {
    var n = {};
    return Object.entries(e).forEach(function(r) {
        var o = r[0],
            i = r[1];
        return (i !== void 0 || o in t) && (n[o] = i)
    }), n
}

function ei(e) {
    return typeof e == "function" ? e() : e
}

function yd() {
    var e = {
            _active: !1,
            _blocked: !1,
            _intentional: [!1, !1],
            _movement: [0, 0],
            _initial: [0, 0],
            _lastEventType: void 0,
            event: void 0,
            values: [0, 0],
            velocities: [0, 0],
            delta: [0, 0],
            movement: [0, 0],
            offset: [0, 0],
            lastOffset: [0, 0],
            direction: [0, 0],
            initial: [0, 0],
            previous: [0, 0],
            first: !1,
            last: !1,
            active: !1,
            timeStamp: 0,
            startTime: 0,
            elapsedTime: 0,
            cancel: na,
            canceled: !1,
            memo: void 0,
            args: void 0
        },
        t = {
            axis: void 0,
            xy: [0, 0],
            vxvy: [0, 0],
            velocity: 0,
            distance: 0
        },
        n = {
            da: [0, 0],
            vdva: [0, 0],
            origin: void 0,
            turns: 0
        };
    return {
        shared: {
            hovering: !1,
            scrolling: !1,
            wheeling: !1,
            dragging: !1,
            moving: !1,
            pinching: !1,
            touches: 0,
            buttons: 0,
            down: !1,
            shiftKey: !1,
            altKey: !1,
            metaKey: !1,
            ctrlKey: !1
        },
        drag: w(w(w({}, e), t), {}, {
            _isTap: !0,
            _delayedEvent: !1,
            tap: !1,
            swipe: [0, 0]
        }),
        pinch: w(w({}, e), n),
        wheel: w(w({}, e), t),
        move: w(w({}, e), t),
        scroll: w(w({}, e), t)
    }
}
var wd = function(t) {
    return function(n, r, o) {
        var i = t ? "addEventListener" : "removeEventListener";
        r.forEach(function(l) {
            var u = l[0],
                a = l[1];
            return n[i](u, a, o)
        })
    }
};

function Ym() {
    try {
        return "constructor" in GestureEvent
    } catch {
        return !1
    }
}
var Ks = wd(!0),
    Qs = wd(!1);

function Xm(e) {
    var t = e.shiftKey,
        n = e.altKey,
        r = e.metaKey,
        o = e.ctrlKey;
    return {
        shiftKey: t,
        altKey: n,
        metaKey: r,
        ctrlKey: o
    }
}

function Sd(e) {
    if ("touches" in e) {
        var t = e.touches,
            n = e.changedTouches;
        return t.length > 0 ? t : n
    }
    return null
}

function fe(e) {
    var t = "buttons" in e ? e.buttons : 0,
        n = Sd(e),
        r = n && n.length || 0,
        o = r > 0 || t > 0;
    return w({
        touches: r,
        down: o,
        buttons: t
    }, Xm(e))
}

function Ys(e) {
    var t = e.currentTarget,
        n = t.scrollX,
        r = t.scrollY,
        o = t.scrollLeft,
        i = t.scrollTop;
    return {
        values: [n || o || 0, r || i || 0]
    }
}

function Ed(e) {
    var t = e.deltaX,
        n = e.deltaY;
    return {
        values: [t, n]
    }
}

function on(e) {
    var t = Sd(e),
        n = t ? t[0] : e,
        r = n.clientX,
        o = n.clientY;
    return {
        values: [r, o]
    }
}
var qm = 260;

function Xs(e) {
    return {
        values: [e.scale * qm, e.rotation]
    }
}

function Zo(e) {
    var t = e.touches,
        n = t[1].clientX - t[0].clientX,
        r = t[1].clientY - t[0].clientY,
        o = [Math.hypot(n, r), -(Math.atan2(n, r) * 180) / Math.PI],
        i = [(t[1].clientX + t[0].clientX) / 2, (t[1].clientY + t[0].clientY) / 2];
    return {
        values: o,
        origin: i
    }
}
var Zm = function() {
    var t = this;
    this.state = yd(), this.timeouts = {}, this.domListeners = [], this.windowListeners = {}, this.bindings = {}, this.clean = function() {
        t.resetBindings(), Object.values(t.timeouts).forEach(clearTimeout), Object.keys(t.windowListeners).forEach(function(n) {
            return t.removeWindowListeners(n)
        })
    }, this.resetBindings = function() {
        t.bindings = {};
        var n = t.getDomTarget();
        n && (Qs(n, t.domListeners, t.config.eventOptions), t.domListeners = [])
    }, this.getDomTarget = function() {
        var n = t.config.domTarget;
        return n && "current" in n ? n.current : n
    }, this.addWindowListeners = function(n, r) {
        !t.config.window || (t.windowListeners[n] = r, Ks(t.config.window, r, t.config.eventOptions))
    }, this.removeWindowListeners = function(n) {
        if (!!t.config.window) {
            var r = t.windowListeners[n];
            r && (Qs(t.config.window, r, t.config.eventOptions), delete t.windowListeners[n])
        }
    }, this.addDomTargetListeners = function(n) {
        Object.entries(t.bindings).forEach(function(r) {
            var o = r[0],
                i = r[1];
            t.domListeners.push([o.substr(2).toLowerCase(), Hs.apply(void 0, i)])
        }), Ks(n, t.domListeners, t.config.eventOptions)
    }, this.addBindings = function(n, r) {
        var o = Array.isArray(n) ? n : [n];
        o.forEach(function(i) {
            t.bindings[i] ? t.bindings[i].push(r) : t.bindings[i] = [r]
        })
    }, this.getBindings = function() {
        var n = {},
            r = t.config.captureString;
        return Object.entries(t.bindings).forEach(function(o) {
            var i = o[0],
                l = o[1],
                u = Array.isArray(l) ? l : [l],
                a = i + r;
            n[a] = Hs.apply(void 0, u)
        }), n
    }, this.getBind = function() {
        if (t.config.domTarget) {
            var n = t.getDomTarget();
            return n && t.addDomTargetListeners(n), t.clean
        }
        return t.getBindings()
    }
};

function xd(e, t, n, r) {
    var o = Si.useMemo(function() {
        var i = new Zm,
            l = function() {
                i.resetBindings();
                for (var a = arguments.length, s = new Array(a), c = 0; c < a; c++) s[c] = arguments[c];
                for (var m = Qm(t), h; !(h = m()).done;) {
                    var g = h.value;
                    new g(i, s).addBindings()
                }
                if (o.nativeRefs)
                    for (var E in o.nativeRefs) i.addBindings(E, o.nativeRefs[E]);
                return i.getBind()
            };
        return {
            nativeRefs: r,
            current: i,
            bind: l
        }
    }, []);
    return o.current.config = n, o.current.handlers = e, o.nativeRefs = r, Si.useEffect(function() {
        return o.current.clean
    }, []), o.bind
}
var kd = function() {
        function e(n, r, o) {
            var i = this;
            o === void 0 && (o = []), this.stateKey = n, this.controller = r, this.args = o, this.debounced = !0, this.setTimeout = function(l, u) {
                var a;
                u === void 0 && (u = 140);
                for (var s = arguments.length, c = new Array(s > 2 ? s - 2 : 0), m = 2; m < s; m++) c[m - 2] = arguments[m];
                i.controller.timeouts[i.stateKey] = (a = window).setTimeout.apply(a, [l, u].concat(c))
            }, this.clearTimeout = function() {
                clearTimeout(i.controller.timeouts[i.stateKey])
            }, this.addWindowListeners = function(l) {
                i.controller.addWindowListeners(i.stateKey, l)
            }, this.removeWindowListeners = function() {
                i.controller.removeWindowListeners(i.stateKey)
            }, this.getStartGestureState = function(l, u) {
                return w(w({}, yd()[i.stateKey]), {}, {
                    _active: !0,
                    values: l,
                    initial: l,
                    offset: i.state.offset,
                    lastOffset: i.state.offset,
                    startTime: u.timeStamp
                })
            }, this.rubberband = function(l, u) {
                var a = i.config.bounds;
                return l.map(function(s, c) {
                    return Wm(s, a[c][0], a[c][1], u[c])
                })
            }, this.fireGestureHandler = function(l) {
                if (i.state._blocked) return i.debounced || (i.state._active = !1, i.clean()), null;
                var u = i.state._intentional,
                    a = u[0],
                    s = u[1];
                if (!l && a === !1 && s === !1) return null;
                var c = i.state,
                    m = c._active,
                    h = c.active;
                i.state.active = m, i.state.first = m && !h, i.state.last = h && !m, i.controller.state.shared[i.ingKey] = m;
                var g = w(w(w({}, i.controller.state.shared), i.state), i.mapStateValues(i.state)),
                    E = i.handler(g);
                return i.state.memo = E !== void 0 ? E : i.state.memo, m || i.clean(), g
            }
        }
        var t = e.prototype;
        return t.updateSharedState = function(r) {
            Object.assign(this.controller.state.shared, r)
        }, t.updateGestureState = function(r) {
            Object.assign(this.state, r)
        }, t.getGenericPayload = function(r, o) {
            var i = r.timeStamp,
                l = r.type,
                u = this.state,
                a = u.values,
                s = u.startTime;
            return {
                _lastEventType: l,
                event: r,
                timeStamp: i,
                elapsedTime: o ? 0 : i - s,
                args: this.args,
                previous: a
            }
        }, t.checkIntentionality = function(r, o, i) {
            return {
                _intentional: r,
                _blocked: !1
            }
        }, t.getMovement = function(r, o) {
            o === void 0 && (o = this.state);
            var i = this.config,
                l = i.initial,
                u = i.threshold,
                a = i.rubberband,
                s = u[0],
                c = u[1],
                m = o,
                h = m._initial,
                g = m._active,
                E = m._intentional,
                S = m.lastOffset,
                p = m.movement,
                f = E[0],
                d = E[1],
                v = this.getInternalMovement(r, o),
                y = v[0],
                C = v[1];
            f === !1 && (f = Us(y, s)), d === !1 && (d = Us(C, c));
            var x = this.checkIntentionality([f, d], [y, C], o),
                T = x._intentional,
                M = x._blocked,
                P = T[0],
                D = T[1],
                F = [y, C];
            if (P !== !1 && E[0] === !1 && (h[0] = ei(l)[0]), D !== !1 && E[1] === !1 && (h[1] = ei(l)[1]), M) return w(w({}, x), {}, {
                _movement: F,
                delta: [0, 0]
            });
            var A = [P !== !1 ? y - P : ei(l)[0], D !== !1 ? C - D : ei(l)[1]],
                b = Ql(A, S),
                J = g ? a : [0, 0];
            return A = this.rubberband(Ql(A, h), J), w(w({}, x), {}, {
                _initial: h,
                _movement: F,
                movement: A,
                offset: this.rubberband(b, J),
                delta: md(A, p)
            })
        }, t.clean = function() {
            this.clearTimeout(), this.removeWindowListeners()
        }, Gm(e, [{
            key: "config",
            get: function() {
                return this.controller.config[this.stateKey]
            }
        }, {
            key: "enabled",
            get: function() {
                return this.controller.config.enabled && this.config.enabled
            }
        }, {
            key: "state",
            get: function() {
                return this.controller.state[this.stateKey]
            }
        }, {
            key: "handler",
            get: function() {
                return this.controller.handlers[this.stateKey]
            }
        }]), e
    }(),
    go = function(e) {
        Bt(t, e);

        function t() {
            return e.apply(this, arguments) || this
        }
        var n = t.prototype;
        return n.getInternalMovement = function(o, i) {
            return md(o, i.initial)
        }, n.checkIntentionality = function(o, i, l) {
            var u = o,
                a = u[0],
                s = u[1],
                c = a !== !1 || s !== !1,
                m = l.axis,
                h = !1;
            if (c) {
                var g = i.map(Math.abs),
                    E = g[0],
                    S = g[1],
                    p = this.config,
                    f = p.axis,
                    d = p.lockDirection;
                if (m = m || (E > S ? "x" : E < S ? "y" : void 0), !!f || d)
                    if (m)
                        if (!!f && m !== f) h = !0;
                        else {
                            var v = m === "x" ? 1 : 0;
                            o[v] = !1
                        }
                else o = [!1, !1]
            }
            return {
                _intentional: o,
                _blocked: h,
                axis: m
            }
        }, n.getKinematics = function(o, i) {
            var l = this.state.timeStamp,
                u = this.getMovement(o, this.state),
                a = u._blocked,
                s = u.delta,
                c = u.movement;
            if (a) return u;
            var m = i.timeStamp - l,
                h = vd(c, s, m);
            return w(w({
                values: o,
                delta: s
            }, u), h)
        }, n.mapStateValues = function(o) {
            return {
                xy: o.values,
                vxvy: o.velocities
            }
        }, t
    }(kd),
    Jm = 3,
    e0 = 220,
    t0 = 200,
    _d = function(e) {
        Bt(t, e);

        function t(r, o) {
            var i;
            return i = e.call(this, "drag", r, o) || this, i.ingKey = "dragging", i.wasTouch = !1, i.isEventTypeTouch = function(l) {
                return !!l && l.indexOf("touch") === 0
            }, i.dragShouldStart = function(l) {
                var u = fe(l),
                    a = u.touches,
                    s = i.state._lastEventType;
                if (!i.controller.config.pointer && i.isEventTypeTouch(s) && !i.isEventTypeTouch(l.type)) {
                    var c = Math.abs(l.timeStamp - i.state.startTime);
                    if (c < t0) return !1
                }
                return i.enabled && a < 2
            }, i.setPointers = function(l) {
                var u = l.currentTarget,
                    a = l.pointerId;
                u && u.setPointerCapture(a), i.updateGestureState({
                    currentTarget: u,
                    pointerId: a
                })
            }, i.removePointers = function() {
                var l = i.state,
                    u = l.currentTarget,
                    a = l.pointerId;
                u && a && u.releasePointerCapture(a)
            }, i.setListeners = function(l) {
                i.removeWindowListeners();
                var u = l ? [
                    ["touchmove", i.onDragChange],
                    ["touchend", i.onDragEnd],
                    ["touchcancel", i.onDragEnd]
                ] : [
                    ["mousemove", i.onDragChange],
                    ["mouseup", i.onDragEnd]
                ];
                i.addWindowListeners(u)
            }, i.onDragStart = function(l) {
                !i.dragShouldStart(l) || (i.controller.config.pointer ? i.setPointers(l) : i.setListeners(i.isEventTypeTouch(l.type)), i.config.delay > 0 ? (i.state._delayedEvent = !0, typeof l.persist == "function" && l.persist(), i.setTimeout(function() {
                    return i.startDrag(l)
                }, i.config.delay)) : i.startDrag(l))
            }, i.onDragChange = function(l) {
                var u = i.state.canceled;
                if (!u) {
                    if (!i.state._active) {
                        i.state._delayedEvent && (i.clearTimeout(), i.startDrag(l));
                        return
                    }
                    var a = fe(l);
                    if (!a.down) {
                        i.onDragEnd(l);
                        return
                    }
                    i.updateSharedState(a);
                    var s = on(l),
                        c = s.values,
                        m = i.getKinematics(c, l),
                        h = i.state._isTap;
                    h && vo(m._movement) >= Jm && (h = !1), i.updateGestureState(w(w(w({}, i.getGenericPayload(l)), m), {}, {
                        _isTap: h,
                        cancel: function() {
                            return i.onCancel()
                        }
                    })), i.fireGestureHandler()
                }
            }, i.onDragEnd = function(l) {
                i.state._active = !1, i.updateSharedState({
                    down: !1,
                    buttons: 0,
                    touches: 0
                });
                var u = i.state,
                    a = u._isTap,
                    s = u.values,
                    c = u.velocities,
                    m = c[0],
                    h = c[1],
                    g = u.movement,
                    E = g[0],
                    S = g[1],
                    p = u._intentional,
                    f = p[0],
                    d = p[1],
                    v = w(w({}, i.getGenericPayload(l)), i.getMovement(s)),
                    y = v.elapsedTime,
                    C = i.config,
                    x = C.swipeVelocity,
                    T = x[0],
                    M = x[1],
                    P = C.swipeDistance,
                    D = P[0],
                    F = P[1],
                    A = [0, 0];
                y < e0 && (f !== !1 && Math.abs(m) > T && Math.abs(E) > D && (A[0] = Xi(m)), d !== !1 && Math.abs(h) > M && Math.abs(S) > F && (A[1] = Xi(h))), i.updateGestureState(w(w({
                    event: l
                }, v), {}, {
                    tap: a,
                    swipe: A
                })), i.fireGestureHandler(i.config.filterTaps && i.state._isTap)
            }, i.clean = function() {
                e.prototype.clean.call(Hm(i)), i.state._delayedEvent = !1, i.controller.config.pointer && i.removePointers()
            }, i.onCancel = function() {
                i.updateGestureState({
                    canceled: !0,
                    cancel: na
                }), i.state._active = !1, i.updateSharedState({
                    down: !1,
                    buttons: 0,
                    touches: 0
                }), requestAnimationFrame(function() {
                    return i.fireGestureHandler()
                })
            }, i
        }
        var n = t.prototype;
        return n.startDrag = function(o) {
            var i = this,
                l = on(o),
                u = l.values;
            this.updateSharedState(fe(o));
            var a = w(w({}, this.getStartGestureState(u, o)), this.getGenericPayload(o, !0));
            this.updateGestureState(w(w(w({}, a), this.getMovement(u, a)), {}, {
                cancel: function() {
                    return i.onCancel()
                }
            })), this.fireGestureHandler()
        }, n.addBindings = function() {
            this.controller.config.pointer ? (this.controller.addBindings("onPointerDown", this.onDragStart), this.controller.addBindings("onPointerMove", this.onDragChange), this.controller.addBindings(["onPointerUp", "onPointerCancel"], this.onDragEnd)) : this.controller.addBindings(["onTouchStart", "onMouseDown"], this.onDragStart)
        }, t
    }(go),
    n0 = 180,
    r0 = .15,
    i0 = .5,
    o0 = 60,
    l0 = typeof window < "u" ? window : void 0,
    u0 = {
        lockDirection: !1,
        axis: void 0,
        bounds: void 0
    };

function Pd(e) {
    e === void 0 && (e = {});
    var t = e,
        n = t.eventOptions;
    n = n === void 0 ? {} : n;
    var r = n.passive,
        o = r === void 0 ? !0 : r,
        i = n.capture,
        l = i === void 0 ? !1 : i,
        u = n.pointer,
        a = u === void 0 ? !1 : u,
        s = t.window,
        c = s === void 0 ? l0 : s,
        m = t.domTarget,
        h = m === void 0 ? void 0 : m,
        g = t.enabled,
        E = g === void 0 ? !0 : g,
        S = jn(t, ["eventOptions", "window", "domTarget", "enabled"]);
    return w(w({}, S), {}, {
        enabled: E,
        domTarget: h,
        window: c,
        eventOptions: {
            passive: !h || !!o,
            capture: !!l
        },
        captureString: l ? "Capture" : "",
        pointer: !!a
    })
}

function Od(e) {
    var t = e.threshold,
        n = t === void 0 ? void 0 : t,
        r = e.rubberband,
        o = r === void 0 ? 0 : r,
        i = e.enabled,
        l = i === void 0 ? !0 : i,
        u = e.initial,
        a = u === void 0 ? [0, 0] : u;
    return typeof o == "boolean" && (o = o ? r0 : 0), n === void 0 && (n = 0), {
        enabled: l,
        initial: a,
        threshold: Te.array(n),
        rubberband: Te.array(o)
    }
}

function gi(e) {
    e === void 0 && (e = {});
    var t = e,
        n = t.axis,
        r = t.lockDirection,
        o = t.bounds,
        i = o === void 0 ? {} : o,
        l = jn(t, ["axis", "lockDirection", "bounds"]),
        u = [
            [Te.withDefault(i.left, -1 / 0), Te.withDefault(i.right, 1 / 0)],
            [Te.withDefault(i.top, -1 / 0), Te.withDefault(i.bottom, 1 / 0)]
        ];
    return w(w(w(w({}, Od(l)), u0), gd({
        axis: n,
        lockDirection: r
    }, e)), {}, {
        bounds: u
    })
}

function a0(e) {
    e === void 0 && (e = {});
    var t = e,
        n = t.distanceBounds,
        r = n === void 0 ? {} : n,
        o = t.angleBounds,
        i = o === void 0 ? {} : o,
        l = jn(t, ["distanceBounds", "angleBounds"]),
        u = [
            [Te.withDefault(r.min, -1 / 0), Te.withDefault(r.max, 1 / 0)],
            [Te.withDefault(i.min, -1 / 0), Te.withDefault(i.max, 1 / 0)]
        ];
    return w(w({}, Od(l)), {}, {
        bounds: u
    })
}

function Cd(e) {
    e === void 0 && (e = {});
    var t = e,
        n = t.enabled,
        r = t.threshold,
        o = t.bounds,
        i = t.rubberband,
        l = t.initial,
        u = jn(t, ["enabled", "threshold", "bounds", "rubberband", "initial"]),
        a = u.swipeVelocity,
        s = a === void 0 ? i0 : a,
        c = u.swipeDistance,
        m = c === void 0 ? o0 : c,
        h = u.delay,
        g = h === void 0 ? !1 : h,
        E = u.filterTaps,
        S = E === void 0 ? !1 : E,
        p = u.axis,
        f = u.lockDirection;
    r === void 0 ? r = Math.max(0, S ? 3 : 0, f || p ? 1 : 0) : S = !0;
    var d = gi(gd({
        enabled: n,
        threshold: r,
        bounds: o,
        rubberband: i,
        axis: p,
        lockDirection: f,
        initial: l
    }, e));
    return w(w({}, d), {}, {
        filterTaps: S || d.threshold[0] + d.threshold[1] > 0,
        swipeVelocity: Te.array(s),
        swipeDistance: Te.array(m),
        delay: typeof g == "number" ? g : g ? n0 : 0
    })
}

function tv(e, t) {
    t === void 0 && (t = {});
    var n = t,
        r = n.domTarget,
        o = n.eventOptions,
        i = n.window,
        l = jn(n, ["domTarget", "eventOptions", "window"]),
        u = w(w({}, Pd({
            domTarget: r,
            eventOptions: o,
            window: i
        })), {}, {
            drag: Cd(l)
        });
    return xd({
        drag: e
    }, [_d], u)
}
var s0 = function(e) {
        Bt(t, e);

        function t() {
            return e.apply(this, arguments) || this
        }
        var n = t.prototype;
        return n.getInternalMovement = function(o, i) {
            var l = o[0],
                u = o[1],
                a = i.values,
                s = i.turns,
                c = i.initial;
            u = u !== void 0 ? u : a[1];
            var m = u - a[1],
                h = Math.abs(m) > 270 ? s + Xi(m) : s,
                g = l - c[0],
                E = u - 360 * h - c[1];
            return [g, E]
        }, n.getKinematics = function(o, i) {
            var l = this.state,
                u = l.timeStamp,
                a = l.initial,
                s = this.getMovement(o, this.state),
                c = s.delta,
                m = s.movement,
                h = (o[1] - m[1] - a[1]) / 360,
                g = i.timeStamp - u,
                E = vd(m, c, g);
            return w(w({
                values: o,
                delta: c,
                turns: h
            }, s), E)
        }, n.mapStateValues = function(o) {
            return {
                da: o.values,
                vdva: o.velocities
            }
        }, t
    }(kd),
    f0 = function(e) {
        Bt(t, e);

        function t(r, o) {
            var i;
            return i = e.call(this, "pinch", r, o) || this, i.ingKey = "pinching", i.pinchShouldStart = function(l) {
                var u = fe(l),
                    a = u.touches;
                return i.enabled && a === 2
            }, i.onPinchStart = function(l) {
                if (!!i.pinchShouldStart(l)) {
                    var u = Zo(l),
                        a = u.values,
                        s = u.origin;
                    i.updateSharedState(fe(l));
                    var c = w(w({}, i.getStartGestureState(a, l)), i.getGenericPayload(l, !0));
                    i.updateGestureState(w(w(w({}, c), i.getMovement(a, c)), {}, {
                        origin: s,
                        cancel: function() {
                            return i.onCancel()
                        }
                    })), i.fireGestureHandler()
                }
            }, i.onPinchChange = function(l) {
                var u = i.state,
                    a = u.canceled,
                    s = u.timeStamp,
                    c = u._active;
                if (!(a || !c)) {
                    var m = fe(l);
                    if (!(m.touches !== 2 || l.timeStamp === s)) {
                        i.updateSharedState(m);
                        var h = Zo(l),
                            g = h.values,
                            E = h.origin,
                            S = i.getKinematics(g, l);
                        i.updateGestureState(w(w(w({}, i.getGenericPayload(l)), S), {}, {
                            origin: E,
                            cancel: function() {
                                return i.onCancel()
                            }
                        })), i.fireGestureHandler()
                    }
                }
            }, i.onPinchEnd = function(l) {
                !i.state.active || (i.state._active = !1, i.updateSharedState({
                    down: !1,
                    touches: 0
                }), i.updateGestureState(w(w({
                    event: l
                }, i.getGenericPayload(l)), i.getMovement(i.state.values))), i.fireGestureHandler())
            }, i.onCancel = function() {
                i.state._active = !1, i.updateGestureState({
                    canceled: !0,
                    cancel: na
                }), i.updateSharedState({
                    down: !1,
                    touches: 0
                }), requestAnimationFrame(function() {
                    return i.fireGestureHandler()
                })
            }, i.onGestureStart = function(l) {
                if (!!i.enabled) {
                    l.preventDefault();
                    var u = Xs(l),
                        a = u.values;
                    i.updateSharedState(fe(l));
                    var s = w(w({}, i.getStartGestureState(a, l)), i.getGenericPayload(l, !0));
                    i.updateGestureState(w(w(w({}, s), i.getMovement(a, s)), {}, {
                        cancel: function() {
                            return i.onCancel()
                        }
                    })), i.fireGestureHandler()
                }
            }, i.onGestureChange = function(l) {
                var u = i.state,
                    a = u.canceled,
                    s = u._active;
                if (!(a || !s)) {
                    l.preventDefault();
                    var c = fe(l);
                    i.updateSharedState(c);
                    var m = Xs(l),
                        h = m.values,
                        g = i.getKinematics(h, l);
                    i.updateGestureState(w(w(w({}, i.getGenericPayload(l)), g), {}, {
                        cancel: function() {
                            return i.onCancel()
                        }
                    })), i.fireGestureHandler()
                }
            }, i.onGestureEnd = function(l) {
                l.preventDefault(), i.state.active && (i.state._active = !1, i.updateSharedState({
                    down: !1,
                    touches: 0
                }), i.updateGestureState(w(w({
                    event: l
                }, i.getGenericPayload(l)), i.getMovement(i.state.values))), i.fireGestureHandler())
            }, i.updateTouchData = function(l) {
                if (!(!i.enabled || l.touches.length !== 2 || !i.state._active)) {
                    var u = Zo(l),
                        a = u.origin;
                    i.state.origin = a
                }
            }, i.wheelShouldRun = function(l) {
                return i.enabled && l.ctrlKey
            }, i.getWheelValuesFromEvent = function(l) {
                var u = Ed(l),
                    a = u.values,
                    s = a[1],
                    c = i.state.values,
                    m = c[0],
                    h = c[1],
                    g = m - s,
                    E = h !== void 0 ? h : 0;
                return {
                    values: [g, E],
                    origin: [l.clientX, l.clientY],
                    delta: [0, s]
                }
            }, i.onWheel = function(l) {
                !i.wheelShouldRun(l) || (i.clearTimeout(), i.setTimeout(i.onWheelEnd), i.state._active ? i.onWheelChange(l) : i.onWheelStart(l))
            }, i.onWheelStart = function(l) {
                var u = i.getWheelValuesFromEvent(l),
                    a = u.values,
                    s = u.delta,
                    c = u.origin;
                i.controller.config.eventOptions.passive || l.preventDefault(), i.updateSharedState(fe(l));
                var m = w(w(w({}, i.getStartGestureState(a, l)), i.getGenericPayload(l, !0)), {}, {
                    initial: i.state.values
                });
                i.updateGestureState(w(w(w({}, m), i.getMovement(a, m)), {}, {
                    offset: a,
                    delta: s,
                    origin: c
                })), i.fireGestureHandler()
            }, i.onWheelChange = function(l) {
                var u = fe(l);
                i.updateSharedState(u);
                var a = i.getWheelValuesFromEvent(l),
                    s = a.values,
                    c = a.origin,
                    m = a.delta,
                    h = i.getKinematics(s, l);
                i.updateGestureState(w(w(w({}, i.getGenericPayload(l)), h), {}, {
                    origin: c,
                    delta: m
                })), i.fireGestureHandler()
            }, i.onWheelEnd = function() {
                i.state._active = !1, i.updateGestureState(i.getMovement(i.state.values)), i.fireGestureHandler()
            }, i
        }
        var n = t.prototype;
        return n.addBindings = function() {
            this.controller.config.domTarget && Ym() ? (this.controller.addBindings("onGestureStart", this.onGestureStart), this.controller.addBindings("onGestureChange", this.onGestureChange), this.controller.addBindings(["onGestureEnd", "onTouchCancel"], this.onGestureEnd), this.controller.addBindings(["onTouchStart", "onTouchMove"], this.updateTouchData)) : (this.controller.addBindings("onTouchStart", this.onPinchStart), this.controller.addBindings("onTouchMove", this.onPinchChange), this.controller.addBindings(["onTouchEnd", "onTouchCancel"], this.onPinchEnd), this.controller.addBindings("onWheel", this.onWheel))
        }, t
    }(s0),
    c0 = function(e) {
        Bt(t, e);

        function t(r, o) {
            var i;
            return i = e.call(this, "wheel", r, o) || this, i.ingKey = "wheeling", i.debounced = !0, i.wheelShouldRun = function(l) {
                return l.ctrlKey && "pinch" in i.controller.handlers ? !1 : i.enabled
            }, i.getValuesFromEvent = function(l) {
                var u = i.state.values,
                    a = Ed(l),
                    s = a.values;
                return {
                    values: Ql(s, u)
                }
            }, i.onWheel = function(l) {
                !i.wheelShouldRun(l) || (i.clearTimeout(), i.setTimeout(i.onWheelEnd), i.state._active ? i.onWheelChange(l) : i.onWheelStart(l))
            }, i.onWheelStart = function(l) {
                var u = i.getValuesFromEvent(l),
                    a = u.values;
                i.updateSharedState(fe(l));
                var s = w(w(w({}, i.getStartGestureState(a, l)), i.getGenericPayload(l, !0)), {}, {
                        initial: i.state.values
                    }),
                    c = i.getMovement(a, s),
                    m = c.delta;
                i.updateGestureState(w(w(w({}, s), c), {}, {
                    distance: vo(m),
                    direction: ta(m)
                })), i.fireGestureHandler()
            }, i.onWheelChange = function(l) {
                var u = fe(l);
                i.updateSharedState(u);
                var a = i.getValuesFromEvent(l),
                    s = a.values,
                    c = i.getKinematics(s, l);
                i.updateGestureState(w(w({}, i.getGenericPayload(l)), c)), i.fireGestureHandler()
            }, i.onWheelEnd = function() {
                i.state._active = !1, i.updateGestureState(w(w({}, i.getMovement(i.state.values)), {}, {
                    velocities: [0, 0],
                    velocity: 0
                })), i.fireGestureHandler()
            }, i
        }
        var n = t.prototype;
        return n.addBindings = function() {
            this.controller.addBindings("onWheel", this.onWheel)
        }, t
    }(go),
    qs = function(e) {
        Bt(t, e);

        function t(r, o) {
            var i;
            return i = e.call(this, "move", r, o) || this, i.ingKey = "moving", i.debounced = !0, i.moveShouldRun = function() {
                return i.enabled
            }, i.onMove = function(l) {
                !i.moveShouldRun() || (i.clearTimeout(), i.setTimeout(i.onMoveEnd), i.state._active ? i.onMoveChange(l) : i.onMoveStart(l))
            }, i.onMoveStart = function(l) {
                var u = on(l),
                    a = u.values;
                i.updateSharedState(fe(l));
                var s = w(w({}, i.getStartGestureState(a, l)), i.getGenericPayload(l, !0));
                i.updateGestureState(w(w({}, s), i.getMovement(a, s))), i.fireGestureHandler()
            }, i.onMoveChange = function(l) {
                var u = fe(l);
                i.updateSharedState(u);
                var a = on(l),
                    s = a.values,
                    c = i.getKinematics(s, l);
                i.updateGestureState(w(w({}, i.getGenericPayload(l)), c)), i.fireGestureHandler()
            }, i.onMoveEnd = function() {
                i.state._active = !1, i.updateGestureState(w(w({}, i.getMovement(i.state.values)), {}, {
                    velocities: [0, 0],
                    velocity: 0
                })), i.fireGestureHandler()
            }, i.onPointerEnter = function(l) {
                if (i.controller.state.shared.hovering = !0, !!i.controller.config.enabled) {
                    if (i.controller.config.hover.enabled) {
                        var u = on(l),
                            a = u.values,
                            s = w(w(w(w({}, i.controller.state.shared), i.state), i.getGenericPayload(l, !0)), {}, {
                                values: a,
                                active: !0,
                                hovering: !0
                            });
                        i.controller.handlers.hover(w(w({}, s), i.mapStateValues(s)))
                    }
                    "move" in i.controller.handlers && i.onMoveStart(l)
                }
            }, i.onPointerLeave = function(l) {
                if (i.controller.state.shared.hovering = !1, "move" in i.controller.handlers && i.onMoveEnd(), i.controller.config.hover.enabled) {
                    var u = on(l),
                        a = u.values,
                        s = w(w(w(w({}, i.controller.state.shared), i.state), i.getGenericPayload(l)), {}, {
                            values: a,
                            active: !1
                        });
                    i.controller.handlers.hover(w(w({}, s), i.mapStateValues(s)))
                }
            }, i
        }
        var n = t.prototype;
        return n.addBindings = function() {
            this.controller.config.pointer ? ("move" in this.controller.handlers && this.controller.addBindings("onPointerMove", this.onMove), "hover" in this.controller.handlers && (this.controller.addBindings("onPointerEnter", this.onPointerEnter), this.controller.addBindings("onPointerLeave", this.onPointerLeave))) : ("move" in this.controller.handlers && this.controller.addBindings("onMouseMove", this.onMove), "hover" in this.controller.handlers && (this.controller.addBindings("onMouseEnter", this.onPointerEnter), this.controller.addBindings("onMouseLeave", this.onPointerLeave)))
        }, t
    }(go),
    d0 = function(e) {
        Bt(t, e);

        function t(r, o) {
            var i;
            return i = e.call(this, "scroll", r, o) || this, i.ingKey = "scrolling", i.debounced = !0, i.scrollShouldRun = function() {
                return i.enabled
            }, i.onScroll = function(l) {
                !i.scrollShouldRun() || (i.clearTimeout(), i.setTimeout(i.onScrollEnd), i.state._active ? i.onScrollChange(l) : i.onScrollStart(l))
            }, i.onScrollStart = function(l) {
                var u = Ys(l),
                    a = u.values;
                i.updateSharedState(fe(l));
                var s = w(w(w({}, i.getStartGestureState(a, l)), i.getGenericPayload(l, !0)), {}, {
                        initial: i.state.values
                    }),
                    c = i.getMovement(a, s),
                    m = c.delta;
                i.updateGestureState(w(w(w({}, s), c), {}, {
                    distance: vo(m),
                    direction: ta(m)
                })), i.fireGestureHandler()
            }, i.onScrollChange = function(l) {
                var u = fe(l);
                i.updateSharedState(u);
                var a = Ys(l),
                    s = a.values,
                    c = i.getKinematics(s, l);
                i.updateGestureState(w(w({}, i.getGenericPayload(l)), c)), i.fireGestureHandler()
            }, i.onScrollEnd = function() {
                i.state._active = !1, i.updateGestureState(w(w({}, i.getMovement(i.state.values)), {}, {
                    velocities: [0, 0],
                    velocity: 0
                })), i.fireGestureHandler()
            }, i
        }
        var n = t.prototype;
        return n.addBindings = function() {
            this.controller.addBindings("onScroll", this.onScroll)
        }, t
    }(go);

function nv(e, t) {
    t === void 0 && (t = {});
    var n = Si.useState(function() {
            return new Set(Object.keys(e).map(function(p) {
                return p.replace(/End|Start/, "")
            }))
        }),
        r = n[0],
        o = t,
        i = o.drag,
        l = o.wheel,
        u = o.move,
        a = o.scroll,
        s = o.pinch,
        c = o.hover,
        m = jn(o, ["drag", "wheel", "move", "scroll", "pinch", "hover"]),
        h = Pd(m),
        g = [],
        E = {},
        S = w({}, e);
    return r.has("onDrag") && (g.push(_d), E.drag = Gn(e, "onDrag", S), h.drag = Cd(i)), r.has("onWheel") && (g.push(c0), E.wheel = Gn(e, "onWheel", S), h.wheel = gi(l)), r.has("onScroll") && (g.push(d0), E.scroll = Gn(e, "onScroll", S), h.scroll = gi(a)), r.has("onMove") && (g.push(qs), E.move = Gn(e, "onMove", S), h.move = gi(u)), r.has("onPinch") && (g.push(f0), E.pinch = Gn(e, "onPinch", S), h.pinch = a0(s)), r.has("onHover") && (r.has("onMove") || g.push(qs), E.hover = e.onHover, h.hover = w({
        enabled: !0
    }, c), delete S.onHover), xd(E, g, h, S)
}

function Gn(e, t, n) {
    var r = t + "Start",
        o = t + "End";
    delete n[t], delete n[r], delete n[o];
    var i = function(u) {
        var a = void 0;
        return u.first && r in e && e[r](u), t in e && (a = e[t](u)), u.last && o in e && e[o](u), a
    };
    return i
}

function p0(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e
}

function Zs(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter(function(o) {
            return Object.getOwnPropertyDescriptor(e, o).enumerable
        })), n.push.apply(n, r)
    }
    return n
}

function Js(e) {
    for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Zs(Object(n), !0).forEach(function(r) {
            p0(e, r, n[r])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Zs(Object(n)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r))
        })
    }
    return e
}

function ie(e) {
    return "Minified Redux error #" + e + "; visit https://redux.js.org/Errors?code=" + e + " for the full message or use the non-minified dev environment for full errors. "
}
var ef = function() {
        return typeof Symbol == "function" && Symbol.observable || "@@observable"
    }(),
    Jo = function() {
        return Math.random().toString(36).substring(7).split("").join(".")
    },
    jr = {
        INIT: "@@redux/INIT" + Jo(),
        REPLACE: "@@redux/REPLACE" + Jo(),
        PROBE_UNKNOWN_ACTION: function() {
            return "@@redux/PROBE_UNKNOWN_ACTION" + Jo()
        }
    };

function h0(e) {
    if (typeof e != "object" || e === null) return !1;
    for (var t = e; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t
}

function ra(e, t, n) {
    var r;
    if (typeof t == "function" && typeof n == "function" || typeof n == "function" && typeof arguments[3] == "function") throw new Error(ie(0));
    if (typeof t == "function" && typeof n > "u" && (n = t, t = void 0), typeof n < "u") {
        if (typeof n != "function") throw new Error(ie(1));
        return n(ra)(e, t)
    }
    if (typeof e != "function") throw new Error(ie(2));
    var o = e,
        i = t,
        l = [],
        u = l,
        a = !1;

    function s() {
        u === l && (u = l.slice())
    }

    function c() {
        if (a) throw new Error(ie(3));
        return i
    }

    function m(S) {
        if (typeof S != "function") throw new Error(ie(4));
        if (a) throw new Error(ie(5));
        var p = !0;
        return s(), u.push(S),
            function() {
                if (!!p) {
                    if (a) throw new Error(ie(6));
                    p = !1, s();
                    var d = u.indexOf(S);
                    u.splice(d, 1), l = null
                }
            }
    }

    function h(S) {
        if (!h0(S)) throw new Error(ie(7));
        if (typeof S.type > "u") throw new Error(ie(8));
        if (a) throw new Error(ie(9));
        try {
            a = !0, i = o(i, S)
        } finally {
            a = !1
        }
        for (var p = l = u, f = 0; f < p.length; f++) {
            var d = p[f];
            d()
        }
        return S
    }

    function g(S) {
        if (typeof S != "function") throw new Error(ie(10));
        o = S, h({
            type: jr.REPLACE
        })
    }

    function E() {
        var S, p = m;
        return S = {
            subscribe: function(d) {
                if (typeof d != "object" || d === null) throw new Error(ie(11));

                function v() {
                    d.next && d.next(c())
                }
                v();
                var y = p(v);
                return {
                    unsubscribe: y
                }
            }
        }, S[ef] = function() {
            return this
        }, S
    }
    return h({
        type: jr.INIT
    }), r = {
        dispatch: h,
        subscribe: m,
        getState: c,
        replaceReducer: g
    }, r[ef] = E, r
}

function m0(e) {
    Object.keys(e).forEach(function(t) {
        var n = e[t],
            r = n(void 0, {
                type: jr.INIT
            });
        if (typeof r > "u") throw new Error(ie(12));
        if (typeof n(void 0, {
                type: jr.PROBE_UNKNOWN_ACTION()
            }) > "u") throw new Error(ie(13))
    })
}

function Td(e) {
    for (var t = Object.keys(e), n = {}, r = 0; r < t.length; r++) {
        var o = t[r];
        typeof e[o] == "function" && (n[o] = e[o])
    }
    var i = Object.keys(n),
        l;
    try {
        m0(n)
    } catch (u) {
        l = u
    }
    return function(a, s) {
        if (a === void 0 && (a = {}), l) throw l;
        for (var c = !1, m = {}, h = 0; h < i.length; h++) {
            var g = i[h],
                E = n[g],
                S = a[g],
                p = E(S, s);
            if (typeof p > "u") throw s && s.type, new Error(ie(14));
            m[g] = p, c = c || p !== S
        }
        return c = c || i.length !== Object.keys(a).length, c ? m : a
    }
}

function tf(e, t) {
    return function() {
        return t(e.apply(this, arguments))
    }
}

function v0(e, t) {
    if (typeof e == "function") return tf(e, t);
    if (typeof e != "object" || e === null) throw new Error(ie(16));
    var n = {};
    for (var r in e) {
        var o = e[r];
        typeof o == "function" && (n[r] = tf(o, t))
    }
    return n
}

function ia() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return t.length === 0 ? function(r) {
        return r
    } : t.length === 1 ? t[0] : t.reduce(function(r, o) {
        return function() {
            return r(o.apply(void 0, arguments))
        }
    })
}

function Rd() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return function(r) {
        return function() {
            var o = r.apply(void 0, arguments),
                i = function() {
                    throw new Error(ie(15))
                },
                l = {
                    getState: o.getState,
                    dispatch: function() {
                        return i.apply(void 0, arguments)
                    }
                },
                u = t.map(function(a) {
                    return a(l)
                });
            return i = ia.apply(void 0, u)(o.dispatch), Js(Js({}, o), {}, {
                dispatch: i
            })
        }
    }
}
const g0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    __DO_NOT_USE__ActionTypes: jr,
    applyMiddleware: Rd,
    bindActionCreators: v0,
    combineReducers: Td,
    compose: ia,
    createStore: ra
}, Symbol.toStringTag, {
    value: "Module"
}));

function Ft() {
    return Ft = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    }, Ft.apply(this, arguments)
}

function y0(e) {
    var t;
    e.models.forEach(function(a) {
        return Md(e, a)
    });
    var n = jd(e),
        r = Rd.apply(g0, e.reduxConfig.middlewares),
        o = e.reduxConfig.devtoolComposer ? (t = e.reduxConfig).devtoolComposer.apply(t, e.reduxConfig.enhancers.concat([r])) : S0(e.reduxConfig.devtoolOptions).apply(void 0, e.reduxConfig.enhancers.concat([r])),
        i = e.reduxConfig.createStore || ra,
        l = e.reduxConfig.initialState,
        u = l === void 0 ? {} : l;
    return i(n, u, o)
}

function Md(e, t) {
    var n = {},
        r = Object.keys(t.reducers);
    r.forEach(function(u) {
        var a = E0(u) ? u : t.name + "/" + u;
        n[a] = t.reducers[u]
    });
    var o = function(a, s) {
            return a === void 0 && (a = t.state), s.type in n ? n[s.type](a, s.payload, s.meta) : a
        },
        i = t.baseReducer,
        l = i ? function(u, a) {
            return u === void 0 && (u = t.state), o(i(u, a), a)
        } : o;
    e.forEachPlugin("onReducer", function(u) {
        l = u(l, t.name, e) || l
    }), e.reduxConfig.reducers[t.name] = l
}

function jd(e) {
    var t = e.reduxConfig.rootReducers,
        n = w0(e.reduxConfig),
        r = n;
    return t && Object.keys(t).length && (r = function(i, l) {
        var u = t[l.type];
        return n(u ? u(i, l) : i, l)
    }), e.forEachPlugin("onRootReducer", function(o) {
        r = o(r, e) || r
    }), r
}

function w0(e) {
    var t = e.combineReducers || Td;
    return Object.keys(e.reducers).length ? t(e.reducers) : function(n) {
        return n
    }
}

function S0(e) {
    return e === void 0 && (e = {}), !e.disabled && typeof window == "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(e) : ia
}

function E0(e) {
    return e.indexOf("/") > -1
}
var x0 = function(t, n, r) {},
    k0 = function(t, n, r) {},
    Dd = function(t, n, r, o) {
        return Object.assign(function(i, l) {
            var u = {
                type: n + "/" + r
            };
            return typeof i < "u" && (u.payload = i), typeof l < "u" && (u.meta = l), t.dispatch(u)
        }, {
            isEffect: o
        })
    },
    _0 = function(t, n) {
        var r = t.dispatch[n.name],
            o = Object.keys(n.reducers);
        o.forEach(function(i) {
            x0(n.name, n.reducers), r[i] = Dd(t, n.name, i, !1)
        })
    },
    P0 = function(t, n, r) {
        var o = t.dispatch[r.name],
            i = {};
        r.effects && (i = typeof r.effects == "function" ? r.effects(t.dispatch) : r.effects);
        var l = Object.keys(i);
        l.forEach(function(u) {
            k0(r.name), n.effects[r.name + "/" + u] = i[u].bind(o), o[u] = Dd(t, r.name, u, !0)
        })
    };

function O0(e) {
    return {
        models: C0(e.models),
        reduxConfig: e.redux,
        forEachPlugin: function(n, r) {
            e.plugins.forEach(function(o) {
                o[n] && r(o[n])
            })
        },
        effects: {}
    }
}

function C0(e) {
    return Object.keys(e).map(function(t) {
        var n = T0(t, e[t]);
        return n
    })
}

function T0(e, t) {
    return Ft({
        name: e,
        reducers: {}
    }, t)
}

function R0(e) {
    var t = O0(e);
    t.reduxConfig.middlewares.push(M0(t)), t.forEachPlugin("createMiddleware", function(o) {
        t.reduxConfig.middlewares.push(o(t))
    });
    var n = y0(t),
        r = Ft({}, n, {
            name: e.name,
            addModel: function(i) {
                Md(t, i), nf(r, i), rf(r, t, i), n.replaceReducer(jd(t)), n.dispatch({
                    type: "@@redux/REPLACE"
                })
            }
        });
    return j0(r, e.plugins), t.models.forEach(function(o) {
        return nf(r, o)
    }), t.models.forEach(function(o) {
        return rf(r, t, o)
    }), t.forEachPlugin("onStoreCreated", function(o) {
        r = o(r, t) || r
    }), r
}

function M0(e) {
    return function(t) {
        return function(n) {
            return function(r) {
                return r.type in e.effects ? (n(r), e.effects[r.type](r.payload, t.getState(), r.meta)) : n(r)
            }
        }
    }
}

function nf(e, t) {
    var n = {};
    e.dispatch["" + t.name] = n, _0(e, t)
}

function rf(e, t, n) {
    P0(e, t, n), t.forEachPlugin("onModel", function(r) {
        r(n, e)
    })
}

function j0(e, t) {
    t.forEach(function(n) {
        if (!!n.exposed) {
            var r = Object.keys(n.exposed);
            r.forEach(function(o) {
                if (!!n.exposed) {
                    var i = n.exposed[o],
                        l = typeof i == "function";
                    e[o] = l ? function() {
                        for (var u = arguments.length, a = new Array(u), s = 0; s < u; s++) a[s] = arguments[s];
                        return i.apply(void 0, [e].concat(a))
                    } : Object.create(n.exposed[o])
                }
            })
        }
    })
}
var of = 0;

function D0(e) {
    var t, n, r, o = (t = e.name) != null ? t : "Rematch Store " + of ; of += 1;
    var i = {
        name: o,
        models: e.models || {},
        plugins: e.plugins || [],
        redux: Ft({
            reducers: {},
            rootReducers: {},
            enhancers: [],
            middlewares: []
        }, e.redux, {
            devtoolOptions: Ft({
                name: o
            }, (n = (r = e.redux) == null ? void 0 : r.devtoolOptions) != null ? n : {})
        })
    };
    return i.plugins.forEach(function(l) {
        l.config && (i.models = ti(i.models, l.config.models), l.config.redux && (i.redux.initialState = ti(i.redux.initialState, l.config.redux.initialState), i.redux.reducers = ti(i.redux.reducers, l.config.redux.reducers), i.redux.rootReducers = ti(i.redux.rootReducers, l.config.redux.reducers), i.redux.enhancers = [].concat(i.redux.enhancers, l.config.redux.enhancers || []), i.redux.middlewares = [].concat(i.redux.middlewares, l.config.redux.middlewares || []), i.redux.combineReducers = i.redux.combineReducers || l.config.redux.combineReducers, i.redux.createStore = i.redux.createStore || l.config.redux.createStore))
    }), i
}

function ti(e, t) {
    return t ? Ft({}, t, e) : e
}
var rv = function(t) {
        var n = D0(t || {});
        return R0(n)
    },
    iv = function() {
        return function(t) {
            return t
        }
    },
    L0 = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    },
    ov = A0;

function A0(e) {
    if (typeof e != "function") throw new Error("Expected batch to be a function.");
    var t = [],
        n = t;

    function r() {
        n === t && (n = t.slice())
    }

    function o(u) {
        if (typeof u != "function") throw new Error("Expected listener to be a function.");
        var a = !0;
        return r(), n.push(u),
            function() {
                if (!!a) {
                    a = !1, r();
                    var c = n.indexOf(u);
                    n.splice(c, 1)
                }
            }
    }

    function i() {
        for (var u = t = n, a = 0; a < u.length; a++) u[a]()
    }

    function l() {
        e(i)
    }
    return function(u) {
        return function() {
            var a = u.apply(void 0, arguments),
                s = a.subscribe;

            function c() {
                var m = a.dispatch.apply(a, arguments);
                return l(), m
            }
            return L0({}, a, {
                dispatch: c,
                subscribe: o,
                subscribeImmediate: s
            })
        }
    }
}
const I0 = () => {
    const [e, t] = $.exports.useState(window.location.pathname);
    return $.exports.useEffect(() => {
        N0();
        const n = ["popstate", "pushState", "replaceState"],
            r = () => t(window.location.pathname);
        return n.map(o => window.addEventListener(o, r)), () => n.map(o => window.removeEventListener(o, r))
    }, []), [e, (n, r) => window.history[r ? "replaceState" : "pushState"](0, 0, n)]
};
let lf = 0;
const N0 = () => {
    if (!lf) return ["pushState", "replaceState"].map(e => {
        const t = window.history[e];
        window.history[e] = function() {
            const n = t.apply(this, arguments),
                r = new Event(e);
            return r.arguments = arguments, dispatchEvent(r), n
        }
    }), lf = 1
};

function $0(e = z0) {
    const t = {},
        n = r => t[r] || (t[r] = e(r));
    return (r, o) => {
        const {
            regexp: i,
            keys: l
        } = n(r || ""), u = i.exec(o);
        if (!u) return [!1, null];
        const a = l.reduce((s, c, m) => (s[c.name] = u[m + 1], s), {});
        return [!0, a]
    }
}
const uf = e => e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"),
    F0 = (e, t, n) => {
        let r = e ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)";
        return t && n && (r = "(?:\\/" + r + ")"), r + (t ? "?" : "")
    },
    z0 = e => {
        const t = /:([A-Za-z0-9_]+)([?+*]?)/g;
        let n = null,
            r = 0;
        const o = [];
        let i = "";
        for (;
            (n = t.exec(e)) !== null;) {
            const [l, u, a] = n, s = a === "+" || a === "*", c = a === "?" || a === "*", m = c && e[n.index - 1] === "/" ? 1 : 0, h = e.substring(r, n.index - m);
            o.push({
                name: u
            }), r = t.lastIndex, i += uf(h) + F0(s, c, m)
        }
        return i += uf(e.substring(r)), {
            keys: o,
            regexp: new RegExp("^" + i + "(?:\\/)?$", "i")
        }
    },
    V0 = $.exports.createContext({}),
    b0 = (e = {}) => ({
        hook: e.hook || I0,
        matcher: e.matcher || $0()
    }),
    oa = () => {
        const e = $.exports.useContext(V0);
        return e.v || (e.v = b0())
    },
    Ld = () => {
        const e = oa();
        return e.hook(e)
    },
    U0 = e => {
        const t = oa(),
            [n] = Ld();
        return t.matcher(e, n)
    },
    B0 = {},
    lv = ({
        path: e,
        match: t,
        component: n,
        props: r = B0,
        children: o
    }) => {
        const i = U0(e),
            [l, u] = t || i;
        return l ? n ? $.exports.createElement(n, {
            params: u,
            ...r
        }) : typeof o == "function" ? o(u) : o : null
    },
    uv = ({
        children: e,
        location: t
    }) => {
        const {
            matcher: n
        } = oa(), [r] = Ld();
        e = e && e.length ? e : [e];
        for (const o of e) {
            let i = 0;
            if ($.exports.isValidElement(o) && o.props.path && (i = n(o.props.path, t || r))[0]) return $.exports.cloneElement(o, {
                match: i
            })
        }
        return null
    };
export {
    G0 as E, Y0 as F, Si as R, uv as S, Pf as a, nv as b, W0 as c, iv as d, X0 as e, J0 as f, af as g, Q0 as h, ev as i, tm as j, rv as k, ra as l, ia as m, ov as n, lv as o, K0 as p, ym as q, $ as r, H0 as s, tv as t, Z0 as u, q0 as v
};