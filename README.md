# vec-la-fp

`Vec-la-fp` is the functional version of the `vec-la` library. All functions are curried with arguments reordered to support composition. MatrixBuilder is replaced with composable calls to `mRotate`, `mTranslate`, `mScale`, `mShear`, and `mCompose` for abitrary matrix concatenations.

## Installation

`npm install --save vec-la-fp`

and import or require as needed. If you need to use a standalone windowed version in a script tag:

`<script src="node_modules/vec-la-fp/dist/vec.window.js"></script>`

## Features

- Immutable functions for manipulating vectors and matrices
- Vectors and matrices represented as pure, single dimensional arrays
- Composable and fully curried

## API

`vec.add(v, v2)` - adds `v` and `v2`

`vec.add3(v, v2, v3)` - adds `v`, `v2`, `v3`

`vec.addAll([v1, v2, ..., vN])` - adds all vectors together

`vec.sub(v, v2)` - subtracts `v2` from `v1`

`vec.sub3(v, v2, v3)` - subtracts `v`, `v2`, `v3`

`vec.subAll([v1, v2, ..., vN])` - subtracts all vectors together

`vec.mag(v)` - gets magnitude of `v`

`vec.normal(v)` - gets normal vector of `v`

`vec.scale(sc, v)` - scales `v` by `sc`

`vec.towards(t, v, v2)` - gets the vector at "time" `t` between `v` and `v2`

`vec.lerp(v, v2, t)` - `towards`, but with the `t` argument last

`vec.scalarNear(e, n, n2)` - true if n is within epsilon of n2

`vec.near(e, v, v2)` - true if every elment of v is near the same in v2

`vec.clampMag(min, max, v)` - a vector in the same direction as v with magnitude clamped to at least min and at most max

`vec.norm(v)` - normalises `v`

`vec.mId` - immutable identity matrix

`vec.createMatrix(a, b, c, d, tx, ty)` - helper function for creating matrices

`vec.transform(m, v)` - transform `v` by matrix `m`

`vec.compose(m, m2)` - compose matrices `m` and `m2`

`vec.mRotate(a, m)` - compose matrix `m` with a rotation matrix using angle `a`

`vec.mTranslate(v, m)` - compose matrix `m` with a translation matrix using vector `v` for x and y

`vec.mId` - The identity matrix

`vec.mScale(v, m)` - compose matrix `m` with a scale matrix using vector `v` for x and y

`vec.mShear(v, m)` - compose matrix `m` with a shear matrix using vector `v` for x and y

`vec.rotate(a, v)` - rotates `v` by angle `a`

`vec.rotatePointAround(a, cp, v)` - rotates `v` by angle `a` around control point vector `cp`

`vec.midpoint(v, v2)` - gets midpoint between `v` and `v2`

`vec.alongAngle(a, r, v)` - gets a vector `r` units along angle `a` from vector `v`

`vec.dist(v, v2)` - gets distance from `v` to `v2`

`vec.fastDist(v, v2)` - gets "fast" distance from `v` to `v2` (no square root)

`vec.dot(v, v2)` - gets dot product of `v` and `v2`

`vec.perpdot(v, v2)` - the perpendicular dot product of `v` and `v2` (sometimes called cross)

`vec.trinagleArea(a, b, c)` - signed area of triangle abc

`vec.colinear(a, b, c)` - true if a b and c are colinear

`vec.det(m)` - calculates the determine of matrix `m`

### Tree shaking

All the functions are exported for better tree shaking:

- vAdd
- vAdd3
- vAddAll
- vSub
- vSub3
- vSubAll
- vMag
- vNormal
- vScale
- vTowards
- vLerp
- vNorm
- mId
- vCreateMatrix
- vTransform
- mCompose
- mRotate
- mTranslate
- mScale
- mShear
- vRotate
- vRotatePointAround
- vMidpoint
- vAngle
- vAlongAngle
- vFastDist
- vDist
- vDot
- vDet

Finally, when using the window version you can call `vec.polute()` to insert these functions into the global scope with the naming convention:

`vFunctionName` e.g `vAdd`, `vMidpoint`, `vDot` etc

and `mCompose`, `mRotate` etc for functions associated with matrices

## Composing matrices

vec-la provided a dot-chain style API for building matrices, but since matrices compose the same as functions, this API can be captured via regular function composition. For example:

**Note!** The `compose` function below is *function* compose, not the `vec.mCompose` function for matrices

```javascript
const M = compose(
  mTranslate([10, 20]),
  mShear([0.2, 0.3]),
  mScale([3.2, 2.3]),
  mRotate(1.5)
)(mId);
```

is equivilent to vec-la's:

```javascript
const M = vMatrixBuilder()
  .rotate(1.5)
  .scale(3.2, 2.3)
  .shear(0.2, 0.3)
  .translate(10, 20)
  .get();
```

## Tests

Clone the repository, and then run `npm install && npm test`.

## Examples

(all examples assume vec is imported under `vec`)

### Addition

```javascript
const v1 = [0, 1];
const v2 = [1, 0];
const v3 = vec.add(v1, v2); // [1, 1]
```

### Scaling

```javascript
const v1 = [0, 1];
const scaler = 10;
const v2 = vec.scale(scaler, v1); // [0, 10]
```

### Normalising

```javascript
const v1 = [6.32, -23.1];
const v2 = vec.norm(v1); // [0.2638946146581466, -0.9645515187663272]
```

### Magnitude

```javascript
const v1 = [6.32, -23.1];
const mag = vec.mag(v1); // 23.948954048141644
```


### Matrix Transform

```javascript
const v1 = [10, 10];

// Inversion matrix
const m = [
  -1, 0,  0
   0, -1, 0,
   0,  0, 1
];
const v2 = vec.transform(m, v1); // [-10, -10]
```

### Computing determinants

```javascript
const m = [
  10, 0, 0,
  0, 10, 0,
  0,  0, 1
];
const d = vec.det(m); // 100
```
