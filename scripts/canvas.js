//init
var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

var screenState = 'game';
var screenSettings = {
  'size': 1,
  'p': [0, 0], 'scale': 1
}

//updateScreen
function updateScreen() {
  document.getElementById('canvasBorder').style.setProperty('--thisLen', `min(${screenSettings.size*100}vw,${screenSettings.size*100}vh)`);
  document.getElementById('canvasBorder').style.left = `calc(${50*(1+screenSettings.p[0])}vw - var(--thisLen) / 2)`;
  document.getElementById('canvasBorder').style.top = `calc(${50*(1-screenSettings.p[1])}vh - var(--thisLen) / 2)`;
  //top: calc(50vh - var(--thisLen) / 2); left: calc(50vw - var(--thisLen)/2);

  maxLeng = Math.min(innerWidth, innerHeight)*0.96;
  canvas.width = maxLeng*screenSettings.size;
  canvas.height = maxLeng*screenSettings.size
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.fillStyle = '#f5c542';
  c.rect(0, 0, canvas.width, canvas.height);
  c.fill();

  switch (screenState) {
    case 'game':
    for (var z = 0; z < 5; z++) {
      for (var name in particles) {
        if (particles[name].zIndex != z) continue;
        particles[name].update();
        c.beginPath();
        c.lineWidth = 1;
        c.fillStyle = particles[name].color;
        c.strokeStyle = particles[name].color;
        var p = particles[name].position;
        var s = particles[name].sides;
        //var d = particles[name].deg;
        var d = particles[name].rotateDeg;
        var d1 = (-d + 180 / s) % 360;
        var sScale = 1/(particles[name].sides/2*Math.cos(Math.rad((180-(180/particles[name].sides*(particles[name].sides-2)))/2)))/0.7071067811865475;
        var centerL = Math.csc(Math.rad(180 / s)) / 2 * particles[name].absSize*sScale;
        var lastPos = [
          maxLeng * (-(screenSettings.p[0]+(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 + p[0] / 2 * screenSettings.scale - Math.sin(Math.rad(d1)) * centerL * particles[name].size[0] * screenSettings.scale),
          maxLeng * ((screenSettings.p[1]-(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 - p[1] / 2 * screenSettings.scale - Math.cos(Math.rad(d1)) * centerL * particles[name].size[1] * screenSettings.scale)
        ];
        c.moveTo(lastPos[0], lastPos[1]);
        for (var i = 0; i < particles[name].sides; i++) {
          lastPos[0] += Math.sin(Math.PI * 2 / particles[name].sides * i + Math.rad(d + 90)) * (maxLeng * particles[name].absSize) * particles[name].size[0] * screenSettings.scale * sScale;
          lastPos[1] -= Math.cos(Math.PI * 2 / particles[name].sides * i + Math.rad(d + 90)) * (maxLeng * particles[name].absSize) * particles[name].size[1] * screenSettings.scale * sScale;
          c.lineTo(lastPos[0], lastPos[1]);
        }
        c.closePath();
        c.fill();
        c.stroke();
      }
    }
      break;
    case 'main':

      break;
    default:
      break;
  }
}

//override
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.csc = function(radian) {
  return 1/Math.sin(radian);
};
