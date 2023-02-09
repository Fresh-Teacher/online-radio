import {
    C as k,
    N as bi,
    R as Z,
    P as ge,
    a as s,
    E as ie,
    b as be,
    c as te,
    K as Ke,
    d as Gt,
    T as ki,
    e as C,
    f as ce,
    g as I,
    H as Bi,
    M as O,
    Q as Ue,
    h as he,
    S as F,
    i as _,
    j as Wt,
    k as gt,
    O as ht,
    I as le,
    l as ve,
    m as W,
    B as b,
    n as z,
    o as Zt,
    p as Ui,
    q as se,
    r as Y,
    s as Rt,
    W as xe,
    t as Vi,
    u as qt,
    v as Ee,
    w as Xt,
    x as we,
    D as Gi,
    y as Pt,
    z as Tt,
    A as Yt,
    F as X,
    V as Wi,
    G as Qe,
    J as Zi,
    L as me,
    U as Et,
    X as qi,
    Y as Xi,
    Z as Yi,
    _ as Ki,
    $ as wt,
    a0 as Qi,
    a1 as Ji
} from "./cesium.56df9c50.js";
import {
    l as pe,
    S as $i,
    g as Kt,
    h as ji,
    i as ea,
    j as De,
    e as ta,
    F as ia,
    k as aa,
    w as na
} from "./index.ff3b8264.js";
import {
    K as sa,
    L as Qt,
    M as ra,
    B as Jt,
    y as Je,
    h as oa,
    v as $e,
    d as de,
    a as Mt
} from "./web-storage.f77d6291.js";
import "./modules.439d8116.js";

function da() {
    const e = {};
    return e.promise = new Promise((n, a) => {
        e.resolve = n, e.reject = a
    }), e
}
const ca = (() => 180 / Math.PI)(),
    Me = e => e * ca;
let ke, Ot, je;

function ha() {
    Ot !== ke && (je || (je = document.querySelector("#map").style), je.cursor = Ot = ke)
}

function la(e) {
    ke !== e && (ke = e, pe.next(ha))
}
const fa = k.fromBytes(0, 255, 130, 255),
    ua = new k(1, 1, 1, 1),
    pa = k.fromBytes(59, 0, 255, 255),
    Ve = {
        markers: {
            near: 5,
            nearScale: .8,
            far: 5e6,
            farScale: .25,
            mediumPlaceTreshold: 5,
            largePlaceTreshold: 20,
            smallPlaceScale: .14,
            mediumPlaceScale: .27,
            largePlaceScale: .42,
            boostScale: 1.5,
            globalScale: .5,
            inactiveColor: fa,
            activeColor: ua
        },
        baseColor: pa
    },
    {
        near: lt,
        nearScale: $t,
        far: ft,
        farScale: jt
    } = Ve.markers,
    ma = new bi(lt, $t, ft, jt),
    Ft = lt * lt,
    _a = ft * ft;
let Nt, Ht;

function va(e) {
    if (e !== Nt) {
        let n = Math.pow((e * e - Ft) / (_a - Ft), .2);
        n = Math.max(0, Math.min(n, 1)), Nt = e, Ht = $t * (1 - n) + jt * n
    }
    return Ht
}
const ga = (() => {
        const e = document.createElement("canvas");
        e.width = 100, e.height = 100;
        const n = 50,
            a = e.getContext("2d");
        return a && (a.beginPath(), a.arc(50, 50, n, 0, Math.PI * 2, !0), a.closePath(), a.fillStyle = "#fff", a.fill()), e.toDataURL()
    })(),
    Ce = {
        image: ga,
        imageId: "circle",
        scale: 1,
        scaleByDistance: ma,
        color: Ve.markers.inactiveColor
    };

function et(e, n, a, o, t, i = Ve) {
    const {
        largePlaceTreshold: r,
        mediumPlaceTreshold: d,
        boostScale: c,
        globalScale: h,
        largePlaceScale: l,
        mediumPlaceScale: f,
        smallPlaceScale: u
    } = i.markers, m = a ? i.markers.activeColor : i.markers.inactiveColor;
    let p = e > r ? l : e > d ? f : u;
    return n && p <= .25 && (p *= c), Ce.scale = p * h, Ce.color = m, Ce.showRatio = t, o && (Ce.position = o), Ce
}

function Ae(e, {
    onMaxZoomReached: n,
    onMinZoomReached: a,
    onZoomAvailable: o
}) {
    this.maxZoomReached = !1, this.minZoomReached = !1, this.onMaxZoomReached = n, this.onMinZoomReached = a, this.onZoomAvailable = o, this.enableInputs = !0, this.enableTranslate = !0, this.enableZoom = !0, this.enableRotate = !0, this.enableTilt = !0, this.enableLook = !0, this.inertiaSpin = .9, this.inertiaTranslate = .9, this.inertiaZoom = .8, this.maximumMovementRatio = .1, this.bounceAnimationTime = 3, this.minimumZoomDistance = 1, this.maximumZoomDistance = Number.POSITIVE_INFINITY, this.translateEventTypes = te.LEFT_DRAG, this.zoomEventTypes = [te.RIGHT_DRAG, te.WHEEL, te.PINCH], this.rotateEventTypes = te.LEFT_DRAG, this.tiltEventTypes = [te.MIDDLE_DRAG, te.PINCH, {
        eventType: te.LEFT_DRAG,
        modifier: Ke.CTRL
    }, {
        eventType: te.RIGHT_DRAG,
        modifier: Ke.CTRL
    }], this.lookEventTypes = {
        eventType: te.LEFT_DRAG,
        modifier: Ke.SHIFT
    }, this.minimumPickingTerrainHeight = 15e4, this._minimumPickingTerrainHeight = this.minimumPickingTerrainHeight, this.minimumCollisionTerrainHeight = 15e3, this._minimumCollisionTerrainHeight = this.minimumCollisionTerrainHeight, this.minimumTrackBallHeight = 75e5, this._minimumTrackBallHeight = this.minimumTrackBallHeight, this.enableCollisionDetection = !0, this._scene = e, this._globe = void 0, this._ellipsoid = void 0, this._aggregator = new Gt(e.canvas), this._lastInertiaSpinMovement = void 0, this._lastInertiaZoomMovement = void 0, this._lastInertiaTranslateMovement = void 0, this._lastInertiaTiltMovement = void 0, this._inertiaDisablers = {
        _lastInertiaZoomMovement: ["_lastInertiaSpinMovement", "_lastInertiaTranslateMovement", "_lastInertiaTiltMovement"],
        _lastInertiaTiltMovement: ["_lastInertiaSpinMovement", "_lastInertiaTranslateMovement"]
    }, this._tweens = new ki, this._tween = void 0, this._horizontalRotationAxis = void 0, this._tiltCenterMousePosition = new C(-1, -1), this._tiltCenter = new s, this._rotateMousePosition = new C(-1, -1), this._rotateStartPosition = new s, this._strafeStartPosition = new s, this._strafeMousePosition = new C, this._strafeEndMousePosition = new C, this._zoomMouseStart = new C(-1, -1), this._zoomWorldPosition = new s, this._useZoomWorldPosition = !1, this._tiltCVOffMap = !1, this._looking = !1, this._rotating = !1, this._strafing = !1, this._zoomingOnVector = !1, this._zoomingUnderground = !1, this._rotatingZoom = !1, this._adjustedHeightForTerrain = !1, this._cameraUnderground = !1;
    var t = e.mapProjection;
    this._maxCoord = t.project(new ce(Math.PI, I.PI_OVER_TWO)), this._zoomFactor = 5, this._rotateFactor = void 0, this._rotateRateRangeAdjustment = void 0, this._maximumRotateRate = 1.77, this._minimumRotateRate = 1 / 5e3, this._minimumZoomRate = 20, this._maximumZoomRate = 5906376272e3, this._minimumUndergroundPickDistance = 2e3, this._maximumUndergroundPickDistance = 1e4
}

function Ta(e, n) {
    if (e < 0) return 0;
    var a = (1 - n) * 25;
    return Math.exp(-a * e)
}

function Ea(e) {
    return C.equalsEpsilon(e.startPosition, e.endPosition, I.EPSILON14)
}
var Ca = .4;

function Sa(e, n, a, o, t, i, r) {
    var d = i[r];
    _(d) || (d = i[r] = {
        startPosition: new C,
        endPosition: new C,
        motion: new C,
        inertiaEnabled: !0
    });
    var c = e.getButtonPressTime(n, a),
        h = e.getButtonReleaseTime(n, a),
        l = c && h && (h.getTime() - c.getTime()) / 1e3,
        f = new Date,
        u = h && (f.getTime() - h.getTime()) / 1e3;
    if (c && h && l < Ca) {
        var m = Ta(u, o),
            p = e.getLastMovement(n, a);
        if (!_(p) || Ea(p) || !d.inertiaEnabled || (d.motion.x = (p.endPosition.x - p.startPosition.x) * .5, d.motion.y = (p.endPosition.y - p.startPosition.y) * .5, d.startPosition = C.clone(p.startPosition, d.startPosition), d.endPosition = C.multiplyByScalar(d.motion, m, d.endPosition), d.endPosition = C.add(d.startPosition, d.endPosition, d.endPosition), isNaN(d.endPosition.x) || isNaN(d.endPosition.y) || C.distance(d.startPosition, d.endPosition) < .5)) return;
        if (!e.isButtonDown(n, a)) {
            var g = e.getStartMousePosition(n, a);
            t(i, g, d)
        }
    }
}

function Da(e, n) {
    if (_(n)) {
        var a = e[n];
        _(a) && (a.inertiaEnabled = !0);
        var o = e._inertiaDisablers[n];
        if (_(o))
            for (var t = o.length, i = 0; i < t; ++i) a = e[o[i]], _(a) && (a.inertiaEnabled = !1)
    }
}
var zt = [];

function ne(e, n, a, o, t, i) {
    if (!!_(a)) {
        var r = e._aggregator;
        Array.isArray(a) || (zt[0] = a, a = zt);
        for (var d = a.length, c = 0; c < d; ++c) {
            var h = a[c],
                l = _(h.eventType) ? h.eventType : h,
                f = h.modifier,
                u = r.isMoving(l, f) && r.getMovement(l, f),
                m = r.getStartMousePosition(l, f);
            e.enableInputs && n && (u ? (o(e, m, u), Da(e, i)) : t < 1 && Sa(r, l, f, t, o, e, i))
        }
    }
}
var tt = new Z,
    xa = new s,
    ya = new C,
    Ia = new s,
    Aa = new s,
    Lt = {
        orientation: new Bi
    };

function ei(e, n, a, o, t, i, r) {
    var d = 1;
    _(i) && (d = I.clamp(Math.abs(i), .25, 1));
    var c = a.endPosition.y - a.startPosition.y,
        h = c < 0 ? 0 : e.minimumZoomDistance * d,
        l = e.maximumZoomDistance,
        f = t - h,
        u = o * f;
    u = I.clamp(u, e._minimumZoomRate, e._maximumZoomRate);
    var m = c / e._scene.canvas.clientHeight;
    m = Math.min(m, e.maximumMovementRatio);
    var p = u * m;
    if (e.enableCollisionDetection || e.minimumZoomDistance === 0 || !_(e._globe)) {
        if (p > 0 && Math.abs(t - h) < 1) {
            e.maxZoomReached || (e.onMaxZoomReached && e.onMaxZoomReached(), e.maxZoomReached = !0);
            return
        }
        if (p < 0 && Math.abs(t - l) < 1) {
            e.minZoomReached || (e.onMinZoomReached && e.onMinZoomReached(), e.minZoomReached = !0);
            return
        }
        t - p < h ? p = t - h - 1 : t - p > l && (p = t - l)
    }
    var g = e._scene,
        v = g.camera,
        T = g.mode,
        E = Lt.orientation;
    if (E.heading = v.heading, E.pitch = v.pitch, E.roll = v.roll, v.frustum instanceof ht) {
        Math.abs(p) > 0 && (v.zoomIn(p), v._adjustOrthographicFrustum());
        return
    }
    var S = C.equals(n, e._zoomMouseStart),
        R = e._zoomingOnVector,
        x = e._rotatingZoom,
        y;
    if (S || (e._zoomMouseStart = C.clone(n, e._zoomMouseStart), _(e._globe) && (y = r || Te(e, n, xa)), _(y) ? (e._useZoomWorldPosition = !0, e._zoomWorldPosition = s.clone(y, e._zoomWorldPosition)) : e._useZoomWorldPosition = !1, R = e._zoomingOnVector = !1, x = e._rotatingZoom = !1, e._zoomingUnderground = e._cameraUnderground), !e._useZoomWorldPosition) {
        v.zoomIn(p);
        return
    }
    var P = T === F.COLUMBUS_VIEW;
    if (v.positionCartographic.height < 2e6 && (x = !0), !S || x) {
        if (T === F.SCENE2D) {
            var N = e._zoomWorldPosition,
                H = v.position;
            if (!s.equals(N, H) && v.positionCartographic.height < e._maxCoord.x * 2) {
                var L = v.position.x,
                    U = s.subtract(N, H, Ia);
                s.normalize(U, U);
                var q = s.distance(N, H) * p / (v.getMagnitude() * .5);
                v.move(U, q * .5), (v.position.x < 0 && L > 0 || v.position.x > 0 && L < 0) && (y = v.getPickRay(n, tt).origin, y = s.fromElements(y.y, y.z, y.x), e._zoomWorldPosition = s.clone(y, e._zoomWorldPosition))
            }
        } else if (r || T === F.SCENE3D) {
            var V = s.normalize(v.position, Aa);
            e._cameraUnderground || e._zoomingUnderground || v.positionCartographic.height < 3e3 && Math.abs(s.dot(v.direction, V)) < .6, P = !0
        }
        e._rotatingZoom = !P
    }
    if (!S && P || R) {
        var B, A = gt.wgs84ToWindowCoordinates(g, e._zoomWorldPosition, ya);
        T !== F.COLUMBUS_VIEW && C.equals(n, e._zoomMouseStart) && _(A) ? B = v.getPickRay(A, tt) : B = v.getPickRay(n, tt);
        var w = B.direction;
        (T === F.COLUMBUS_VIEW || T === F.SCENE2D) && s.fromElements(w.y, w.z, w.x, w), v.move(w, p), e._zoomingOnVector = !0
    } else v.zoomIn(p);
    e._cameraUnderground || v.setView(Lt)
}
var ti = new Z,
    Ra = new s,
    Pa = new s;

function Te(e, n, a) {
    var o = e._scene,
        t = e._globe,
        i = o.camera;
    if (!!_(t)) {
        var r = !e._cameraUnderground,
            d;
        o.pickPositionSupported && (d = o.pickPositionWorldCoordinates(n, Ra));
        var c = i.getPickRay(n, ti),
            h = t.pickWorldCoordinates(c, o, r, Pa),
            l = _(d) ? s.distance(d, i.positionWC) : Number.POSITIVE_INFINITY,
            f = _(h) ? s.distance(h, i.positionWC) : Number.POSITIVE_INFINITY;
        return l < f ? s.clone(d, a) : s.clone(h, a)
    }
}
var wa = new ce;

function Be(e) {
    var n = e._ellipsoid,
        a = e._scene,
        o = a.camera,
        t = a.mode,
        i = 0;
    if (t === F.SCENE3D) {
        var r = n.cartesianToCartographic(o.position, wa);
        _(r) && (i = r.height)
    } else i = o.position.z;
    var d = W(e._scene.globeHeight, 0),
        c = Math.abs(d - i);
    return c
}
var Ma = new s;

function Oa(e, n) {
    var a = n.origin,
        o = n.direction,
        t = Be(e),
        i = s.normalize(a, Ma),
        r = Math.abs(s.dot(i, o));
    return r = Math.max(r, .5) * 2, t * r
}

