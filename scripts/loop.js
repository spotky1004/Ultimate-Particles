var tickSpeed = 15;
var tps = 1000/tickSpeed;

mainInterval = setInterval( function () {
  updatePlayer();
  updateScreen();
  gameStatusUpdate();
  levelTickFunction();
}, tickSpeed);
