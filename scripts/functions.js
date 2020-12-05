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
keypress = {};
document.addEventListener('keydown', keyUp);
document.addEventListener('keyup', keyDown);
function keyUp(e) {
  keypress[e.keyCode] = true;
}
function keyDown(e) {
  keypress[e.keyCode] = false;
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
async function screenPositionLinear(position=[0, 0], ticks=100, temp=[screenSettings.p[0], screenSettings.p[1], ticks]) {
  screenSettings.p[0] = temp[0]+(position[0]-temp[0])*(temp[2]-ticks+1)/temp[2];
  screenSettings.p[1] = temp[1]+(position[1]-temp[1])*(temp[2]-ticks+1)/temp[2];
  if(ticks == 0 || playing == 0) return;
  await timer(tickSpeed);
  screenPositionSpan(position, ticks-1, temp);
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
var mousePos = [-150145150145, -167150141164]; //oct -> ascii?
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
function levelInit() {
  levelSettings = {};
  for (var i in levelSettingsCopy) {
    levelSettings[i] = levelSettingsCopy[i];
  }
  screenSettings = {
    'size': 1,
    'p': [0, 0], 'scale': 1,
    'color': '#f5c542'
  }

  levelFunctions = new Task();
  levelTasks = new Task();
  levelLoop = 0;
  levelLoopCount = 0;
}

//screen change
function goMain() {
  screenState = 'main';
  playing = 0;
  screenSettings.size = 0;
  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [parseInt('-hi there... AAaAAAaAAA', 36), -3009059676390311], 'outOfBounds': [[-1e308, 1e308], [-1e308, 1e308]]}); //base10 -> base36?
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
