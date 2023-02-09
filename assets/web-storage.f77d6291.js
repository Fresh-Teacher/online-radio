import "./modules.439d8116.js";
const Oe = function() {
    const n = document.createElement("link").relList;
    if (n && n.supports && n.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
    new MutationObserver(o => {
        for (const r of o)
            if (r.type === "childList")
                for (const i of r.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && s(i)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function t(o) {
        const r = {};
        return o.integrity && (r.integrity = o.integrity), o.referrerpolicy && (r.referrerPolicy = o.referrerpolicy), o.crossorigin === "use-credentials" ? r.credentials = "include" : o.crossorigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r
    }

    function s(o) {
        if (o.ep) return;
        o.ep = !0;
        const r = t(o);
        fetch(o.href, r)
    }
};
Oe();
async function De(e) {
    return new Promise(n => {
        setTimeout(n, e)
    })
}

function Ne(e) {
    if (!e) throw new Error("assertion error")
}

function It(e) {
    if (typeof e != "object" || e === null) return !1;
    const n = Object.getPrototypeOf(e);
    return (n === null || n === Object.prototype || Object.getPrototypeOf(n) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e)
}

function Rt(e) {
    return pe("Number")(e)
}

function Bt(e) {
    return pe("String")(e)
}

function Ot(e) {
    return e === !0 || e === !1
}

function W(e) {
    return !he(e)
}

function he(e) {
    return e == null
}

function Fe(e) {
    Ne(W(e))
}
const pe = (() => {
        const {
            toString: e
        } = Object.prototype;
        return n => {
            const t = n.toLowerCase(),
                s = `[object ${n}]`;
            return function(o) {
                const r = typeof o;
                return r === t || !!o && r === "object" && e.call(o) === s
            }
        }
    })(),
    Te = window.location.search,
    q = new URLSearchParams(Te),
    {
        userAgent: me
    } = window.navigator,
    A = e => me.includes(e),
    Me = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime) || (A("CriOS") || A("Chrome/") || A("Chromium/")) && A("Edge/"),
    G = (A("Safari") || /(iPhone|iPad|iPod).*AppleWebKit/.test(me) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1) && !A("Chrome/") && !A("Chromium/") && !A("CriOS") && !A("FxiOS"),
    $e = typeof InstallTrigger < "u" || A("FxiOS");

function Ue(e) {
    return e.startsWith("/") ? `https://${window.location.hostname}${e}` : e
}
const je = ["geforce 320m", "geforce 8600", "geforce 8600m gt", "geforce 8800 gs", "geforce 8800 gt", "geforce 9400", "geforce 9400m g", "geforce 9400m", "geforce 9600m gt", "geforce 9600m", "geforce fx go5200", "geforce gt 120", "geforce gt 130", "geforce gt 330m", "geforce gtx 285", "google swiftshader", "intel g41", "intel g45", "intel gma 4500mhd", "intel gma x3100", "intel hd 3000", "intel q45", "legacy", "mali-2", "mali-3", "mali-4", "quadro fx 1500", "quadro fx 4", "quadro fx 5", "radeon hd 2400", "radeon hd 2600", "radeon hd 4670", "radeon hd 4850", "radeon hd 4870", "radeon hd 5670", "radeon hd 5750", "radeon hd 6290", "radeon hd 6300", "radeon hd 6310", "radeon hd 6320", "radeon hd 6490m", "radeon hd 6630m", "radeon hd 6750m", "radeon hd 6770m", "radeon hd 6970m", "sgx 543", "sgx543"],
    L = void 0;

function ie(e) {
    return L == null || L("cleanRenderer", {
        renderer: e
    }), e = e.toLowerCase().replace(/.*angle ?\((.+)\)(?: on vulkan [0-9.]+)?$/i, "$1").replace(/\s(\d{1,2}gb|direct3d.+$)|\(r\)| \([^)]+\)$/g, "").replace(/(?:vulkan|opengl) \d+\.\d+(?:\.\d+)?(?: \((.*)\))?/, "$1"), L == null || L("cleanRenderer - renderer cleaned to", {
        renderer: e
    }), e
}
const ke = 16384,
    Ge = 4,
    We = 35044,
    ae = 34962,
    qe = 5121,
    Ke = 5126,
    Ve = 6408,
    ze = 35632,
    Je = 35633,
    we = typeof window > "u",
    S = (() => {
        if (we) return;
        const {
            userAgent: e,
            platform: n,
            maxTouchPoints: t
        } = window.navigator, s = /(iphone|ipod|ipad)/i.test(e), o = n === "iPad" || n === "MacIntel" && t > 0 && !window.MSStream, r = /android/i.test(e);
        return {
            isIpad: o,
            isMobile: r || s || o,
            isSafari12: /Version\/12.+Safari/.test(e)
        }
    })(),
    b = void 0;

function He(e, n, t) {
    if (!t) return b == null || b("Safari 14+ obfuscates its GPU type and version, using fallback"), [n];
    const s = Xe(e),
        o = "801621810",
        r = "8016218135",
        i = "80162181161",
        d = S != null && S.isIpad ? [
            ["a7", i, 12],
            ["a8", r, 15],
            ["a8x", r, 15],
            ["a9", r, 15],
            ["a9x", r, 15],
            ["a10", r, 15],
            ["a10x", r, 15],
            ["a12", o, 15],
            ["a12x", o, 15],
            ["a12z", o, 15],
            ["a14", o, 15],
            ["m1", o, 15]
        ] : [
            ["a7", i, 12],
            ["a8", r, 12],
            ["a9", r, 15],
            ["a10", r, 15],
            ["a11", o, 15],
            ["a12", o, 15],
            ["a13", o, 15],
            ["a14", o, 15]
        ];
    let l;
    s === "80162181255" ? l = d.filter(([, , c]) => c >= 14) : (l = d.filter(([, c]) => c === s), l.length || (l = d));
    const u = l.map(([c]) => `apple ${c} gpu`);
    return b == null || b(`iOS 12.2+ obfuscates its GPU type and version, using closest matches: ${JSON.stringify(u)}`), u
}

function Xe(e) {
    const n = `
    precision highp float;
    attribute vec3 aPosition;
    varying float vvv;
    void main() {
      vvv = 0.31622776601683794;
      gl_Position = vec4(aPosition, 1.0);
    }
  `,
        t = `
    precision highp float;
    varying float vvv;
    void main() {
      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * vvv;
      enc = fract(enc);
      enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
      gl_FragColor = enc;
    }
  `,
        s = e.createShader(Je),
        o = e.createShader(ze),
        r = e.createProgram();
    if (!(o && s && r)) return;
    e.shaderSource(s, n), e.shaderSource(o, t), e.compileShader(s), e.compileShader(o), e.attachShader(r, s), e.attachShader(r, o), e.linkProgram(r), e.detachShader(r, s), e.detachShader(r, o), e.deleteShader(s), e.deleteShader(o), e.useProgram(r);
    const i = e.createBuffer();
    e.bindBuffer(ae, i), e.bufferData(ae, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), We);
    const d = e.getAttribLocation(r, "aPosition");
    e.vertexAttribPointer(d, 3, Ke, !1, 0, 0), e.enableVertexAttribArray(d), e.clearColor(1, 1, 1, 1), e.clear(ke), e.viewport(0, 0, 1, 1), e.drawArrays(Ge, 0, 3);
    const l = new Uint8Array(4);
    return e.readPixels(0, 0, 1, 1, Ve, qe, l), e.deleteProgram(r), e.deleteBuffer(i), l.join("")
}

function Ye(e, n, t) {
    return n === "apple gpu" ? He(e, n, t) : [n]
}
class ce extends Error {
    constructor(n) {
        super(n), Object.setPrototypeOf(this, new.target.prototype)
    }
}

function Ze(e) {
    var t;
    e = e.replace(/\([^)]+\)/, "");
    const n = e.match(/\d+/) || e.match(/(\W|^)([A-Za-z]{1,3})(\W|$)/g);
    return (t = n == null ? void 0 : n.join("").replace(/\W|amd/g, "")) != null ? t : ""
}
const T = [],
    le = [];

