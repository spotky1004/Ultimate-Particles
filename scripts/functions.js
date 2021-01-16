'use strict';

//tasks (ty CrackTrough for made this for me!)
class Task {
  constructor(v1, v2) {
    if (typeof v1 == "function") {
      this._data[0] = { callback: v1, time: v2, activated: false }
    } else if (typeof v1 == "object") {
      this._data = v1;
    }
  }

  _data = [{ callback: function(){}, time: 0, activated: false }]
  _dataRaw = [];

  cancel(index) {
    if (this._data[index] != null) {
      if (this._data[index].activated) {
        this._data[index] = null;
        if (this._dataRaw[index] != null) clearTimeout(this._dataRaw[index]);
      }
    }
  }

  cancelAll() {
    for (var i = 0, l = this._data.length; i < l; i++) {
      var raw = this._dataRaw[i];
      if (raw != null) {
        clearTimeout(raw);
      }
    }
  }

  activate(index, arg=null) {
    this._data[index].activated = true;
    this._dataRaw[index] = setTimeout(this._data[index].callback, this._data[index].time, arg);
  }

  activateAll() {
    for (var i = 0, l = this._data.length; i <l ; i++) {
      this._data[i].activated = true;
      this._dataRaw[i] = setTimeout(this._data[i].callback, this._data[i].time);
    }
  }
}

//timeout for async function
const timer = ms => new Promise(
  res => {
    setTimeout(res, ms);
  }
)

//keyboard detect
var keypress = {};
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
var resetP = 0, resetTimeout;
function keyDown(e) {
  keypress[e.keyCode] = true;

  switch (e.keyCode) {
    case 87:
    // redirect wasd key to arrow keys
    keypress[38] = true;
      break;
    case 65:
    // redirect wasd key to arrow keys
    keypress[37] = true;
      break;
    case 83:
    // redirect wasd key to arrow keys
    keypress[40] = true;
      break;
    case 68:
    // redirect wasd key to arrow keys
    keypress[39] = true;
      break;
    // esc
    case 27:
    if (innerPlaying) {
      playerDead(1);
    }
      break;
    // R
    case 82:
    if (innerPlaying) {
      clearTimeout(resetTimeout);
      resetP = 1;
      sendInfo('press enter to confrim restart', 3000);
      resetTimeout = setTimeout( function () {
        resetP = 0;
      }, 3000);
    }
      break;
    // enter
    case 13:
    if (innerPlaying && resetP) {
      clearTimeout(resetTimeout);
      try {
        levelTasks.cancelAll();
      } catch (e) {

      }
      try {
        levelFunctions.cancelAll();
      } catch (e) {

      }
      clearInterval(levelLoop);
      particles = {};
      new Function(`${levelSelectedFunc}()`)();
      resetP = 0;
    }
      break;
  }
}
function keyUp(e) {
  keypress[e.keyCode] = false;

  // redirect asdf key to arrow keys
  switch (e.keyCode) {
    case 87:
    keypress[38] = false;
      break;
    case 65:
    keypress[37] = false;
      break;
    case 83:
    keypress[40] = false;
      break;
    case 68:
    keypress[39] = false;
      break;
  }
}

//span effect function
async function screenSizeSpan(size=1, per=1, loop=100) {
  screenSettings.size = (size+screenSettings.size*per)/(per+1);
  if(loop == 0 || Math.abs(screenSettings.size-size) < 0.001 || playing == 0) return;
  await timer(tickSpeed);
  screenSizeSpan(size, per, loop-1);
}
async function screenScaleSpan(scale=1, per=1, loop=100) {
  screenSettings.scale = (scale+screenSettings.scale*per)/(per+1);
  if(loop == 0 || Math.abs(screenSettings.scale[0]-scale) < 0.001 || playing == 0) return;
  await timer(tickSpeed);
  screenScaleSpan(scale, per, loop-1);
}
async function screenPositionSpan(position=[0, 0], per=1, loop=100) {
  screenSettings.p[0] = (position[0]+screenSettings.p[0]*per)/(per+1);
  screenSettings.p[1] = (position[1]+screenSettings.p[1]*per)/(per+1);
  if(loop == 0 || (Math.abs(screenSettings.p[0]-position[0]) < 0.001 && Math.abs(screenSettings.p[1]-position[1]) < 0.001) || playing == 0) return;
  await timer(tickSpeed);
  screenPositionSpan(position, per, loop-1);
}
async function particleSpeedSpan(speed=1, per=1, loop=100) {
  levelSettings.particleSpeed = (speed+levelSettings.particleSpeed*per)/(per+1);
  if(loop == 0 || Math.abs(levelSettings.particleSpeed-speed) < 0.001 || playing == 0) return;
  await timer(tickSpeed);
  particleSpeedSpan(speed, per, loop-1);
}
async function screenPositionLinear(position=[0, 0], loop=100, temp=[screenSettings.p[0], screenSettings.p[1], loop]) {
  screenSettings.p[0] -= (temp[0]-position[0])/temp[2];
  screenSettings.p[1] -= (temp[1]-position[1])/temp[2];
  if(loop == 0 || playing == 0) return;
  await timer(tickSpeed);
  screenPositionLinear(position, loop-1, temp);
}

