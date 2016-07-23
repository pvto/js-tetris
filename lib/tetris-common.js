// Common -----
var isEmpty = function(val) {
  return val === ' ';
};

var remove = function(arr, item) {
  var index = arr.indexOf(item);
  arr.splice(index, 1);
};

var arrRand = function(arr) {
  return arr[irand(arr.length)];
};

var attrRand = function(obj) {
  return obj[arrRand(_.keys(obj))];
};

var arrAdd = (function() {
  return function(a, b) {
    var ret = [];
    for(var x = 0; x < a.length; x++) {
      ret.push(a[x] + b[x]);
    }
    return ret;
  }
})();

var arrNeg = (function() {
  return function(a) {
    var ret = [];
    for(var x = 0; x < a.length; x++) {
      ret.push(-a[x]);
    }
    return ret;
  }
})();

var inBounds = (function() {
  return function(xy, x0, y0, x1, y1) {
    return (xy[0] >= x0
      && xy[0] <= x1
      && xy[1] >= y0
      && xy[1] <= y1);
  }
})();


var remove = function(arr, item) {
  var index = arr.indexOf(item);
  arr.splice(index, 1);
};

var paste = function(to, u, v, src) {
    arr2paste(to, u, v, src, ' ');
};

// Tetris space -----

var rotateWithsideLineBorrow = function(activePiece, tmp, testCrash) {
  if (!testCrash({y:activePiece.y, x:activePiece.x + activePiece.borrow}, tmp)) {
    activePiece.piece.p = tmp;
    activePiece.x += activePiece.borrow;
    activePiece.borrow = 0;
  } else if (activePiece.borrow !== 0
    && (!testCrash({y:activePiece.y, x:activePiece.x}, tmp))) {
    activePiece.piece.p = tmp;
  } else {
    if (activePiece.x < 0) {
      if (!testCrash({y:activePiece.y, x:activePiece.x + 1}, tmp)) {
        activePiece.x++;
        activePiece.borrow = -1;
        activePiece.piece.p = tmp;
      }
    } else if (activePiece.x + activePiece.piece.p[0].length >= xdim) {
      if (!testCrash({y:activePiece.y, x:activePiece.x - 1}, tmp)) {
        activePiece.x--;
        activePiece.borrow = 1;
        activePiece.piece.p = tmp;
      }
    }
  }
};


var gravity = (function() {
  return function(space, isEmpty, gvector) {
    var y = 0, x = 0;
    if (gvector[0] > 0) { x = space[0].length - 1; }
    if (gvector[1] > 0) { y = space[1].length - 1; }
    var d = [-gvector[0], -gvector[1]];
    var end = [space[0].length - x, space[1].length - y];
    if (end[0] == 0) { end[0]--; }
    if (end[1] == 0) { end[1]--; }
    for(var v = y; v != end[1]; v += d[1]) {
      for(var u = x; u != end[0]; u += d[0]) {
        if (isEmpty(space[v][u]) && v < space.length - 1 && isEmpty(space[v+1][u])) {
          continue;
        }
        var max = Math.max(space.length, space[0].length);
        var it = 0;
        while(isEmpty(space[v][u]) && it++ < max) {
          var U = u, V = v;
          while (1==1) {
            var X = U+d[0];
            var Y = V+d[1];
            if (X < 0 || X >= space[0].length
              || Y < 0 || Y >= space.length) {
              break;
            }
            space[V][U] = space[Y][X];
            U = X;  V = Y;
          }
        }
      }
    }
  };
})();


// Canvas -----

var wh12 = function(ww,hh,scalea,scaleb) {
  var w = ww*(scalea-2)/scalea,
    h = hh*(scalea-2)/scalea,
    w2 = w*(scaleb-2)/scaleb,
    h2 = h*(scaleb-2)/scaleb;
  return {w:w, h:h, w2:w2, h2:h2};
};

var fillTwoRects = function(context, x, y, ww, hh, cola, scalea, colb, scaleb) {
  var w = ww*(scalea-2)/scalea,
    h = hh*(scalea-2)/scalea,
    w2 = w*(scaleb-2)/scaleb,
    h2 = h*(scaleb-2)/scaleb
    ;
    context.fillStyle = cola;
    context.fillRect(x - w/2, y - h/2, w, h);
    context.fillStyle = colb;
    context.fillRect(x - w2/2, y - h2/2, w2, h2);
};

