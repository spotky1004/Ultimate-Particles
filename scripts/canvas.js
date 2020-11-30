//init
var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

var screenState = 'main';
var screenSettings = {
  'size': 1,
  'p': [0, 0], 'scale': 1
}
var levelOn = -1;
var levelSelected = -1;

//updateScreen
function updateScreen() {
  document.getElementById('canvasBorder').style.setProperty('--thisLen', `min(${screenSettings.size*100}vw,${screenSettings.size*100}vh)`);
  document.getElementById('canvasBorder').style.left = `calc(${50*(1+screenSettings.p[0])}vw - var(--thisLen) / 2)`;
  document.getElementById('canvasBorder').style.top = `calc(${50*(1-screenSettings.p[1])}vh - var(--thisLen) / 2)`;
  //top: calc(50vh - var(--thisLen) / 2); left: calc(50vw - var(--thisLen)/2);

  maxLeng = Math.min(innerWidth, innerHeight)*0.96;
  canvasSize = maxLeng*screenSettings.size;
  canvas.width = canvasSize;
  canvas.height = canvasSize
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.fillStyle = '#f5c542';
  c.rect(0, 0, canvas.width, canvas.height);
  c.fill();

  resetCanvasSettings();
  switch (screenState) {
    case 'main':
    levelOn = -1;
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var blockOn = 0;
        levelScreenOffset = [(screenSettings.p[0]+(1-screenSettings.size)/2)*maxLeng, -(screenSettings.p[1]-(1-screenSettings.size))*maxLeng/2];
        if (levelSelected != -1 && levelSelected == i+j*5) {
          blockOn = 1;
        }
        if (Math.abs(maxLeng*(i+.5)/5-maxLeng*(particles.player.position[0]+1)/2) < maxLeng/10 && Math.abs(maxLeng*(j+.5)/5+maxLeng*(particles.player.position[1]-1)/2) < maxLeng/10) {
          blockOn = 1;
          levelOn = i+j*5;
          if (keypress['13'] && levelSelected == -1) {
            levelSelected = levelOn;
            screenPositionSpan([1*((i+0.5)/5)-0.5, -2*((j+0.5)/5)+1], 10);
            screenSizeSpan(0.2, 10);
          }
        }
        var colSet = [Math.floor(256*(4-i)/5), Math.floor(256*(i+j)/10), Math.floor(256*(4-j)/5)];
        var onFill = `#${(Math.floor(256*(Math.min(1, colSet[0]/256+0.2)))).toString(16).padStart(2, '0')}${(Math.floor(256*(Math.min(1, colSet[1]/256+0.2)))).toString(16).padStart(2, '0')}${(Math.floor(256*(Math.min(1, colSet[2]/256+0.2)))).toString(16).padStart(2, '0')}`;

        //rect
        resetCanvasSettings();
        c.beginPath();
        c.rect(maxLeng*i/5-levelScreenOffset[0], maxLeng*j/5-levelScreenOffset[1], maxLeng/5, maxLeng/5);
        c.fillStyle = `#${colSet[0].toString(16).padStart(2, '0')}${colSet[1].toString(16).padStart(2, '0')}${colSet[2].toString(16).padStart(2, '0')}`;
        if (blockOn) {
          c.fillStyle = '#fff';
        }
        c.fill();

        //rank rect
        resetCanvasSettings();
        c.beginPath();
        c.rect(maxLeng*(i+0.05)/5-levelScreenOffset[0], maxLeng*(j+0.85)/5-levelScreenOffset[1], maxLeng/5*0.9, maxLeng/5*0.1);
        c.fillStyle = `#fff`;
        if (blockOn) {
          c.fillStyle = onFill;
        }
        c.fill();

        //rank txt
        if (blockOn) {
          for (var k = 0; k < 3; k++) {
            resetCanvasSettings();
            c.beginPath();
            c.font = `bold ${maxLeng*0.02}px Major Mono Display`;
            c.textBaseline = 'middle';
            c.fillStyle = onFill;
            var txtToWrite = `${(k+1)*30}`;
            c.fillText(txtToWrite, maxLeng*(i+Math.min(0.92, .30*(k+1)))/5-c.measureText((txtToWrite).toString()).width/2-levelScreenOffset[0], maxLeng*(j+.75)/5-levelScreenOffset[1]);
          }
        }

        //info text
        resetCanvasSettings();
        c.beginPath();
        c.font = `bold ${maxLeng*0.01}px Major Mono Display`;
        c.textBaseline = 'top';
        c.fillStyle = '#fff';
        if (blockOn) {
          c.fillStyle = onFill;
        }
        var txtToWrite = `best`;
        c.fillText(txtToWrite, maxLeng*(i+0.05)/5-levelScreenOffset[0], maxLeng*(j+0.02)/5-levelScreenOffset[1]);

        //recoard text
        resetCanvasSettings();
        c.beginPath();
        c.font = `bold ${maxLeng*0.04}px Major Mono Display`;
        c.textBaseline = 'top';
        c.fillStyle = '#fff';
        if (blockOn) {
          c.fillStyle = onFill;
        }
        var txtToWrite = `${0}`;
        c.fillText(txtToWrite, maxLeng*(i+.05)/5-levelScreenOffset[0], maxLeng*(j+.05)/5-levelScreenOffset[1]);

        //stage text
        resetCanvasSettings();
        c.beginPath();
        c.font = `bold ${maxLeng*0.06}px Major Mono Display`;
        c.textBaseline = 'middle';
        c.fillStyle = '#fff';
        if (blockOn) {
          c.fillStyle = onFill;
        }
        if (blockOn) {
          c.fillText(`${i+1}-${j+1}`, maxLeng*(i+.5)/5-c.measureText((`${i+1}-${j+1}`).toString()).width/2-levelScreenOffset[0], maxLeng*(j+.45)/5-levelScreenOffset[1]);
        } else {
          c.fillText(`${i+1}-${j+1}`, maxLeng*(i+.5)/5-c.measureText((`${i+1}-${j+1}`).toString()).width/2-levelScreenOffset[0], maxLeng*(j+.5)/5-levelScreenOffset[1]);
        }
      }
    }
      break;
  }
  if (screenState == 'main' || screenState == 'game') {
    for (var z = 0; z < 5; z++) {
      for (var name in particles) {
        if (particles[name].zIndex != z) continue;
        particles[name].update();
        c.beginPath();
        c.lineWidth = 1;
        c.fillStyle = particles[name].color;
        c.strokeStyle = particles[name].color;
        c.globalAlpha = particles[name].alpha;
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
  }
}

//override
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.csc = function(radian) {
  return 1/Math.sin(radian);
};
