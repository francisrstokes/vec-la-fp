// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
const curry = fn => {
  const curried = (...args) => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...argsNext) => curried(...args, ...argsNext);
  };
  return curried;
};

// pipe :: (a -> b) -> (b -> ...) -> (... -> n)
const pipe = (fn1, ...functions) => (...args) =>
  functions.reduce((acc, fn) => fn(acc), fn1(...args));

// compose :: (... -> n) -> (b -> ...) -> (a -> b)
const compose = (...functions) => pipe(...functions.reverse());

// vAdd :: Vector -> Vector -> Vector
const vAdd = curry((v, v2) => [v[0] + v2[0], v[1] + v2[1]]);

// vAdd3 :: Vector -> Vector -> Vector -> Vector
const vAdd3 = curry((v, v2, v3) => [
  v[0] + v2[0] + v3[0],
  v[1] + v2[1] + v3[1]
]);

// vAddAll :: [Vector] -> Vector
const vAddAll = vs => vs.reduce(vAdd, [0, 0]);

// vSub :: Vector -> Vector -> Vector
const vSub = curry((v, v2) => [v[0] - v2[0], v[1] - v2[1]]);

// vSub3 :: Vector -> Vector -> Vector -> Vector
const vSub3 = curry((v, v2, v3) => [
  v[0] - v2[0] - v3[0],
  v[1] - v2[1] - v3[1]
]);

// vSubAll :: [Vector] -> Vector
const vSubAll = vs => vs.slice(1).reduce(vSub, vs.slice(0, 1)[0]);

// vMag :: Vector -> Number
const vMag = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);

// vNormal :: Vector -> Vector
const vNormal = v => [-v[1], v[0]];

// vScale :: Number -> Vector
const vScale = curry((sc, v) => [v[0] * sc, v[1] * sc]);

// vTowards :: Number -> Vector -> Vector -> Vector
const vTowards = curry((t, v1, v2) => {
  const d = vSub(v2, v1);
  const sc = vMag(d) * t;
  return vAdd(v1, vScale(sc, vNorm(d)));
});

// vLerp :: Vector -> Vector -> Number -> Vector
const vLerp = curry((v1, v2, t) => vTowards(t, v1, v2));

// vScalarNear :: Number -> Number -> Number -> bool
const vScalarNear = curry((e, a, b) => Math.abs(a - b) < e);

// vNear :: Number -> Vector -> Vector -> bool
const vNear = curry(
  (e, a, b) => vScalarNear(e, a[0], b[0]) && vScalarNear(e, a[1], b[1])
);

// vClampMag :: Number -> Number -> Vector -> Vector
const vClampMag = curry((min, max, v) => {
  const d = vec.mag(v);
  if (d < min) return vec.scale(min / d, v);
  else if (d > max) return vec.scale(max / d, v);
  return v;
});

