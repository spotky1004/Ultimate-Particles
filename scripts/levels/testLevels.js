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
  }, tickSpeed*150);

  particles['player'] = new Particle({'type': 'player', 'color': '#a98b0e', 'hitboxSize': 0.8, 'absSize': 1.5, 'playerSpeed': 0.015, 'screenParallaxPer': 2});
}
function levelTest5() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      screenSettings.size = 1.03;
      screenSizeSpan(1, 10)
      var dist = 1.2;
      for (var i = 0; i < 10+Math.sqrt(levelLoopCount)/3; i++) {
        var deg = Math.random()*360;
        particles[`P${levelLoopCount}S${i}`] = new Particle({'color': hsvToRgb(levelLoopCount*(0.001*(levelLoopCount/30+1)), 0.8, 0.5), 'speed': 0.5, 'moveType': ['circle']}).moveTo([Math.sin(Math.rad(deg))*dist, -Math.cos(Math.rad(deg))*dist]);
      }
      if (levelLoopCount > 1) {
        for (var i = 0; i < 10+Math.sqrt(levelLoopCount)/5; i++) {
          particles[`P${levelLoopCount-1}S${i}`].moveType = ['trace', 'player'];
          particles[`P${levelLoopCount-1}S${i}`].speed = 2+Math.sqrt(levelLoopCount)/3;
          particles[`P${levelLoopCount-1}S${i}`].speedI = 0.3+Math.sqrt(levelLoopCount)/15;
        }
      }
      if (levelLoopCount > 2) {
        for (var i = 0; i < 10+Math.sqrt(levelLoopCount)/5; i++) {
          particles[`P${levelLoopCount-2}S${i}`].moveType = ['normal'];
          particles[`P${levelLoopCount-2}S${i}`].speedI = 0.7+Math.sqrt(levelLoopCount)/7;
        }
      }
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    levelFunctions.activate(0);
  }, tickSpeed*100);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  //levelTasks.activateAll();
}

function levelPillowTest() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      screenSizeSpan(0.8, 200);
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    for (var i = 0; i < 9; i++) {
      particles[`PPhase${levelLoopCount}with${i}`] = new Particle({'color': hsvToRgb(Math.random(), 0.5, 0.5), 'speed': Math.random()*10+55, 'speedI': 1, 'speedIType': 'span', 'spanPer': 27, 'hitboxSize': 0.66}).randMove('r1')
      .setDeg((Math.random()*30+345)%360);
    }
  }, tickSpeed*20);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [0,-0.75], 'playerSpeed': 0.005});
  levelTasks.activateAll();
}
function levelPillowTest2() {
  levelInit();
  pillowx = 0;
  pillowindex = 0;
  pillowstate = 0;
  pillowrandom = 0;
  pillowrandomtwo = 0;
  levelFunctions = new Task([
    {callback: function(){
      particles[`PPhase${pillowindex}with1`] = new Particle({'speed': 45, 'position': [pillowx,1]})
      particles[`PPhase${pillowindex}with2`] = new Particle({'speed': 45, 'position': [pillowx+0.7,1]})
      if (pillowx >= 0.3) {
        pillowstate = 1;
      }
      else if (pillowx <= -1){
        pillowstate = 0;
      }
      if (Math.random() < 0.56 && Math.abs(pillowx + 0.35) < 0.03) {
        pillowstate = 1 - pillowstate;
      }

      if (pillowstate == 0) {
        pillowx = pillowx + 0.06;
      }
      else {
        pillowx = pillowx - 0.06;
      }

      pillowindex++;

      levelFunctions.activate(0);
    }, time: tickSpeed*3, activated: false},

    {callback: function(){
      if(levelLoopCount >= 30) {
        pillowrandom = Math.random()*2
        for (var i = 0; i <= 5; i = i + 1) {
          particles[`SPhase${levelLoopCount}with${i}`] = new Particle({'color': '#600', 'hitboxSize': 0.45, 'speed': 18, 'position': [pillowrandom/5-1,1]})
          pillowrandom = pillowrandom + 2;
        }
      }
      levelFunctions.activate(1);
    }, time: tickSpeed*30, activated: false},

    {callback: function(){
      if(levelLoopCount >= 60) {
        pillowrandomtwo = Math.random()*2.5
        for (var i = 0; i <= 4; i = i + 1) {
          particles[`TPhase${levelLoopCount}with${i}`] = new Particle({'color': '#006', 'hitboxSize': 0.5, 'speed': 6, 'position': [-1,pillowrandomtwo/5-1]})
          .setDeg(90);

          pillowrandomtwo = pillowrandomtwo + 2.5;
        }
      }
      levelFunctions.activate(2);
    }, time: tickSpeed*120, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      screenSizeSpan(0.8, 200);
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
      levelLoopCount++;
  }, tickSpeed*30);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [0,-0.75], 'hp': 20, 'playerSpeed': 0.02});
  levelTasks.activateAll();
  levelFunctions.activate(0);
  levelFunctions.activate(1);
  levelFunctions.activate(2);
}
function levelPillowTest3() {
  levelInit();

  PillowX = 0;
  PillowY = 0;
  PillowDeg = 0;
  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){


    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
      particles[`${levelLoopCount}`] = new Particle({'speed': 30, 'spanper': 30, 'speedI': 9, 'speedIType': 'span', 'color': '#600', 'size': [0.03,0.03], 'position': [Math.random()*2-1,1]})

      if (levelLoopCount > 1) {
        PillowX = particles[`${levelLoopCount}` - 1].position[0]
        PillowY = particles[`${levelLoopCount}` - 1].position[1]
        PillowDeg = Math.random()*90

        particles[`${levelLoopCount}with1`] = new Particle({'speed': 15, 'deg': PillowDeg, 'color': '#600', 'position': [PillowX,PillowY]})
        particles[`${levelLoopCount}with2`] = new Particle({'speed': 15, 'deg': PillowDeg+90, 'color': '#600', 'position': [PillowX,PillowY]})
        particles[`${levelLoopCount}with3`] = new Particle({'speed': 15, 'deg': PillowDeg+180, 'color': '#600', 'position': [PillowX,PillowY]})
        particles[`${levelLoopCount}with4`] = new Particle({'speed': 15, 'deg': PillowDeg+270, 'color': '#600', 'position': [PillowX,PillowY]})

        delete particles[`${levelLoopCount}` - 1]
      }
  }, tickSpeed*32);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
