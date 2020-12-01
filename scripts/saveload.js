var tempSaveData = {
  'levelData': []
}
var saveData = {};
for (var i in tempSaveData) {
  if (saveData[i] === undefined) {
    saveData[i] = tempSaveData[i];
  }
}
