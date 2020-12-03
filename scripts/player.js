function updatePlayer() {
  //if (!playing) return;
  for (var i in particles) {
    if (particles[i].type != 'player') continue;
    if ((keypress['37'] || keypress['39']) && (keypress['38'] || keypress['40'])) {
      var playerSpeed = particles[i].playerSpeed/Math.sqrt(2);
    } else {
      var playerSpeed = particles[i].playerSpeed;
    }
    var axisMult = [0, 0];
    if (keypress['37']) axisMult[0] += -1;
    if (keypress['38']) axisMult[1] += 1;
    if (keypress['39']) axisMult[0] += 1;
    if (keypress['40']) axisMult[1] += -1;
    if (keypress['37'] || keypress['38'] || keypress['39'] || keypress['40'] || playing == 0) {
      noControllTick = 0;
    } else {
      noControllTick++;
      if (noControllTick > 500) {
        playerDead();
      }
    }
    particles[i].position[0] += playerSpeed*axisMult[0];
    particles[i].position[1] += playerSpeed*axisMult[1];
    if (particles[i].screenParallaxPer > 0) {
      screenSettings.p[0] += playerSpeed/particles[i].screenParallaxPer*axisMult[0];
      screenSettings.p[1] += playerSpeed/particles[i].screenParallaxPer*axisMult[1];
    }
    if (particles[i].position[0] < -getScreenAbsSize()+particles[i].size[0]*particles[i].absSize+screenSettings.p[0]) particles[i].position[0] = -getScreenAbsSize()+particles[i].size[0]*particles[i].absSize+screenSettings.p[0];
    if (particles[i].position[0] > getScreenAbsSize()-particles[i].size[0]*particles[i].absSize+screenSettings.p[0]) particles[i].position[0] = getScreenAbsSize()-particles[i].size[0]*particles[i].absSize+screenSettings.p[0];
    if (particles[i].position[1] < -getScreenAbsSize()+particles[i].size[1]*particles[i].absSize+screenSettings.p[1]) particles[i].position[1] = -getScreenAbsSize()+particles[i].size[1]*particles[i].absSize+screenSettings.p[1];
    if (particles[i].position[1] > getScreenAbsSize()-particles[i].size[1]*particles[i].absSize+screenSettings.p[1]) particles[i].position[1] = getScreenAbsSize()-particles[i].size[1]*particles[i].absSize+screenSettings.p[1];
    for (var j in particles) {
      if (particles[j].type == 'player' || particles[j].type != 'enemy' || i == j) continue;
      if (particles[i].collisionWith(particles[j])) {
        particles[i].hp -= particles[j].atk;
        if (particles[j].breakOnAtttack == 1) {
          delete particles[j];
        }
        if (particles[i].hp <= 0) {
          playerDead();
          return;
        }
      }
    }
  }
}