function ii(e, n, a, o) {
    var t = s.distance(n.origin, a),
        i = Be(e),
        r = I.clamp(i * 5, e._minimumUndergroundPickDistance, e._maximumUndergroundPickDistance);
    return t > r && (t = Math.min(t, i / 5), t = Math.max(t, 100)), Z.getPoint(n, t, o)
}

function ai(e, n, a, o) {
    var t;
    return _(a) ? (t = s.distance(n.origin, a), t > e._maximumUndergroundPickDistance && (t = Be(e))) : t = Be(e), Z.getPoint(n, t, o)
}
var Fa = new C;

function ni(e, n) {
    var a = n.endPosition,
        o = C.subtract(n.endPosition, n.startPosition, Fa),
        t = e._strafeEndMousePosition;
    C.add(t, o, t), n.endPosition = t, Ct(e, n, e._strafeStartPosition), n.endPosition = a
}
var bt = new Z,
    Na = new Z,
    it = new s,
    Ha = new s,
    za = new s,
    La = new s,
    ba = new ge(s.UNIT_X, 0),
    ka = new C,
    Ba = new C;

function Ua(e, n, a) {
    if (s.equals(n, e._translateMousePosition) || (e._looking = !1), s.equals(n, e._strafeMousePosition) || (e._strafing = !1), e._looking) {
        Q(e, n, a);
        return
    }
    if (e._strafing) {
        ni(e, a);
        return
    }
    var o = e._scene,
        t = o.camera,
        i = e._cameraUnderground,
        r = C.clone(a.startPosition, ka),
        d = C.clone(a.endPosition, Ba),
        c = t.getPickRay(r, bt),
        h = s.clone(s.ZERO, La),
        l = s.UNIT_X,
        f;
    if (t.position.z < e._minimumPickingTerrainHeight && (f = Te(e, r, it), _(f) && (h.x = f.x)), i || h.x > t.position.z && _(f)) {
        var u = f;
        i && (u = ai(e, c, f, it)), C.clone(n, e._strafeMousePosition), C.clone(n, e._strafeEndMousePosition), s.clone(u, e._strafeStartPosition), e._strafing = !0, Ct(e, a, e._strafeStartPosition);
        return
    }
    var m = ge.fromPointNormal(h, l, ba);
    c = t.getPickRay(r, bt);
    var p = le.rayPlane(c, m, it),
        g = t.getPickRay(d, Na),
        v = le.rayPlane(g, m, Ha);
    if (!_(p) || !_(v)) {
        e._looking = !0, Q(e, n, a), C.clone(n, e._translateMousePosition);
        return
    }
    var T = s.subtract(p, v, za),
        E = T.x;
    T.x = T.y, T.y = T.z, T.z = E;
    var S = s.magnitude(T);
    S > I.EPSILON6 && (s.normalize(T, T), t.move(T, S))
}
var si = new C,
    Ne = new Z,
    He = new s,
    Va = new s,
    ri = new O,
    Ga = new O,
    Wa = new s,
    Za = new ge(s.UNIT_X, 0),
    at = new s,
    ut = new ce,
    oi = new O,
    qa = new Ue,
    Xa = new he,
    ze = new s;

function Ya(e, n, a) {
    if (_(a.angleAndHeight) && (a = a.angleAndHeight), C.equals(n, e._tiltCenterMousePosition) || (e._tiltCVOffMap = !1, e._looking = !1), e._looking) {
        Q(e, n, a);
        return
    }
    var o = e._scene,
        t = o.camera;
    e._tiltCVOffMap || !e.onMap() || Math.abs(t.position.z) > e._minimumPickingTerrainHeight ? (e._tiltCVOffMap = !0, Ka(e, n, a)) : Qa(e, n, a)
}

function Ka(e, n, a) {
    var o = e._scene,
        t = o.camera,
        i = o.canvas,
        r = si;
    r.x = i.clientWidth / 2, r.y = i.clientHeight / 2;
    var d = t.getPickRay(r, Ne),
        c = s.UNIT_X,
        h = d.origin,
        l = d.direction,
        f, u = s.dot(c, l);
    if (Math.abs(u) > I.EPSILON6 && (f = -s.dot(c, h) / u), !_(f) || f <= 0) {
        e._looking = !0, Q(e, n, a), C.clone(n, e._tiltCenterMousePosition);
        return
    }
    var m = s.multiplyByScalar(l, f, He);
    s.add(h, m, m);
    var p = o.mapProjection,
        g = p.ellipsoid;
    s.fromElements(m.y, m.z, m.x, m);
    var v = p.unproject(m, ut);
    g.cartographicToCartesian(v, m);
    var T = ve.eastNorthUpToFixedFrame(m, g, ri),
        E = e._globe,
        S = e._ellipsoid;
    e._globe = void 0, e._ellipsoid = ie.UNIT_SPHERE, e._rotateFactor = 1, e._rotateRateRangeAdjustment = 1;
    var R = O.clone(t.transform, oi);
    t._setTransform(T), K(e, n, a, s.UNIT_Z), t._setTransform(R), e._globe = E, e._ellipsoid = S;
    var x = S.maximumRadius;
    e._rotateFactor = 1 / x, e._rotateRateRangeAdjustment = x
}

function Qa(e, n, a) {
    var o = e._scene,
        t = o.camera,
        i = e._cameraUnderground,
        r, d, c = s.UNIT_X;
    if (C.equals(n, e._tiltCenterMousePosition)) r = s.clone(e._tiltCenter, He);
    else {
        if (t.position.z < e._minimumPickingTerrainHeight && (r = Te(e, n, He)), !_(r)) {
            d = t.getPickRay(n, Ne);
            var h = d.origin,
                l = d.direction,
                f, u = s.dot(c, l);
            if (Math.abs(u) > I.EPSILON6 && (f = -s.dot(c, h) / u), !_(f) || f <= 0) {
                e._looking = !0, Q(e, n, a), C.clone(n, e._tiltCenterMousePosition);
                return
            }
            r = s.multiplyByScalar(l, f, He), s.add(h, r, r)
        }
        i && (_(d) || (d = t.getPickRay(n, Ne)), ii(e, d, r, r)), C.clone(n, e._tiltCenterMousePosition), s.clone(r, e._tiltCenter)
    }
    var m = o.canvas,
        p = si;
    p.x = m.clientWidth / 2, p.y = e._tiltCenterMousePosition.y, d = t.getPickRay(p, Ne);
    var g = s.clone(s.ZERO, Wa);
    g.x = r.x;
    var v = ge.fromPointNormal(g, c, Za),
        T = le.rayPlane(d, v, Va),
        E = t._projection,
        S = E.ellipsoid;
    s.fromElements(r.y, r.z, r.x, r);
    var R = E.unproject(r, ut);
    S.cartographicToCartesian(R, r);
    var x = ve.eastNorthUpToFixedFrame(r, S, ri),
        y;
    _(T) ? (s.fromElements(T.y, T.z, T.x, T), R = E.unproject(T, ut), S.cartographicToCartesian(R, T), y = ve.eastNorthUpToFixedFrame(T, S, Ga)) : y = x;
    var P = e._globe,
        N = e._ellipsoid;
    e._globe = void 0, e._ellipsoid = ie.UNIT_SPHERE, e._rotateFactor = 1, e._rotateRateRangeAdjustment = 1;
    var H = s.UNIT_Z,
        L = O.clone(t.transform, oi);
    t._setTransform(x);
    var U = s.cross(s.UNIT_Z, s.normalize(t.position, at), at),
        q = s.dot(t.right, U);
    if (K(e, n, a, H, !1, !0), t._setTransform(y), q < 0) {
        var V = a.startPosition.y - a.endPosition.y;
        (i && V < 0 || !i && V > 0) && (H = void 0);
        var B = t.constrainedAxis;
        t.constrainedAxis = void 0, K(e, n, a, H, !0, !1), t.constrainedAxis = B
    } else K(e, n, a, H, !0, !1);
    if (_(t.constrainedAxis)) {
        var A = s.cross(t.direction, t.constrainedAxis, ze);
        s.equalsEpsilon(A, s.ZERO, I.EPSILON6) || (s.dot(A, t.right) < 0 && s.negate(A, A), s.cross(A, t.direction, t.up), s.cross(t.direction, t.up, t.right), s.normalize(t.up, t.up), s.normalize(t.right, t.right))
    }
    t._setTransform(L), e._globe = P, e._ellipsoid = N;
    var w = N.maximumRadius;
    e._rotateFactor = 1 / w, e._rotateRateRangeAdjustment = w;
    var D = s.clone(t.positionWC, at);
    if (e.enableCollisionDetection && xt(e), !s.equals(t.positionWC, D)) {
        t._setTransform(y), t.worldToCameraCoordinatesPoint(D, D);
        var ae = s.magnitudeSquared(D);
        s.magnitudeSquared(t.position) > ae && (s.normalize(t.position, t.position), s.multiplyByScalar(t.position, Math.sqrt(ae), t.position));
        var oe = s.angleBetween(D, t.position),
            ee = s.cross(D, t.position, D);
        s.normalize(ee, ee);
        var ue = Ue.fromAxisAngle(ee, oe, qa),
            Re = he.fromQuaternion(ue, Xa);
        he.multiplyByVector(Re, t.direction, t.direction), he.multiplyByVector(Re, t.up, t.up), s.cross(t.direction, t.up, t.right), s.cross(t.right, t.direction, t.up), t._setTransform(L)
    }
}
var di = new C,
    Ja = new Z,
    $a = new s;

function ja(e, n, a) {
    _(a.distance) && (a = a.distance);
    var o = e._scene,
        t = o.camera,
        i = o.canvas,
        r = e._cameraUnderground,
        d;
    r ? d = n : (d = di, d.x = i.clientWidth / 2, d.y = i.clientHeight / 2);
    var c = t.getPickRay(d, Ja),
        h = c.origin,
        l = c.direction,
        f = t.position.z,
        u;
    f < e._minimumPickingTerrainHeight && (u = Te(e, d, $a));
    var m;
    if (_(u) && (m = s.distance(h, u)), r) {
        var p = Oa(e, c);
        _(m) ? m = Math.min(m, p) : m = p
    }
    if (!_(m)) {
        var g = s.UNIT_X;
        m = -s.dot(g, h) / s.dot(g, l)
    }
    ei(e, n, a, e._zoomFactor, m)
}

function en(e) {
    var n = e._scene,
        a = n.camera;
    if (!O.equals(O.IDENTITY, a.transform)) ne(e, e.enableRotate, e.rotateEventTypes, K, e.inertiaSpin, "_lastInertiaSpinMovement"), ne(e, e.enableZoom, e.zoomEventTypes, ci, e.inertiaZoom, "_lastInertiaZoomMovement");
    else {
        var o = e._tweens;
        if (e._aggregator.anyButtonDown && o.removeAll(), ne(e, e.enableTilt, e.tiltEventTypes, Ya, e.inertiaSpin, "_lastInertiaTiltMovement"), ne(e, e.enableTranslate, e.translateEventTypes, Ua, e.inertiaTranslate, "_lastInertiaTranslateMovement"), ne(e, e.enableZoom, e.zoomEventTypes, ja, e.inertiaZoom, "_lastInertiaZoomMovement"), ne(e, e.enableLook, e.lookEventTypes, Q), !e._aggregator.anyButtonDown && !o.contains(e._tween)) {
            var t = a.createCorrectPositionTween(e.bounceAnimationTime);
            _(t) && (e._tween = o.add(t))
        }
        o.update()
    }
}
var tn = new Z,
    an = new ge(s.UNIT_X, 0),
    nn = new s,
    sn = new s,
    rn = new s;

function Ct(e, n, a) {
    var o = e._scene,
        t = o.camera,
        i = t.getPickRay(n.endPosition, tn),
        r = s.clone(t.direction, sn);
    o.mode === F.COLUMBUS_VIEW && s.fromElements(r.z, r.x, r.y, r);
    var d = ge.fromPointNormal(a, r, an),
        c = le.rayPlane(i, d, nn);
    !_(c) || (r = s.subtract(a, c, r), o.mode === F.COLUMBUS_VIEW && s.fromElements(r.y, r.z, r.x, r), s.add(t.position, r, t.position))
}
var kt = new s,
    on = new ce,
    pt = new s,
    mt = new ie,
    dn = new s,
    cn = new s;

function hn(e, n, a) {
    var o = e._scene,
        t = o.camera,
        i = e._cameraUnderground,
        r = e._ellipsoid;
    if (!O.equals(t.transform, O.IDENTITY)) {
        K(e, n, a);
        return
    }
    var d, c, h = r.geodeticSurfaceNormal(t.position, dn);
    if (C.equals(n, e._rotateMousePosition)) {
        if (e._looking) Q(e, n, a, h);
        else if (e._rotating) K(e, n, a);
        else if (e._strafing) ni(e, a);
        else {
            if (s.magnitude(t.position) < s.magnitude(e._rotateStartPosition)) return;
            d = s.magnitude(e._rotateStartPosition), c = pt, c.x = c.y = c.z = d, r = ie.fromCartesian3(c, mt), st(e, n, a, r)
        }
        return
    }
    e._looking = !1, e._rotating = !1, e._strafing = !1;
    var l = r.cartesianToCartographic(t.positionWC, on).height,
        f = e._globe;
    if (_(f) && l < e._minimumPickingTerrainHeight) {
        var u = Te(e, a.startPosition, rn);
        if (_(u)) {
            var m = !1,
                p = t.getPickRay(a.startPosition, ti);
            if (i) m = !0, ai(e, p, u, u);
            else {
                var g = r.geodeticSurfaceNormal(u, cn),
                    v = Math.abs(s.dot(p.direction, g)) < .05;
                v ? m = !0 : m = s.magnitude(t.position) < s.magnitude(u)
            }
            m ? (C.clone(n, e._strafeEndMousePosition), s.clone(u, e._strafeStartPosition), e._strafing = !0, Ct(e, a, e._strafeStartPosition)) : (d = s.magnitude(u), c = pt, c.x = c.y = c.z = d, r = ie.fromCartesian3(c, mt), st(e, n, a, r), s.clone(u, e._rotateStartPosition))
        } else e._looking = !0, Q(e, n, a, h)
    } else _(t.pickEllipsoid(a.startPosition, e._ellipsoid, kt)) ? (st(e, n, a, e._ellipsoid), s.clone(kt, e._rotateStartPosition)) : l > e._minimumTrackBallHeight ? (e._rotating = !0, K(e, n, a)) : (e._looking = !0, Q(e, n, a, h));
    C.clone(n, e._rotateMousePosition)
}

function K(e, n, a, o, t, i) {
    t = W(t, !1), i = W(i, !1);
    var r = e._scene,
        d = r.camera,
        c = r.canvas,
        h = d.constrainedAxis;
    _(o) && (d.constrainedAxis = o);
    var l = s.magnitude(d.position),
        f = e._rotateFactor * (l - e._rotateRateRangeAdjustment);
    f > e._maximumRotateRate && (f = e._maximumRotateRate), f < e._minimumRotateRate && (f = e._minimumRotateRate);
    var u = (a.startPosition.x - a.endPosition.x) / c.clientWidth,
        m = (a.startPosition.y - a.endPosition.y) / c.clientHeight;
    u = Math.min(u, e.maximumMovementRatio), m = Math.min(m, e.maximumMovementRatio);
    var p = f * u * Math.PI * 2,
        g = f * m * Math.PI;
    t || d.rotateRight(p), i || d.rotateUp(g), d.constrainedAxis = h
}
var ln = be.clone(be.UNIT_W),
    fn = be.clone(be.UNIT_W),
    Oe = new s,
    nt = new s,
    un = new s,
    pn = new s,
    mn = new C,
    _n = new C;

