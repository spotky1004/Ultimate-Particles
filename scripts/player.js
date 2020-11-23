function updatePlayer() {
  var screenAbsSize = screenSettings.size*(1/screenSettings.scale);
  if (!playing) return;
  for (var i in particles) {
    if (particles[i].type != 'player') continue;
    if ((keypress['37'] || keypress['39']) && (keypress['38'] || keypress['40'])) {
      var playerSpeed = 0.01/Math.sqrt(2);
    } else {
      var playerSpeed = 0.01;
    }
    if (keypress['37']) particles[i].position[0] -= playerSpeed;
    if (keypress['38']) particles[i].position[1] += playerSpeed;
    if (keypress['39']) particles[i].position[0] += playerSpeed;
    if (keypress['40']) particles[i].position[1] -= playerSpeed;
    if (particles[i].position[0] < -screenAbsSize+particles[i].size[0]) particles[i].position[0] = -screenAbsSize+particles[i].size[0];
    if (particles[i].position[0] > screenAbsSize-particles[i].size[0]) particles[i].position[0] = screenAbsSize-particles[i].size[0];
    if (particles[i].position[1] < -screenAbsSize+particles[i].size[1]) particles[i].position[1] = -screenAbsSize+particles[i].size[1];
    if (particles[i].position[1] > screenAbsSize-particles[i].size[1]) particles[i].position[1] = screenAbsSize-particles[i].size[1];
    for (var j in particles) {
      if (particles[j].type == 'player' || particles[j].type != 'enemy') continue;
      if (
        particles[i].position[0]+particles[i].size[0] > particles[j].position[0]-particles[j].size[0]*particles[j].hitboxSize &&
        particles[i].position[0]-particles[i].size[0] < particles[j].position[0]+particles[j].size[0]*particles[j].hitboxSize &&
        particles[i].position[1]+particles[i].size[1] > particles[j].position[1]-particles[j].size[1]*particles[j].hitboxSize &&
        particles[i].position[1]-particles[i].size[1] < particles[j].position[1]+particles[j].size[1]*particles[j].hitboxSize
      ) {
        particles = {};
        levelTasks.cancelAll();
        return;
      }
    }
  }
}