function levelPillowTest3_1() {
  levelInit();

  PillowX = 0;
  PillowY = 0;
  PillowDeg = 0;
  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){


    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
      particles[`${levelLoopCount}`] = new Particle({'speed': 30, 'spanper': 30, 'speedI': 9, 'speedIType': 'span', 'color': '#600', 'size': [0.03,0.03], 'position': [Math.random()*2-1,1]})

      if (levelLoopCount > 1) {
        PillowX = particles[`${levelLoopCount}` - 1].position[0]
        PillowY = particles[`${levelLoopCount}` - 1].position[1]
        PillowDeg = Math.random()*90

        for (var i = 0; i < 4; i++) {
          particles[`${levelLoopCount}with${i}`] = new Particle({'speed': 12, 'deg': PillowDeg + i*90, 'color': '#600', 'position': [PillowX,PillowY]})
        }

        if (levelLoopCount > 30) {
          for (var i = 0; i < 4; i++) {
            particles[`${levelLoopCount}with${i}withTwo`] = new Particle({'speed': 12, 'deg': (PillowDeg + i*90 + 45)%360, 'color': '#600', 'position': [PillowX,PillowY]})
          }
        }
        if (levelLoopCount > 60) {
          for (var i = 0; i < 8; i++) {
            particles[`${levelLoopCount}with${i}withThree`] = new Particle({'speed': 15, 'deg': (PillowDeg + i*45)%360, 'color': '#600', 'position': [PillowX,PillowY]})
            particles[`${levelLoopCount}with${i}withFour`] = new Particle({'speed': 18, 'deg': (PillowDeg + i*45)%360, 'color': '#600', 'position': [PillowX,PillowY]})
          }
          for (var i = 0; i < 4; i++) {
            particles[`${levelLoopCount}with${i}withThree`] = new Particle({'speed': 15, 'deg': (PillowDeg + i*90+22.5)%360, 'color': '#600', 'position': [PillowX,PillowY]})
          }
        }
        delete particles[`${levelLoopCount}` - 1]
      }
  }, tickSpeed*32);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
function levelPillowTest4() {
  levelInit();

  PillowRand1 = 0;
  PillowRand2 = 0;
  PillowSwitch = 0;
  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){


    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;

    PillowRand1 = (Math.random()-4)/4
    PillowRand2 = (Math.random()-4)/4
    if (levelLoopCount <= 90) {
      for(var i = 0; i<8; i++) {
        particles[`${levelLoopCount}With${i}`] = new Particle({'speed': 12, 'color': '#A00', 'position': [PillowRand1,1]})
        PillowRand1 = PillowRand1 + 0.25;
      }
      if (levelLoopCount > 30) {
        for(var i = 0; i<8; i++) {
        particles[`${levelLoopCount}With${i}With2`] = new Particle({'speed': 12, 'color': '#00A', 'position': [-1,PillowRand2]})
        .setDeg(90);
        PillowRand2 = PillowRand2 + 0.25;
        }
      }
    } else {
      if (PillowSwitch == 1) {
        for(var i = 0; i<8; i++) {
          particles[`${levelLoopCount}With${i}`] = new Particle({'speed': 12, 'color': '#A00', 'position': [PillowRand1,1]})
          PillowRand1 = PillowRand1 + 0.25;
        }
        for(var i = 0; i<8; i++) {
          particles[`${levelLoopCount}With${i}With2`] = new Particle({'speed': 12, 'color': '#00A', 'position': [-1,PillowRand2]})
          .setDeg(90);
          PillowRand2 = PillowRand2 + 0.25;
        }
      } else {
        for(var i = 0; i<8; i++) {
          particles[`${levelLoopCount}With${i}`] = new Particle({'speed': 12, 'color': '#A00', 'position': [PillowRand1,-1]})
          .setDeg(180);
          PillowRand1 = PillowRand1 + 0.25;
        }
        for(var i = 0; i<8; i++) {
          particles[`${levelLoopCount}With${i}With2`] = new Particle({'speed': 12, 'color': '#00A', 'position': [1,PillowRand2]})
          .setDeg(270);
          PillowRand2 = PillowRand2 + 0.25;
        }
      }
      PillowSwitch = 1 - PillowSwitch
    }
  }, tickSpeed*35);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'hp': 24});
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
