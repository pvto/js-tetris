
var arr2str = (function() {
  return function(piece) {
    var ret = "";
    for(var y = 0; y < piece.length; y++) {
      if (y > 0) { ret += "\n"; }
      for(var x = 0; x < piece[y].length; x++) {
        ret += piece[y][x];
      }
    }
    return ret;
  }
})();

var arr2 = (function() {
  return function(w, h, val) {
    var ret = [];
    for(var y = 0; y < h; y++) {
      ret.push([]);
      for(var x = 0; x < w; x++) {
        ret[y].push(val || ' ');
      }
    };
    return ret;
  };
})();

var arr2fill = (function() {
  return function(arr, val) {
    var ret = arr2(arr[0].length, arr.length);
    for(var y = 0; y < arr.length; y++) {
      for(var x = 0; x < arr[y].length; x++) {
        ret[y][x] = val;
      }
    }
    return ret;
  }
})();

var arr2paste = (function() {
  return function(to, u, v, src, emptyval) {
    for(var y = Math.max(0, v);
        y < Math.min(to.length, v + src.length);
        y++) {
      for(var x = Math.max(0, u);
        x < Math.min(to[y].length, u + src[y - v].length);
        x++) {
        if (!emptyval || emptyval != src[y - v][x - u]) {
          to[y][x] = src[y - v][x - u];
        }
      }
    }
  }
})();

var arr2cellOverlaps = (function() {
  return function(arra, bu, bv, arrb, emptyval) {
    for(var y = Math.max(0, bv);
        y < Math.min(arra.length, bv + arrb.length);
        y++) {
      for(var x = Math.max(0, bu);
        x < Math.min(arra[y].length, bu + arrb[y - bv].length);
        x++) {
        if (emptyval != arra[y][x]
          && emptyval != arrb[y - bv][x - bu]) {
            return true;
        }
      }
    }
    return false;
  }
})();

var rcw = (function() {
  return function(piece) {
    var ret = arr2(piece.length, piece.length);
    // (0,0) -> (2,0)  (2,0) -> (2,2)  (2,2) -> (0,2)  (0,2) -> (0,0)
    var u = piece[0].length - 1;
    var v = 0;
    for(var y = 0; y < piece.length; y++) {
      for(var x = 0; x < piece[y].length; x++) {
        ret[v][u] = piece[y][x];
        v = (v + 1) % piece.length;
      };
      u = u - 1;
    };
    return ret;
  };
})();

var rccw = (function() {
  return function(piece) {
    var ret = arr2(piece.length, piece.length);
    // (0,0) -> (0,2)  (0,2) -> (2,2)  (2,2) -> (2,0)  (2,0) -> (0,0)
    var u = 0;
    var v = piece.length - 1;
    for(var y = 0; y < piece.length; y++) {
      for(var x = 0; x < piece[y].length; x++) {
        ret[v][u] = piece[y][x];
        v = (v - 1 + piece.length) % piece.length;
      };
      u = u + 1;
    };
    return ret;
  };
})();
