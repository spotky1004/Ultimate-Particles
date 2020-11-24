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
    for (var i = 0; i < this._data.length; i++) {
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
    for (var i = 0; i < this._data.length; i++) {
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

//spanFunctions
async function screenSizeSpan(size=1, per=1, loop=100) {
  screenSettings.size = (size+screenSettings.size*per)/(per+1);
  if(loop == 0 || Math.abs(screenSettings.size[0]-size) < 0.001) return;
  await timer(tickSpeed);
  screenSizeSpan(size, per, loop-1);
}
async function screenScaleSpan(scale=1, per=1, loop=100) {
  screenSettings.scale = (scale+screenSettings.scale*per)/(per+1);
  if(loop == 0 || Math.abs(screenSettings.scale[0]-scale) < 0.001) return;
  await timer(tickSpeed);
  screenScaleSpan(scale, per, loop-1);
}
async function particleSpeedSpan(speed=1, per=1, loop=100) {
  levelSettings.particleSpeed = (speed+levelSettings.particleSpeed*per)/(per+1);
  if(loop == 0 || Math.abs(levelSettings.particleSpeed-speed) < 0.001) return;
  await timer(tickSpeed);
  particleSpeedSpan(speed, per, loop-1);
}
