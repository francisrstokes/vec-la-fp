(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
var curry = function curry(fn) {
  var curried = function curried() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length >= fn.length) {
      return fn.apply(undefined, args);
    }
    return function () {
      for (var _len2 = arguments.length, argsNext = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        argsNext[_key2] = arguments[_key2];
      }

      return curried.apply(undefined, args.concat(argsNext));
    };
  };
  return curried;
};

// pipe :: (a -> b) -> (b -> ...) -> (... -> n)
var pipe = function pipe(fn1) {
  for (var _len3 = arguments.length, functions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    functions[_key3 - 1] = arguments[_key3];
  }

  return function () {
    return functions.reduce(function (acc, fn) {
      return fn(acc);
    }, fn1.apply(undefined, arguments));
  };
};

// compose :: (... -> n) -> (b -> ...) -> (a -> b)
var compose = function compose() {
  for (var _len4 = arguments.length, functions = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    functions[_key4] = arguments[_key4];
  }

  return pipe.apply(undefined, _toConsumableArray(functions.reverse()));
};

// vAdd :: Vector -> Vector -> Vector
var vAdd = curry(function (v, v2) {
  return [v[0] + v2[0], v[1] + v2[1]];
});

// vAdd3 :: Vector -> Vector -> Vector -> Vector
var vAdd3 = curry(function (v, v2, v3) {
  return [v[0] + v2[0] + v3[0], v[1] + v2[1] + v3[1]];
});

// vAddAll :: [Vector] -> Vector
var vAddAll = function vAddAll(vs) {
  return vs.reduce(vAdd, [0, 0]);
};

// vSub :: Vector -> Vector -> Vector
var vSub = curry(function (v, v2) {
  return [v[0] - v2[0], v[1] - v2[1]];
});

// vSub3 :: Vector -> Vector -> Vector -> Vector
var vSub3 = curry(function (v, v2, v3) {
  return [v[0] - v2[0] - v3[0], v[1] - v2[1] - v3[1]];
});

// vSubAll :: [Vector] -> Vector
var vSubAll = function vSubAll(vs) {
  return vs.slice(1).reduce(vSub, vs.slice(0, 1)[0]);
};

// vMag :: Vector -> Number
var vMag = function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

// vNormal :: Vector -> Vector
var vNormal = function vNormal(v) {
  return [-v[1], v[0]];
};

// vScale :: Number -> Vector
var vScale = curry(function (sc, v) {
  return [v[0] * sc, v[1] * sc];
});

// vTowards :: Number -> Vector -> Vector -> Vector
var vTowards = curry(function (t, v1, v2) {
  var d = vSub(v2, v1);
  var sc = vMag(d) * t;
  return vAdd(v1, vScale(sc, vNorm(d)));
});

// vLerp :: Vector -> Vector -> Number -> Vector
var vLerp = curry(function (v1, v2, t) {
  return vTowards(t, v1, v2);
});

// vScalarNear :: Number -> Number -> Number -> bool
var vScalarNear = curry(function (e, a, b) {
  return Math.abs(a - b) < e;
});

// vNear :: Number -> Vector -> Vector -> bool
var vNear = curry(function (e, a, b) {
  return vScalarNear(e, a[0], b[0]) && vScalarNear(e, a[1], b[1]);
});

// vClampMag :: Number -> Number -> Vector -> Vector
var vClampMag = curry(function (min, max, v) {
  var d = vec.mag(v);
  if (d < min) return vec.scale(min / d, v);else if (d > max) return vec.scale(max / d, v);
  return v;
});

// vNorm :: Vector -> Vector
var vNorm = function vNorm(v) {
  var mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

// mId :: Matrix
var mId = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);

// vCreateMatrix :: Number -> Number -> Number -> Number -> Number -> Number -> Matrix
var vCreateMatrix = function vCreateMatrix() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  return [a, c, tx, b, d, ty, 0, 0, 1];
};

// vTransform :: Matrix -> Vector -> Vector
var vTransform = curry(function (m, v) {
  return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]];
});

// mCompose :: Matrix -> Matrix -> Matrix
var mCompose = curry(function (m, m2) {
  return [m[0] * m2[0] + m[1] * m2[3] + m[2] * m2[6], m[0] * m2[1] + m[1] * m2[4] + m[2] * m2[7], m[0] * m2[2] + m[1] * m2[5] + m[2] * m2[8], m[3] * m2[0] + m[4] * m2[3] + m[5] * m2[6], m[3] * m2[1] + m[4] * m2[4] + m[5] * m2[7], m[3] * m2[2] + m[4] * m2[5] + m[5] * m2[8], m[6] * m2[0] + m[7] * m2[3] + m[8] * m2[6], m[6] * m2[1] + m[7] * m2[4] + m[8] * m2[7], m[6] * m2[2] + m[7] * m2[5] + m[8] * m2[8]];
});

// mRotate :: Number -> Matrix -> Matrix
var mRotate = function mRotate(a) {
  return mCompose([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1]);
};

// mTranslate :: Vector -> Matrix -> Matrix
var mTranslate = function mTranslate(v) {
  return mCompose([1, 0, v[0], 0, 1, v[1], 0, 0, 1]);
};