function Qe(e, n) {
    if (e === n) return 0;
    const t = e;
    e.length > n.length && (e = n, n = t);
    let s = e.length,
        o = n.length;
    for (; s > 0 && e.charCodeAt(~-s) === n.charCodeAt(~-o);) s--, o--;
    let r = 0;
    for (; r < s && e.charCodeAt(r) === n.charCodeAt(r);) r++;
    if (s -= r, o -= r, s === 0) return o;
    let i, d = 0,
        l, u, c = 0,
        a = 0;
    for (; c < s;) le[c] = e.charCodeAt(r + c), T[c] = ++c;
    for (; a < o;)
        for (i = n.charCodeAt(r + a), l = a++, d = a, c = 0; c < s; c++) u = i === le[c] ? l : l + 1, l = T[c], d = T[c] = l > d ? u > d ? d + 1 : u : u > l ? l + 1 : u;
    return d
}

function et(e) {
    return e.split(/[.,()\[\]/\s]/g).sort().filter((n, t, s) => t === 0 || n !== s[t - 1]).join(" ")
}

function tt(e, n = !1) {
    const t = {
        alpha: !1,
        antialias: !1,
        depth: !1,
        failIfMajorPerformanceCaveat: n,
        powerPreference: "high-performance",
        stencil: !1
    };
    e && delete t.powerPreference;
    const s = window.document.createElement("canvas"),
        o = s.getContext("webgl", t) || s.getContext("experimental-webgl", t);
    return o != null ? o : void 0
}
const m = void 0,
    nt = async ({
        mobileTiers: e = [0, 15, 30, 60],
        desktopTiers: n = [0, 15, 30, 60],
        override: t = {},
        glContext: s,
        failIfMajorPerformanceCaveat: o = !1,
        benchmarksURL: r
    } = {}) => {
        const i = {};
        if (we) return {
            tier: 0,
            type: "SSR"
        };
        const {
            isIpad: d = !!(S != null && S.isIpad),
            isMobile: l = !!(S != null && S.isMobile),
            screenSize: u = window.screen,
            loadBenchmarks: c = async f => {
                const h = await fetch(Ue(`${r}/${f}`), {
                    credentials: "same-origin"
                }).then(E => E.json());
                if (parseInt(h.shift().split(".")[0], 10) < 4) throw new ce("Detect GPU benchmark data is out of date. Please update to version 4x");
                return h
            }
        } = t;
        let {
            renderer: a
        } = t;
        const v = f => {
            const h = l ? ["adreno", "apple", "mali-t", "mali", "nvidia", "powervr", "samsung"] : ["intel", "apple", "amd", "radeon", "nvidia", "geforce"];
            for (const y of h)
                if (f.includes(y)) return y
        };
        async function x(f) {
            var oe;
            const h = v(f);
            if (!h) return;
            m == null || m("queryBenchmarks - found type:", {
                type: h
            });
            const y = `${l?"m":"d"}-${h}${d?"-ipad":""}.json`,
                E = i[y] = (oe = i[y]) != null ? oe : c(y);
            let _;
            try {
                _ = await E
            } catch (p) {
                if (p instanceof ce) throw p;
                m == null || m("queryBenchmarks - couldn't load benchmark:", {
                    error: p
                });
                return
            }
            const Q = Ze(f);
            let C = _.filter(([, p]) => p === Q);
            m == null || m(`found ${C.length} matching entries using version '${Q}':`, C.map(([p]) => p)), C.length || (C = _.filter(([p]) => p.includes(f)), m == null || m(`found ${C.length} matching entries comparing model names`, {
                matched: C
            }));
            const ee = C.length;
            if (ee === 0) return;
            const Le = et(f);
            let [te, , , , ne] = ee > 1 ? C.map(p => [p, Qe(Le, p[2])]).sort(([, p], [, F]) => p - F)[0][0] : C[0];
            m == null || m(`${f} matched closest to ${te} with the following screen sizes`, JSON.stringify(ne));
            let D = Number.MAX_VALUE,
                N;
            const {
                devicePixelRatio: re
            } = window, be = u.width * re * u.height * re;
            for (const p of ne) {
                const [F, Re] = p, Be = F * Re, se = Math.abs(be - Be);
                se < D && (D = se, N = p)
            }
            if (!N) return;
            const [, , _e, Ie] = N;
            return [D, _e, te, Ie]
        }
        const w = (f, h, y, E, _) => ({
            device: _,
            fps: E,
            gpu: y,
            isMobile: l,
            tier: f,
            type: h
        });
        let g, P = "";
        if (a) a = ie(a), g = [a];
        else {
            const f = s || tt(S == null ? void 0 : S.isSafari12, o);
            if (!f) return w(0, "WEBGL_UNSUPPORTED");
            const h = f.getExtension("WEBGL_debug_renderer_info");
            if (h && (a = f.getParameter(h.UNMASKED_RENDERER_WEBGL)), !a) return w(1, "FALLBACK");
            P = a, a = ie(a), g = Ye(f, a, l)
        }
        const R = (await Promise.all(g.map(x))).filter(W).sort(([f = Number.MAX_VALUE, h], [y = Number.MAX_VALUE, E]) => f === y ? h - E : f - y);
        if (!R.length) {
            const f = je.find(h => a.includes(h));
            return f ? w(0, "BLOCKLISTED", f) : w(1, "FALLBACK", `${a} (${P})`)
        }
        const [, B, H, X] = R[0];
        if (B === -1) return w(0, "BLOCKLISTED", H, B, X);
        const Y = l ? e : n;
        let Z = 0;
        for (let f = 0; f < Y.length; f++) B >= Y[f] && (Z = f);
        return w(Z, "BENCHMARK", H, B, X)
    };