function st(e, n, a, o) {
    var t = e._scene,
        i = t.camera,
        r = C.clone(a.startPosition, mn),
        d = C.clone(a.endPosition, _n),
        c = i.pickEllipsoid(r, o, ln),
        h = i.pickEllipsoid(d, o, fn);
    if (!_(c) || !_(h)) {
        e._rotating = !0, K(e, n, a);
        return
    }
    if (c = i.worldToCameraCoordinates(c, c), h = i.worldToCameraCoordinates(h, h), _(i.constrainedAxis)) {
        var m = i.constrainedAxis,
            p = s.mostOrthogonalAxis(m, Oe);
        s.cross(p, m, p), s.normalize(p, p);
        var g = s.cross(m, p, nt),
            v = s.magnitude(c),
            T = s.dot(m, c),
            E = Math.acos(T / v),
            S = s.multiplyByScalar(m, T, un);
        s.subtract(c, S, S), s.normalize(S, S);
        var R = s.magnitude(h),
            x = s.dot(m, h),
            y = Math.acos(x / R),
            P = s.multiplyByScalar(m, x, pn);
        s.subtract(h, P, P), s.normalize(P, P);
        var N = Math.acos(s.dot(S, p));
        s.dot(S, g) < 0 && (N = I.TWO_PI - N);
        var H = Math.acos(s.dot(P, p));
        s.dot(P, g) < 0 && (H = I.TWO_PI - H);
        var L = N - H,
            U;
        s.equalsEpsilon(m, i.position, I.EPSILON2) ? U = i.right : U = s.cross(m, i.position, Oe);
        var q = s.cross(m, U, Oe),
            V = s.dot(q, s.subtract(c, m, nt)),
            B = s.dot(q, s.subtract(h, m, nt)),
            A;
        V > 0 && B > 0 ? A = y - E : V > 0 && B <= 0 ? s.dot(i.position, m) > 0 ? A = -E - y : A = E + y : A = E - y, i.rotateRight(L), i.rotateUp(A)
    } else {
        s.normalize(c, c), s.normalize(h, h);
        var l = s.dot(c, h),
            f = s.cross(c, h, Oe);
        if (l < 1 && !s.equalsEpsilon(f, s.ZERO, I.EPSILON14)) {
            var u = Math.acos(l);
            i.rotate(f, u)
        }
    }
}
var vn = new s,
    gn = new ce;

function ci(e, n, a) {
    _(a.distance) && (a = a.distance);
    var o = e._ellipsoid,
        t = e._scene,
        i = t.camera,
        r = t.canvas;
    gt.wgs84ToWindowCoordinates(t, e.getZoomPosition(), n);
    var d = e._cameraUnderground,
        c;
    d ? c = n : (c = di, c.x = r.clientWidth / 2, c.y = r.clientHeight / 2);
    var h = o.cartesianToCartographic(i.position, gn).height,
        l = h;
    _(l) || (l = h);
    var f = s.normalize(i.position, vn);
    ei(e, n, a, e._zoomFactor, l, s.dot(f, i.direction), e.getZoomCartesian3 && e.getZoomCartesian3())
}
var hi = new C,
    Le = new Z,
    ye = new s,
    Tn = new s,
    li = new O,
    En = new O,
    fi = new O,
    Cn = new Ue,
    Sn = new he,
    St = new ce,
    Dt = new s;

function Dn(e, n, a) {
    var o = e._scene,
        t = o.camera;
    if (!!O.equals(t.transform, O.IDENTITY)) {
        if (_(a.angleAndHeight) && (a = a.angleAndHeight), C.equals(n, e._tiltCenterMousePosition) || (e._tiltOnEllipsoid = !1, e._looking = !1), e._looking) {
            var i = e._ellipsoid.geodeticSurfaceNormal(t.position, Dt);
            Q(e, n, a, i);
            return
        }
        var r = e._ellipsoid,
            d = r.cartesianToCartographic(t.position, St);
        e._tiltOnEllipsoid || d.height > e._minimumCollisionTerrainHeight ? (e._tiltOnEllipsoid = !0, yn(e, n, a)) : In(e, n, a)
    }
}
var xn = new ce;

function yn(e, n, a) {
    var o = e._ellipsoid,
        t = e._scene,
        i = t.camera,
        r = e.minimumZoomDistance * .25,
        d = o.cartesianToCartographic(i.positionWC, xn).height;
    if (!(d - r - 1 < I.EPSILON3 && a.endPosition.y - a.startPosition.y < 0)) {
        var c = t.canvas,
            h = hi;
        h.x = c.clientWidth / 2, h.y = c.clientHeight / 2;
        var l = i.getPickRay(h, Le),
            f, u = le.rayEllipsoid(l, o);
        if (_(u)) f = Z.getPoint(l, u.start, ye);
        else if (d > e._minimumTrackBallHeight) {
            var m = le.grazingAltitudeLocation(l, o);
            if (!_(m)) return;
            var p = o.cartesianToCartographic(m, St);
            p.height = 0, f = o.cartographicToCartesian(p, ye)
        } else {
            e._looking = !0;
            var g = e._ellipsoid.geodeticSurfaceNormal(i.position, Dt);
            Q(e, n, a, g), C.clone(n, e._tiltCenterMousePosition);
            return
        }
        var v = ve.eastNorthUpToFixedFrame(f, o, li),
            T = e._globe,
            E = e._ellipsoid;
        e._globe = void 0, e._ellipsoid = ie.UNIT_SPHERE, e._rotateFactor = 1, e._rotateRateRangeAdjustment = 1;
        var S = O.clone(i.transform, fi);
        i._setTransform(v), K(e, n, a, s.UNIT_Z), i._setTransform(S), e._globe = T, e._ellipsoid = E;
        var R = E.maximumRadius;
        e._rotateFactor = 1 / R, e._rotateRateRangeAdjustment = R
    }
}

function In(e, n, a) {
    var o = e._ellipsoid,
        t = e._scene,
        i = t.camera,
        r = e._cameraUnderground,
        d, c, h;
    if (C.equals(n, e._tiltCenterMousePosition)) d = s.clone(e._tiltCenter, ye);
    else {
        if (d = Te(e, n, ye), !_(d)) {
            if (c = i.getPickRay(n, Le), h = le.rayEllipsoid(c, o), !_(h)) {
                var l = o.cartesianToCartographic(i.position, St);
                if (l.height <= e._minimumTrackBallHeight) {
                    e._looking = !0;
                    var f = e._ellipsoid.geodeticSurfaceNormal(i.position, Dt);
                    Q(e, n, a, f), C.clone(n, e._tiltCenterMousePosition)
                }
                return
            }
            d = Z.getPoint(c, h.start, ye)
        }
        r && (_(c) || (c = i.getPickRay(n, Le)), ii(e, c, d, d)), C.clone(n, e._tiltCenterMousePosition), s.clone(d, e._tiltCenter)
    }
    var u = t.canvas,
        m = hi;
    m.x = u.clientWidth / 2, m.y = e._tiltCenterMousePosition.y, c = i.getPickRay(m, Le);
    var p = s.magnitude(d),
        g = s.fromElements(p, p, p, pt),
        v = ie.fromCartesian3(g, mt);
    if (h = le.rayEllipsoid(c, v), !!_(h)) {
        var T = s.magnitude(c.origin) > p ? h.start : h.stop,
            E = Z.getPoint(c, T, Tn),
            S = ve.eastNorthUpToFixedFrame(d, o, li),
            R = ve.eastNorthUpToFixedFrame(E, v, En),
            x = e._globe,
            y = e._ellipsoid;
        e._globe = void 0, e._ellipsoid = ie.UNIT_SPHERE, e._rotateFactor = 1, e._rotateRateRangeAdjustment = 1;
        var P = s.UNIT_Z,
            N = O.clone(i.transform, fi);
        i._setTransform(S);
        var H = s.cross(E, i.positionWC, ze),
            L = s.dot(i.rightWC, H);
        if (K(e, n, a, P, !1, !0), i._setTransform(R), L < 0) {
            var U = a.startPosition.y - a.endPosition.y;
            (r && U < 0 || !r && U > 0) && (P = void 0);
            var q = i.constrainedAxis;
            i.constrainedAxis = void 0, K(e, n, a, P, !0, !1), i.constrainedAxis = q
        } else K(e, n, a, P, !0, !1);
        if (_(i.constrainedAxis)) {
            var V = s.cross(i.direction, i.constrainedAxis, ze);
            s.equalsEpsilon(V, s.ZERO, I.EPSILON6) || (s.dot(V, i.right) < 0 && s.negate(V, V), s.cross(V, i.direction, i.up), s.cross(i.direction, i.up, i.right), s.normalize(i.up, i.up), s.normalize(i.right, i.right))
        }
        i._setTransform(N), e._globe = x, e._ellipsoid = y;
        var B = y.maximumRadius;
        e._rotateFactor = 1 / B, e._rotateRateRangeAdjustment = B;
        var A = s.clone(i.positionWC, ze);
        if (e.enableCollisionDetection && xt(e), !s.equals(i.positionWC, A)) {
            i._setTransform(R), i.worldToCameraCoordinatesPoint(A, A);
            var w = s.magnitudeSquared(A);
            s.magnitudeSquared(i.position) > w && (s.normalize(i.position, i.position), s.multiplyByScalar(i.position, Math.sqrt(w), i.position));
            var D = s.angleBetween(A, i.position),
                ae = s.cross(A, i.position, A);
            s.normalize(ae, ae);
            var oe = Ue.fromAxisAngle(ae, D, Cn),
                ee = he.fromQuaternion(oe, Sn);
            he.multiplyByVector(ee, i.direction, i.direction), he.multiplyByVector(ee, i.up, i.up), s.cross(i.direction, i.up, i.right), s.cross(i.right, i.direction, i.up), i._setTransform(N)
        }
    }
}
var An = new C,
    Rn = new C,
    Bt = new Z,
    Ut = new Z,
    Pn = new s,
    wn = new s;

function Q(e, n, a, o) {
    var t = e._scene,
        i = t.camera,
        r = An;
    r.x = a.startPosition.x, r.y = 0;
    var d = Rn;
    d.x = a.endPosition.x, d.y = 0;
    var c = i.getPickRay(r, Bt),
        h = i.getPickRay(d, Ut),
        l = 0,
        f, u;
    i.frustum instanceof ht ? (f = c.origin, u = h.origin, s.add(i.direction, f, f), s.add(i.direction, u, u), s.subtract(f, i.position, f), s.subtract(u, i.position, u), s.normalize(f, f), s.normalize(u, u)) : (f = c.direction, u = h.direction);
    var m = s.dot(f, u);
    m < 1 && (l = Math.acos(m)), l = a.startPosition.x > a.endPosition.x ? -l : l;
    var p = e._horizontalRotationAxis;
    if (_(o) ? i.look(o, -l) : _(p) ? i.look(p, -l) : i.lookLeft(l), r.x = 0, r.y = a.startPosition.y, d.x = 0, d.y = a.endPosition.y, c = i.getPickRay(r, Bt), h = i.getPickRay(d, Ut), l = 0, i.frustum instanceof ht ? (f = c.origin, u = h.origin, s.add(i.direction, f, f), s.add(i.direction, u, u), s.subtract(f, i.position, f), s.subtract(u, i.position, u), s.normalize(f, f), s.normalize(u, u)) : (f = c.direction, u = h.direction), m = s.dot(f, u), m < 1 && (l = Math.acos(m)), l = a.startPosition.y > a.endPosition.y ? -l : l, o = W(o, p), _(o)) {
        var g = i.direction,
            v = s.negate(o, Pn),
            T = s.equalsEpsilon(g, o, I.EPSILON2),
            E = s.equalsEpsilon(g, v, I.EPSILON2);
        if (!T && !E) {
            m = s.dot(g, o);
            var S = I.acosClamped(m);
            l > 0 && l > S && (l = S - I.EPSILON4), m = s.dot(g, v), S = I.acosClamped(m), l < 0 && -l > S && (l = -S + I.EPSILON4);
            var R = s.cross(o, g, wn);
            i.look(R, l)
        } else(T && l < 0 || E && l > 0) && i.look(i.right, -l)
    } else i.lookUp(l)
}

function Mn(e) {
    ne(e, e.enableRotate, e.rotateEventTypes, hn, e.inertiaSpin, "_lastInertiaSpinMovement"), ne(e, e.enableZoom, e.zoomEventTypes, ci, e.inertiaZoom, "_lastInertiaZoomMovement"), ne(e, e.enableTilt, e.tiltEventTypes, Dn, e.inertiaSpin, "_lastInertiaTiltMovement"), ne(e, e.enableLook, e.lookEventTypes, Q)
}
var On = new O,
    Fn = new ce;

function xt(e) {
    e._adjustedHeightForTerrain = !0;
    var n = e._scene,
        a = n.mode,
        o = n.globe;
    if (!(!_(o) || a === F.SCENE2D || a === F.MORPHING)) {
        var t = n.camera,
            i = o.ellipsoid,
            r = n.mapProjection,
            d, c;
        O.equals(t.transform, O.IDENTITY) || (d = O.clone(t.transform, On), c = s.magnitude(t.position), t._setTransform(O.IDENTITY));
        var h = Fn;
        a === F.SCENE3D ? i.cartesianToCartographic(t.position, h) : r.unproject(t.position, h);
        var l = !1;
        if (h.height < e._minimumCollisionTerrainHeight) {
            var f = e._scene.globeHeight;
            if (_(f)) {
                var u = f + e.minimumZoomDistance;
                h.height < u && (h.height = u, a === F.SCENE3D ? i.cartographicToCartesian(h, t.position) : r.project(h, t.position), l = !0)
            }
        }
        _(d) && (t._setTransform(d), l && (s.normalize(t.position, t.position), s.negate(t.position, t.direction), s.multiplyByScalar(t.position, Math.max(c, e.minimumZoomDistance), t.position), s.normalize(t.direction, t.direction), s.cross(t.direction, t.up, t.right), s.cross(t.right, t.direction, t.up)))
    }
}
Ae.prototype.onMap = function() {
    var e = this._scene,
        n = e.mode,
        a = e.camera;
    return n === F.COLUMBUS_VIEW ? Math.abs(a.position.x) - this._maxCoord.x < 0 && Math.abs(a.position.y) - this._maxCoord.y < 0 : !0
};
var Nn = new s,
    Hn = new s;