var fillRectAndCircle = function(context, x, y, ww, hh, cola, scalea, colb, scaleb) {
  var wh = wh12(ww,hh,scalea,scaleb);
  fillCenteredRect(context, x, y, wh.w, wh.h, cola);
  fillCircle(context, x, y, wh.w2/2, colb);
};

var fillTwoCircles = function(context, x, y, ww, hh, cola, scalea, colb, scaleb) {
  var wh = wh12(ww,hh,scalea,scaleb);
  fillCircle(context, x, y, wh.w/2, cola);
  fillCircle(context, x, y, wh.w2/2, colb);
};


// Events ---

var parentReduceSum = function(node, f) {
  var sum = 0;
  while (node) {
    sum += (f(node) || 0);
    node = node.parentNode;
  }
  return sum;
};

var getPieceClientCoords = function(node, piece, block) {
  var offsetLeft = parentReduceSum(node, function(node) { return node.offsetLeft; });
  var offsetTop = parentReduceSum(node, function(node) { return node.offsetTop; });
  var xleft = offsetLeft + (piece.x) * block;
  var xright = offsetLeft + (piece.x + piece.piece.p[0].length) * block;
  var ytop = offsetTop + (piece.y) * block;
  var ybottom = offsetTop + (piece.y + piece.piece.p.length) * block;
  return {
    offsetLeft: offsetLeft,
    offsetTop: offsetTop,
    xleft: xleft,
    xright: xright,
    ytop: ytop,
    ybottom: ybottom
  }
};



var mouseDragActivePiece = function(node, event, activePiece, block, xdim, testCrashF) {
  if (event.buttons === 0) {
    activePiece.justDragged = false;
    return;
  }
  if (!activePiece.justDragged &&
    event.movementY > event.movementX && (event.movementY > 2 || event.movementX === 0)) {
    return;
  }
  var c = getPieceClientCoords(node, activePiece, block);
  var margin = 1 * block;
  if (event.clientX < c.xleft - margin
    || event.clientX > c.xright + margin
    || event.clientY < c.ytop - 2 * margin
    || event.clientY > c.ybottom + 2 * margin) {
      return;
  }
  activePiece.justDragged = true;
  event.preventDefault();
  event.stopPropagation();
  var xCandidate = Math.round(
    (event.clientX - c.offsetLeft - (c.xright - c.xleft) / 2)
    /
    block
  );
  if (xCandidate < 0) { xCandidate = 0; }
  while (xCandidate > xdim - activePiece.piece.p[0].length) { xCandidate--; }
  if (!testCrashF({y:activePiece.y, x:xCandidate}, activePiece.piece.p)) {
    activePiece.x = xCandidate;
    activePiece.redraw = true;
  }
  //console.log(event);
};


var setCursor = function(gameContainerNode, canvasNode, event, activePiece, block) {
  var c = getPieceClientCoords(canvasNode, activePiece, block);
  var margin = 0;
  var style = "pointer";
  if (event.clientY > c.ybottom + block * 2) {
    var factor = (event.clientX - (c.xright + c.xleft) / 2) * 1 / Math.pow(event.clientY - c.ybottom, 0.9);
    if (factor < -1) { style = "w-resize"; }
    else if (factor > 1) { style = "e-resize"; }
    else { style = "s-resize"; }
  }
  else if (event.clientX < c.xleft - margin) { style = "w-resize"; }
  else if (event.clientX > c.xright + margin) { style = "e-resize"; }
  else {
    if (event.clientY > c.ybottom + margin + block) {
      style = "s-resize";
    }
    else if (event.clientY > c.ytop - margin) { style = "all-scroll"; }
    else {
      if (event.clientX < c.xleft + block) { style = "w-resize"; }
      else if (event.clientX > c.xright - block) { style = "e-resize"; }
    }
  }
  if (!iOS) {
    gameContainerNode.style.cursor = style;
  }
  return style;
};

var doCreateInput = function(container, width, text, action, activePiece) {
  var action0 = function() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    activePiece.redraw = true;
    if (activePiece.gameOver|activePiece.paused === true) {
      return;
    }
    action();
  };
  d3.select(container).append("button")
    .attr("type", "button")
    .attr("class", "noselect")
    .text(text)
    .on("click", action0)
    .style("border-radius", "10px")
    .style("font-size", "26px")
    .style("width", (width / 6) + "px")
    .style("height", (width / 10) + "px");
};