let ge = !1;
try {
    const e = Object.defineProperty({}, "passive", {
        get: function() {
            return ge = !0, !0
        }
    });
    window.addEventListener("testPassive", null, e), window.removeEventListener("testPassive", null, e)
} catch {}
const rt = ge ? {
        passive: !0
    } : !1,
    ye = !1,
    {
        userAgent: I,
        platform: K,
        maxTouchPoints: ot
    } = window.navigator,
    Se = K === "MacIntel",
    V = K === "iPad" || Se && ot > 0 && !ye,
    ve = /android/i.test(I),
    Ae = /iPhone|iPad|iPod/.test(K) || V || ye,
    Dt = Ae || ve || V,
    st = q.has("screenshots"),
    O = /RadioGarden/i.test(I),
    it = window.location.protocol === "https:",
    Nt = it && !O,
    at = "ontouchstart" in window || !!(window.DocumentTouch && document instanceof DocumentTouch),
    Ft = at && !O,
    ct = window.matchMedia("(pointer:fine)").matches,
    Tt = ct && !O,
    Mt = W(typeof PointerEvent),
    $t = window.location.hostname.includes("radio.garden"),
    lt = !O,
    Ut = /FBAN|FBAV/.test(I),
    jt = ve ? parseFloat(I.slice(I.indexOf("Android") + 8)) : void 0,
    ut = Se && !V,
    ue = {
        supportsWebGl: !0,
        tier: 1
    },
    kt = rt,
    Gt = G ? typeof BigInt !== void 0 : !0,
    de = q.get("tier"),
    dt = q.has("fps"),
    Wt = !!window.navigator.webdriver && !st,
    qt = async () => {
        var o, r;
        const e = (() => {
                if (he(de)) return;
                const i = parseInt(de);
                if (i < 0 || i > 3) throw new Error;
                return i
            })(),
            n = async () => {
                var u, c, a;
                const i = ".cesium-performanceDisplay-throttled";
                for (; !document.querySelector(i);) await De(100);
                const d = document.querySelector(i);
                Fe(d);
                const l = e || s;
                d.innerHTML = `<div>TIER: ${l!==s?`${l} (${s})`:s}</div>
    <div><span style="font-size: 10px;">${t==null?void 0:t.type}:${(u=t==null?void 0:t.gpu)!=null?u:"-"}/${(c=t==null?void 0:t.device)!=null?c:"*"}:${(a=t==null?void 0:t.fps)!=null?a:"-"}</span></div>`
            };
        let t;
        try {
            t = await nt({
                benchmarksURL: "/public/benchmarks-5",
                failIfMajorPerformanceCaveat: !1,
                mobileTiers: [0, 15, 45, 58],
                desktopTiers: [0, 15, 45, 60]
            })
        } catch {}
        let s = (o = t == null ? void 0 : t.tier) != null ? o : 1;
        ut && t && !t.isMobile && !((r = t.gpu) != null ? r : "").includes("m1") && t.tier > 1 && (s = 1), ue.tier = e != null ? e : s, ue.supportsWebGl = !(t != null && t.type) || (t == null ? void 0 : t.type) !== "WEBGL_UNSUPPORTED", dt && n()
    };