Ae.prototype.update = function() {
    var e = this._scene,
        n = e.camera,
        a = e.globe,
        o = e.mode;
    O.equals(n.transform, O.IDENTITY) ? (this._globe = a, this._ellipsoid = _(this._globe) ? this._globe.ellipsoid : e.mapProjection.ellipsoid) : (this._globe = void 0, this._ellipsoid = ie.UNIT_SPHERE), this._cameraUnderground = e.cameraUnderground && _(this._globe), this._minimumCollisionTerrainHeight = this.minimumCollisionTerrainHeight * e.terrainExaggeration, this._minimumPickingTerrainHeight = this.minimumPickingTerrainHeight * e.terrainExaggeration, this._minimumTrackBallHeight = this.minimumTrackBallHeight * e.terrainExaggeration;
    var t = this._ellipsoid.maximumRadius;
    this._rotateFactor = 1 / t, this._rotateRateRangeAdjustment = t, this._adjustedHeightForTerrain = !1;
    var i = s.clone(n.positionWC, Nn),
        r = s.clone(n.directionWC, Hn);
    if (o === F.SCENE2D || (o === F.COLUMBUS_VIEW ? (this._horizontalRotationAxis = s.UNIT_Z, en(this)) : o === F.SCENE3D && (this._horizontalRotationAxis = void 0, Mn(this))), this.enableCollisionDetection && !this._adjustedHeightForTerrain) {
        var d = !s.equals(i, n.positionWC) || !s.equals(r, n.directionWC);
        d && xt(this)
    }
    this._aggregator.reset()
};
Ae.prototype.isDestroyed = function() {
    return !1
};
Ae.prototype.destroy = function() {
    return this._tweens.removeAll(), this._aggregator = this._aggregator && this._aggregator.destroy(), Wt(this)
};
const zn = `#ifdef INSTANCED
attribute vec2 direction;
#endif
attribute vec4 positionHighAndScale;
attribute vec4 positionLowAndRotation;
attribute vec4 compressedAttribute0;                       // pixel offset, translate, horizontal origin, vertical origin, show, direction, texture coordinates (texture offset)
attribute vec4 compressedAttribute1;                       // aligned axis, translucency by distance, image width
attribute vec4 compressedAttribute2;                       // label horizontal origin, image height, color, pick color, size in meters, valid aligned axis, 13 bits free
attribute vec4 eyeOffset;                                  // eye offset in meters, 4 bytes free (texture range)
attribute vec4 scaleByDistance;                            // near, nearScale, far, farScale
attribute vec4 pixelOffsetScaleByDistance;                 // near, nearScale, far, farScale
attribute vec4 compressedAttribute3;                       // distance display condition near, far, disableDepthTestDistance, dimensions
attribute vec2 sdf;                                        // sdf outline color (rgb) and width (w)
#if defined(VERTEX_DEPTH_CHECK) || defined(FRAGMENT_DEPTH_CHECK)
attribute vec4 textureCoordinateBoundsOrLabelTranslate;    // the min and max x and y values for the texture coordinates
#endif
#ifdef VECTOR_TILE
attribute float a_batchId;
#endif

varying vec2 v_textureCoordinates;
#ifdef FRAGMENT_DEPTH_CHECK
varying vec4 v_textureCoordinateBounds;
varying vec4 v_originTextureCoordinateAndTranslate;
varying vec4 v_compressed;                                 // x: eyeDepth, y: applyTranslate & enableDepthCheck, z: dimensions, w: imageSize
varying mat2 v_rotationMatrix;
#endif

varying vec4 v_pickColor;
varying vec4 v_color;
uniform float u_showRatio;

#ifdef SDF
varying vec4 v_outlineColor;
varying float v_outlineWidth;
#endif

const float UPPER_BOUND = 32768.0;

const float SHIFT_LEFT16 = 65536.0;
const float SHIFT_LEFT12 = 4096.0;
const float SHIFT_LEFT8 = 256.0;
const float SHIFT_LEFT7 = 128.0;
const float SHIFT_LEFT5 = 32.0;
const float SHIFT_LEFT3 = 8.0;
const float SHIFT_LEFT2 = 4.0;
const float SHIFT_LEFT1 = 2.0;

const float SHIFT_RIGHT12 = 1.0 / 4096.0;
const float SHIFT_RIGHT8 = 1.0 / 256.0;
const float SHIFT_RIGHT7 = 1.0 / 128.0;
const float SHIFT_RIGHT5 = 1.0 / 32.0;
const float SHIFT_RIGHT3 = 1.0 / 8.0;
const float SHIFT_RIGHT2 = 1.0 / 4.0;
const float SHIFT_RIGHT1 = 1.0 / 2.0;

vec4 addScreenSpaceOffset(vec4 positionEC, vec2 imageSize, float scale, vec2 direction, vec2 origin, vec2 translate, vec2 pixelOffset, vec3 alignedAxis, bool validAlignedAxis, float rotation, bool sizeInMeters, out mat2 rotationMatrix, out float mpp)
{
    // Note the halfSize cannot be computed in JavaScript because it is sent via
    // compressed vertex attributes that coerce it to an integer.
    vec2 halfSize = imageSize * scale * 0.5;
    halfSize *= ((direction * 2.0) - 1.0);

    vec2 originTranslate = origin * abs(halfSize);

    if (sizeInMeters)
    {
        positionEC.xy += halfSize;
    }

    mpp = czm_metersPerPixel(positionEC);

    if (!sizeInMeters)
    {
        originTranslate *= mpp;
    }

    positionEC.xy += originTranslate;
    if (!sizeInMeters)
    {
        positionEC.xy += halfSize * mpp;
    }

    positionEC.xy += translate * mpp;
    positionEC.xy += pixelOffset * mpp;
    return positionEC;
}

#ifdef VERTEX_DEPTH_CHECK
float getGlobeDepth(vec4 positionEC)
{
    vec4 posWC = czm_eyeToWindowCoordinates(positionEC);

    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, posWC.xy / czm_viewport.zw));

    if (globeDepth == 0.0)
    {
        return 0.0; // not on the globe
    }

    vec4 eyeCoordinate = czm_windowToEyeCoordinates(posWC.xy, globeDepth);
    return eyeCoordinate.z / eyeCoordinate.w;
}
#endif
void main()
{
    // Modifying this shader may also require modifications to Billboard._computeScreenSpacePosition

    // unpack attributes
    vec3 positionHigh = positionHighAndScale.xyz;
    vec3 positionLow = positionLowAndRotation.xyz;
    float showRatio = positionLowAndRotation.w;
    float scale = positionHighAndScale.w;

#if defined(ROTATION) || defined(ALIGNED_AXIS)
    float rotation = positionLowAndRotation.w;
#else
    float rotation = 0.0;
#endif

    float compressed = compressedAttribute0.x;

    vec2 pixelOffset;
    pixelOffset.x = floor(compressed * SHIFT_RIGHT7);
    compressed -= pixelOffset.x * SHIFT_LEFT7;
    pixelOffset.x -= UPPER_BOUND;

    vec2 origin;
    origin.x = floor(compressed * SHIFT_RIGHT5);
    compressed -= origin.x * SHIFT_LEFT5;

    origin.y = floor(compressed * SHIFT_RIGHT3);
    compressed -= origin.y * SHIFT_LEFT3;

#ifdef FRAGMENT_DEPTH_CHECK
    vec2 depthOrigin = origin.xy;
#endif
    origin -= vec2(1.0);

    float show = floor(compressed * SHIFT_RIGHT2);
    compressed -= show * SHIFT_LEFT2;

#ifdef INSTANCED
    vec2 textureCoordinatesBottomLeft = czm_decompressTextureCoordinates(compressedAttribute0.w);
    vec2 textureCoordinatesRange = czm_decompressTextureCoordinates(eyeOffset.w);
    vec2 textureCoordinates = textureCoordinatesBottomLeft + direction * textureCoordinatesRange;
#else
    vec2 direction;
    direction.x = floor(compressed * SHIFT_RIGHT1);
    direction.y = compressed - direction.x * SHIFT_LEFT1;

    vec2 textureCoordinates = czm_decompressTextureCoordinates(compressedAttribute0.w);
#endif

    float temp = compressedAttribute0.y  * SHIFT_RIGHT8;
    pixelOffset.y = -(floor(temp) - UPPER_BOUND);

    vec2 translate;
    translate.y = (temp - floor(temp)) * SHIFT_LEFT16;

    temp = compressedAttribute0.z * SHIFT_RIGHT8;
    translate.x = floor(temp) - UPPER_BOUND;

    translate.y += (temp - floor(temp)) * SHIFT_LEFT8;
    translate.y -= UPPER_BOUND;

    temp = compressedAttribute1.x * SHIFT_RIGHT8;
    float temp2 = floor(compressedAttribute2.w * SHIFT_RIGHT2);

    vec2 imageSize = vec2(floor(temp), temp2);

#ifdef FRAGMENT_DEPTH_CHECK
    float labelHorizontalOrigin = floor(compressedAttribute2.w - (temp2 * SHIFT_LEFT2));
    float applyTranslate = 0.0;
    if (labelHorizontalOrigin != 0.0) // is a billboard, so set apply translate to false
    {
        applyTranslate = 1.0;
        labelHorizontalOrigin -= 2.0;
        depthOrigin.x = labelHorizontalOrigin + 1.0;
    }

    depthOrigin = vec2(1.0) - (depthOrigin * 0.5);
#endif

#ifdef EYE_DISTANCE_TRANSLUCENCY
    vec4 translucencyByDistance;
    translucencyByDistance.x = compressedAttribute1.z;
    translucencyByDistance.z = compressedAttribute1.w;

    translucencyByDistance.y = ((temp - floor(temp)) * SHIFT_LEFT8) / 255.0;

    temp = compressedAttribute1.y * SHIFT_RIGHT8;
    translucencyByDistance.w = ((temp - floor(temp)) * SHIFT_LEFT8) / 255.0;
#endif

#if defined(VERTEX_DEPTH_CHECK) || defined(FRAGMENT_DEPTH_CHECK)
    temp = compressedAttribute3.w;
    temp = temp * SHIFT_RIGHT12;

    vec2 dimensions;
    dimensions.y = (temp - floor(temp)) * SHIFT_LEFT12;
    dimensions.x = floor(temp);
#endif

#ifdef ALIGNED_AXIS
    vec3 alignedAxis = czm_octDecode(floor(compressedAttribute1.y * SHIFT_RIGHT8));
    temp = compressedAttribute2.z * SHIFT_RIGHT5;
    bool validAlignedAxis = (temp - floor(temp)) * SHIFT_LEFT1 > 0.0;
#else
    vec3 alignedAxis = vec3(0.0);
    bool validAlignedAxis = false;
#endif

    vec4 pickColor;
    vec4 color;

    temp = compressedAttribute2.y;
    temp = temp * SHIFT_RIGHT8;
    pickColor.b = (temp - floor(temp)) * SHIFT_LEFT8;
    temp = floor(temp) * SHIFT_RIGHT8;
    pickColor.g = (temp - floor(temp)) * SHIFT_LEFT8;
    pickColor.r = floor(temp);

    temp = compressedAttribute2.x;
    temp = temp * SHIFT_RIGHT8;
    color.b = (temp - floor(temp)) * SHIFT_LEFT8;
    temp = floor(temp) * SHIFT_RIGHT8;
    color.g = (temp - floor(temp)) * SHIFT_LEFT8;
    color.r = floor(temp);

    temp = compressedAttribute2.z * SHIFT_RIGHT8;
    bool sizeInMeters = floor((temp - floor(temp)) * SHIFT_LEFT7) > 0.0;
    temp = floor(temp) * SHIFT_RIGHT8;

    pickColor.a = (temp - floor(temp)) * SHIFT_LEFT8;
    pickColor /= 255.0;

    color.a = floor(temp);
    color /= 255.0;

    ///////////////////////////////////////////////////////////////////////////

    vec4 p = czm_translateRelativeToEye(positionHigh, positionLow);
    vec4 positionEC = czm_modelViewRelativeToEye * p;

#if defined(FRAGMENT_DEPTH_CHECK) || defined(VERTEX_DEPTH_CHECK)
    float eyeDepth = positionEC.z;
#endif

    positionEC = czm_eyeOffset(positionEC, eyeOffset.xyz);
    positionEC.xyz *= show;

    ///////////////////////////////////////////////////////////////////////////

#if defined(EYE_DISTANCE_SCALING) || defined(EYE_DISTANCE_TRANSLUCENCY) || defined(EYE_DISTANCE_PIXEL_OFFSET) || defined(DISTANCE_DISPLAY_CONDITION) || defined(DISABLE_DEPTH_DISTANCE)
    float lengthSq;
    if (czm_sceneMode == czm_sceneMode2D)
    {
        // 2D camera distance is a special case
        // treat all billboards as flattened to the z=0.0 plane
        lengthSq = czm_eyeHeight2D.y;
    }
    else
    {
        lengthSq = dot(positionEC.xyz, positionEC.xyz);
    }
#endif
lengthSq = dot(positionEC.xyz, positionEC.xyz);
#ifdef EYE_DISTANCE_SCALING
    float distanceScale = czm_nearFarScalar(scaleByDistance, lengthSq);
    float smoothScale = smoothstep(u_showRatio + 20.0, u_showRatio, showRatio);

    scale *= distanceScale * smoothScale;
    translate *= distanceScale * smoothScale;
    // push vertex behind near plane for clipping
    if (scale == 0.0)
    {
        positionEC.xyz = vec3(0.0);
    }
#endif

    float translucency = 1.0;
#ifdef EYE_DISTANCE_TRANSLUCENCY
    translucency = czm_nearFarScalar(translucencyByDistance, lengthSq);
    // push vertex behind near plane for clipping
    if (translucency == 0.0)
    {
        positionEC.xyz = vec3(0.0);
    }
#endif

#ifdef EYE_DISTANCE_PIXEL_OFFSET
    float pixelOffsetScale = czm_nearFarScalar(pixelOffsetScaleByDistance, lengthSq);
    pixelOffset *= pixelOffsetScale;
#endif

#ifdef DISTANCE_DISPLAY_CONDITION
    float nearSq = compressedAttribute3.x;
    float farSq = compressedAttribute3.y;
    if (lengthSq < nearSq || lengthSq > farSq)
    {
        positionEC.xyz = vec3(0.0);
    }
#endif

    mat2 rotationMatrix;
    float mpp;

#ifdef DISABLE_DEPTH_DISTANCE
    float disableDepthTestDistance = compressedAttribute3.z;
#endif

#ifdef VERTEX_DEPTH_CHECK
if (lengthSq < disableDepthTestDistance) {
    float depthsilon = 10.0;

    vec2 labelTranslate = textureCoordinateBoundsOrLabelTranslate.xy;
    vec4 pEC1 = addScreenSpaceOffset(positionEC, dimensions, scale, vec2(0.0), origin, labelTranslate, pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);
    float globeDepth1 = getGlobeDepth(pEC1);

    if (globeDepth1 != 0.0 && pEC1.z + depthsilon < globeDepth1)
    {
        vec4 pEC2 = addScreenSpaceOffset(positionEC, dimensions, scale, vec2(0.0, 1.0), origin, labelTranslate, pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);
        float globeDepth2 = getGlobeDepth(pEC2);

        if (globeDepth2 != 0.0 && pEC2.z + depthsilon < globeDepth2)
        {
            vec4 pEC3 = addScreenSpaceOffset(positionEC, dimensions, scale, vec2(1.0), origin, labelTranslate, pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);
            float globeDepth3 = getGlobeDepth(pEC3);
            if (globeDepth3 != 0.0 && pEC3.z + depthsilon < globeDepth3)
            {
                positionEC.xyz = vec3(0.0);
            }
        }
    }
}
#endif
    positionEC = addScreenSpaceOffset(positionEC, imageSize, scale, direction, origin, translate, pixelOffset, alignedAxis, validAlignedAxis, rotation, sizeInMeters, rotationMatrix, mpp);
    gl_Position = czm_projection * positionEC;
    v_textureCoordinates = textureCoordinates;

#ifdef LOG_DEPTH
    czm_vertexLogDepth();
#endif

#ifdef DISABLE_DEPTH_DISTANCE
    if (disableDepthTestDistance == 0.0 && czm_minimumDisableDepthTestDistance != 0.0)
    {
        disableDepthTestDistance = czm_minimumDisableDepthTestDistance;
    }

    if (disableDepthTestDistance != 0.0)
    {
        // Don't try to "multiply both sides" by w.  Greater/less-than comparisons won't work for negative values of w.
        float zclip = gl_Position.z / gl_Position.w;
        bool clipped = (zclip < -1.0 || zclip > 1.0);
        if (!clipped && (disableDepthTestDistance < 0.0 || (lengthSq > 0.0 && lengthSq < disableDepthTestDistance)))
        {
            // Position z on the near plane.
            gl_Position.z = -gl_Position.w;
#ifdef LOG_DEPTH
            czm_vertexLogDepth(vec4(czm_currentFrustum.x));
#endif
        }
    }
#endif

#ifdef FRAGMENT_DEPTH_CHECK
    if (sizeInMeters) {
        translate /= mpp;
        dimensions /= mpp;
        imageSize /= mpp;
    }

#if defined(ROTATION) || defined(ALIGNED_AXIS)
    v_rotationMatrix = rotationMatrix;
#else
    v_rotationMatrix = mat2(1.0, 0.0, 0.0, 1.0);
#endif

    float enableDepthCheck = 0.0;
    if (lengthSq < disableDepthTestDistance)
    {
        enableDepthCheck = 1.0;
    }

    float dw = floor(clamp(dimensions.x, 0.0, SHIFT_LEFT12));
    float dh = floor(clamp(dimensions.y, 0.0, SHIFT_LEFT12));

    float iw = floor(clamp(imageSize.x, 0.0, SHIFT_LEFT12));
    float ih = floor(clamp(imageSize.y, 0.0, SHIFT_LEFT12));

    v_compressed.x = eyeDepth;
    v_compressed.y = applyTranslate * SHIFT_LEFT1 + enableDepthCheck;
    v_compressed.z = dw * SHIFT_LEFT12 + dh;
    v_compressed.w = iw * SHIFT_LEFT12 + ih;
    v_originTextureCoordinateAndTranslate.xy = depthOrigin;
    v_originTextureCoordinateAndTranslate.zw = translate;
    v_textureCoordinateBounds = textureCoordinateBoundsOrLabelTranslate;

#endif

#ifdef SDF
    vec4 outlineColor;
    float outlineWidth;

    temp = sdf.x;
    temp = temp * SHIFT_RIGHT8;
    outlineColor.b = (temp - floor(temp)) * SHIFT_LEFT8;
    temp = floor(temp) * SHIFT_RIGHT8;
    outlineColor.g = (temp - floor(temp)) * SHIFT_LEFT8;
    outlineColor.r = floor(temp);

    temp = sdf.y;
    temp = temp * SHIFT_RIGHT8;
    float temp3 = (temp - floor(temp)) * SHIFT_LEFT8;
    temp = floor(temp) * SHIFT_RIGHT8;
    outlineWidth = (temp - floor(temp)) * SHIFT_LEFT8;
    outlineColor.a = floor(temp);
    outlineColor /= 255.0;

    v_outlineWidth = outlineWidth / 255.0;
    v_outlineColor = outlineColor;
#endif

    v_pickColor = pickColor;

    v_color = color;
    v_color.a *= translucency;

}
`,
    Ln = `#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform sampler2D u_atlas;

#ifdef VECTOR_TILE
uniform vec4 u_highlightColor;
#endif

varying vec2 v_textureCoordinates;
varying vec4 v_pickColor;
varying vec4 v_color;

#ifdef SDF
varying vec4 v_outlineColor;
varying float v_outlineWidth;
#endif

#ifdef FRAGMENT_DEPTH_CHECK
varying vec4 v_textureCoordinateBounds;                  // the min and max x and y values for the texture coordinates
varying vec4 v_originTextureCoordinateAndTranslate;      // texture coordinate at the origin, billboard translate (used for label glyphs)
varying vec4 v_compressed;                               // x: eyeDepth, y: applyTranslate & enableDepthCheck, z: dimensions, w: imageSize
varying mat2 v_rotationMatrix;

const float SHIFT_LEFT12 = 4096.0;
const float SHIFT_LEFT1 = 2.0;

const float SHIFT_RIGHT12 = 1.0 / 4096.0;
const float SHIFT_RIGHT1 = 1.0 / 2.0;

float getGlobeDepth(vec2 adjustedST, vec2 depthLookupST, bool applyTranslate, vec2 dimensions, vec2 imageSize)
{
    vec2 lookupVector = imageSize * (depthLookupST - adjustedST);
    lookupVector = v_rotationMatrix * lookupVector;
    vec2 labelOffset = (dimensions - imageSize) * (depthLookupST - vec2(0.0, v_originTextureCoordinateAndTranslate.y)); // aligns label glyph with bounding rectangle.  Will be zero for billboards because dimensions and imageSize will be equal

    vec2 translation = v_originTextureCoordinateAndTranslate.zw;

    if (applyTranslate)
    {
        // this is only needed for labels where the horizontal origin is not LEFT
        // it moves the label back to where the "origin" should be since all label glyphs are set to HorizontalOrigin.LEFT
        translation += (dimensions * v_originTextureCoordinateAndTranslate.xy * vec2(1.0, 0.0));
    }

    vec2 st = ((lookupVector - translation + labelOffset) + gl_FragCoord.xy) / czm_viewport.zw;
    float logDepthOrDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, st));

    if (logDepthOrDepth == 0.0)
    {
        return 0.0; // not on the globe
    }

    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, logDepthOrDepth);
    return eyeCoordinate.z / eyeCoordinate.w;
}
#endif


#ifdef SDF

// Get the distance from the edge of a glyph at a given position sampling an SDF texture.
float getDistance(vec2 position)
{
    return texture2D(u_atlas, position).r;
}

// Samples the sdf texture at the given position and produces a color based on the fill color and the outline.
vec4 getSDFColor(vec2 position, float outlineWidth, vec4 outlineColor, float smoothing)
{
    float distance = getDistance(position);

    if (outlineWidth > 0.0)
    {
        // Don't get the outline edge exceed the SDF_EDGE
        float outlineEdge = clamp(SDF_EDGE - outlineWidth, 0.0, SDF_EDGE);
        float outlineFactor = smoothstep(SDF_EDGE - smoothing, SDF_EDGE + smoothing, distance);
        vec4 sdfColor = mix(outlineColor, v_color, outlineFactor);
        float alpha = smoothstep(outlineEdge - smoothing, outlineEdge + smoothing, distance);
        return vec4(sdfColor.rgb, sdfColor.a * alpha);
    }
    else
    {
        float alpha = smoothstep(SDF_EDGE - smoothing, SDF_EDGE + smoothing, distance);
        return vec4(v_color.rgb, v_color.a * alpha);
    }
}
#endif

void main()
{
    vec4 color = texture2D(u_atlas, v_textureCoordinates);

#ifdef SDF
    float outlineWidth = v_outlineWidth;
    vec4 outlineColor = v_outlineColor;

    // Get the current distance
    float distance = getDistance(v_textureCoordinates);

#ifdef GL_OES_standard_derivatives
    float smoothing = fwidth(distance);
    // Get an offset that is approximately half the distance to the neighbor pixels
    // 0.354 is approximately half of 1/sqrt(2)
    vec2 sampleOffset = 0.354 * vec2(dFdx(v_textureCoordinates) + dFdy(v_textureCoordinates));

    // Sample the center point
    vec4 center = getSDFColor(v_textureCoordinates, outlineWidth, outlineColor, smoothing);

    // Sample the 4 neighbors
    vec4 color1 = getSDFColor(v_textureCoordinates + vec2(sampleOffset.x, sampleOffset.y), outlineWidth, outlineColor, smoothing);
    vec4 color2 = getSDFColor(v_textureCoordinates + vec2(-sampleOffset.x, sampleOffset.y), outlineWidth, outlineColor, smoothing);
    vec4 color3 = getSDFColor(v_textureCoordinates + vec2(-sampleOffset.x, -sampleOffset.y), outlineWidth, outlineColor, smoothing);
    vec4 color4 = getSDFColor(v_textureCoordinates + vec2(sampleOffset.x, -sampleOffset.y), outlineWidth, outlineColor, smoothing);

    // Equally weight the center sample and the 4 neighboring samples
    color = (center + color1 + color2 + color3 + color4)/5.0;
#else
    // Just do a single sample
    float smoothing = 1.0/32.0;
    color = getSDFColor(v_textureCoordinates, outlineWidth, outlineColor, smoothing);
#endif

    color = czm_gammaCorrect(color);
#else
    color = czm_gammaCorrect(color);
    color *= czm_gammaCorrect(v_color);
#endif

// Fully transparent parts of the billboard are not pickable.
#if !defined(OPAQUE) && !defined(TRANSLUCENT)
    if (color.a < 0.005)   // matches 0/255 and 1/255
    {
        discard;
    }
#else
// The billboard is rendered twice. The opaque pass discards translucent fragments
// and the translucent pass discards opaque fragments.
#ifdef OPAQUE
    if (color.a < 0.995)   // matches < 254/255
    {
        discard;
    }
#else
    if (color.a >= 0.995)  // matches 254/255 and 255/255
    {
        discard;
    }
#endif
#endif

#ifdef VECTOR_TILE
    color *= u_highlightColor;
#endif
    gl_FragColor = color;

    czm_writeLogDepth();

#ifdef FRAGMENT_DEPTH_CHECK
    float temp = v_compressed.y;

    temp = temp * SHIFT_RIGHT1;

    float temp2 = (temp - floor(temp)) * SHIFT_LEFT1;
    bool enableDepthTest = temp2 != 0.0;
    bool applyTranslate = floor(temp) != 0.0;

    if (enableDepthTest) {
        temp = v_compressed.z;
        temp = temp * SHIFT_RIGHT12;

        vec2 dimensions;
        dimensions.y = (temp - floor(temp)) * SHIFT_LEFT12;
        dimensions.x = floor(temp);

        temp = v_compressed.w;
        temp = temp * SHIFT_RIGHT12;

        vec2 imageSize;
        imageSize.y = (temp - floor(temp)) * SHIFT_LEFT12;
        imageSize.x = floor(temp);

        vec2 adjustedST = v_textureCoordinates - v_textureCoordinateBounds.xy;
        adjustedST = adjustedST / vec2(v_textureCoordinateBounds.z - v_textureCoordinateBounds.x, v_textureCoordinateBounds.w - v_textureCoordinateBounds.y);

        float epsilonEyeDepth = v_compressed.x + czm_epsilon1;
        float globeDepth1 = getGlobeDepth(adjustedST, v_originTextureCoordinateAndTranslate.xy, applyTranslate, dimensions, imageSize);

        // negative values go into the screen
        if (globeDepth1 != 0.0 && globeDepth1 > epsilonEyeDepth)
        {
            float globeDepth2 = getGlobeDepth(adjustedST, vec2(0.0, 1.0), applyTranslate, dimensions, imageSize); // top left corner
            if (globeDepth2 != 0.0 && globeDepth2 > epsilonEyeDepth)
            {
                float globeDepth3 = getGlobeDepth(adjustedST, vec2(1.0, 1.0), applyTranslate, dimensions, imageSize); // top right corner
                if (globeDepth3 != 0.0 && globeDepth3 > epsilonEyeDepth)
                {
                    discard;
                }
            }
        }
    }
#endif

}
`;
var bn = b.SHOW_INDEX,
    Ie = b.POSITION_INDEX,
    ui = b.PIXEL_OFFSET_INDEX,
    pi = b.EYE_OFFSET_INDEX,
    kn = b.HORIZONTAL_ORIGIN_INDEX,
    Bn = b.VERTICAL_ORIGIN_INDEX,
    Un = b.SCALE_INDEX,
    Se = b.IMAGE_INDEX_INDEX,
    mi = b.COLOR_INDEX,
    Vn = b.ROTATION_INDEX,
    Gn = b.ALIGNED_AXIS_INDEX,
    _i = b.SCALE_BY_DISTANCE_INDEX,
    vi = b.TRANSLUCENCY_BY_DISTANCE_INDEX,
    gi = b.PIXEL_OFFSET_SCALE_BY_DISTANCE_INDEX,
    Ti = b.DISTANCE_DISPLAY_CONDITION,
    Wn = b.DISABLE_DEPTH_DISTANCE,
    Zn = b.TEXTURE_COORDINATE_BOUNDS,
    Ei = b.SDF_INDEX,
    yt = b.NUMBER_OF_PROPERTIES,
    M, qn = {
        positionHighAndScale: 0,
        positionLowAndRotation: 1,
        compressedAttribute0: 2,
        compressedAttribute1: 3,
        compressedAttribute2: 4,
        eyeOffset: 5,
        scaleByDistance: 6,
        pixelOffsetScaleByDistance: 7,
        compressedAttribute3: 8,
        textureCoordinateBoundsOrLabelTranslate: 9,
        a_batchId: 10,
        sdf: 11
    },
    Xn = {
        direction: 0,
        positionHighAndScale: 1,
        positionLowAndRotation: 2,
        compressedAttribute0: 3,
        compressedAttribute1: 4,
        compressedAttribute2: 5,
        eyeOffset: 6,
        scaleByDistance: 7,
        pixelOffsetScaleByDistance: 8,
        compressedAttribute3: 9,
        textureCoordinateBoundsOrLabelTranslate: 10,
        a_batchId: 11,
        sdf: 12
    };

