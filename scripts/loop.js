var tickSpeed = 15;
var tps = 1000/tickSpeed;
let blured = 0;

window.onblur = function() {
  blured = 1;
  keypress = {};
};
window.onfocus = function() {
  blured = 0;
};
mainInterval = setInterval( function () {
  if (blured) return;
  updatePlayer();
  updateScreen();
  gameStatusUpdate();
  levelTickFunction();
}, tickSpeed);
