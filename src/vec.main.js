// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
const curry = (fn) => {
  const curried = (...args) => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...argsNext) => curried(...args, ...argsNext);
  };
  return curried;
};

// pipe :: (a -> b) -> (b -> ...) -> (... -> n)
const pipe = (fn1, ...functions) =>
  (...args) =>
    functions.reduce((acc, fn) => fn(acc), fn1(...args));

// compose :: (... -> n) -> (b -> ...) -> (a -> b)
const compose = (...functions) => pipe(...functions.reverse());


// vAdd :: Vector -> Vector -> Vector
const vAdd = curry((v, v2) => [v[0]+v2[0], v[1]+v2[1]]);

// vSub :: Vector -> Vector -> Vector
const vSub = curry((v, v2) => [v[0]-v2[0], v[1]-v2[1]]);

// vMag :: Vector -> Number
const vMag = (v) => Math.sqrt(v[0]*v[0]+v[1]*v[1]);

// vNormal :: Vector -> Vector
const vNormal = (v) => [-v[1], v[0]];

// vScale :: Number -> Vector
const vScale = curry((sc, v) => [v[0]*sc, v[1]*sc]);

// vTowards :: Number -> Vector -> Vector -> Vector
const vTowards = curry((t, v1, v2) => {
  const d = vSub(v2, v1);
  const m = vMag(d);
  return vAdd(v1, vScale(t*m, vNorm(d)));
});

// vNorm :: Vector -> Vector
const vNorm = (v) => {
  const mag = vMag(v);
  return [
    v[0] / mag,
    v[1] / mag
  ];
};

// mId :: Matrix
const mId = Object.freeze([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
]);

// vCreateMatrix :: Number -> Number -> Number -> Number -> Number -> Number -> Matrix
const vCreateMatrix = (a=1, b=0, c=0, d=1, tx=0, ty=0) =>[
  a, c, tx,
  b, d, ty,
  0, 0, 1
];

// vTransform :: Matrix -> Vector -> Vector
const vTransform = curry((m, v) => [
  v[0]*m[0] + v[1]*m[1] + m[2],
  v[0]*m[3] + v[1]*m[4] + m[5]
]);

// mCompose :: Matrix -> Matrix -> Matrix
const mCompose = curry((m, m2) => [
  m[0]*m2[0] + m[1]*m2[3] + m[2]*m2[6],   m[0]*m2[1] + m[1]*m2[4] + m[2]*m2[7],    m[0]*m2[2] + m[1]*m2[5] + m[2]*m2[8],
  m[3]*m2[0] + m[4]*m2[3] + m[5]*m2[6],   m[3]*m2[1] + m[4]*m2[4] + m[5]*m2[7],    m[3]*m2[2] + m[4]*m2[5] + m[5]*m2[8],
  m[6]*m2[0] + m[7]*m2[3] + m[8]*m2[6],   m[6]*m2[1] + m[7]*m2[4] + m[8]*m2[7],    m[6]*m2[2] + m[7]*m2[5] + m[8]*m2[8]
]);

// mRotate :: Number -> Matrix -> Matrix
const mRotate = (a) =>
  mCompose([
    Math.cos(a), -Math.sin(a), 0,
    Math.sin(a), Math.cos(a), 0,
    0, 0, 1
  ]);

// mTranslate :: Vector -> Matrix -> Matrix
const mTranslate = (v) =>
  mCompose([
    1, 0, v[0],
    0, 1, v[1],
    0, 0, 1
  ]);

// mScale :: Vector -> Matrix -> Matrix
const mScale = (v) =>
  mCompose([
    v[0], 0, 0,
    0, v[1], 0,
    0, 0, 1
  ]);

// mShear :: Vector -> Matrix -> Matrix
const mShear = (v) =>
  mCompose([
    1, v[0], 0,
    v[1], 1, 0,
    0, 0, 1
  ]);

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

// vAlongAngle :: Number -> Number -> Vector
const vAlongAngle = curry((a, r, v) => [
  v[0] + Math.cos(a) * r,
  v[1] + Math.sin(a) * r
]);

// vDist :: Vector -> Vector -> Number
const vDist = curry((v, v2) => Math.hypot(v2[0] - v[0], v2[1] - v[1]));

// vDot :: Vector -> Vector -> Number
const vDot = curry((v, v2) => v[0]*v2[0] + v[1]*v2[1]);

// vDet :: Matrix -> Number
const vDet = (m) => m[0]*m[4] - m[3]*m[1];


/* start window exports */
/**
 * Polutes the global scope with unnamespaced functions
 */
const polute = function () {
  window.vAdd = vAdd;
  window.vSub = vSub;
  window.vMag = vMag;
  window.vNormal = vNormal;
  window.vScale = vScale;
  window.vTowards = vTowards;
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
  window.vAlongAngle = vAlongAngle;
  window.vDist = vDist;
  window.vDot = vDot;
  window.vDet = vDet;
}

/**
 * Exposed API
 */
window.vec = {
  add: vAdd,
  sub: vSub,
  mag: vMag,
  normal: vNormal,
  scale: vScale,
  towards: vTowards,
  norm: vNorm,
  mId: mId,
  createMatrix: vCreateMatrix,
  transform: vTransform,
  compose: mCompose,
  rotate: mRotate,
  translate: mTranslate,
  scale: mScale,
  shear: mShear,
  rotate: vRotate,
  rotatePointAround: vRotatePointAround,
  midpoint: vMidpoint,
  alongAngle: vAlongAngle,
  dist: vDist,
  dot: vDot,
  det: vDet,

  polute: polute
};
/* end window exports */

/* start exports */
export const vec = {
  add: vAdd,
  sub: vSub,
  mag: vMag,
  normal: vNormal,
  scale: vScale,
  towards: vTowards,
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
  alongAngle: vAlongAngle,
  dist: vDist,
  dot: vDot,
  det: vDet,
}
/* end exports */