function j(e) {
    e = W(e, W.EMPTY_OBJECT), this._scene = e.scene, this._batchTable = e.batchTable, this._textureAtlas = void 0, this._textureAtlasGUID = void 0, this._destroyTextureAtlas = !0, this._sp = void 0, this._spTranslucent = void 0, this._rsOpaque = void 0, this._rsTranslucent = void 0, this._vaf = void 0, this._billboards = [], this._billboardsToUpdate = [], this._billboardsToUpdateIndex = 0, this._billboardsRemoved = !1, this._createVertexArray = !1, this._shaderRotation = !1, this._compiledShaderRotation = !1, this._shaderAlignedAxis = !1, this._compiledShaderAlignedAxis = !1, this._shaderScaleByDistance = !1, this._compiledShaderScaleByDistance = !1, this._shaderTranslucencyByDistance = !1, this._compiledShaderTranslucencyByDistance = !1, this._shaderPixelOffsetScaleByDistance = !1, this._compiledShaderPixelOffsetScaleByDistance = !1, this._shaderDistanceDisplayCondition = !1, this._compiledShaderDistanceDisplayCondition = !1, this._shaderDisableDepthDistance = !1, this._compiledShaderDisableDepthDistance = !1, this._shaderClampToGround = !1, this._compiledShaderClampToGround = !1, this._propertiesChanged = new Uint32Array(yt), this._maxSize = 0, this._maxEyeOffset = 0, this._maxScale = 1, this._maxPixelOffset = 0, this._allHorizontalCenter = !0, this._allVerticalCenter = !0, this._allSizedInMeters = !0, this._baseVolume = new se, this._baseVolumeWC = new se, this._baseVolume2D = new se, this._boundingVolume = new se, this._boundingVolumeDirty = !1, this._colorCommands = [], this.showRatio = 0, this.modelMatrix = O.clone(W(e.modelMatrix, O.IDENTITY)), this._modelMatrix = O.clone(O.IDENTITY), this.debugShowBoundingVolume = W(e.debugShowBoundingVolume, !1), this.debugShowTextureAtlas = W(e.debugShowTextureAtlas, !1), this.blendOption = W(e.blendOption, Y.OPAQUE_AND_TRANSLUCENT), this._blendOption = void 0, this._mode = F.SCENE3D, this._buffersUsage = [z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW, z.STATIC_DRAW], this._highlightColor = k.clone(k.WHITE);
    var n = this;
    this._uniforms = {
        u_atlas: function() {
            return n._textureAtlas.texture
        },
        u_highlightColor: function() {
            return n._highlightColor
        },
        u_showRatio: function() {
            return n.showRatio * 1e3
        }
    };
    var a = this._scene;
    _(a) && _(a.terrainProviderChanged) && (this._removeCallbackFunc = a.terrainProviderChanged.addEventListener(function() {
        for (var o = this._billboards, t = o.length, i = 0; i < t; ++i) o[i]._updateClamping()
    }, this))
}
Object.defineProperties(j.prototype, {
    length: {
        get: function() {
            return It(this), this._billboards.length
        }
    },
    textureAtlas: {
        get: function() {
            return this._textureAtlas
        },
        set: function(e) {
            this._textureAtlas !== e && (this._textureAtlas = this._destroyTextureAtlas && this._textureAtlas && this._textureAtlas.destroy(), this._textureAtlas = e, this._createVertexArray = !0)
        }
    },
    destroyTextureAtlas: {
        get: function() {
            return this._destroyTextureAtlas
        },
        set: function(e) {
            this._destroyTextureAtlas = e
        }
    }
});

