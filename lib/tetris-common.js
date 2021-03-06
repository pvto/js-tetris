// Common, more universal -----
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

var concatWithEmptyCheck = function(arr, arr2) {
  if (arr2 && arr2.length > 0) {
    return arr.concat(arr2);
  }
  return arr;
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


var gravityDown = (function() {
  return function(space, isEmpty) {
    for(var x = 0; x < space[0].length; x++) {
      var ybottom = space.length - 1;
      var ytop = ybottom - 1;
      while (ytop >= 0) {
        while(!isEmpty(space[ybottom][x]) && ybottom > 1) {
          ybottom--;
          ytop = ybottom - 1;
        }
        if (isEmpty(space[ytop][x])) {
          ytop--;
          continue;
        }
        space[ybottom][x] = space[ytop][x];
        space[ytop][x] = ' ';
      }
    }
  };
})();



// Game specific

var addAction = function(messages, action, delay, duration) {
  var start = new Date().getTime() + (delay || 0);
  var end = (duration ? start+duration : null);
  var message = {action: action, start: start, end: end};
  messages.push(message);
};

var addBlink = function(messages, xyspace, x, y, dur, phase, val1, val2) {
  for(var tt = 0; tt < dur; tt+=phase) {
    addAction(messages, function() { xyspace[y][x] = val1; }, tt, phase/2);
    addAction(messages, function() { xyspace[y][x] = val2; }, tt+phase/2, phase/2);
  }
};

var addNotifyMessage = function(messages, message, text, delay, duration, block, xdim, ydim) {
  var start = new Date().getTime() + (delay || 0);
  var message = _.cloneDeep(message || {});
  message.text = text || message.text;
  message.start = start || message.start;
  duration = duration || message.duration;
  if (duration) {
    message.end = start + duration;
  }
  message.x = message.x || block * xdim / 2;
  message.y = message.y || block * ydim /4;
  messages.push(message);
};

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


var addDragListeners = function(GAME_CONTAINER_NODE, GAME_CANVAS_NODE, activePiece, block, xdim, ydim, testCrash) {
  GAME_CONTAINER_NODE.addEventListener("touchstart", function(event) {
    var c = getPieceClientCoords(GAME_CANVAS_NODE, activePiece, block);
    var margin = 1 * block;
    var touch = event.changedTouches[0];
    if (touch.clientX < c.xleft - 1 * margin
      || touch.clientX > c.xright + 1 * margin
      || touch.clientY < c.ytop - 1 * margin
      || touch.clientY > c.ybottom + 1 * margin) {
        activePiece.touchDrag = false;
        return;
    }
    activePiece.touchDrag = true;
  }, false);
  GAME_CONTAINER_NODE.addEventListener("touchmove", function(event) {
    if (activePiece.touchDrag === false) {
      return;
    }
    if (event.changedTouches.length > 1) {
      return;
    }
    var touch = event.changedTouches[0];
    var c = getPieceClientCoords(GAME_CANVAS_NODE, activePiece, block);
    var xCandidate = Math.round(
      (touch.clientX - c.offsetLeft - (c.xright - c.xleft) / 2)
      /
      block
    );
    while (xCandidate < activePiece.x &&
      testCrash({y:activePiece.y, x:xCandidate}, activePiece.piece.p)) { xCandidate++; }
    while (xCandidate > activePiece.x &&
      testCrash({y:activePiece.y, x:xCandidate}, activePiece.piece.p)) { xCandidate--; }
    if (!testCrash({y:activePiece.y, x:xCandidate}, activePiece.piece.p)) {
      activePiece.x = xCandidate;
      activePiece.redraw = true;
    }
  }, false);
  GAME_CONTAINER_NODE.addEventListener("touchend", function(event) {
    activePiece.touchDrag = false;
  }, false);
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
