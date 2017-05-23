(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Adds two vectors
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Vector}
 */
var vAdd = function vAdd(v, v2) {
  return [v[0] + v2[0], v[1] + v2[1]];
};

/**
 * Subtracts one vector from another
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Vector}
 */
var vSub = function vSub(v, v2) {
  return [v[0] - v2[0], v[1] - v2[1]];
};

/**
 * Gets the magnitude of a vector
 * @param {Vector} v
 * @returns {Number}
 */
var vMag = function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

/**
 * Gets a normalised vector 
 * @param {Vector} v
 * @returns {Vector}
 */
var vNorm = function vNorm(v) {
  var mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

/**
 * Gets a scaled vector
 * @param {Vector} v
 * @param {Number} sc
 * @returns {Vector}
 */
var vScale = function vScale(v, sc) {
  return [v[0] * sc, v[1] * sc];
};

/**
 * Applys a matrix transformation to a vector
 * @param {Vector} v
 * @param {Matrix} m
 * @returns {Vector}
 */
var vTransform = function vTransform(v, m) {
  return [v[0] * (m[0] + m[1]), v[1] * (m[2] + m[3])];
};

/**
 * Rotates a vector around the origin. Shorthand for a rotation matrix
 * @param {Vector} v
 * @param {Number} a
 * @returns {Vector}
 */
var vRotate = function vRotate(v, a) {
  return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
};

/**
 * Rotates a vector around a given point.
 * @param {Vector} v
 * @param {Vector} cp
 * @param {Number} a
 * @returns {Vector}
 */
var vRotatePointAround = function vRotatePointAround(v, cp, a) {
  var v2 = vSub(v, cp);
  return this.add(cp, [v2[0] * Math.cos(a) - v2[1] * Math.sin(a), v2[0] * Math.sin(a) + v2[1] * Math.cos(a)]);
};

/**
 * Gets the equidistant point between two vectors
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Vector}
 */
var vMidpoint = function vMidpoint(v, v2) {
  return vScale(vAdd(v, v2), 0.5);
};

/**
 * Dot product of two vectors
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Number}
 */
var vDot = function vDot(v, v2) {
  return v[0] * v2[0] + v[1] * v2[1];
};

/**
 * Determinate of a matrix
 * @param {Matrix} m
 * @returns {Number}
 */
var vDet = function vDet(m) {
  return m[0] * m[3] - m[1] * m[2];
};

/* start window exports */
/**
 * Polutes the global scope with unnamespaced functions
 */
var polute = function polute() {
  window.vAdd = vAdd;
  window.vSub = vSub;
  window.vNorm = vNorm;
  window.vScale = vScale;
  window.vMag = vMag;
  window.vTransform = vTransform;
  window.vRotate = vRotate;
  window.vRotatePointAround = vRotatePointAround;
  window.vMidpoint = vMidpoint;
  window.vDot = vDot;
  window.vDet = vDet;
};

/**
 * Exposed API
 */
window.vec = {
  add: vAdd,
  sub: vSub,
  norm: vNorm,
  mag: vMag,
  scale: vScale,
  transform: vTransform,
  rotate: vRotate,
  rotatePointAround: vRotatePointAround,
  midpoint: vMidpoint,
  dot: vDot,
  det: vDet,

  polute: polute
};
/* end window exports */
},{}]},{},[1])