function Ci(e) {
    for (var n = e.length, a = 0; a < n; ++a) e[a] && e[a]._destroy()
}
j.prototype.add = function(e) {
    var n = new b(e, this);
    return n._showRatio = e.showRatio, n._index = this._billboards.length, this._billboards.push(n), this._createVertexArray = !0, n
};
j.prototype.remove = function(e) {
    return this.contains(e) ? (this._billboards[e._index] = null, this._billboardsRemoved = !0, this._createVertexArray = !0, e._destroy(), !0) : !1
};
j.prototype.removeAll = function() {
    Ci(this._billboards), this._billboards = [], this._billboardsToUpdate = [], this._billboardsToUpdateIndex = 0, this._billboardsRemoved = !1, this._createVertexArray = !0
};

function It(e) {
    if (e._billboardsRemoved) {
        e._billboardsRemoved = !1;
        for (var n = [], a = e._billboards, o = a.length, t = 0, i = 0; t < o; ++t) {
            var r = a[t];
            r && (r._index = i++, n.push(r))
        }
        e._billboards = n
    }
}
j.prototype._updateBillboard = function(e, n) {
    e._dirty || (this._billboardsToUpdate[this._billboardsToUpdateIndex++] = e), ++this._propertiesChanged[n]
};
j.prototype.contains = function(e) {
    return _(e) && e._billboardCollection === this
};
j.prototype.get = function(e) {
    return It(this), this._billboards[e]
};
var rt;

function Yn(e) {
    var n = 16384,
        a = e.cache.billboardCollection_indexBufferBatched;
    if (_(a)) return a;
    for (var o = n * 6 - 6, t = new Uint16Array(o), i = 0, r = 0; i < o; i += 6, r += 4) t[i] = r, t[i + 1] = r + 1, t[i + 2] = r + 2, t[i + 3] = r + 0, t[i + 4] = r + 2, t[i + 5] = r + 3;
    return a = Tt.createIndexBuffer({
        context: e,
        typedArray: t,
        usage: z.STATIC_DRAW,
        indexDatatype: Yt.UNSIGNED_SHORT
    }), a.vertexArrayDestroyable = !1, e.cache.billboardCollection_indexBufferBatched = a, a
}

function Kn(e) {
    var n = e.cache.billboardCollection_indexBufferInstanced;
    return _(n) || (n = Tt.createIndexBuffer({
        context: e,
        typedArray: new Uint16Array([0, 1, 2, 0, 2, 3]),
        usage: z.STATIC_DRAW,
        indexDatatype: Yt.UNSIGNED_SHORT
    }), n.vertexArrayDestroyable = !1, e.cache.billboardCollection_indexBufferInstanced = n), n
}

function Qn(e) {
    var n = e.cache.billboardCollection_vertexBufferInstanced;
    return _(n) || (n = Tt.createVertexBuffer({
        context: e,
        typedArray: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        usage: z.STATIC_DRAW
    }), n.vertexArrayDestroyable = !1, e.cache.billboardCollection_vertexBufferInstanced = n), n
}
j.prototype.computeNewBuffersUsage = function() {
    for (var e = this._buffersUsage, n = !1, a = this._propertiesChanged, o = 0; o < yt; ++o) {
        var t = a[o] === 0 ? z.STATIC_DRAW : z.STREAM_DRAW;
        n = n || e[o] !== t, e[o] = t
    }
    return n
};

function Jn(e, n, a, o, t, i) {
    var r = [{
        index: M.positionHighAndScale,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[Ie]
    }, {
        index: M.positionLowAndRotation,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[Ie]
    }, {
        index: M.compressedAttribute0,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[ui]
    }, {
        index: M.compressedAttribute1,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[vi]
    }, {
        index: M.compressedAttribute2,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[mi]
    }, {
        index: M.eyeOffset,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[pi]
    }, {
        index: M.scaleByDistance,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[_i]
    }, {
        index: M.pixelOffsetScaleByDistance,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[gi]
    }, {
        index: M.compressedAttribute3,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[Ti]
    }, {
        index: M.textureCoordinateBoundsOrLabelTranslate,
        componentsPerAttribute: 4,
        componentDatatype: X.FLOAT,
        usage: a[Zn]
    }];
    o && r.push({
        index: M.direction,
        componentsPerAttribute: 2,
        componentDatatype: X.FLOAT,
        vertexBuffer: Qn(e)
    }), _(t) && r.push({
        index: M.a_batchId,
        componentsPerAttribute: 1,
        componentDatatyps: X.FLOAT,
        bufferUsage: z.STATIC_DRAW
    }), i && r.push({
        index: M.sdf,
        componentsPerAttribute: 2,
        componentDatatype: X.FLOAT,
        usage: a[Ei]
    });
    var d = o ? n : 4 * n;
    return new Wi(e, r, d, o)
}
var ot = new Zt;

function Si(e, n, a, o, t) {
    var i, r = o[M.positionHighAndScale],
        d = o[M.positionLowAndRotation],
        c = t._getActualPosition();
    e._mode === F.SCENE3D && (se.expand(e._baseVolume, c, e._baseVolume), e._boundingVolumeDirty = !0), Zt.fromCartesian(c, ot);
    var h = t.scale;
    e._maxScale = Math.max(e._maxScale, h);
    var l = ot.high,
        f = ot.low,
        u = Math.floor(t._showRatio * 1e3);
    e._instanced ? (i = t._index, r(i, l.x, l.y, l.z, h), d(i, f.x, f.y, f.z, u)) : (i = t._index * 4, r(i + 0, l.x, l.y, l.z, h), r(i + 1, l.x, l.y, l.z, h), r(i + 2, l.x, l.y, l.z, h), r(i + 3, l.x, l.y, l.z, h), d(i + 0, f.x, f.y, f.z, u), d(i + 1, f.x, f.y, f.z, u), d(i + 2, f.x, f.y, f.z, u), d(i + 3, f.x, f.y, f.z, u))
}
var $ = new C,
    J = 32768,
    _e = 65536,
    dt = 4096,
    re = 256,
    $n = 128,
    jn = 32,
    es = 8,
    Di = 4,
    ts = 1 / 256,
    xi = 0,
    yi = 2,
    Ii = 3,
    Ai = 1;

function Ri(e, n, a, o, t) {
    var i, r = o[M.compressedAttribute0],
        d = t.pixelOffset,
        c = d.x,
        h = d.y,
        l = t._translate,
        f = l.x,
        u = l.y;
    e._maxPixelOffset = Math.max(e._maxPixelOffset, Math.abs(c + f), Math.abs(-h + u));
    var m = t.horizontalOrigin,
        p = t._verticalOrigin,
        g = t.show && t.clusterShow;
    t.color.alpha === 0 && (g = !1), p === Qe.BASELINE && (p = Qe.BOTTOM), e._allHorizontalCenter = e._allHorizontalCenter && m === Zi.CENTER, e._allVerticalCenter = e._allVerticalCenter && p === Qe.CENTER;
    var v = 0,
        T = 0,
        E = 0,
        S = 0,
        R = t._imageIndex;
    if (R !== -1) {
        var x = a[R];
        v = x.x, T = x.y, E = x.width, S = x.height
    }
    var y = v + E,
        P = T + S,
        N = Math.floor(I.clamp(c, -J, J) + J) * $n;
    N += (m + 1) * jn, N += (p + 1) * es, N += (g ? 1 : 0) * Di;
    var H = Math.floor(I.clamp(h, -J, J) + J) * re,
        L = Math.floor(I.clamp(f, -J, J) + J) * re,
        U = (I.clamp(u, -J, J) + J) * ts,
        q = Math.floor(U),
        V = Math.floor((U - q) * re);
    H += q, L += V, $.x = v, $.y = T;
    var B = me.compressTextureCoordinates($);
    $.x = y;
    var A = me.compressTextureCoordinates($);
    $.y = P;
    var w = me.compressTextureCoordinates($);
    $.x = v;
    var D = me.compressTextureCoordinates($);
    e._instanced ? (i = t._index, r(i, N, H, L, B)) : (i = t._index * 4, r(i + 0, N + xi, H, L, B), r(i + 1, N + yi, H, L, A), r(i + 2, N + Ii, H, L, w), r(i + 3, N + Ai, H, L, D))
}

function Pi(e, n, a, o, t) {
    var i, r = o[M.compressedAttribute1],
        d = t.alignedAxis;
    s.equals(d, s.ZERO) || (e._shaderAlignedAxis = !0);
    var c = 0,
        h = 1,
        l = 1,
        f = 1,
        u = t.translucencyByDistance;
    _(u) && (c = u.near, h = u.nearValue, l = u.far, f = u.farValue, (h !== 1 || f !== 1) && (e._shaderTranslucencyByDistance = !0));
    var m = 0,
        p = t._imageIndex;
    if (p !== -1) {
        var g = a[p];
        m = g.width
    }
    var v = e._textureAtlas.texture.width,
        T = Math.round(W(t.width, v * m));
    e._maxSize = Math.max(e._maxSize, T);
    var E = I.clamp(T, 0, _e),
        S = 0;
    Math.abs(s.magnitudeSquared(d) - 1) < I.EPSILON6 && (S = me.octEncodeFloat(d)), h = I.clamp(h, 0, 1), h = h === 1 ? 255 : h * 255 | 0, E = E * re + h, f = I.clamp(f, 0, 1), f = f === 1 ? 255 : f * 255 | 0, S = S * re + f, e._instanced ? (i = t._index, r(i, E, S, c, l)) : (i = t._index * 4, r(i + 0, E, S, c, l), r(i + 1, E, S, c, l), r(i + 2, E, S, c, l), r(i + 3, E, S, c, l))
}

function _t(e, n, a, o, t) {
    var i, r = o[M.compressedAttribute2],
        d = t.color,
        c = _(e._batchTable) ? k.WHITE : t.getPickId(n).color,
        h = t.sizeInMeters ? 1 : 0,
        l = Math.abs(s.magnitudeSquared(t.alignedAxis) - 1) < I.EPSILON6 ? 1 : 0;
    e._allSizedInMeters = e._allSizedInMeters && h === 1;
    var f = 0,
        u = t._imageIndex;
    if (u !== -1) {
        var m = a[u];
        f = m.height
    }
    var p = e._textureAtlas.texture.dimensions,
        g = Math.round(W(t.height, p.y * f));
    e._maxSize = Math.max(e._maxSize, g);
    var v = W(t._labelHorizontalOrigin, -2);
    v += 2;
    var T = g * Di + v,
        E = k.floatToByte(d.red),
        S = k.floatToByte(d.green),
        R = k.floatToByte(d.blue),
        x = E * _e + S * re + R;
    E = k.floatToByte(c.red), S = k.floatToByte(c.green), R = k.floatToByte(c.blue);
    var y = E * _e + S * re + R,
        P = k.floatToByte(d.alpha) * _e + k.floatToByte(c.alpha) * re;
    P += h * 2 + l, e._instanced ? (i = t._index, r(i, x, y, P, T)) : (i = t._index * 4, r(i + 0, x, y, P, T), r(i + 1, x, y, P, T), r(i + 2, x, y, P, T), r(i + 3, x, y, P, T))
}

function vt(e, n, a, o, t) {
    var i, r = o[M.eyeOffset],
        d = t.eyeOffset,
        c = d.z;
    if (t._heightReference !== Et.NONE && (c *= 1.005), e._maxEyeOffset = Math.max(e._maxEyeOffset, Math.abs(d.x), Math.abs(d.y), Math.abs(c)), e._instanced) {
        var h = 0,
            l = 0,
            f = t._imageIndex;
        if (f !== -1) {
            var u = a[f];
            h = u.width, l = u.height
        }
        $.x = h, $.y = l;
        var m = me.compressTextureCoordinates($);
        i = t._index, r(i, d.x, d.y, c, m)
    } else i = t._index * 4, r(i + 0, d.x, d.y, c, 0), r(i + 1, d.x, d.y, c, 0), r(i + 2, d.x, d.y, c, 0), r(i + 3, d.x, d.y, c, 0)
}

function wi(e, n, a, o, t) {
    var i, r = o[M.scaleByDistance],
        d = 0,
        c = 1,
        h = 1,
        l = 1,
        f = t.scaleByDistance;
    _(f) && (d = f.near, c = f.nearValue, h = f.far, l = f.farValue, (c !== 1 || l !== 1) && (e._shaderScaleByDistance = !0)), e._instanced ? (i = t._index, r(i, d, c, h, l)) : (i = t._index * 4, r(i + 0, d, c, h, l), r(i + 1, d, c, h, l), r(i + 2, d, c, h, l), r(i + 3, d, c, h, l))
}

function Mi(e, n, a, o, t) {
    var i, r = o[M.pixelOffsetScaleByDistance],
        d = 0,
        c = 1,
        h = 1,
        l = 1,
        f = t.pixelOffsetScaleByDistance;
    _(f) && (d = f.near, c = f.nearValue, h = f.far, l = f.farValue, (c !== 1 || l !== 1) && (e._shaderPixelOffsetScaleByDistance = !0)), e._instanced ? (i = t._index, r(i, d, c, h, l)) : (i = t._index * 4, r(i + 0, d, c, h, l), r(i + 1, d, c, h, l), r(i + 2, d, c, h, l), r(i + 3, d, c, h, l))
}

function Oi(e, n, a, o, t) {
    var i, r = o[M.compressedAttribute3],
        d = 0,
        c = Number.MAX_VALUE,
        h = t.distanceDisplayCondition;
    _(h) && (d = h.near, c = h.far, d *= d, c *= c, e._shaderDistanceDisplayCondition = !0);
    var l = t.disableDepthTestDistance,
        f = t.heightReference === Et.CLAMP_TO_GROUND && e._scene.context.depthTexture;
    _(l) || (l = f ? 5e3 : 0), l *= l, (f || l > 0) && (e._shaderDisableDepthDistance = !0, l === Number.POSITIVE_INFINITY && (l = -1));
    var u, m;
    if (_(t._labelDimensions)) m = t._labelDimensions.x, u = t._labelDimensions.y;
    else {
        var p = 0,
            g = 0,
            v = t._imageIndex;
        if (v !== -1) {
            var T = a[v];
            p = T.height, g = T.width
        }
        u = Math.round(W(t.height, e._textureAtlas.texture.dimensions.y * p));
        var E = e._textureAtlas.texture.width;
        m = Math.round(W(t.width, E * g))
    }
    var S = Math.floor(I.clamp(m, 0, dt)),
        R = Math.floor(I.clamp(u, 0, dt)),
        x = S * dt + R;
    e._instanced ? (i = t._index, r(i, d, c, l, x)) : (i = t._index * 4, r(i + 0, d, c, l, x), r(i + 1, d, c, l, x), r(i + 2, d, c, l, x), r(i + 3, d, c, l, x))
}

function Fi(e, n, a, o, t) {
    t.heightReference === Et.CLAMP_TO_GROUND && (e._shaderClampToGround = e._scene.context.depthTexture);
    var i, r = o[M.textureCoordinateBoundsOrLabelTranslate];
    if (qt.maximumVertexTextureImageUnits > 0) {
        var d = 0,
            c = 0;
        _(t._labelTranslate) && (d = t._labelTranslate.x, c = t._labelTranslate.y), e._instanced ? (i = t._index, r(i, d, c, 0, 0)) : (i = t._index * 4, r(i + 0, d, c, 0, 0), r(i + 1, d, c, 0, 0), r(i + 2, d, c, 0, 0), r(i + 3, d, c, 0, 0));
        return
    }
    var h = 0,
        l = 0,
        f = 0,
        u = 0,
        m = t._imageIndex;
    if (m !== -1) {
        var p = a[m];
        h = p.x, l = p.y, f = p.width, u = p.height
    }
    var g = h + f,
        v = l + u;
    e._instanced ? (i = t._index, r(i, h, l, g, v)) : (i = t._index * 4, r(i + 0, h, l, g, v), r(i + 1, h, l, g, v), r(i + 2, h, l, g, v), r(i + 3, h, l, g, v))
}