// vNorm :: Vector -> Vector
const vNorm = v => {
  const mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

// mId :: Matrix
const mId = Object.freeze([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
]);

// vCreateMatrix :: Number -> Number -> Number -> Number -> Number -> Number -> Matrix
const vCreateMatrix = (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) => [
  a, c, tx,
  b, d, ty,
  0, 0, 1
];

// vTransform :: Matrix -> Vector -> Vector
const vTransform = curry((m, v) => [
  v[0] * m[0] + v[1] * m[1] + m[2],
  v[0] * m[3] + v[1] * m[4] + m[5]
]);

// mCompose :: Matrix -> Matrix -> Matrix
const mCompose = curry((m, m2) => [
  m[0] * m2[0] + m[1] * m2[3] + m[2] * m2[6],
  m[0] * m2[1] + m[1] * m2[4] + m[2] * m2[7],
  m[0] * m2[2] + m[1] * m2[5] + m[2] * m2[8],
  m[3] * m2[0] + m[4] * m2[3] + m[5] * m2[6],
  m[3] * m2[1] + m[4] * m2[4] + m[5] * m2[7],
  m[3] * m2[2] + m[4] * m2[5] + m[5] * m2[8],
  m[6] * m2[0] + m[7] * m2[3] + m[8] * m2[6],
  m[6] * m2[1] + m[7] * m2[4] + m[8] * m2[7],
  m[6] * m2[2] + m[7] * m2[5] + m[8] * m2[8]
]);

// mRotate :: Number -> Matrix -> Matrix
const mRotate = a =>
  mCompose([
    Math.cos(a), -Math.sin(a), 0,
    Math.sin(a), Math.cos(a),  0,
    0,           0,            1
  ]);

// mTranslate :: Vector -> Matrix -> Matrix
const mTranslate = v => mCompose([1, 0, v[0], 0, 1, v[1], 0, 0, 1]);

// mScale :: Vector -> Matrix -> Matrix
const mScale = v => mCompose([v[0], 0, 0, 0, v[1], 0, 0, 0, 1]);

// mShear :: Vector -> Matrix -> Matrix
const mShear = v => mCompose([1, v[0], 0, v[1], 1, 0, 0, 0, 1]);

// vRotate :: Number -> Vector -> Vector
const vRotate = curry((a, v) => [
  v[0] * Math.cos(a) - v[1] * Math.sin(a),
  v[0] * Math.sin(a) + v[1] * Math.cos(a)
]);

// vRotatePointAround :: Number -> Vector -> Vector -> Vector
const vRotatePointAround = curry((a, cp, v) => {
  const v2 = vSub(v, cp);
  return vAdd(cp, [
    v2[0] * Math.cos(a) - v2[1] * Math.sin(a),
    v2[0] * Math.sin(a) + v2[1] * Math.cos(a)
  ]);
});

// vMidpoint :: Vector -> Vector -> Vector
const vMidpoint = curry((v, v2) => vScale(0.5, vAdd(v, v2)));

// vAngle :: Number -> Vector
const vAngle = a => [Math.cos(a), Math.sin(a)];

// vAlongAngle :: Number -> Number -> Vector
const vAlongAngle = curry((a, r, v) =>
  compose(
    vAdd(v),
    vScale(r),
    vAngle
  )(a)
);

// vFastDist :: Vector -> Vector -> Number
const vFastDist = curry(
  (v, v2) => Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2)
);

// vDist :: Vector -> Vector -> Number
const vDist = curry((v, v2) => Math.hypot(v2[0] - v[0], v2[1] - v[1]));

// vDot :: Vector -> Vector -> Number
const vDot = curry((v, v2) => v[0] * v2[0] + v[1] * v2[1]);

// vPerpDot :: Vector -> Vector -> Number
const vPerpDot = curry((v, v2) => v[0] * v2[1] - v[1] * v2[0]);

// vTriangleArea :: Vector -> Vector -> Vector -> Number
const vTriangleArea = curry(
  (a, b, c) =>
    ((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2
);

// vColinear :: Vector -> Vector -> Vector -> bool
const vColinear = curry((v0, v1, v2) =>
  vScalarNear(1e-4, vTriangleArea(v0, v1, v2), 0)
);

// vDet :: Matrix -> Number
const vDet = m => m[0] * m[4] - m[3] * m[1];

const vec = {
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
const polute = function() {
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
  (window.vScalarNear = vScalarNear), (window.vNear = vNear);
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
window.vec = Object.assign({ polute }, vec);
/* end window exports */

/* start exports */
export default vec;
export { vec };
export { vAdd };
export { vAdd3 };
export { vAddAll };
export { vSub };
export { vSub3 };
export { vSubAll };
export { vMag };
export { vNormal };
export { vScale };
export { vTowards };
export { vLerp };
export { vScalarNear };
export { vNear };
export { vClampMag };
export { vNorm };
export { mId };
export { vCreateMatrix };
export { vTransform };
export { mCompose };
export { mRotate };
export { mTranslate };
export { mScale };
export { mShear };
export { vRotate };
export { vRotatePointAround };
export { vMidpoint };
export { vAngle };
export { vAlongAngle };
export { vFastDist };
export { vDist };
export { vDot };
export { vPerpDot };
export { vTriangleArea };
export { vColinear };
export { vDet };
/* end exports */
