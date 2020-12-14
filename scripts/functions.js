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

  activate(index) {
    this._data[index].activated = true;
    this._dataRaw[index] = setTimeout(this._data[index].callback, this._data[index].time);
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
function keyDown(e) {
  keypress[e.keyCode] = true;

  // redirect asdf key to arrow keys
  switch (e.keyCode) {
    case 87:
    keypress[38] = true;
      break;
    case 65:
    keypress[37] = true;
      break;
    case 83:
    keypress[40] = true;
      break;
    case 68:
    keypress[39] = true;
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
  return '#' + Math.floor(r*255).toString(16) + Math.floor(g*255).toString(16) + Math.floor(b*255).toString(16);
}
function hexToRgba(hex, alpha=0) {
  hex = hex.substr(1, 6);
  var subLeng = hex.length/3;
  return `rgba(${(Number('0x' + hex.substr(subLeng*0, subLeng))*(256/16**subLeng)).toString()}, ${(Number('0x' + hex.substr(subLeng*1, subLeng))*(256/16**subLeng)).toString()}, ${(Number('0x' + hex.substr(subLeng*2, subLeng))*(256/16**subLeng)).toString()}, ${alpha})`;
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
// polygons collision (https://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles)
function doPolygonsIntersect (a, b) {
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
  //document.getElementById('noControllTick').innerHTML = `c: ${Math.floor(noControllTick/10)}/50`;
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
  'particleSpeed': 1
}
var levelSettings, levelLoopCount;
var levelLoop = 0;
var levelFunctions, levelTasks, levelLoop, levelLoopCount, levelVars;
function levelInit() {
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
}

//screen change
function goMain() {
  screenState = 'main';
  playing = 0;
  screenSettings.size = 0;
  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [parseInt('-hi there... AAaAAAaAAA', 36), -3009059676390311], 'outOfBounds': [[-1e308, 1e308], [-1e308, 1e308]], 'effects': ['glow']}); //base10 -> base36?
  levelSelected = -1;
}
function playerDead() {
  particles = {};
  try {
    levelTasks.cancelAll();
  } catch (e) {

  }
  try {
    levelFunctions.cancelAll();
  } catch (e) {

  }
  clearInterval(levelLoop);
  if (saveData.levelData[`level${levelSelected}`] !== undefined) {
    saveData.levelData[`level${levelSelected}`].phase = Math.max(saveData.levelData[`level${levelSelected}`].phase, levelLoopCount);
  }
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