function is(e, n, a, o, t) {
    if (!!_(e._batchTable)) {
        var i = o[M.a_batchId],
            r = t._batchIndex,
            d;
        e._instanced ? (d = t._index, i(d, r)) : (d = t._index * 4, i(d + 0, r), i(d + 1, r), i(d + 2, r), i(d + 3, r))
    }
}

function Ni(e, n, a, o, t) {
    if (!!e._sdf) {
        var i, r = o[M.sdf],
            d = t.outlineColor,
            c = t.outlineWidth,
            h = k.floatToByte(d.red),
            l = k.floatToByte(d.green),
            f = k.floatToByte(d.blue),
            u = h * _e + l * re + f,
            m = c / Xt.RADIUS,
            p = k.floatToByte(d.alpha) * _e + k.floatToByte(m) * re;
        e._instanced ? (i = t._index, r(i, u, p)) : (i = t._index * 4, r(i + 0, u + xi, p), r(i + 1, u + yi, p), r(i + 2, u + Ii, p), r(i + 3, u + Ai, p))
    }
}

function as(e, n, a, o, t) {
    Si(e, n, a, o, t), Ri(e, n, a, o, t), Pi(e, n, a, o, t), _t(e, n, a, o, t), vt(e, n, a, o, t), wi(e, n, a, o, t), Mi(e, n, a, o, t), Oi(e, n, a, o, t), Fi(e, n, a, o, t), is(e, n, a, o, t), Ni(e, n, a, o, t)
}

function ct(e, n, a, o, t, i) {
    var r;
    o.mode === F.SCENE3D ? (r = e._baseVolume, e._boundingVolumeDirty = !0) : r = e._baseVolume2D;
    for (var d = [], c = 0; c < a; ++c) {
        var h = n[c],
            l = h.position,
            f = b._computeActualPosition(h, l, o, t);
        _(f) && (h._setActualPosition(f), i ? d.push(f) : se.expand(r, f, r))
    }
    i && se.fromPoints(d, r)
}

function ns(e, n) {
    var a = n.mode,
        o = e._billboards,
        t = e._billboardsToUpdate,
        i = e._modelMatrix;
    (e._createVertexArray || e._mode !== a || a !== F.SCENE3D) && !O.equals(i, e.modelMatrix) ? (e._mode = a, O.clone(e.modelMatrix, i), e._createVertexArray = !0, (a === F.SCENE3D || a === F.SCENE2D || a === F.COLUMBUS_VIEW) && ct(e, o, o.length, n, i, !0)) : a === F.MORPHING ? ct(e, o, o.length, n, i, !0) : (a === F.SCENE2D || a === F.COLUMBUS_VIEW) && ct(e, t, e._billboardsToUpdateIndex, n, i, !1)
}

function ss(e, n, a) {
    var o = 1;
    (!e._allSizedInMeters || e._maxPixelOffset !== 0) && (o = n.camera.getPixelSize(a, n.context.drawingBufferWidth, n.context.drawingBufferHeight));
    var t = o * e._maxScale * e._maxSize * 2;
    e._allHorizontalCenter && e._allVerticalCenter && (t *= .5);
    var i = o * e._maxPixelOffset + e._maxEyeOffset;
    a.radius += t + i
}
var rs = [];
j.prototype.update = function(e) {
    It(this);
    var n = this._billboards,
        a = n.length,
        o = e.context;
    this._instanced = o.instancedArrays, M = this._instanced ? Xn : qn, rt = this._instanced ? Kn : Yn;
    var t = this._textureAtlas;
    if (!_(t)) {
        t = this._textureAtlas = new Ui({
            context: o
        });
        for (var i = 0; i < a; ++i) n[i]._loadImage()
    }
    var r = t.textureCoordinates;
    if (r.length !== 0) {
        ns(this, e), n = this._billboards, a = n.length;
        var d = this._billboardsToUpdate,
            c = this._billboardsToUpdateIndex,
            h = this._propertiesChanged,
            l = t.guid,
            f = this._createVertexArray || this._textureAtlasGUID !== l;
        this._textureAtlasGUID = l;
        var u, m = e.passes,
            p = m.pick;
        if (f || !p && this.computeNewBuffersUsage()) {
            this._createVertexArray = !1;
            for (var g = 0; g < yt; ++g) h[g] = 0;
            if (this._vaf = this._vaf && this._vaf.destroy(), a > 0) {
                this._vaf = Jn(o, a, this._buffersUsage, this._instanced, this._batchTable, this._sdf), u = this._vaf.writers;
                for (var v = 0; v < a; ++v) {
                    var T = this._billboards[v];
                    T._dirty = !1, as(this, o, r, u, T)
                }
                this._vaf.commit(rt(o))
            }
            this._billboardsToUpdateIndex = 0
        } else if (c > 0) {
            var E = rs;
            E.length = 0, (h[Ie] || h[Vn] || h[Un]) && E.push(Si), (h[Se] || h[ui] || h[kn] || h[Bn] || h[bn]) && (E.push(Ri), this._instanced && E.push(vt)), (h[Se] || h[Gn] || h[vi]) && (E.push(Pi), E.push(_t)), (h[Se] || h[mi]) && E.push(_t), h[pi] && E.push(vt), h[_i] && E.push(wi), h[gi] && E.push(Mi), (h[Ti] || h[Wn] || h[Se] || h[Ie]) && E.push(Oi), (h[Se] || h[Ie]) && E.push(Fi), h[Ei] && E.push(Ni);
            var S = E.length;
            if (u = this._vaf.writers, c / a > .1) {
                for (var R = 0; R < c; ++R) {
                    var x = d[R];
                    x._dirty = !1;
                    for (var y = 0; y < S; ++y) E[y](this, o, r, u, x)
                }
                this._vaf.commit(rt(o))
            } else {
                for (var P = 0; P < c; ++P) {
                    var N = d[P];
                    N._dirty = !1;
                    for (var H = 0; H < S; ++H) E[H](this, o, r, u, N);
                    this._instanced ? this._vaf.subCommit(N._index, 1) : this._vaf.subCommit(N._index * 4, 4)
                }
                this._vaf.endSubCommits()
            }
            this._billboardsToUpdateIndex = 0
        }
        if (c > a * 1.5 && (d.length = a), !(!_(this._vaf) || !_(this._vaf.va))) {
            this._boundingVolumeDirty && (this._boundingVolumeDirty = !1, se.transform(this._baseVolume, this.modelMatrix, this._baseVolumeWC));
            var L, U = O.IDENTITY;
            e.mode === F.SCENE3D ? (U = this.modelMatrix, L = se.clone(this._baseVolumeWC, this._boundingVolume)) : L = se.clone(this._baseVolume2D, this._boundingVolume), ss(this, e, L);
            var q = this._blendOption !== this.blendOption;
            if (this._blendOption = this.blendOption, q) {
                this._blendOption === Y.OPAQUE || this._blendOption === Y.OPAQUE_AND_TRANSLUCENT ? this._rsOpaque = Rt.fromCache({
                    depthTest: {
                        enabled: !0,
                        func: xe.LESS
                    },
                    depthMask: !0
                }) : this._rsOpaque = void 0;
                var V = this._blendOption === Y.TRANSLUCENT;
                this._blendOption === Y.TRANSLUCENT || this._blendOption === Y.OPAQUE_AND_TRANSLUCENT ? this._rsTranslucent = Rt.fromCache({
                    depthTest: {
                        enabled: !0,
                        func: V ? xe.LEQUAL : xe.LESS
                    },
                    depthMask: V,
                    blending: Vi.ALPHA_BLEND
                }) : this._rsTranslucent = void 0
            }
            this._shaderDisableDepthDistance = this._shaderDisableDepthDistance || e.minimumDisableDepthTestDistance !== 0;
            var B, A, w, D, ae, oe = qt.maximumVertexTextureImageUnits > 0;
            if (q || this._shaderRotation !== this._compiledShaderRotation || this._shaderAlignedAxis !== this._compiledShaderAlignedAxis || this._shaderScaleByDistance !== this._compiledShaderScaleByDistance || this._shaderTranslucencyByDistance !== this._compiledShaderTranslucencyByDistance || this._shaderPixelOffsetScaleByDistance !== this._compiledShaderPixelOffsetScaleByDistance || this._shaderDistanceDisplayCondition !== this._compiledShaderDistanceDisplayCondition || this._shaderDisableDepthDistance !== this._compiledShaderDisableDepthDistance || this._shaderClampToGround !== this._compiledShaderClampToGround || this._sdf !== this._compiledSDF) {
                B = zn, A = Ln, ae = [], _(this._batchTable) && (ae.push("VECTOR_TILE"), B = this._batchTable.getVertexShaderCallback(!1, "a_batchId", void 0)(B), A = this._batchTable.getFragmentShaderCallback(!1, void 0)(A)), w = new Ee({
                    defines: ae,
                    sources: [B]
                }), this._instanced && w.defines.push("INSTANCED"), this._shaderRotation && w.defines.push("ROTATION"), this._shaderAlignedAxis && w.defines.push("ALIGNED_AXIS"), this._shaderScaleByDistance && w.defines.push("EYE_DISTANCE_SCALING"), this._shaderTranslucencyByDistance && w.defines.push("EYE_DISTANCE_TRANSLUCENCY"), this._shaderPixelOffsetScaleByDistance && w.defines.push("EYE_DISTANCE_PIXEL_OFFSET"), this._shaderDistanceDisplayCondition && w.defines.push("DISTANCE_DISPLAY_CONDITION"), this._shaderDisableDepthDistance && w.defines.push("DISABLE_DEPTH_DISTANCE"), this._shaderClampToGround && (oe ? w.defines.push("VERTEX_DEPTH_CHECK") : w.defines.push("FRAGMENT_DEPTH_CHECK"));
                var ee = 1 - Xt.CUTOFF;
                this._sdf && w.defines.push("SDF");
                var ue = _(this._batchTable) ? "VECTOR_TILE" : "";
                this._blendOption === Y.OPAQUE_AND_TRANSLUCENT && (D = new Ee({
                    defines: ["OPAQUE", ue],
                    sources: [A]
                }), this._shaderClampToGround && (oe ? D.defines.push("VERTEX_DEPTH_CHECK") : D.defines.push("FRAGMENT_DEPTH_CHECK")), this._sdf && (D.defines.push("SDF"), D.defines.push("SDF_EDGE " + ee)), this._sp = we.replaceCache({
                    context: o,
                    shaderProgram: this._sp,
                    vertexShaderSource: w,
                    fragmentShaderSource: D,
                    attributeLocations: M
                }), D = new Ee({
                    defines: ["TRANSLUCENT", ue],
                    sources: [A]
                }), this._shaderClampToGround && (oe ? D.defines.push("VERTEX_DEPTH_CHECK") : D.defines.push("FRAGMENT_DEPTH_CHECK")), this._sdf && (D.defines.push("SDF"), D.defines.push("SDF_EDGE " + ee)), this._spTranslucent = we.replaceCache({
                    context: o,
                    shaderProgram: this._spTranslucent,
                    vertexShaderSource: w,
                    fragmentShaderSource: D,
                    attributeLocations: M
                })), this._blendOption === Y.OPAQUE && (D = new Ee({
                    defines: [ue],
                    sources: [A]
                }), this._shaderClampToGround && (oe ? D.defines.push("VERTEX_DEPTH_CHECK") : D.defines.push("FRAGMENT_DEPTH_CHECK")), this._sdf && (D.defines.push("SDF"), D.defines.push("SDF_EDGE " + ee)), this._sp = we.replaceCache({
                    context: o,
                    shaderProgram: this._sp,
                    vertexShaderSource: w,
                    fragmentShaderSource: D,
                    attributeLocations: M
                })), this._blendOption === Y.TRANSLUCENT && (D = new Ee({
                    defines: [ue],
                    sources: [A]
                }), this._shaderClampToGround && (oe ? D.defines.push("VERTEX_DEPTH_CHECK") : D.defines.push("FRAGMENT_DEPTH_CHECK")), this._sdf && (D.defines.push("SDF"), D.defines.push("SDF_EDGE " + ee)), this._spTranslucent = we.replaceCache({
                    context: o,
                    shaderProgram: this._spTranslucent,
                    vertexShaderSource: w,
                    fragmentShaderSource: D,
                    attributeLocations: M
                })), this._compiledShaderRotation = this._shaderRotation, this._compiledShaderAlignedAxis = this._shaderAlignedAxis, this._compiledShaderScaleByDistance = this._shaderScaleByDistance, this._compiledShaderTranslucencyByDistance = this._shaderTranslucencyByDistance, this._compiledShaderPixelOffsetScaleByDistance = this._shaderPixelOffsetScaleByDistance, this._compiledShaderDistanceDisplayCondition = this._shaderDistanceDisplayCondition, this._compiledShaderDisableDepthDistance = this._shaderDisableDepthDistance, this._compiledShaderClampToGround = this._shaderClampToGround, this._compiledSDF = this._sdf
            }
            var Re = e.commandList;
            if (m.render || m.pick) {
                var Ge = this._colorCommands,
                    zi = this._blendOption === Y.OPAQUE,
                    Pe = this._blendOption === Y.OPAQUE_AND_TRANSLUCENT,
                    We = this._vaf.va,
                    Ze = We.length,
                    qe = this._uniforms,
                    Xe;
                _(this._batchTable) ? (qe = this._batchTable.getUniformMapCallback()(qe), Xe = this._batchTable.getPickId()) : Xe = "v_pickColor", Ge.length = Ze;
                for (var Li = Pe ? Ze * 2 : Ze, fe = 0; fe < Li; ++fe) {
                    var G = Ge[fe];
                    _(G) || (G = Ge[fe] = new Gi);
                    var Ye = zi || Pe && fe % 2 === 0;
                    G.pass = Ye || !Pe ? Pt.OPAQUE : Pt.TRANSLUCENT, G.owner = this;
                    var At = Pe ? Math.floor(fe / 2) : fe;
                    G.boundingVolume = L, G.modelMatrix = U, G.count = We[At].indicesCount, G.shaderProgram = Ye ? this._sp : this._spTranslucent, G.uniformMap = qe, G.vertexArray = We[At].va, G.renderState = Ye ? this._rsOpaque : this._rsTranslucent, G.debugShowBoundingVolume = this.debugShowBoundingVolume, G.pickId = Xe, this._instanced && (G.count = 6, G.instanceCount = a), Re.push(G)
                }
            }
        }
    }
};
j.prototype.isDestroyed = function() {
    return !1
};
j.prototype.destroy = function() {
    return _(this._removeCallbackFunc) && (this._removeCallbackFunc(), this._removeCallbackFunc = void 0), this._textureAtlas = this._destroyTextureAtlas && this._textureAtlas && this._textureAtlas.destroy(), this._sp = this._sp && this._sp.destroy(), this._spTranslucent = this._spTranslucent && this._spTranslucent.destroy(), this._vaf = this._vaf && this._vaf.destroy(), Ci(this._billboards), Wt(this)
};

