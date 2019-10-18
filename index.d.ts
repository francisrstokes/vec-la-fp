declare module 'vec-la-fp' {
  export type Vector = [number, number];
  export type Matrix =
    [ number, number, number,
      number, number, number,
      number, number, number ];

  export const mId:Matrix;

  export function vAdd(v1:Vector, v2:Vector):Vector;
  export function vAdd(v1:Vector):(v2:Vector) => Vector;

  export function vAdd3(v1:Vector, v2:Vector, v3:Vector):Vector;
  export function vAdd3(v1:Vector, v2:Vector):(v3:Vector) => Vector;
  export function vAdd3(v1:Vector):(v2:Vector) => (v3:Vector) => Vector;

  export function vAddAll(vs:Vector[]):Vector;

  export function vSub(v1:Vector, v2:Vector):Vector;
  export function vSub(v1:Vector):(v2:Vector) => Vector;

  export function vSub3(v1:Vector, v2:Vector, v3:Vector):Vector;
  export function vSub3(v1:Vector, v2:Vector):(v3:Vector) => Vector;
  export function vSub3(v1:Vector):(v2:Vector) => (v3:Vector) => Vector;

  export function vSubAll(vs:Vector[]):Vector;

  export function vMag(v1:Vector):number;
  export function vNormal(v1:Vector):Vector;

  export function vScale(sc:number, v1:Vector):Vector;
  export function vScale(sc:number):(v1:Vector) => Vector;

  export function vTowards(t:number, v1:Vector, v2:Vector):Vector;
  export function vTowards(t:number):(v1:Vector, v2:Vector) => Vector;
  export function vTowards(t:number):(v1:Vector) => (v2:Vector) => Vector;

  export function vLerp(v1:Vector, v2:Vector, t:number):Vector;
  export function vLerp(v1:Vector):(v2:Vector, t:number) => Vector;
  export function vLerp(v1:Vector):(v2:Vector) => (t:number) => Vector;

  export function vScalarNear(e:number, a:number, b:number):boolean;
  export function vScalarNear(e:number):(a:number, b:number) => boolean;
  export function vScalarNear(e:number):(a:number) => (b:number) => boolean;

  export function vNear(ev:Vector, v1:Vector, v2:Vector):boolean;
  export function vNear(ev:Vector):(v1:Vector, v2:Vector) => boolean;
  export function vNear(ev:Vector):(v1:Vector) => (v2:Vector) => boolean;

  export function vClampMag(a:number, b:number, v1:Vector):Vector;
  export function vClampMag(a:number):(b:number, v1:Vector) => Vector;
  export function vClampMag(a:number):(b:number) => (v1:Vector) => Vector;

  export function vCreateMatrix(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix;

  export function vTransform(m:Matrix, v:Vector):Vector;
  export function vTransform(m:Matrix):(v:Vector) => Vector;

  export function mCompose(m1:Matrix, m2:Matrix):Matrix;
  export function mCompose(m1:Matrix):(m2:Matrix) => Matrix;

  export function mRotate(a:number, m:Matrix):Matrix;
  export function mRotate(a:number):(m:Matrix) => Matrix;

  export function mTranslate(v:Vector, m:Matrix):Matrix;
  export function mTranslate(v:Vector):(m:Matrix) => Matrix;

  export function mScale(v:Vector, m:Matrix):Matrix;
  export function mScale(v:Vector):(m:Matrix) => Matrix;

  export function mShear(v:Vector, m:Matrix):Matrix;
  export function mShear(v:Vector):(m:Matrix) => Matrix;

  export function vRotate(a:number, v:Vector):Vector;
  export function vRotate(a:number):(v:Vector) => Vector;

  export function vRotatePointAround(a:number, cv:Vector, v:Vector):Vector;
  export function vRotatePointAround(a:number):(cv:Vector, v:Vector) => Vector;
  export function vRotatePointAround(a:number):(cv:Vector) => (v:Vector) => Vector;

  export function vMidpoint(v1:Vector, v2:Vector):Vector;
  export function vMidpoint(v1:Vector):(v2:Vector) => Vector;

  export function vAngle(a:number):Vector;

  export function vAlongAngle(a:number, r:number):Vector;
  export function vAlongAngle(a:number):(r:number) => Vector;

  export function vDist(v1:Vector, v2:Vector):number;
  export function vDist(v1:Vector):(v2:Vector) => number;

  export function vFastDist(v1:Vector, v2:Vector):number;
  export function vFastDist(v1:Vector):(v2:Vector) => number;

  export function vDot(v1:Vector, v2:Vector):number;
  export function vDot(v1:Vector):(v2:Vector) => number;

  export function vPerpDot(v1:Vector, v2:Vector):number;
  export function vPerpDot(v1:Vector):(v2:Vector) => number;

  export function vTriangleArea(v1:Vector, v2:Vector, v3:Vector):number;
  export function vTriangleArea(v1:Vector):(v2:Vector, v3:Vector) => number;
  export function vTriangleArea(v1:Vector):(v2:Vector) => (v3:Vector) => number;

  export function vColinear(v1:Vector, v2:Vector, v3:Vector):boolean;
  export function vColinear(v1:Vector):(v2:Vector, v3:Vector) => boolean;
  export function vColinear(v1:Vector):(v2:Vector) => (v3:Vector) => boolean;

  export function vDet(m:Matrix):number;
}
