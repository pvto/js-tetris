"use strict";

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

var arr2copy = function(arr) {
  return _.cloneDeep(arr);
}
var arr2xwalk = (function() {
  return function(arr2, f) {
    arr2.forEach(function(arr) {
      for(var x = 0; x < arr.length; x++) {
        f(arr, x);
      }
    });
  };
})();

var arr2walk = arr2xwalk;

var arr2xywalk = (function() {
  return function(arr2, f) {
    for(var y = 0; y < arr2.length; y++) {
      for(var x = 0; x < arr2[y].length; x++) {
        f(arr2, x, y);
      }
    };
  };
})();

var arr2Replace = (function() {
  return function(arr2, identityF, replace) {
    arr2xwalk(arr2, function(arr, x) {
      if (identityF(arr[x])) {
        arr[x] = replace;
      }
    });
  };
})();

var arr2count = (function() {
  return function(arr2, identityF) {
    var count = 0;
    arr2walk(arr2, function(arr, x) {
      if (identityF(arr[x])) { count++; }
    });
    return count;
  };
})();

var arr2fill = (function() {
  return function(arr, val) {
    arr2xwalk(arr, function(arr, i) { arr[i] = val; });
    var ret = arr2(arr[0].length, arr.length);
    for(var y = 0; y < arr.length; y++) {
      for(var x = 0; x < arr[y].length; x++) {
        ret[y][x] = val;
      }
    }
    return ret;
  }
})();

var arr2color = (function() {
    var color = function(arr2, x, y, isEmptyF, val, f) {
      if (isEmptyF(val)) {
        throw new Error("arr2color error: " + val + " is empty for " + isEmptyF);
      }
      var stack = [];
      var n = 0;
      while (isEmptyF(arr2[y][x])) {
        arr2[y][x] = val;
        n++;
        if (f) {
          f(arr2, x, y);
        }
        if (x > 0 && isEmptyF(arr2[y][x-1])) { stack.push([x-1,y]); }
        if (x < arr2[y].length - 1 && isEmptyF(arr2[y][x+1])) { stack.push([x+1,y]); }
        if (y > 0 && isEmptyF(arr2[y-1][x])) { stack.push([x,y-1]); }
        if (y < arr2.length - 1 && isEmptyF(arr2[y+1][x])) { stack.push([x,y+1]); }
        while (stack.length > 0 && !isEmptyF(arr2[y][x])) {
          var xy = stack.pop();
          x = xy[0];
          y = xy[1];
        }
      }
      return n;
    };
    return color;
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

var arr2collision = (function(){
  return function(container, placement, xy, isEmptyF) {
    var crash = false;
    for(var y = 0; y < placement.length; y++) {
      for(var x = 0; x < placement[y].length; x++) {
        if (0 > xy.y + y) {
          if (!isEmptyF(placement[y][x]) &&
              (xy.x + x < 0 || xy.x + x >= container[0].length)) {
            return true;
          }
        }
        if (!isEmptyF(placement[y][x]) && 0 <= xy.y + y) {
          if (container.length - 1 < y + xy.y) {
            return true;
          }
          if (!isEmptyF(container[xy.y + y][xy.x + x])) {
            return true;
          }
        }
      }
    }
    return false;
  };
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

var arr2contains = (function() {
  return function(arr, val, strict) {
    var count = 0;
    for(var y = 0; y < arr.length; y++) {
      for(var x = 0; x < arr[y].length; x++) {
        if (strict && arr[y][x] === val
            || !strict && arr[y][x] == val) {
            count++;
        }
      }
    }
    return count;
  }
})();

var arr2RemoveAndRollYDown = (function() {
  return function(arr2, identityF, emptyval) {
    for(var y = arr2.length - 1; y >= 0; y--) {
      for(var x = 0; x < arr2[y].length; x++) {
        while (identityF(arr2[y][x])) {
          for(var v = y; v > 0; v --) {
            arr2[v][x] = arr2[v-1][x];
          }
          arr2[0][x] = emptyval;
        }
      }
    }
  };
})();

var arr2colMin = (function() {
  return function(arr2, column) {
    var min = arr2[0][column];
    arr2.forEach(function(arr) { min = Math.min(arr[column], min); });
    return min;
  };
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