//get funtcion
function getScreenAbsSize() {
  return screenSettings.size*(1/screenSettings.scale);
}
function getScore() {
  var tempScore = 0;
  for (var i in saveData.levelData) {
    tempScore += Math.min(90, saveData.levelData[i].phase);
  }
  return tempScore;
}

//color
function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return '#' + Math.floor(r*255).toString(16).padStart(2, Math.floor(r*255).toString(16)) + Math.floor(g*255).toString(16).padStart(2, Math.floor(g*255).toString(16)) + Math.floor(b*255).toString(16).padStart(2, Math.floor(b*255).toString(16));
}
function rgbToHsv(r, g, b) {
  if (arguments.length === 1) {
      g = r.g, b = r.b, r = r.r;
  }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

  switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return {
      h: h,
      s: s,
      v: v
  };
}
function hexToRgba(hex, alpha=0) {
  hex = hex.substr(1, 6);
  var subLeng = hex.length/3;
  return `rgba(${(Number('0x' + hex.substr(subLeng*0, subLeng))*(256/16**subLeng)).toString()}, ${(Number('0x' + hex.substr(subLeng*1, subLeng))*(256/16**subLeng)).toString()}, ${(Number('0x' + hex.substr(subLeng*2, subLeng))*(256/16**subLeng)).toString()}, ${alpha})`;
}
function hexToNum(hex) {
  var colors = [];
  for (var i = 0; i < 3; i++) {
    if (hex.length == 7) {
      colors.push(Number('0x' + hex.substr(1+i*2, 2)));
    } else {
      colors.push(Number('0x' + hex.substr(1+i, 1).repeat(2)));
    }
  }
  return colors;
}
function numToRgb(arr) {
  return `#${Math.floor(arr[0]).toString(16).padStart(2, Math.floor(arr[0]).toString(16))}${Math.floor(arr[1]).toString(16).padStart(2, Math.floor(arr[1]).toString(16))}${Math.floor(arr[2]).toString(16).padStart(2, Math.floor(arr[2]).toString(16))}`;
}
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return `#${Math.round(r * 255).toString(16)}${Math.round(g * 255).toString(16)}${Math.round(b * 255).toString(16)}`;
}
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

//calculate
function incrementCalc(a, b, p) {
  return a+b*p;
}
function multiplyCalc(a, b, p) {
  return a*b**p;
}
function spanCalc(a, b, p) {
  return (b+a*p)/(p+1);
}
function doPolygonsIntersect (a, b) {
  // polygons collision (https://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles)

    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
}
function isUndefined(thing) {
  if (thing === undefined) {
    return 1;
  } else {
    return 0;
  }
}
function getCenter(points) {
  // formula from (https://m.blog.naver.com/PostView.nhn?blogId=a630203&logNo=120213239668&proxyReferer=https:%2F%2Fwww.google.com%2F)

  var a = 0, cx = 0, cy = 0;

  // a: x_i * y_(i+1) - x_(i+1) * y_i * 1/2
  for (var i = 0, l = points.length; i < l; i++) {
    a += (points[i].x*points[(i+1)%l].y-points[(i+1)%l].x*points[i].y)/2;
  }

  var c = 1/(6*a);
  // cx: ( x_i + x_(i+1) ) * ( x_i * y_(i+1) - x_(i+1) * y_i ) * c
  // cy: ( y_i + y_(i+1) ) * ( x_i * y_(i+1) - x_(i+1) * y_i ) * c
  for (var i = 0, l = points.length; i < l; i++) {
    var c2 = (points[i].x*points[(i+1)%l].y-points[(i+1)%l].x*points[i].y)*c;
    cx += (points[i].x+points[(i+1)%l].x)*c2;
    cy += (points[i].y+points[(i+1)%l].y)*c2;
  }
  return [cx, cy, a];
}
function rotatePoint(position, center, deg) {
  var dist = Math.sqrt((position[0]-center[0])**2+(position[1]-center[1])**2);
  var centerDeg = (Math.atan2(position[1]-center[1], position[0]-center[0])*180/Math.PI-(deg%360)+810)%360;
  return [Math.sin(Math.rad(centerDeg))*dist+center[0], -Math.cos(Math.rad(centerDeg))*dist+center[1]];
}

//short random
function screenRand() {
  return Math.random()*getScreenAbsSize()*2-getScreenAbsSize();
}
function boolRand() {
  return Math.floor(Math.random()*2);
}
function signRand() {
  return boolRand()*2-1;
}

//short calc
function calcAlphaI(tick, power=1) {
  return power/(tick)*-1000/tickSpeed;
}