// mScale :: Vector -> Matrix -> Matrix
var mScale = function mScale(v) {
  return mCompose([v[0], 0, 0, 0, v[1], 0, 0, 0, 1]);
};

// mShear :: Vector -> Matrix -> Matrix
var mShear = function mShear(v) {
  return mCompose([1, v[0], 0, v[1], 1, 0, 0, 0, 1]);
};

// vRotate :: Number -> Vector -> Vector
var vRotate = curry(function (a, v) {
  return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
});

// vRotatePointAround :: Number -> Vector -> Vector -> Vector
var vRotatePointAround = curry(function (a, cp, v) {
  var v2 = vSub(v, cp);
  return vAdd(cp, [v2[0] * Math.cos(a) - v2[1] * Math.sin(a), v2[0] * Math.sin(a) + v2[1] * Math.cos(a)]);
});

// vMidpoint :: Vector -> Vector -> Vector
var vMidpoint = curry(function (v, v2) {
  return vScale(0.5, vAdd(v, v2));
});

// vAngle :: Number -> Vector
var vAngle = function vAngle(a) {
  return [Math.cos(a), Math.sin(a)];
};

// vAlongAngle :: Number -> Number -> Vector
var vAlongAngle = curry(function (a, r, v) {
  return compose(vAdd(v), vScale(r), vAngle)(a);
});

// vFastDist :: Vector -> Vector -> Number
var vFastDist = curry(function (v, v2) {
  return Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2);
});

// vDist :: Vector -> Vector -> Number
var vDist = curry(function (v, v2) {
  return Math.hypot(v2[0] - v[0], v2[1] - v[1]);
});

// vDot :: Vector -> Vector -> Number
var vDot = curry(function (v, v2) {
  return v[0] * v2[0] + v[1] * v2[1];
});

// vPerpDot :: Vector -> Vector -> Number
var vPerpDot = curry(function (v, v2) {
  return v[0] * v2[1] - v[1] * v2[0];
});

// vTriangleArea :: Vector -> Vector -> Vector -> Number
var vTriangleArea = curry(function (a, b, c) {
  return ((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
});

// vColinear :: Vector -> Vector -> Vector -> bool
var vColinear = curry(function (v0, v1, v2) {
  return vScalarNear(1e-4, vTriangleArea(v0, v1, v2), 0);
});

// vDet :: Matrix -> Number
var vDet = function vDet(m) {
  return m[0] * m[4] - m[3] * m[1];
};

var vec = {
  add: vAdd,
  add3: vAdd3,
  addAll: vAddAll,
  sub: vSub,
  sub3: vSub3,
  subAll: vSubAll,
  mag: vMag,
  normal: vNormal,
  scale: vScale,
  towards: vTowards,
  lerp: vLerp,
  scalarNear: vScalarNear,
  near: vNear,
  clampMag: vClampMag,
  norm: vNorm,
  mId: mId,
  createMatrix: vCreateMatrix,
  transform: vTransform,
  mCompose: mCompose,
  mRotate: mRotate,
  mTranslate: mTranslate,
  mScale: mScale,
  mShear: mShear,
  rotate: vRotate,
  rotatePointAround: vRotatePointAround,
  midpoint: vMidpoint,
  angle: vAngle,
  alongAngle: vAlongAngle,
  fastDist: vFastDist,
  dist: vDist,
  dot: vDot,
  perpdot: vPerpDot,
  triangleArea: vTriangleArea,
  colinear: vColinear,
  det: vDet
};

/* start window exports */
/**
 * Polutes the global scope with unnamespaced functions
 */
/* eslint-disable func-names */
var polute = function polute() {
  window.vAdd = vAdd;
  window.vAdd3 = vAdd3;
  window.vAddAll = vAddAll;
  window.vSub = vSub;
  window.vSub3 = vSub3;
  window.vSubAll = vSubAll;
  window.vMag = vMag;
  window.vNormal = vNormal;
  window.vScale = vScale;
  window.vTowards = vTowards;
  window.vLerp = vLerp;
  window.vScalarNear = vScalarNear, window.vNear = vNear;
  window.vClampMag = vClampMag;
  window.vNorm = vNorm;
  window.mId = mId;
  window.vCreateMatrix = vCreateMatrix;
  window.vTransform = vTransform;
  window.mCompose = mCompose;
  window.mRotate = mRotate;
  window.mTranslate = mTranslate;
  window.mScale = mScale;
  window.mShear = mShear;
  window.vRotate = vRotate;
  window.vRotatePointAround = vRotatePointAround;
  window.vMidpoint = vMidpoint;
  window.vAngle = vAngle;
  window.vAlongAngle = vAlongAngle;
  window.vFastDist = vFastDist;
  window.vDist = vDist;
  window.vDot = vDot;
  window.vPerpDot = vPerpDot;
  window.vTriangleArea = vTriangleArea;
  window.vColinear = vColinear;
  window.vDet = vDet;
};
/* eslint-enable func-names */

/**
 * Exposed API
 */
window.vec = Object.assign({ polute: polute }, vec);
/* end window exports */
},{}]},{},[1])