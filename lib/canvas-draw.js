"use strict";

var fillCircle = function(context, x, y, w, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, w, 0, 2*Math.PI);
  context.fill();
};

var fillCenteredRect = function(context, x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x - w/2, y - h/2, w, h);
};
