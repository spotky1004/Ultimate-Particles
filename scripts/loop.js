var tickSpeed = 15;
var tps = 1000/tickSpeed;

setInterval( function () {
  updatePlayer();
  updateScreen();
}, tickSpeed);
