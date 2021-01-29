'use strict';

var tempSaveData = {
  'levelData': {},
  'd': 0
}
var saveData = {};

var savePoint = localStorage['ultimateParticlesReworked_S1'];

function save() {
  localStorage[savePoint] = JSON.stringify(saveData);
}
function load() {
  if (localStorage[savePoint] !== undefined) {
    saveData = JSON.parse(localStorage[savePoint]);
  }

  for (var i in tempSaveData) {
    if (saveData[i] === undefined) {
      saveData[i] = tempSaveData[i];
    }
  }

  //handle 'levelData'
  for (var i = 0; i < 36; i++) {
    if (saveData.levelData[`level${i}`] === undefined) {
      saveData.levelData[`level${i}`] = {'phase': 0};
    }
  }

  // old version path
  if (saveData.d < 1) {
    saveData.levelData[`level27`].phase = 0;
    saveData.d = 1;
  }
  if (saveData.d < 2) {
    saveData.levelData.level32.phase = 0;
    saveData.d = 2;
  }
}

load();