function ft(e) {
    return Object.keys(e).find(n => !!e[n])
}
const Kt = (ft({
        safari: G,
        chrome: Me,
        firefox: $e
    }) || "other") + (G && Ae && lt ? " mobile-safari" : ""),
    Vt = e => (e == null ? void 0 : e.type) === "cs",
    zt = e => (e == null ? void 0 : e.type) === "cs" && (e == null ? void 0 : e.error) !== void 0;
var xe = {
    exports: {}
};
(function(e, n) {
    (function(t) {
        var s;
        if (e.exports = t(), s = !0, !s) {
            var o = window.Cookies,
                r = window.Cookies = t();
            r.noConflict = function() {
                return window.Cookies = o, r
            }
        }
    })(function() {
        function t() {
            for (var r = 0, i = {}; r < arguments.length; r++) {
                var d = arguments[r];
                for (var l in d) i[l] = d[l]
            }
            return i
        }

        function s(r) {
            return r.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
        }

        function o(r) {
            function i() {}

            function d(u, c, a) {
                if (!(typeof document > "u")) {
                    a = t({
                        path: "/"
                    }, i.defaults, a), typeof a.expires == "number" && (a.expires = new Date(new Date * 1 + a.expires * 864e5)), a.expires = a.expires ? a.expires.toUTCString() : "";
                    try {
                        var v = JSON.stringify(c);
                        /^[\{\[]/.test(v) && (c = v)
                    } catch {}
                    c = r.write ? r.write(c, u) : encodeURIComponent(String(c)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), u = encodeURIComponent(String(u)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                    var x = "";
                    for (var w in a) !a[w] || (x += "; " + w, a[w] !== !0 && (x += "=" + a[w].split(";")[0]));
                    return document.cookie = u + "=" + c + x
                }
            }

            function l(u, c) {
                if (!(typeof document > "u")) {
                    for (var a = {}, v = document.cookie ? document.cookie.split("; ") : [], x = 0; x < v.length; x++) {
                        var w = v[x].split("="),
                            g = w.slice(1).join("=");
                        !c && g.charAt(0) === '"' && (g = g.slice(1, -1));
                        try {
                            var P = s(w[0]);
                            if (g = (r.read || r)(g, P) || s(g), c) try {
                                g = JSON.parse(g)
                            } catch {}
                            if (a[P] = g, u === P) break
                        } catch {}
                    }
                    return u ? a[u] : a
                }
            }
            return i.set = d, i.get = function(u) {
                return l(u, !1)
            }, i.getJSON = function(u) {
                return l(u, !0)
            }, i.remove = function(u, c) {
                d(u, "", t(c, {
                    expires: -1
                }))
            }, i.defaults = {}, i.withConverter = o, i
        }
        return o(function() {})
    })
})(xe);
const M = xe.exports,
    ht = 365,
    Ce = wt(),
    pt = !!Ce,
    mt = Ce ? "None" : "Lax";

function wt() {
    try {
        return !Boolean(window.top.location.href)
    } catch {
        return !0
    }
}
class gt {
    constructor({
        ttl: n = ht,
        secure: t = pt,
        sameSite: s = mt
    } = {}) {
        return this.ttl = n, this.secure = t, this.sameSite = s, (async () => this)()
    }
    async get(n) {
        const t = M.get(n);
        return typeof t == "string" ? t : void 0
    }
    async set(n, t) {
        M.set(n, t, this._constructCookieParams())
    }
    async remove(n) {
        M.remove(n, this._constructCookieParams())
    }
    _constructCookieParams() {
        return {
            expires: this.ttl,
            secure: this.secure,
            sameSite: this.sameSite
        }
    }
}
class Ee {
    constructor(n = "keyval-store", t = "keyval") {
        this.storeName = t, this._dbp = new Promise((s, o) => {
            const r = indexedDB.open(n, 1);
            r.onerror = () => o(r.error), r.onsuccess = () => s(r.result), r.onupgradeneeded = () => {
                r.result.createObjectStore(t)
            }
        })
    }
    _withIDBStore(n, t) {
        return this._dbp.then(s => new Promise((o, r) => {
            const i = s.transaction(this.storeName, n);
            i.oncomplete = () => o(), i.onabort = i.onerror = () => r(i.error), t(i.objectStore(this.storeName))
        }))
    }
}
let $;

function z() {
    return $ || ($ = new Ee), $
}

function yt(e, n = z()) {
    let t;
    return n._withIDBStore("readonly", s => {
        t = s.get(e)
    }).then(() => t.result)
}

function St(e, n, t = z()) {
    return t._withIDBStore("readwrite", s => {
        s.put(n, e)
    })
}

function vt(e, n = z()) {
    return n._withIDBStore("readwrite", t => {
        t.delete(e)
    })
}
const At = "ImmortalDB",
    xt = "key-value-pairs";
class Ct {
    constructor(n = At, t = xt) {
        return this.store = new Ee(n, t), (async () => {
            try {
                await this.store._dbp
            } catch (s) {
                if (s.name === "SecurityError") return null;
                throw s
            }
            return this
        })()
    }
    async get(n) {
        const t = await yt(n, this.store);
        return typeof t == "string" ? t : void 0
    }
    async set(n, t) {
        await St(n, t, this.store)
    }
    async remove(n) {
        await vt(n, this.store)
    }
}
class Et {
    constructor(n) {
        return this.store = n, (async () => this)()
    }
    async get(n) {
        const t = this.store.getItem(n);
        return typeof t == "string" ? t : void 0
    }
    async set(n, t) {
        this.store.setItem(n, t)
    }
    async remove(n) {
        this.store.removeItem(n)
    }
}
class Pt extends Et {
    constructor() {
        super(window.localStorage)
    }
}
const U = console.log,
    j = "_immortal|",
    Pe = typeof window < "u",
    J = [gt];
try {
    Pe && window.indexedDB && J.push(Ct)
} catch {}
try {
    Pe && window.localStorage && J.push(Pt)
} catch {}

function fe(e, n, t = null) {
    return n in e ? e[n] : t
}

function Lt(e) {
    const n = new Map;
    let t = e.slice();
    for (const s of t) {
        let o = 0;
        for (const r of t) s === r && (o += 1);
        o > 0 && (n.set(s, o), t = t.filter(r => r !== s))
    }
    return n
}
class bt {
    constructor(n = J) {
        this.stores = [], this.onReady = (async () => {
            this.stores = (await Promise.all(n.map(async t => {
                if (typeof t == "object") return t;
                try {
                    return await new t
                } catch {
                    return null
                }
            }))).filter(Boolean)
        })()
    }
    async get(n, t = null) {
        await this.onReady;
        const s = `${j}${n}`,
            o = await Promise.all(this.stores.map(async a => {
                try {
                    return await a.get(s)
                } catch (v) {
                    U(v)
                }
            })),
            r = Array.from(Lt(o).entries());
        r.sort((a, v) => a[1] <= v[1]);
        let i;
        const [d, l] = fe(r, 0, [void 0, 0]), [u, c] = fe(r, 1, [void 0, 0]);
        return l > c || l === c && d !== void 0 ? i = d : i = u, i !== void 0 ? (await this.set(n, i), i) : (await this.remove(n), t)
    }
    async set(n, t) {
        return await this.onReady, n = `${j}${n}`, await Promise.all(this.stores.map(async s => {
            try {
                await s.set(n, t)
            } catch (o) {
                U(o)
            }
        })), t
    }
    async remove(n) {
        await this.onReady, n = `${j}${n}`, await Promise.all(this.stores.map(async t => {
            try {
                await t.remove(n)
            } catch (s) {
                U(s)
            }
        }))
    }
}
const k = new bt,
    Jt = {
        async set(e) {
            await Promise.all(Object.entries(e).map(async n => {
                const [t, s] = n;
                return await k.set(t, JSON.stringify(s))
            }))
        },
        async get(e) {
            const n = await k.get(e).catch(t => {
                throw console.log(t), new Error(`Unable to get ${JSON.stringify(e)} from storage`)
            });
            return n != null ? JSON.parse(n) : void 0
        },
        async delete(e) {
            await Promise.all(e.map(n => k.remove(n)))
        }
    };
export {
    V as A, ct as B, he as C, G as D, Tt as E, $t as F, qt as G, jt as H, Ft as I, Ut as J, q as K, dt as L, Mt as M, ve as a, Kt as b, lt as c, Wt as d, It as e, Ne as f, Rt as g, Ae as h, O as i, Gt as j, Dt as k, Ue as l, W as m, Fe as n, Ot as o, Nt as p, Vt as q, zt as r, kt as s, it as t, Jt as u, De as v, Te as w, $e as x, ue as y, Bt as z
};