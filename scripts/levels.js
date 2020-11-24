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

  levelFunctions = new Task();
  levelTasks = new Task();
  levelLoop = 0;
  levelLoopCount = 0;
}

function levelTest() {
  levelInit();

  levelTasks = new Task(
    [
      {callback: function(){
        //phase1
        for (var i = 0; i < 100; i++) {
          particles[`Phase1-Shape${i}`] = new Particle().randMove('rR').setSpeed(10);
        }
      }, time: 0, activated: false},
      {callback: function(){
        //phase2
        screenScaleSpan(0.5, 10);
        for (var i = 0; i < 100; i++) {
          particles[`Phase2-Shape${i}-1`] = new Particle({'color' : '#f00'})
          .moveTo([Math.sin(Math.rad(3.60*i)), -Math.cos(Math.rad(3.60*i))])
          .setDeg(360-3.60*i)
          .setSpeed(6);

          particles[`Phase2-Shape${i}-2`] = new Particle({'color' : '#f00'})
          .moveTo([Math.sin(Math.rad(3.60*i)), -Math.cos(Math.rad(3.60*i))])
          .setDeg((540-3.60*i)%360)
          .setSpeed(6);
        }
      }, time: 4000, activated: false},
      {callback: function(){
        screenScaleSpan(1, 10);
        screenSizeSpan(0.8, 10);
        for (var i = 0; i < 10; i++) {
          particles[`Phase3-Shape${i}`] = new Particle({'color' : '#00f'}).setSides(i+4).setDeg(36*i).setSpeed(5).setSize(4);
        }
      }, time: 8000, activated: false},
    ]
  );
  levelFunctions = null;
  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
function levelTest2() {
  levelInit();

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'hitboxSize': 0.8, 'absSize': 1.5});
  levelTasks.activateAll();
  levelLoop = setInterval( function () {
    levelLoopCount++;
    for (var i = 0; i < Math.sqrt(levelLoopCount)/2+2; i++) {
      particles[`Phase${levelLoopCount}-Shape${i}`] = new Particle({'spanPer': 30, 'absSizeI': 1, 'absSizeIType': 'span', 'color': '#327ce3'}).setSpeed(10);
      if (Math.random() < 0.5) {
        particles[`Phase${levelLoopCount}-Shape${i}`].randMove('r2').setDeg(90);
      } else {
        particles[`Phase${levelLoopCount}-Shape${i}`].randMove('r3').setDeg(270);
      }
    }
    for (var i in particles) {
      if (!i.includes('Phase')) continue;
      particles[i].absSize = Math.min(2+Math.log(levelLoopCount^0.3), 3);
    }
    levelSettings.particleSpeed = 1;
    particleSpeedSpan(0.3, 20, 30);
    screenSettings.size = 1.03+Math.log(levelLoopCount)/100;
    screenSizeSpan(0.97, 20, 30);
    document.getElementById('scroe').innerHTML = `Phase: ${levelLoopCount}`
  }, tickSpeed*30);
}
function levelTemplate() {
  levelInit();

  levelFunctions = new Task(
    [
      {callback: function(){
        console.log(1);
      }, time: 0, activated: false},
    ]
  );

  levelTasks = new Task(
    [
      {callback: function(){
        //phase1
        for (var i = 0; i < 50; i++) {
          particles[`Phase1-Shape${i}`] = new Particle().randMove('rR').setSpeed(10);
        }
        levelFunctions.activate(0);
      }, time: 0, activated: false},
    ]
  );
  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