function os(e) {
    const n = sa.get("pixel-ratio"),
        a = n ? Number(n) : Je.tier === 2 ? Math.min(2, window.devicePixelRatio) : Je.tier === 3 ? Math.min(3, window.devicePixelRatio) : 1,
        o = document.getElementById(e),
        t = document.createElement("div");
    t.className = "cesium-widget", o.appendChild(t);
    const i = m();
    let r = !1,
        d = !1,
        c = new qi({
            canvas: i,
            contextOptions: {
                webgl: {
                    alpha: !1,
                    preserveDrawingBuffer: !1
                }
            },
            scene3DOnly: !0,
            requestRenderMode: !Qt,
            maximumRenderTimeChange: 1 / 0
        });
    c.backgroundColor = k.fromCssColorString("#3b00ff"), c.camera.constrainedAxis = s.UNIT_Z, u(), c.globe = (() => {
        const p = new Xi;
        return p.showGroundAtmosphere = !1, p.baseColor = Ve.baseColor, p
    })();
    const h = 512,
        l = oa || Je.tier < 3 || a < 2,
        f = c.imageryLayers.addImageryProvider(new Yi({
            url: `${$i}/{z}/{x}/{y}{q}.jpg`,
            tileWidth: h,
            tileHeight: h,
            maximumLevel: 13,
            customTags: {
                q(p, g, v, T) {
                    return l || T >= 12 ? "" : "-2x"
                }
            }
        }));
    return f.magnificationFilter = xe.LINEAR, f.minificationFilter = xe.NEAREST, c.renderError.addEventListener(console.log), {
        screenSpaceEventHandler: new Ki(i),
        scene: c,
        canvas: i,
        container: o,
        forceResize: () => {
            d = !0
        },
        destroy: () => {
            c.destroy(), o.removeChild(t)
        },
        render: () => {
            d && (d = !1, u(), c.requestRender()), r && (c.initializeFrame(), c.render())
        }
    };

    function u() {
        let {
            clientWidth: p,
            clientHeight: g
        } = i;
        if (c.pixelRatio = a, p = i.width = p * a, g = i.height = g * a, r = p !== 0 && g !== 0, r) {
            const {
                frustum: v
            } = c.camera;
            v.aspectRatio ? v.aspectRatio = p / g : (v.top = v.right * (g / p), v.bottom = -v.top)
        }
    }

    function m() {
        const p = document.createElement("canvas");
        p.addEventListener(ra ? "pointerdown" : Jt ? "mousedown" : "touchstart", () => Kt()), wt.supportsImageRenderingPixelated() && (p.style.imageRendering = wt.imageRenderingValue());
        const g = () => !1;
        return p.oncontextmenu = g, p.onselectstart = g, t.appendChild(p), p
    }
}
Gt.prototype.simulateMouseWheel = function(e) {
    var n = te.WHEEL,
        a = this._update;
    a[n] = !0;
    var o = this.getMovement(n),
        t = 15 * I.toRadians(e);
    C.clone(C.ZERO, o.startPosition), o.endPosition.x = 0, o.endPosition.y = t, a[n] = !1
};
const ds = ([e, n]) => s.fromDegrees(e, n),
    Vt = new ce,
    cs = new C,
    hs = new s,
    Fe = 111e4,
    Hi = 40,
    ls = ([, e, , n]) => e - n < Hi * (De.lastValue("media").$narrow ? .7 : 1),
    fs = ([, e, , n], [, a, , o]) => e - n - (a - o),
    us = ([, , , e], [, , , n]) => n - e,
    ps = ([, , e]) => e;
class ms extends ji {
    constructor() {
        super(...arguments), this.stopped = !1, this.markerByPlace = {}, this.markersPlaceIds = [], this.screenCenter = new C, this.externalMovement = !1, this.flying = !1, this.pinching = !1, this.mouseDown = !1, this.mouseMoveCreatedMovement = !1, this.moveCount = 0, this.snapToActiveMarkerDebounced = ea(n => {
            this.pinching || this.mouseDown || !this.activeMarker || !this.closestMarkerToScreen || this.activeMarker.id !== this.closestMarkerToScreen.id || this.externalMovement || this.flying || !n || this.activeMarker !== n || this.flyTo(n.geo, {
                duration: 1.5,
                keepCameraHeight: !0,
                setFlying: !1
            })
        }, 500), this.cameraWasMoving = !1, this.onTick = () => {
            var a;
            if (this.stopped) return;
            this.widget.render();
            const n = !this.lastPosition.equals(this.position) && s.distanceSquared(this.lastPosition, this.position) > 1;
            if (this.position.clone(this.lastPosition), !n) {
                this.cameraWasMoving && ((a = this.cameraMovingDeferred) == null || a.resolve(), this.onCameraMoveEnd(), this.cameraWasMoving = !1);
                return
            }
            this.cameraWasMoving || (this.cameraMovingDeferred = da()), this.cameraWasMoving = !0, this.onCameraMove()
        }, this.onCameraMove = () => {
            const n = this.scene.screenSpaceCameraController;
            if ((n.maxZoomReached || n.minZoomReached) && (n.onZoomAvailable(), n.maxZoomReached = n.minZoomReached = !1), this.mouseMoveCreatedMovement) {
                const a = this.closestMarkerToScreen = this.getClosestMarkerToScreenPosition(this.screenCenter);
                a && this.changeActiveMarker(a)
            }
        }, this.onCameraMoveEnd = () => {
            this.pinching || this.snapToActiveMarkerDebounced(this.activeMarker)
        }, this.onMouseLeave = () => {
            this.highlightMarker(null, this.highlightEntity)
        }
    }
    initialize(n) {
        De.on("blur-viewer", () => {
            this.mouseMoveCreatedMovement = !1
        }), this.closestMarkerToScreen = void 0;
        const a = this.widget = os(n);
        this.scene = a.scene;
        const o = this.camera = a.scene.camera;
        o.setView({
            destination: new s(7383326785028172e-9, 9419480707813196e-9, 14989893080210578e-9)
        }), De.lastValue("media").$narrow && o.zoomIn(35e5), this.position = this.camera.positionWC, this.lastPosition = new s, this.createCameraController(), pe.add(this.onTick);
        const t = this.scene.primitives.add(new Qi({
            blendOption: Y.TRANSLUCENT
        }));
        t.allowPicking = !1, this.activeEntity = t.add(et(1, !0, !0)), this.highlightEntity = t.add(et(1, !0, !0));
        const i = new s(0, 0, -1e3);
        this.activeEntity.eyeOffset = i, this.highlightEntity.eyeOffset = i;
        const r = a.canvas.parentNode,
            d = () => {
                !this.stopped && !Mt && r.classList.add("cesium-resizing"), this.stopped = !0
            },
            c = () => {
                this.stopped && !Mt && r.classList.remove("cesium-resizing"), this.stopped = !1, a.forceResize();
                const {
                    offsetWidth: h,
                    offsetHeight: l
                } = r;
                this.screenCenter.x = h * .5, this.screenCenter.y = l * .5
            };
        c(), De.on("window-will-resize", d), De.on("window-resize-debounced", c), a.container.addEventListener("mouseleave", this.onMouseLeave), this.billboards = new j({
            blendOption: Y.TRANSLUCENT
        }), this.billboards.allowPicking = !1, this.highlightMarker(null, this.activeEntity), this.highlightMarker(null, this.highlightEntity), this.scene.debugShowFramesPerSecond = Qt
    }
    installInputHandlers() {
        for (const [n, a] of [
                ["LEFT_UP", this.onMouseUp],
                ["LEFT_DOWN", this.onMouseDown],
                ["MOUSE_MOVE", this.onMouseMove],
                ["PINCH_START", this.onPinchStart],
                ["PINCH_END", this.onPinchEnd],
                ["LEFT_CLICK", this.onMouseClick],
                ["WHEEL", this.onScrollWheel]
            ]) this.widget.screenSpaceEventHandler.setInputAction(a.bind(this), Ji[n])
    }
    onMouseDown() {
        this.highlightMarker(null, this.highlightEntity), this.camera.cancelFlight(), this.mouseDown = !0, this.externalMovement = !1
    }
    onMouseUp() {
        this.mouseDown = !1, Kt(!1), this.flying || this.onCameraMoveEnd(), this.moveCount = 0
    }
    onScrollWheel() {
        this.camera.cancelFlight()
    }
    onMouseMove(n) {
        this.mouseDown ? (this.moveCount += 1, this.moveCount === 1 && ta.player.lock(), this.mouseMoveCreatedMovement = !0, this.flying = !1) : (this.closestMarker = this.getClosestMarkerToScreenPosition(n.endPosition), this.highlightMarker(this.closestMarker || this.activeMarker, this.highlightEntity), Jt && la(this.closestMarker ? "pointer" : ""))
    }
    onMouseClick({
        position: n
    }) {
        const a = this.pickEllipsoid(n),
            o = this.getClosestMarkerToScreenPosition(n);
        if (!o) return;
        let t;
        if (o) t = o.geo;
        else {
            if (!a) return;
            const {
                longitude: i,
                latitude: r
            } = this.cartesianToCartographic(a);
            t = [Me(i), Me(r)]
        }
        this.changeActiveMarker(o, !1), this.flyTo(t, {
            duration: ia * .001
        }), this.emit("place-clicked", o == null ? void 0 : o.id)
    }
    onPinchStart() {
        this.pinching = !0
    }
    onPinchEnd() {
        this.pinching = !1
    }
    highlightMarker(n, a) {
        if (n !== this.lastMarker) {
            if (!n) a.show = !1;
            else {
                const {
                    entity: o
                } = n;
                if (!o) return;
                a.show = !0, a.position = o.position, a.scale = o.scale
            }
            this.lastMarker = n, this.scene.requestRender()
        }
    }
    createCameraController() {
        const n = this.scene = this.widget.scene,
            {
                maxZoomReached: a,
                minZoomReached: o
            } = n.screenSpaceCameraController;
        n.screenSpaceCameraController.destroy();
        const t = this.cameraController = n._screenSpaceCameraController = new Ae(n, {
            onMaxZoomReached: () => this.emit("max-zoom-reached"),
            onMinZoomReached: () => this.emit("min-zoom-reached"),
            onZoomAvailable: () => this.emit("zoom-available")
        });
        t.maximumZoomDistance = 2e7, t.minimumZoomDistance = 6e3, t.enableTilt = !1, t.minZoomReached = o, t.maxZoomReached = a, t.getZoomPosition = () => (this.camera.cancelFlight(), this.activeMarker ? this.activeMarker.cartesian : this.position), t.getZoomCartesian3 = () => {
            const {
                activeMarker: i,
                screenCenter: r
            } = this;
            return i && C.distance(this.cartesianToWindowCoordinates(i.cartesian), r) > Hi ? this.pickEllipsoid(this.screenCenter) : i == null ? void 0 : i.cartesian
        }
    }
    async zoomInToGeoWhileRevealingMarkers(n) {
        this.teleportTo(n), await $e(de ? 0 : 300);
        const a = Date.now(),
            o = i => i * i,
            t = () => {
                this.scene.requestRender(), (this.billboards.showRatio = de ? 1 : o(Math.min(1, (Date.now() - a) / 1e3))) === 1 && pe.remove(t)
            };
        pe.add(t), await $e(de ? 0 : 400)
    }
    async revealMarkersWhileRotatingGlobe() {
        this.scene.requestRender();
        const n = Date.now(),
            a = de ? 10 : 8e3,
            o = de ? 5 : 5500,
            t = i => {
                const r = Date.now() - n;
                r < o && (this.camera.rotateLeft(5e-4 * i), this.camera.zoomOut(500 * i)), r > a && pe.remove(t), this.billboards.showRatio = Math.min(1, (Date.now() - n) / a)
            };
        pe.add(t), await $e(o)
    }
    async setMarkers({
        byId: n,
        ids: a
    }, {
        repeatVisitor: o = !1,
        config: t
    } = {}) {
        let i = Date.now();
        const r = de ? Number.MAX_VALUE : 500,
            d = de ? Number.MAX_VALUE : 32,
            c = u => {
                if (!(u % r !== 0 || Date.now() - i < d)) return i = Date.now(), na()
            },
            {
                markerByPlace: h,
                billboards: l
            } = this;
        i = Date.now();
        for (let u = 0; u < this.markersPlaceIds.length; u++) {
            const m = c(u);
            m && await m;
            const p = this.markersPlaceIds[u];
            a.indexOf(p) === -1 && (l.remove(h[p].entity), delete h[p])
        }
        this.markersPlaceIds = a, i = Date.now();
        for (let u = 0; u < a.length; u++) {
            const m = c(u);
            m && await m;
            const p = a[u];
            if (h[p]) continue;
            const g = n[p],
                v = g.geo,
                T = ds(v),
                E = (v[0] + 180 + 90) % 360 / 360,
                S = l.add(et(g.size, g.boost, !1, T, o ? Math.random() : Math.max(0, 1 - E + (Math.random() * .05 - .025)), t));
            h[p] = {
                geo: v,
                id: p,
                cartesian: T,
                entity: S
            }
        }
        const {
            primitives: f
        } = this.scene;
        f.contains(l) || f.add(l), this.scene.requestRender()
    }
    async gotoPlace(n, {
        teleport: a = !1,
        zoom: o = !0,
        duration: t,
        changeMarker: i,
        forceFlight: r
    } = {}) {
        const d = this.markerByPlace && this.markerByPlace[n.id];
        (r || !this.mouseMoveCreatedMovement) && await (a ? o ? this.teleportTo(n.geo) : this.moveCameraTo(n.geo, Fe) : this.flyTo(n.geo, t ? {
            duration: t
        } : void 0)), !(!!d && d === this.activeMarker) && (this.externalMovement = !0, i && this.changeActiveMarker(d, !1))
    }
    changeActiveMarker(n, a = !0) {
        n !== this.activeMarker && (this.activeMarker = n, this.highlightMarker(n, this.activeEntity), n && a && !this.flying && !this.externalMovement && this.emit("place-changed", n.id))
    }
    zoomIn() {
        this.scene._screenSpaceCameraController._aggregator.simulateMouseWheel(25)
    }
    zoomOut() {
        this.scene._screenSpaceCameraController._aggregator.simulateMouseWheel(-25)
    }
    getViewRectangle() {
        return this.camera.computeViewRectangle(this.scene.globe.ellipsoid)
    }
    globeDistanceFromCamera() {
        var a;
        const n = (a = this.camera) == null ? void 0 : a.position;
        return n ? this.cartesianToCartographic(n).height : 0
    }
    moveCameraTo([n, a], o = Fe * 10) {
        this.camera.setView({
            destination: s.fromDegrees(n, a, o)
        })
    }
    async flyCameraTo([n, a], o, t = Fe, i = !0) {
        return new Promise(r => {
            i && (this.flying = !0), this.createCameraController(), this.camera.flyTo({
                destination: s.fromDegrees(n, a, t),
                duration: de ? .01 : o,
                complete: async () => {
                    var d;
                    await ((d = this.cameraMovingDeferred) == null ? void 0 : d.promise), this.flying = !1, r()
                }
            })
        })
    }
    async teleportTo(n, a = de ? .01 : 2.5) {
        return this.moveCameraTo(n), this.flyCameraTo(n, a)
    }
    async flyTo(n, {
        duration: a,
        keepCameraHeight: o,
        setFlying: t
    } = {}) {
        return this.flyCameraTo(n, a, o ? this.globeDistanceFromCamera() : Math.min(Fe, this.globeDistanceFromCamera()), t)
    }
    cartesianToCartographic(n, a = Vt) {
        return ie.WGS84.cartesianToCartographic(n, a)
    }
    cartesianToWindowCoordinates(n, a = cs) {
        return gt.wgs84ToWindowCoordinates(this.scene, n, a)
    }
    pickEllipsoid(n, a = hs) {
        return this.camera.pickEllipsoid(n, this.scene.globe.ellipsoid, a)
    }
    getClosestMarkerToScreenPosition(n) {
        const a = this.pickEllipsoid(n);
        if (!a) return null;
        const o = this.globeDistanceFromCamera(),
            t = va(o);
        let i = 0;
        const r = ie.WGS84.cartesianToCartographic(a, Vt);
        r.longitude = Me(r.longitude), r.latitude = Me(r.latitude);
        const d = aa.lookupCartesian(r, 30).map(h => {
            const l = this.markerByPlace[h.id],
                f = this.cartesianToWindowCoordinates(l.cartesian),
                u = C.distance(f, n),
                m = l.entity.scale * t * 50,
                p = u - m <= 0;
            return p && i++, [l, u, p, m]
        }).filter(ls).sort(fs);
        return d.length ? (i > 0 ? d.filter(ps).sort(us) : d)[0][0] : null
    }
}
const Es = new ms;
export {
    Es as
    default
};