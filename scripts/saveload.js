var tempSaveData = {
  'levelData': {}
}
var saveData = {};

savePoint = localStorage['ultimateParticlesReworked_S1'];

function save() {
  localStorage[savePoint] = JSON.stringify(saveData);
}
function load() {
  saveData = JSON.parse(localStorage[savePoint]);
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
}

load();
