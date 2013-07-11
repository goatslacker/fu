/*jshint curly: false, latedef: false, eqeqeq: false, plusplus: false, newcap: false */
(function () {
  'use strict';

  module.exports = {
    all: all,
    and: and,
    any: any,
    comp: comp,
    compact: compact,
    concat: concat,
    concatMap: concatMap,
    curry: curry,
    drop: drop,
    dropWhile: dropWhile,
    elem: elem,
    filter: filter,
    flip: flip,
    foldl: foldl,
    head: head,
    id: id,
    init: init,
    intoArray: intoArray,
    intoObject: intoObject,
    last: last,
    map: map,
    max: max,
    maybe: maybe,
    merge: merge,
    min: min,
    nil: nil,
    or: or,
    property: property,
    range: range,
    scanl: scanl,
    seq: seq,
    splitAt: splitAt,
    tail: tail,
    take: take,
    takeWhile: takeWhile,
    zipWith: zipWith
  }

  var isArray = Array.isArray || function (a) {
    return {}.call(a) == '[object Array]'
  }
  var emptyList = 'empty list'

  function id(x) {
    return x
  }

  function head(xs) {
    return xs[0]
  }

  function last(xs) {
    return xs[xs.length - 1]
  }

  function init(xs) {
    var i = -1, l = xs.length - 1, r = Array(l - 1)
    while (++i < l) r[i] = xs[i]
    return r
  }

  function tail(xs) {
    var i = 0, l = xs.length, r = Array(l - 1)
    while (++i < l) r[i - 1] = xs[i]
    return r
  }

  function and(a) {
    return all(Boolean, a)
  }

  function or(a) {
    return any(Boolean, a)
  }

  function all(f, a) {
    if (arguments.length == 1) return function (a) { return all(f, a) }

    var i = -1, l = a.length
    while (++i < l) if (!f(a[i])) return false
    return true
  }

  function any(f, a) {
    if (arguments.length == 1) return function (a) { return any(f, a) }
    var i = -1, l = a.length
    while (++i < l) if (f(a[i])) return true
    return false
  }

  function concat() {
    var i = -1, l = arguments.length, n = 0, j = 0, lx = 0, r, a = arguments
    while (++i < l) n += a[i].length
    r = Array(n)
    i = -1
    n = 0
    while (++i < l)
      for (j = 0, lx = a[i].length; j < lx; j++)
        r[n++] = a[i][j]
    return r
  }

  function curry(f, a) {
    return function (b) {
      return f(a, b)
    }
  }

  //+ intoObject :: [[key, value]] -> Object
  function intoObject(a) {
    return foldl(function (o, x) {
      if (!isArray(x)) throw new TypeError('expected key value pair')
      var k = x[0], v = x[1]
      o[k] = v
      return o
    }, a, {})
  }

  //+ intoArray :: Object -> [[key, value]]
  function intoArray(o) {
    return map(function (k) {
      return [k, o[k]]
    }, Object.keys(o))
  }

  //+ compact :: [a] -> [a]
  function compact(a) {
    return filter(Boolean, a)
  }

  //+ filter :: (a -> Boolean), [a] -> [a]
  function filter(f, a) {
    if (arguments.length == 1) return function (a) { return filter(f, a) }
    var i = -1, l = a.length, r = []
    while (++i < l) f(a[i]) === true && r.push(a[i])
    return r
  }

  //+ map :: (a -> b), [a] -> [b]
  function map(f, a) {
    if (arguments.length == 1) return function (a) { return map(f, a) }
    var i = -1, l = a.length, r = Array(l)
    while (++i < l) r[i] = f(a[i])
    return r
  }

  //+ foldl :: (a, b -> a), [a], b -> a
  function foldl(f, a, s) {
    if (arguments.length == 1) return function (a, s) { return foldl(f, a, s) }
    var i = -1, l = a.length, v
    if (s === undefined) {
      if (!l) throw new Error(emptyList)
      v = a[++i]
    } else {
      v = s
    }
    while (++i < l) v = f(v, a[i])
    return v
  }

  //+ concatMap :: (a -> [a]), [a] -> [a]
  function concatMap(f, a) {
    if (arguments.length == 1) return function (a) { return concatMap(f, a) }
    var i = -1, l = a.length, r = [], v
    while (++i < l) {
      v = f(a[i])
      isArray(v)
        ? [].push.apply(r, v)
        : r.push(v)
    }
    return r
  }

  //+ take :: Number, [a] -> [a]
  function take(n, a) {
    if (arguments.length == 1) return function (a) { return take(n, a) }
    if (n < 0) return []
    var i = -1, l = a.length, x = min([n, l]), r = Array(x)
    while (++i < x) r[i] = a[i]
    return r
  }

  //+ takeWhile :: (a -> Boolean), [a] -> [a]
  function takeWhile(f, a) {
    if (arguments.length == 1) return function (a) { return takeWhile(f, a) }
    var i = -1, r = []
    while (f(a[++i]) === true) r.push(a[i])
    return r
  }

  //+ drop :: Number, [a] -> [a]
  function drop(n, a) {
    if (n < 1) return a
    if (arguments.length == 1) return function (a) { return drop(n, a) }
    var l = a.length
    if (n >= l) return []
    var i = n - 1, r = Array(l - n), x = -1
    while (++i < l) r[++x] = a[i]
    return r
  }

  //+ dropWhile :: (a -> Boolean), [a] -> [a]
  function dropWhile(f, a) {
    if (arguments.length == 1) return function (a) { return dropWhile(f, a) }
    var i = -1, l = a.length, n = 0
    while (++i < l) if (f(a[i]) !== true) break
    if (i == l) return []
    var r = Array(l - i - 1)
    while (i < l) r[n++] = a[i++]
    return r
  }

  function scanl(f, a) {
    if (arguments.length == 1) return function (a) { return map(f, a) }
    var i = -1, l = a.length, r = Array(l), v
    while (++i < l) r[i] = v = f(v, a[i]) || a[i]
    return r
  }

  //+ elem :: a, [a] -> Boolean
  function elem(x, a) {
    if (arguments.length == 1) return function (a) { return elem(x, a) }
    var nan = isNaN(x), v, i = -1, l = a.length
    while (++i < l) {
      v = a[i]
      if (v === x) return x !== 0 || 1 / x === 1 / v
      else if (nan && x !== x && v !== v) return true
    }
    return false
  }

  function nil(a) {
    var i = -1, l = a.length
    while (++i < l) if (a[i] != null) return false
    return true
  }

  function range(s, e) {
    if (arguments.length == 1) {
      e = s
      s = 1
    }
    if (s > e) return []
    var r = Array(e - s + 1), x = -1
    while (s <= e) r[++x] = s++
    return r
  }

  function flip(f, a, b) {
    switch (arguments.length) {
      case 1:
        return function (a, b) {
          return arguments.length == 1
            ? flip(f, a)
            : flip(f, a, b)
        }
      case 2:
        return function (b) { return flip(f, a, b) }
      default:
        return f(b, a)
    }
  }

  function merge() {
    var a = arguments, r = isArray(a[0]) ? [] : {}, k, i = -1, l = a.length, v
    while (++i < l)
      for (k in a[i]) {
        v = a[i][k]
        r[k] = typeof v == 'object'
          ? merge(v, {})
          : v
      }
    return r
  }

  function comp(f, g) {
    return arguments.length == 1
      ? function (g) { return comp(f, g) }
      : function (x) { return f(g(x)) }
  }

  function seq(f, g) {
    return arguments.length == 1
      ? function (g) { return seq(f, g) }
      : function (x) { return g(f(x)) }
  }

  function property(p) {
    return function (x) { return x[p] }
  }

  function zipWith(f, a, b) {
    if (arguments.length == 1)
      return function (a, b) { return zipWith(f, a, b) }

    var i = -1, l = min([a.length, b.length]), r = Array(l)
    while (++i < l) r[i] = f(a[i], b[i])
    return r
  }

  function max(a) {
    if (!a) return null
    var v = -Infinity, i = -1, l = a.length
    if (!l) throw new Error(emptyList)
    while (++i < l) if (a[i] > v) v = a[i]
    return v
  }

  function min(a) {
    if (!a) return null
    var v = Infinity, i = -1, l = a.length
    if (!l) throw new Error(emptyList)
    while (++i < l) if (a[i] < v) v = a[i]
    return v
  }

  function splitAt(n, a) {
    if (arguments.length == 1) return function (a) { return splitAt(n, a) }
    var i = -1, l = a.length
    if (n < 1) return [[], a]
    if (n > l) return [a, []]
    var r1 = Array(n), r2 = Array(l - n), j = 0
    while (++i < n) r1[i] = a[i]
    while (i < l) r2[j++] = a[i++]
    return [r1, r2]
  }

  function maybe(f) {
    return function () {
      try { return f() } catch (e) { return null }
    }
  }
}());
