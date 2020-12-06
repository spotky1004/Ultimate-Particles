//init
var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

var screenState = 'main';
var screenSettings = {
  'size': 1,
  'p': [0, 0], 'scale': 1,
  'color': '#f5c542',
  'screenRotate': 0
}
var levelOn = -1;
var levelSelected = -1;

var score = 0;

//updateScreen
function updateScreen() {
  screenMaxLeng = Math.min(innerWidth, innerHeight);
  maxLeng = screenMaxLeng*0.96;

  document.getElementById('canvasBorder').style.setProperty('--thisLen', `${screenMaxLeng*screenSettings.size}px`);
  document.getElementById('canvasBorder').style.left = `${(innerWidth-(screenMaxLeng*(-screenSettings.p[0]+1-(1-screenSettings.size))))/2}px`;
  document.getElementById('canvasBorder').style.top = `${(innerHeight-(screenMaxLeng*(screenSettings.p[1]+1-(1-screenSettings.size))))/2}px`;

  canvasSize = maxLeng*screenSettings.size;
  canvas.width = canvasSize;
  canvas.height = canvasSize
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.fillStyle = screenSettings.color;
  c.rect(0, 0, canvas.width, canvas.height);
  c.fill();

  resetCanvasSettings();
  switch (screenState) {
    case 'main':
    levelOn = -1;

    var ijc = 6;
    var ic = ijc;
    var jc = ijc;

    if (levelSelected == -1) {
      var sSizeMax = Math.min(1, (1/ijc)*Math.pow(score/(20-Math.log(Math.max(1, score), 10)), 1/3));
      screenSizeSpan(sSizeMax, 10, 1);
      if (screenSettings.size > sSizeMax) {
        screenSettings.size = sSizeMax;
      }
      screenSettings.p = [screenSettings.size-1, -screenSettings.size+1];
      particles.player.playerSpeed = sSizeMax/30;
    }

    for (var i = 0; i < ic; i++) {
      for (var j = 0; j < jc; j++) {
        var blockOn = 0;
        levelScreenOffset = [maxLeng*(screenSettings.p[0]+1-screenSettings.size)/2, -(maxLeng*(screenSettings.p[1]-1+screenSettings.size))/2];
        if (levelSelected != -1 && levelSelected == i+j*ic) {
          blockOn = 1;
        }
        if (Math.abs(maxLeng*(i+.5)/ic-maxLeng*(particles.player.position[0]+1)/2) < maxLeng/ic/2 && Math.abs(maxLeng*(j+.5)/ic+maxLeng*(particles.player.position[1]-1)/2) < maxLeng/jc/2) {
          blockOn = 1;
          levelOn = i+j*ic;
          if (keypress['13'] && levelSelected == -1 && ((i <= 2 && j <= 2) || (i == 0 && j == 3) || (i == 2 && j == 1))) {
            levelSelected = levelOn;
            playing = 1;
            screenPositionSpan([2*((i+0.5)/ic)-1, -2*((j+0.5)/jc)+1], 10);
            screenSizeSpan(1/ijc, 10);
            setTimeout( function () {
              screenSizeSpan(1/ijc+.02, 5, 24);
              setTimeout( function () {
                screenSizeSpan(0, 7, 30);
                setTimeout( function () {
                  startLevel(levelSelected);
                }, tickSpeed*50);
              }, tickSpeed*25);
            }, 1000);
          }
        }
        var colSet = [Math.floor(256*(ic-1-i)/ic), Math.floor(256*(i+j)/(ic+jc)), Math.floor(256*(jc-1-j)/jc)];
        var onFill = `#${(Math.floor(240*(Math.min(1, colSet[0]/256+0.2)))).toString(16).padStart(2, '0')}${(Math.floor(240*(Math.min(1, colSet[1]/256+0.2)))).toString(16).padStart(2, '0')}${(Math.floor(240*(Math.min(1, colSet[2]/256+0.2)))).toString(16).padStart(2, '0')}`;

        //rect
        resetCanvasSettings();
        c.beginPath();
        c.rect(maxLeng*i/ic-levelScreenOffset[0], maxLeng*j/jc-levelScreenOffset[1], maxLeng/ic, maxLeng/jc);
        c.fillStyle = `#${colSet[0].toString(16).padStart(2, '0')}${colSet[1].toString(16).padStart(2, '0')}${colSet[2].toString(16).padStart(2, '0')}`;
        if (blockOn) {
          c.fillStyle = '#fff';
        }
        c.fill();

        //rank rect
        resetCanvasSettings();
        c.beginPath();
        c.rect(maxLeng*(i+0.05)/ic-levelScreenOffset[0], maxLeng*(j+0.85)/jc-levelScreenOffset[1], maxLeng/ic*0.9, maxLeng/jc*0.1);
        c.fillStyle = `#fff`;
        if (blockOn) {
          c.fillStyle = onFill;
        }
        c.fill();

        //rank rect 2
        resetCanvasSettings();
        c.beginPath();
        var partScore = saveData.levelData[`level${i+j*ijc}`].phase;
        c.rect(maxLeng*(i+0.05)/ic-levelScreenOffset[0], maxLeng*(j+0.85)/jc-levelScreenOffset[1], maxLeng/ic*Math.min(1, partScore/90)*0.9, maxLeng/jc*0.1);
        if (partScore >= 90) {
          c.fillStyle = `#e3e139`;
        } else if (partScore >= 60) {
          c.fillStyle = `#b0b0b0`;
        } else if (partScore >= 30) {
          c.fillStyle = `#c2902d`;
        } else {
          c.fillStyle = `#666`;
        }
        c.fill();

        //rank txt
        if (blockOn) {
          for (var k = 0; k < 3; k++) {
            resetCanvasSettings();
            c.beginPath();
            c.font = `bold ${maxLeng*0.1/ijc}px Major Mono Display`;
            c.textBaseline = 'middle';
            c.fillStyle = onFill;
            var txtToWrite = `${(k+1)*30}`;
            c.fillText(txtToWrite, maxLeng*(i+Math.min(0.92, .30*(k+1)))/ic-c.measureText((txtToWrite).toString()).width/2-levelScreenOffset[0], maxLeng*(j+.75)/jc-levelScreenOffset[1]);
          }
        }

        //info text
        resetCanvasSettings();
        c.beginPath();
        c.font = `bold ${maxLeng*0.05/ijc}px Major Mono Display`;
        c.textBaseline = 'top';
        c.fillStyle = '#fff';
        if (blockOn) {
          c.fillStyle = onFill;
        }
        var txtToWrite = `best`;
        c.fillText(txtToWrite, maxLeng*(i+0.05)/ic-levelScreenOffset[0], maxLeng*(j+0.02)/jc-levelScreenOffset[1]);

        //recoard text
        resetCanvasSettings();
        c.beginPath();
        c.font = `bold ${maxLeng*0.2/ijc}px Major Mono Display`;
        c.textBaseline = 'top';
        c.fillStyle = '#fff';
        if (blockOn) {
          c.fillStyle = onFill;
        }
        var txtToWrite = `${saveData.levelData[`level${i+j*ijc}`].phase}`;
        c.fillText(txtToWrite, maxLeng*(i+.05)/ic-levelScreenOffset[0], maxLeng*(j+.05)/jc-levelScreenOffset[1]);

        //stage text
        resetCanvasSettings();
        c.beginPath();
        c.font = `bold ${maxLeng*0.3/ijc}px Major Mono Display`;
        c.textBaseline = 'middle';
        c.fillStyle = '#fff';
        if (blockOn) {
          c.fillStyle = onFill;
        }
        var txtToWrite = `${Math.max(i,j)+1}-${((i!=j)?(Math.min(i,j)+((i>j)?i:0)):i*2)+1}`;
        //123 456: `${Math.max(i,j)+1}-${((i!=j)?(Math.min(i,j)+((i>j)?i:0)):i*2)+1}`
        //135 246: `${Math.max(i,j)+1}-${((i!=j)?((i>j)?j*2+1:i*2):i*2)+1}`
        if (blockOn) {
          c.fillText(txtToWrite, maxLeng*(i+.5)/ic-c.measureText((txtToWrite).toString()).width/2-levelScreenOffset[0], maxLeng*(j+.45)/jc-levelScreenOffset[1]);
        } else {
          c.fillText(txtToWrite, maxLeng*(i+.5)/ic-c.measureText((txtToWrite).toString()).width/2-levelScreenOffset[0], maxLeng*(j+.5)/jc-levelScreenOffset[1]);
        }
      }
    }
      break;
  }
  if (screenState == 'main' || screenState == 'game') {
    for (var z = 0; z < 5; z++) {
      for (var name in particles) {
        if (particles[name].zIndex != z || !particles[name].update(name)) continue;
        c.beginPath();
        resetCanvasSettings();
        c.lineWidth = 1;
        c.fillStyle = particles[name].color;
        c.strokeStyle = particles[name].color;
        c.globalAlpha = particles[name].alpha;
        var p = particles[name].position;
        var s = particles[name].sides;
        //var d = particles[name].deg;
        var d = particles[name].rotateDeg;
        switch (particles[name].type) {
          case 'text':
          c.font = `bold ${maxLeng*particles[name].absSize}px Major Mono Display`;
          c.textBaseline = 'middle';
          var lastPos = [
            maxLeng * (-(screenSettings.p[0]+(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 + p[0] / 2 * screenSettings.scale)-c.measureText(particles[name].text).width/2,
            maxLeng * ((screenSettings.p[1]-(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 - p[1] / 2 * screenSettings.scale)
          ];
          c.fillText(particles[name].text, lastPos[0], lastPos[1]);
            break;
          default:
          var d1 = (-d + 180 / s) % 360;
          var sScale = 1/(particles[name].sides/2*Math.cos(Math.rad((180-(180/particles[name].sides*(particles[name].sides-2)))/2)))/0.7071067811865475;
          var centerL = Math.csc(Math.rad(180 / s)) / 2 * particles[name].absSize*sScale;
          var lastPos = [
            maxLeng * (-(screenSettings.p[0]+(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 + p[0] / 2 * screenSettings.scale - Math.sin(Math.rad(d1)) * centerL * particles[name].size[0] * screenSettings.scale),
            maxLeng * ((screenSettings.p[1]-(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 - p[1] / 2 * screenSettings.scale - Math.cos(Math.rad(d1)) * centerL * particles[name].size[1] * screenSettings.scale)
          ];
          if (s == 4) {
            c.rect(lastPos[0]-maxLeng*particles[name].getTotAbsSize()[0], lastPos[1]-maxLeng*particles[name].getTotAbsSize()[1], maxLeng*particles[name].getTotAbsSize()[0], maxLeng*particles[name].getTotAbsSize()[1]);
          } else {
            c.moveTo(lastPos[0], lastPos[1]);
            for (var i = 0; i < particles[name].sides; i++) {
              lastPos[0] += Math.sin(Math.PI * 2 / particles[name].sides * i + Math.rad(d + 90)) * (maxLeng * particles[name].absSize) * particles[name].size[0] * screenSettings.scale * sScale;
              lastPos[1] -= Math.cos(Math.PI * 2 / particles[name].sides * i + Math.rad(d + 90)) * (maxLeng * particles[name].absSize) * particles[name].size[1] * screenSettings.scale * sScale;
              c.lineTo(lastPos[0], lastPos[1]);
            }
            c.closePath();
          }
          c.fill();
          c.stroke();
          if (particles[name].effects.includes('glow')) {
            var lastPos = [
              maxLeng * (-(screenSettings.p[0]+(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 + p[0] / 2 * screenSettings.scale),
              maxLeng * ((screenSettings.p[1]-(1-screenSettings.size)) / 2 * screenSettings.scale + 0.5 - p[1] / 2 * screenSettings.scale)
            ];
            var grd = c.createRadialGradient(lastPos[0], lastPos[1], maxLeng*Math.max(particles[name].getTotAbsSize()[0], particles[name].getTotAbsSize()[1])*0.25, lastPos[0], lastPos[1], maxLeng*Math.max(particles[name].getTotAbsSize()[0], particles[name].getTotAbsSize()[1]+0.005));
            grd.addColorStop(0, particles[name].color);
            grd.addColorStop(1, hexToRgba(particles[name].color));
            c.fillStyle = grd;
            c.fillRect(lastPos[0]-maxLeng*0.03, lastPos[1]-maxLeng*0.03, maxLeng*0.06, maxLeng*0.06);
          }
        }
      }
    }
  }
}
