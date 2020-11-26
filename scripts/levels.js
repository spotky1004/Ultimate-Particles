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
    'p': [0, 0], 'scale': 1
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
function levelTest3() {
  levelInit();

  levelLoop = setInterval( function () {
    levelLoopCount++;
    for (var i = 0; i < 15+levelLoopCount*3; i++) {
      var genPos = [Math.random()*2-1, Math.random()*2-1];
      if (Math.abs(particles.player.position[0]-genPos[0]) < 0.5 && Math.abs(particles.player.position[1]-genPos[1]) < 0.5) continue;
      particles[`Phase${levelLoopCount}-TraceParticle${i}`] = new Particle({'color': `#${(Math.floor(Math.random()*4)+8).toString(16)}${(Math.floor(Math.random()*4)+8).toString(16)}${(Math.floor(Math.random()*4)+8).toString(16)}`, 'hitboxSize': 0.8, 'moveType': ['trace', 'player']}).setSpeed(Math.random()*3+0.7).moveTo(genPos);
    }
    particles.player.hp++;
    document.getElementById('scroe').innerHTML = `Phase: ${levelLoopCount}`;
    document.getElementById('hp').innerHTML = `HP: ${particles.player.hp}`;
  }, tickSpeed*150);

  particles['player'] = new Particle({'type': 'player', 'color': '#00f', 'hitboxSize': 0.8, 'absSize': 1.5});
}
function levelTest4() {
  levelInit();
  screenSettings.size = 0;

  levelFunctions = new Task(
    [
      {callback: function(){
        var movePoint = [Math.random()*(0.5-Math.sqrt(levelLoopCount)/100)*2-0.5-Math.sqrt(levelLoopCount)/100, Math.random()*(0.5-Math.sqrt(levelLoopCount)/100)*2-0.5-Math.sqrt(levelLoopCount)/100];
        screenSettings.p = [movePoint[0], movePoint[1]];
        particles['player'].position = [movePoint[0], movePoint[1]];
        screenSizeSpan(Math.max(0.5-Math.sqrt(levelLoopCount)/100, 0.25), 4, 30);
        for (var i = 0; i < 10+Math.sqrt(Math.sqrt(levelLoopCount)); i++) {
          particles[`particle${i}`] = new Particle({'color': '#f00', 'speed': Math.min(Math.random()*(2+Math.sqrt(levelLoopCount**0.9)/5)+4, 10), 'atk': 4}).randMove('sR');
        }
        for (var i = 0; i < 100; i++) {
          //particles[`blocker${i}`] = new Particle({'color': '#eee', 'speed': 100, 'atk': 1, 'moveType': ['traceCircle', 'player', 1]}).randMove('rR');
        }
      }, time: tickSpeed*Math.max(20, 50-levelLoopCount), activated: false},
    ]
  );

  levelLoop = setInterval( function () {
    levelLoopCount++;
    screenSizeSpan(0, Math.max(20-levelLoopCount, 3), Math.max(20, 50-levelLoopCount));
    levelFunctions.activate(0);
    document.getElementById('scroe').innerHTML = `Phase: ${levelLoopCount}`;
    document.getElementById('hp').innerHTML = `HP: ${particles.player.hp}`;
  }, tickSpeed*150);

  particles['player'] = new Particle({'type': 'player', 'color': '#a98b0e', 'hitboxSize': 0.8, 'absSize': 1.5, 'playerSpeed': 0.015, 'screenParallaxPer': 2});
}

function levelTemplate() {
  levelInit();

  levelFunctions = new Task(
    [
      {callback: function(){
        //some functions here!
      }, time: 0, activated: false},
    ]
  );

  levelTasks = new Task(
    [
      {callback: function(){
        //some functions here!
      }, time: 0, activated: false},
    ]
  );
  levelLoop = setInterval( function () {
    //some functions here!
  }, tickSpeed*10);
  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
function levelPlayer() {
  levelInit();
  var s = 20;
  for (var i = 0; i < s; i++) {
    for (var j = 0; j < s; j++) {
      particles[`player${i}_${j}`] = new Particle({'type': 'player', 'color': `#${Math.floor(16/s*i).toString(16)}${Math.floor(16/s*j).toString(16)}${Math.floor(0).toString(16)}`})
      .moveTo([(2/s*i-1+2/s*(i+1)-1)/2, (2/s*j-1+2/s*(j+1)-1)/2]);
    }
  }
}