//dom update
function gameStatusUpdate() {
  document.getElementById('phase').innerHTML = `phase: ${levelLoopCount}`;
  document.getElementById('hp').innerHTML = `hp: ${(particles.player ? particles.player.hp : 0)}`;
  score = getScore();
  document.getElementById('score').innerHTML = `score: ${score}`;
  document.getElementById('info').style.bottom = `${infoVars[0]}vh`;
  document.getElementById('info').style.opacity = `${infoVars[1].toString()}`;
  //document.getElementById('noControllTick').innerHTML = `c: ${Math.floor(noControllTick/10)}/50`;
  document.getElementById('worldChange').style.display = (playing ? 'none' : 'block');
  document.getElementById('worldChange').innerHTML = (getScore() < 1500 ? '1500 score' : screenState);
  if (getScore() > 1500) {
    document.getElementById('worldChange').classList.remove('disabled');
  }
}
var infoTimeout, infoTimeout2;
var infoVars = [-1, 0];
function sendInfo(str, lastTime=2000) {
  document.getElementById('info').innerHTML = str.toString();
  clearInterval(infoTimeout);
  clearTimeout(infoTimeout2);
  infoTimeout = setInterval( function () {
    infoVars[0] = Math.min(1, Math.max(-2, infoVars[0]+0.1));
    infoVars[1] = Math.min(1, Math.max(0, infoVars[1]+0.1));
  }, 20);
  infoTimeout2 = setTimeout( function () {
    clearInterval(infoTimeout);
    infoTimeout = setInterval( function () {
      infoVars[0] = Math.min(1, Math.max(-2, infoVars[0]-0.1));
      infoVars[1] = Math.min(1, Math.max(0, infoVars[1]-0.1));
    }, 20);
  }, lastTime);
}

//document event
document.onmousemove = getMousePos;
var mousePos = [-150145150145, -167150141164]; // oct -> ascii?
function getMousePos(event) {
  mousePos = [event.clientX, event.clientY]
}

//canvas
function resetCanvasSettings() {
  c.lineWidth = 1;
  c.fillStyle = '#000';
  c.strokeStyle = '#000';
  c.globalAlpha = 1;
}
var levelSettingsCopy = {
  'particleSpeed': 1,
  'atkMult': 1
}
var levelSettings, levelLoopCount;
var levelLoop = 0;
var levelFunctions, levelTasks, levelLoop, levelLoopCount, levelVars;
function levelInit() {
  try {
    levelTasks.cancelAll();
  } catch (e) {

  }
  try {
    levelFunctions.cancelAll();
  } catch (e) {

  }
  clearInterval(levelLoop);
  levelSettings = {};
  for (var i in levelSettingsCopy) {
    levelSettings[i] = levelSettingsCopy[i];
  }
  screenSettings = {
    'size': 1,
    'p': [0, 0], 'scale': 1,
    'color': '#f5c542',
    'screenRotate': 0
  }

  levelFunctions = new Task();
  levelTasks = new Task();
  levelLoop = 0;
  levelLoopCount = 0;
  levelVars = [];

  innerPlaying = 1;
}

//screen change
function goMain() {
  levelInit();
  screenState = 'main';
  playing = 0;
  screenSettings.size = 0;
  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [parseInt('-hi there... AAaAAAaAAA', 36), -3009059676390311], 'outOfBounds': [[-1e308, 1e308], [-1e308, 1e308]], 'effects': ['glow']}); //base10 -> base36?
  levelSelected = -1;
  innerPlaying = 0;
}
function goExtra() {
  levelInit();
  screenState = 'extra';
  screenSettings.p = [0, 0];
  screenSettings.size = 1;
  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [0, 0], 'outOfBounds': [[-1e308, 1e308], [-1e308, 1e308]], 'effects': ['glow']}); //base10 -> base36?
  extraIdxPoint = 0;
  innerPlaying = 0;
}
function playerDead(skipSave=0) {
  var bossLevels = [21];
  if (!skipSave || !bossLevels.includes(levelSelected)) {
    try {
      if (saveData.levelData[`level${levelSelected}`] !== undefined) {
        if (particles.player.hp !== undefined && bossLevels.includes(levelSelected)) {
          saveData.levelData[`level${levelSelected}`].phase = Math.max(saveData.levelData[`level${levelSelected}`].phase, particles.player.hp);
        } else {
          saveData.levelData[`level${levelSelected}`].phase = Math.max(saveData.levelData[`level${levelSelected}`].phase, levelLoopCount);
        }
      }
    } catch (e) {

    }
  }
  levelInit();
  particles = {};
  innerPlaying = 0;
  goMain();
  save();
}

//override
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.csc = function(radian) {
  return 1/Math.sin(radian);
};
Math.log = (function() {
  var log = Math.log;
  return function(n, base) {
    return log(n)/(base ? log(base) : 1);
  };
})();
