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
function levelPillowTest5() {
  PillowRandom = 0;
  PillowDeg = 0;
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    screenSettings.size = 1.01;
    screenSizeSpan(1, 10)
    for (var i = 0; i < (levelLoopCount/13)+1; i++) {
      PillowDeg = 0;
      PillowRandom = (Math.random()*10)+55;
      if (levelLoopCount >= 31) {
        PillowDeg = (Math.random()*10)-5
      }
      if (levelLoopCount >= 91) {
        PillowDeg = (Math.random()*30)-15
      }
      if (levelLoopCount >= 121) {
        PillowDeg = (Math.random()*50)-25
      }
    particles[`${levelLoopCount}with${i}`] = new Particle({'linearSpeed': [PillowDeg,PillowRandom], 'linearSpeedI': [0,-60], 'linearSpeedIType': 'increment', 'color': '#A00', 'position':[Math.random()*2-1,-1]})
    }
  }, tickSpeed*40);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'hp': 16});
  levelTasks.activateAll();
}
function PillowLevelTest7() {
  levelInit();
  pillowrand = 0;
  pillowrand2 = 0;
  pillowdegrand = 0;
  pillowindex = 0;
  levelFunctions = new Task([
    {callback: function(){
      particles['player'].position[0] = 0;
      levelFunctions.activate(0);
    }, time: tickSpeed*1, activated: false},


    {callback: function(){
      pillowindex++;
      pillowrand = Math.random()*2-1
      particles[`PPhase${pillowindex}with1`] = new Particle({'speed': 20, 'position': [1,pillowrand], 'deg': 270})
      pillowrand = Math.random()*2-1
      particles[`PPhase${pillowindex}with2`] = new Particle({'speed': 20, 'position': [-1,pillowrand], 'deg': 90})
      levelFunctions.activate(1);
    }, time: tickSpeed*15, activated: false},

    {callback: function(){
      particles['lava'] = new Particle({'breakOnAttack': 0, 'color': '#A00', 'effects': ['glow'], 'size': [1, 1.2], 'position': [-2.1,0], 'linearSpeed': [25,0], 'linearSpeedI': [-30,0], 'outOfBounds': [[-3,3],[-3,3]], 'linearSpeedIType': 'increment', 'positionIType': 'increment', 'zIndex': 4});
      for (var i=0; i<10; i++) {
        pillowrand2 = (Math.random()*10)+32;
        pillowdegrand = (Math.random()*5)-2.5;
        particles[`Firstwith${i}`] = new Particle({'outOfBounds': [[-1.3,1,3],[-1,3,1.3]], 'linearSpeed': [pillowrand2,pillowdegrand], 'linearSpeedI': [-30,0], 'linearSpeedIType': 'increment', 'effects': ['glow'], 'color': '#ff9514', 'position':[-1,Math.random()*2-1]})
      }
    }, time: tickSpeed*400, activated: false},

    {callback: function(){
      particles[`PillowSwing1`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [1.2, 1,2], 'effects': ['glow']}).tickTraceTo(particles.player);
      particles[`PillowSwing2`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [1.2, -1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
      particles[`PillowSwing3`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [-1.2, 1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
      particles[`PillowSwing4`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [-1.2, -1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    }, time: tickSpeed*500, activated: false},
    {callback: function(){
      particleSpeedSpan(-1, 12, 50);
    }, time: tickSpeed*650, activated: false},
    {callback: function(){
      particleSpeedSpan(1, 12, 130);
    }, time: tickSpeed*700, activated: false},

    {callback: function(){
      for (var i = 0; i < 10; i++) {
        particles[`PE${i}`] = new Particle({'color': '#e01db9', 'spanPer': 4, 'position': [1,screenRand()], 'positionIType': 'span'});
        particles[`PE${i}`].positionI = [Math.sign(particles[`PE${i}`].position[0])*0.9, particles[`PE${i}`].position[1]];
      }
    }, time: tickSpeed*800, activated: false},
    {callback: function(){
      for (var i = 0; i < 10; i++) {
        particles[`PE${i}`].positionI = [0, 0];
        particles[`PE${i}`].positionIType = 'increment';
        particles[`PE${i}`].spanPer = 100;
        particles[`PE${i}`].speed = 30;
        particles[`PE${i}`].speedI = 3;
        particles[`PE${i}`].speedIType = 'span';
        particles[`PE${i}`].color = '#ba1313';
        particles[`PE${i}`].tickTraceTo(particles.player);
      }
    }, time: tickSpeed*860, activated: false},
    {callback: function(){
      particles[`bomb`] = new Particle({'speed': 30, 'deleteTick': 100, 'spanPer': 30, 'speedI': 9, 'speedIType': 'span', 'deg': 270, 'color': '#600', 'size': [0.03,0.03], 'position': [1,Math.random()*1.6-0.8], 'onDelete':
      `
      var PillowDeg = Math.random()*60;
      particles['bombS1'] = new Particle({'speed': 8, 'spanPer': 60, 'speedI': 30, 'speedIType': 'span', 'deg': PillowDeg, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombS2'] = new Particle({'speed': 8, 'spanPer': 60, 'speedI': 30, 'speedIType': 'span', 'deg': PillowDeg+60, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombS3'] = new Particle({'speed': 8, 'spanPer': 60, 'speedI': 30, 'speedIType': 'span', 'deg': PillowDeg+120, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombS4'] = new Particle({'speed': 8, 'spanPer': 60, 'speedI': 30, 'speedIType': 'span', 'deg': PillowDeg+180, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombS5'] = new Particle({'speed': 8, 'spanPer': 60, 'speedI': 30, 'speedIType': 'span', 'deg': PillowDeg+240, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombS6'] = new Particle({'speed': 8, 'spanPer': 60, 'speedI': 30, 'speedIType': 'span', 'deg': PillowDeg+300, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      PillowDeg = Math.random()*45;
      particles['bombTwoS1'] = new Particle({'speed': 18, 'deg': PillowDeg, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS2'] = new Particle({'speed': 18, 'deg': PillowDeg+45, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS3'] = new Particle({'speed': 18, 'deg': PillowDeg+90, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS4'] = new Particle({'speed': 18, 'deg': PillowDeg+135, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS5'] = new Particle({'speed': 18, 'deg': PillowDeg+180, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS6'] = new Particle({'speed': 18, 'deg': PillowDeg+225, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS7'] = new Particle({'speed': 18, 'deg': PillowDeg+270, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombTwoS8'] = new Particle({'speed': 18, 'deg': PillowDeg+315, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS1'] = new Particle({'speed': 16, 'deg': PillowDeg, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS2'] = new Particle({'speed': 16, 'deg': PillowDeg+45, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS3'] = new Particle({'speed': 16, 'deg': PillowDeg+90, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS4'] = new Particle({'speed': 16, 'deg': PillowDeg+135, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS5'] = new Particle({'speed': 16, 'deg': PillowDeg+180, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS6'] = new Particle({'speed': 16, 'deg': PillowDeg+225, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS7'] = new Particle({'speed': 16, 'deg': PillowDeg+270, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombThreeS8'] = new Particle({'speed': 16, 'deg': PillowDeg+315, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS1'] = new Particle({'speed': 14, 'deg': PillowDeg, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS2'] = new Particle({'speed': 14, 'deg': PillowDeg+45, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS3'] = new Particle({'speed': 14, 'deg': PillowDeg+90, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS4'] = new Particle({'speed': 14, 'deg': PillowDeg+135, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS5'] = new Particle({'speed': 14, 'deg': PillowDeg+180, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS6'] = new Particle({'speed': 14, 'deg': PillowDeg+225, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS7'] = new Particle({'speed': 14, 'deg': PillowDeg+270, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFourS8'] = new Particle({'speed': 14, 'deg': PillowDeg+315, 'color': '#600', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      PillowDeg = Math.random()*90;
      particles['bombFiveS1'] = new Particle({'speed': 26, 'deg': PillowDeg, 'color': '#000', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFiveS2'] = new Particle({'speed': 26, 'deg': PillowDeg+90, 'color': '#000', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFiveS3'] = new Particle({'speed': 26, 'deg': PillowDeg+180, 'color': '#000', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombFiveS4'] = new Particle({'speed': 26, 'deg': PillowDeg+270, 'color': '#000', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      PillowDeg = Math.random()*120;
      particles['bombSixS1'] = new Particle({'speed': 28, 'deg': PillowDeg, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombSixS2'] = new Particle({'speed': 28, 'deg': PillowDeg+120, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombSixS3'] = new Particle({'speed': 28, 'deg': PillowDeg+240, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      PillowDeg = Math.random()*120;
      particles['bombSevenS1'] = new Particle({'speed': 32, 'deg': PillowDeg, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombSevenS2'] = new Particle({'speed': 32, 'deg': PillowDeg+120, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      particles['bombSevenS3'] = new Particle({'speed': 32, 'deg': PillowDeg+240, 'color': '#006', 'position': [particles['bomb'].position[0], particles['bomb'].position[1]]})
      `})
    }, time: tickSpeed*900, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      screenSizeSpan(0.8, 200);
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
      levelLoopCount++;
  }, tickSpeed*400);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [0,-0.75], 'hp': 3, 'playerSpeed': 0.02});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.08, 'text': 'Fixed Position!', 'color': '#c49b29', 'zIndex': 1})
  levelTasks.activateAll();
  levelFunctions.activate(0);
  levelFunctions.activate(1);
  levelFunctions.activate(2);
  levelFunctions.activate(3);
  levelFunctions.activate(4);
  levelFunctions.activate(5);
  levelFunctions.activate(6);
  levelFunctions.activate(7);
  levelFunctions.activate(8);
}

function redMountain1() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
        particles.player["hp"] = 5
        particles[`Base1`] = new Particle({'speed': 0, 'position': [0,0.9], 'atk': 100, 'absSize': 4})
        particles[`Base2`] = new Particle({'speed': 0, 'position': [0,-0.9], 'atk': 100, 'absSize': 4})
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    if (levelLoopCount < 20) {
        particles[`Phase${levelLoopCount}1`] = new Particle({'speed': 8, 'position': [0,0.9]})
        particles[`Phase${levelLoopCount}2`] = new Particle({'speed': 8, 'position': [0,-0.9]})
        particles[`Phase${levelLoopCount}1`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2`].tickTraceTo(particles.player);
    } else if (levelLoopCount < 40) {
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
        }
        particles[`Phase${levelLoopCount}2`] = new Particle({'speed': 8, 'position': [0,-0.9]})
        particles[`Phase${levelLoopCount}2`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}1_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}1_3`]["deg"] -= 15
    } else if (levelLoopCount < 60) {
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [0, -0.9] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
        }
        particles[`Phase${levelLoopCount}1_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}1_3`]["deg"] -= 15
        particles[`Phase${levelLoopCount}2_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}2_3`]["deg"] -= 15
    } else if (levelLoopCount < 80) {
        particles[`Phase${levelLoopCount}1_1`] = new Particle({'speed': 12, 'position': [0,0.9], 'color': '#009'})
        particles[`Phase${levelLoopCount}1_1`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2_1`] = new Particle({'speed': 12, 'position': [0,-0.9], 'color': '#009'})
        particles[`Phase${levelLoopCount}2_1`].tickTraceTo(particles.player);
        for (i = 2; i < 4; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
        }
        for (i = 2; i < 4; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [0, -0.9] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
        }
        particles[`Phase${levelLoopCount}1_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}1_3`]["deg"] -= 15
        particles[`Phase${levelLoopCount}2_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}2_3`]["deg"] -= 15
    } else if (levelLoopCount < 100) {
        particles[`Phase${levelLoopCount}1_0`] = new Particle({'speed': 12, 'position': [0,0.9], 'color': '#009'})
        particles[`Phase${levelLoopCount}2_0`] = new Particle({'speed': 12, 'position': [0,-0.9], 'color': '#009'})
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [0, -0.9] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
        }
        particles[`Phase${levelLoopCount}1_0`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}1_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}1_3`]["deg"] -= 15
        particles[`Phase${levelLoopCount}2_0`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2_2`]["deg"] += 15
        particles[`Phase${levelLoopCount}2_3`]["deg"] -= 15
    } else {
        particles[`Phase${levelLoopCount}1_0`] = new Particle({'speed': 12, 'position': [0,0.9], 'color': '#009'})
        particles[`Phase${levelLoopCount}2_0`] = new Particle({'speed': 12, 'position': [0,-0.9], 'color': '#009'})
        for (i = 1; i < 5; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
        }
        for (i = 1; i < 5; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [0, -0.9] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
        }
        particles[`Phase${levelLoopCount}1_0`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2_0`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}1_1`]["deg"] += 20
        particles[`Phase${levelLoopCount}1_2`]["deg"] += 10
        particles[`Phase${levelLoopCount}1_3`]["deg"] -= 10
        particles[`Phase${levelLoopCount}1_4`]["deg"] -= 20
        particles[`Phase${levelLoopCount}2_1`]["deg"] += 20
        particles[`Phase${levelLoopCount}2_2`]["deg"] += 10
        particles[`Phase${levelLoopCount}2_3`]["deg"] -= 10
        particles[`Phase${levelLoopCount}2_4`]["deg"] -= 20
    }
  }, tickSpeed*40);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.12, 'text': '', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
}
function redMountain1_1() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
        particles.player["hp"] = 10
        particles[`Base1`] = new Particle({'speed': 0, 'position': [-0.9,0], 'atk': 100, 'absSize': 4})
        particles[`Base2`] = new Particle({'speed': 0, 'position': [0.9,0], 'atk': 100, 'absSize': 4})
        particles[`Base3`] = new Particle({'speed': 0, 'position': [0,0.9], 'atk': 100, 'absSize': 4, 'color': '#555'})
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    if (levelLoopCount == 20) {particles[`Base3`]['color'] = '#000'}
    if (levelLoopCount == 80) {particles[`Base3`]['color'] = '#009'}
    if (levelLoopCount < 20) {
        particles[`Phase${levelLoopCount}1`] = new Particle({'speed': 8, 'position': [0.9,0]})
        particles[`Phase${levelLoopCount}2`] = new Particle({'speed': 8, 'position': [-0.9,0]})
        particles[`Phase${levelLoopCount}1`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2`].tickTraceTo(particles.player);
    } else if (levelLoopCount < 40) {
        particles[`Phase${levelLoopCount}1`] = new Particle({'speed': 8, 'position': [0.9,0]})
        particles[`Phase${levelLoopCount}2`] = new Particle({'speed': 8, 'position': [-0.9,0]})
        particles[`Phase${levelLoopCount}3`] = new Particle({'speed': 8, 'position': [0,0.9]})
        particles[`Phase${levelLoopCount}1`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}3`].tickTraceTo(particles.player);
    } else if (levelLoopCount < 60) {
        particles[`Phase${levelLoopCount}1`] = new Particle({'speed': 8, 'position': [0.9,0]})
        particles[`Phase${levelLoopCount}2`] = new Particle({'speed': 8, 'position': [-0.9,0]})
        particles[`Phase${levelLoopCount}1`].tickTraceTo(particles.player);
        particles[`Phase${levelLoopCount}2`].tickTraceTo(particles.player);
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}3_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}3_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}3_${i}`]['deg'] += i * 15 - 30
        }
    } else if (levelLoopCount < 80) {
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0.9, 0] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}1_${i}`]['deg'] += i * 15 - 30
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [-0.9, 0] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}2_${i}`]['deg'] += i * 15 - 30
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}3_${i}`] = new Particle({ 'speed': 8, 'position': [0, 0.9] })
            particles[`Phase${levelLoopCount}3_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}3_${i}`]['deg'] += i * 15 - 30
        }
    } else if (levelLoopCount < 100) {
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0.9, 0] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}1_${i}`]['deg'] += i * 15 - 30
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [-0.9, 0] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}2_${i}`]['deg'] += i * 15 - 30
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}3_${i}`] = new Particle({ 'speed': 12, 'position': [0, 0.9], 'color': '#009'})
            particles[`Phase${levelLoopCount}3_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}3_${i}`]['deg'] += i * 10 - 20
        }
    } else {
        for (i = 1; i < 5; i++) {
            particles[`Phase${levelLoopCount}1_${i}`] = new Particle({ 'speed': 8, 'position': [0.9, 0] })
            particles[`Phase${levelLoopCount}1_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}1_${i}`]['deg'] += i * 10 - 25
        }
        for (i = 1; i < 5; i++) {
            particles[`Phase${levelLoopCount}2_${i}`] = new Particle({ 'speed': 8, 'position': [-0.9, 0] })
            particles[`Phase${levelLoopCount}2_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}2_${i}`]['deg'] += i * 10 - 25
        }
        for (i = 1; i < 4; i++) {
            particles[`Phase${levelLoopCount}3_${i}`] = new Particle({ 'speed': 12, 'position': [0, 0.9], 'color': '#009'})
            particles[`Phase${levelLoopCount}3_${i}`].tickTraceTo(particles.player)
            particles[`Phase${levelLoopCount}3_${i}`]['deg'] += i * 10 - 20
        }
    }
  }, tickSpeed*40);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.12, 'text': '', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
}
function redMountain2() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
        particles.player["hp"] = 8
        smallLoopCount = 0
        particles[`target`] = new Particle({'position': [-1, 0], 'deg': 90, 'speed': 10, 'type': 'decoration', 'alpha': 0, 'deleteTick': -1, 'specialAttrs': ['bounce']})
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    smallLoopCount++;
    if (smallLoopCount == 4) {levelLoopCount++; smallLoopCount = 0}
    if (levelLoopCount == 20) {particles[`target2`] = new Particle({'position': [-1, 0], 'deg': 90, 'speed': 15, 'type': 'decoration', 'alpha': 0, 'deleteTick': -1, 'specialAttrs': ['bounce']})}
    if (levelLoopCount == 40) {particles[`target3`] = new Particle({'position': [-1, 0], 'deg': 90, 'speed': 7, 'type': 'decoration', 'alpha': 0, 'deleteTick': -1, 'specialAttrs': ['bounce']})}
    if (levelLoopCount == 70) {particles[`target4`] = new Particle({'position': [1, 0], 'deg': 180, 'speed': 18, 'type': 'decoration', 'alpha': 0, 'deleteTick': -1, 'specialAttrs': ['bounce']})}
    particles[`Phase${levelLoopCount}_Loop${smallLoopCount}`] = new Particle({'position': [0, 1], 'speed': 10, 'color': '#050'})
    particles[`Phase${levelLoopCount}_Loop${smallLoopCount}`].tickTraceTo(particles[`target`])
    if (levelLoopCount > 20) {
        particles[`Phase${levelLoopCount}_Loop${smallLoopCount}_2`] = new Particle({'position': [0, -1], 'speed': 7, 'color': '#500'})
        particles[`Phase${levelLoopCount}_Loop${smallLoopCount}_2`].tickTraceTo(particles[`target2`])
    }
    if (levelLoopCount > 40) {
        particles[`Phase${levelLoopCount}_Loop${smallLoopCount}_3`] = new Particle({'position': [0, 1], 'speed': 15, 'color': '#005'})
        particles[`Phase${levelLoopCount}_Loop${smallLoopCount}_3`].tickTraceTo(particles[`target3`])
    }
    if (levelLoopCount > 70 && smallLoopCount % 2 == 0) {
        particles[`Phase${levelLoopCount}_Loop${smallLoopCount}_4`] = new Particle({'position': [-1, 0], 'speed': 10, 'color': '#055'})
        particles[`Phase${levelLoopCount}_Loop${smallLoopCount}_4`].tickTraceTo(particles[`target4`])
    }
  }, tickSpeed*20);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.18, 'text': 'wave!', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
}
// boss 4-7
function redMountain3() {
    levelInit();

    levelFunctions = new Task([
    {callback: function(){
        particles['core']['sides'] = 10 - Math.floor(smallLoopCount / 4)
        if (particles['core']['rotateDegI'] == 0) {
            particles['core']['rotateDegI'] = 1440
        } else {
            particles['core']['rotateDegI'] = 0
        }
        if (smallLoopCount < 20) {levelFunctions.activate(0)}
    }, time: tickSpeed * 400, activated: false},
    {callback: function() {
        if (phase3count % 3 == 1) {particles[`${phase3count}`] = new Particle({'speed': 15 + 5 * Math.random(), 'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'absSize': 0.7, 'effects': ["glow"], 'position': [-0.5, 0.9]}).tickTraceTo(particles.player)}
        if (phase3count % 3 == 2) {particles[`${phase3count}`] = new Particle({'speed': 15 + 5 * Math.random(), 'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'absSize': 0.7, 'effects': ["glow"], 'position': [0, 0.9]}).tickTraceTo(particles.player)}
        if (phase3count % 3 == 0) {particles[`${phase3count}`] = new Particle({'speed': 15 + 5 * Math.random(), 'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'absSize': 0.7, 'effects': ["glow"], 'position': [0.5, 0.9]}).tickTraceTo(particles.player)}
        if (phase3count % 12 == 0) {
            particles[`Laser_S${phase3count}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'size': [1.2, 0.07 + 0.0005 * phase3count], 'position': [0, Math.random() * 1.8 - 1]});
        }
        if (phase3count % 12 == 11) {
            particles[`Laser${phase3count}`] = new Particle({'atk': 10, 'color': hslToRgb(Math.random(), 1, 0.85), 'size': [1.2, 0.07 + 0.0005 * phase3count], 'hitboxSize': 0.95, 'position': [2.5, particles[`Laser_S${phase3count - 11}`].position[1]], 'outOfBounds': [[-10, 10], [-2, 2]], 'deg': 270, 'speed': 100, 'speedI': 6, 'speedIType': 'multiply'});
          delete particles[`Laser_S${phase3count - 11}`]
        }
        phase3count++
        if (smallLoopCount < 75) {levelFunctions.activate(1)}
    }, time: tickSpeed * 6, activated: false}
    ]);

    levelTasks = new Task([
    {callback: function(){
        screenSettings.color = '#000'
        smallLoopCount = 0
        phase3count = 0
        particles.player["playerSpeed"] = 0.015
        particles.player["hp"] = 120
        // particles.player["screenParallaxPer"] = 1
        particles['core'] = new Particle({'speed': 0, 'deg': 0, 'speedI': 0, 'speedIType': 'span', 'zIndex': 3,
        'color': hslToRgb(Math.random(), 1, 0.8), 'atk': 3, 'breakOnAttack': 0, 'sides': 7, 'absSize': 12, 'position': [0, 0.9],
        'spanPer': 120, 'rotateDeg': 360, 'hsvRotateI': 0.03, 'hsvRotateIType': 'increment', 'rotateDegI': 0, 'rotateDegIType': 'span'})
        particles['core1'] = new Particle({'speed': 0, 'deg': 0, 'speedI': 0, 'speedIType': 'span', 'zIndex': 3,
        'color': hslToRgb(Math.random(), 1, 0.8), 'atk': 3, 'breakOnAttack': 0, 'sides': 5, 'absSize': 9, 'position': [-0.5, 1.2],
        'spanPer': 120, 'rotateDeg': 360, 'hsvRotateI': 0.03, 'hsvRotateIType': 'increment'})
        particles['core2'] = new Particle({'speed': 0, 'deg': 0, 'speedI': 0, 'speedIType': 'span', 'zIndex': 3,
        'color': hslToRgb(Math.random(), 1, 0.8), 'atk': 3, 'breakOnAttack': 0, 'sides': 5, 'absSize': 9, 'position': [0.5, 1.2],
        'spanPer': 120, 'rotateDeg': 360, 'hsvRotateI': 0.03, 'hsvRotateIType': 'increment'})
    }, time: 0, activated: false},
    ]);

    levelLoop = setInterval( function () {
        smallLoopCount++
        if (smallLoopCount == 2) {
            particles['core']['sides'] = 6 + Math.floor(4 * Math.random())
            if (particles['core']['rotateDegI'] == 0) {
                particles['core']['rotateDegI'] = 1440
            } else {
                particles['core']['rotateDegI'] = 0
            }
            levelFunctions.activate(0)
        }
        if (smallLoopCount <= 24) {
            particles['phasetext']['text'] = 'phase 1 / 4'
            if (smallLoopCount % 4 == 1) {

                particles[`${smallLoopCount}_1`] = new Particle({'atk': 2, 'breakOnAttack': 0, 'color': hslToRgb(Math.random(), 1, 0.7),
                'absSize': 2, 'sides': 5, 'position': [(-0.7 * Math.random()) - 0.3, 1], 'spanPer': 50, 'speed': 15,
                'speedI': 0, 'speedIType': 'span', 'onPlayerCollision': `this.type = 'decoration'`})

                particles[`${smallLoopCount}_2`] = new Particle({'atk': 2, 'breakOnAttack': 0, 'color': hslToRgb(Math.random(), 1, 0.7),
                'absSize': 2, 'sides': 5, 'position': [Math.random() * 0.3 * signRand(), 1], 'spanPer': 50, 'speed': 15,
                'speedI': 0, 'speedIType': 'span'})

                particles[`${smallLoopCount}_3`] = new Particle({'atk': 2, 'breakOnAttack': 0, 'color': hslToRgb(Math.random(), 1, 0.7),
                'absSize': 2, 'sides': 5, 'position': [(0.7 * Math.random()) + 0.3, 1], 'spanPer': 50, 'speed': 15,
                'speedI': 0, 'speedIType': 'span'})
            }
            if (smallLoopCount % 4 == 2) {
                seed = 17 + Math.floor(smallLoopCount / 4)

                for (i = 0; i < seed; i++) { particles[`${smallLoopCount}_1_${i}`] = new Particle({'atk': 5,
                'color': hslToRgb(Math.random(), 1, 0.8), 'rotateDeg': 45, 'deg': i * (360 / seed), 'absSize': 1.2,
                'sides': 4, 'position': [particles[`${smallLoopCount - 1}_1`]['position'][0],particles[`${smallLoopCount - 1}_1`]['position'][1]],
                'speed': 20, 'speedI': -10, 'speedC': [-25, 20], 'speedIType': 'increment', 'outOfBounds': [[-4, 4], [-4, 4]]}) }

                for (i = 0; i < seed; i++) { particles[`${smallLoopCount}_2_${i}`] = new Particle({'atk': 5,
                'color': hslToRgb(Math.random(), 1, 0.8), 'rotateDeg': 45, 'deg': i * (360 / seed), 'absSize': 1.2,
                'sides': 4, 'position': [particles[`${smallLoopCount - 1}_2`]['position'][0],particles[`${smallLoopCount - 1}_2`]['position'][1]],
                'speed': 20, 'speedI': -10, 'speedC': [-25, 20], 'speedIType': 'increment', 'outOfBounds': [[-4, 4], [-4, 4]]}) }

                for (i = 0; i < seed; i++) { particles[`${smallLoopCount}_3_${i}`] = new Particle({'atk': 5,
                'color': hslToRgb(Math.random(), 1, 0.8), 'rotateDeg': 45, 'deg': i * (360 / seed), 'absSize': 1.2,
                'sides': 4, 'position': [particles[`${smallLoopCount - 1}_3`]['position'][0],particles[`${smallLoopCount - 1}_3`]['position'][1]],
                'speed': 20, 'speedI': -10, 'speedC': [-25, 20], 'speedIType': 'increment', 'outOfBounds': [[-4, 4], [-4, 4]]}) }

                delete particles[`${smallLoopCount - 1}_1`]
                delete particles[`${smallLoopCount - 1}_2`]
                delete particles[`${smallLoopCount - 1}_3`]
            }
        }
        else if (smallLoopCount >= 30 && smallLoopCount <= 45) {
            particles['phasetext']['text'] = 'phase 2 / 4'
            for (k = 0; k < 5; k++) {
                particles[`${smallLoopCount}_${k}`] = new Particle({'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'deg': k * 72,
                'speed': 15, 'sides': 5, 'absSize': 1.2, 'zIndex': 1, 'specialAttrs': ['bounce']})
                particles[`${smallLoopCount}_${k}`]['rotateDeg'] = particles[`${smallLoopCount}_${k}`]['deg']
            }
            setTimeout( function() {
                for (k = 0; k < 5; k++) {
                    particles[`${smallLoopCount}_${k}`]['speed'] = 0
                    particles[`${smallLoopCount}_${k}`]['speedI'] = 10
                    particles[`${smallLoopCount}_${k}`]['speedC'] = [0, 15]
                    particles[`${smallLoopCount}_${k}`]['zIndex'] = 4
                    particles[`${smallLoopCount}_${k}`].tickTraceTo(particles.player)
                    particles[`${smallLoopCount}_${k}`].fade(400, 0.3)
                }
            }, tickSpeed * 40)
        }
        else if (smallLoopCount >= 50 && smallLoopCount <= 75) {
            particles['phasetext']['text'] = 'phase 3 / 4'
        } else if (smallLoopCount >= 80 && smallLoopCount <= 110) {
            particles['phasetext']['text'] = 'phase 4 / 4'
            if (smallLoopCount == 80) {
                particles[`Shadow_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                particles[`Shadow2_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                particles[`Shadow3_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                particles[`Shadow4_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
              } else {
                if (smallLoopCount != 110) {
                    particles[`Shadow_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                    particles[`Shadow2_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                    particles[`Shadow3_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                    particles[`Shadow4_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 30})
                }
                particles[`Main_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow_${smallLoopCount-1}`].position[0],particles[`Shadow_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(2, 0)
                particles[`Main2_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow2_${smallLoopCount-1}`].position[0],particles[`Shadow2_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(2, 0)
                particles[`Main3_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow3_${smallLoopCount-1}`].position[0],particles[`Shadow3_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(2, 0)
                particles[`Main4_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow4_${smallLoopCount-1}`].position[0],particles[`Shadow4_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(2, 0)
                particles[`Light_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow_${smallLoopCount-1}`].position[0],particles[`Shadow_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(30, 0)
                particles[`Light2_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow2_${smallLoopCount-1}`].position[0],particles[`Shadow2_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(30, 0)
                particles[`Light3_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow3_${smallLoopCount-1}`].position[0],particles[`Shadow3_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(30, 0)
                particles[`Light4_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow4_${smallLoopCount-1}`].position[0],particles[`Shadow4_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 30.5}).fade(30, 0)
                for (i = 0; i < 3; i++) {
                    particles[`Normal_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow_${smallLoopCount-1}`].position[0],particles[`Shadow_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                for (i = 0; i < 3; i++) {
                    particles[`Normal2_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow2_${smallLoopCount-1}`].position[0],particles[`Shadow2_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                for (i = 0; i < 3; i++) {
                    particles[`Normal3_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow3_${smallLoopCount-1}`].position[0],particles[`Shadow3_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                for (i = 0; i < 3; i++) {
                    particles[`Normal4_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow4_${smallLoopCount-1}`].position[0],particles[`Shadow4_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                delete particles[`Shadow_${smallLoopCount-1}`]
                delete particles[`Shadow2_${smallLoopCount-1}`]
                delete particles[`Shadow3_${smallLoopCount-1}`]
                delete particles[`Shadow4_${smallLoopCount-1}`]
            }
        }
        // core move
        if (smallLoopCount == 26) {
            particles['core']['speed'] = 7.5
            particles['core']['speedI'] = 0
            particles['core']['rotateDegI'] = 0
        }
        if (smallLoopCount == 42) {
            particles[`coremove`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'size': [0.15, 0.6], 'position': [0, 0.6]});
        }
        if (smallLoopCount == 45) {
            particles['core']['speed'] = -7
            particles['core']['speedI'] = 0
            particles['core']['rotateDegI'] = 1440
            particles['core1']['speed'] = 3
            particles['core2']['speed'] = 3
            delete particles[`coremove`]
        }
        if (smallLoopCount == 50) {
            levelFunctions.activate(1)
        }
        if (smallLoopCount == 80) {
            particles['core1']['speed'] = -3
            particles['core2']['speed'] = -3
            particles['core']['speed'] = -5
            particles['core']['rotateDegI'] = 0
        }
        if (smallLoopCount == 112) {
            particles['core']['speed'] = 4
            particles['text']['text'] = 'clear!'
            particles['phasetext']['text'] = `score: ${particles.player.hp}`
            delete particles[`Shadow_110`]
            delete particles[`Shadow2_110`]
            delete particles[`Shadow3_110`]
            delete particles[`Shadow4_110`]
        }
    }, tickSpeed*100);

    particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
    particles['text'] = new Particle({'type': 'text', 'text': 'boss stage!', 'absSize': 0.11, 'color': '#faa', 'zIndex': 1})
    particles['phasetext'] = new Particle({'type': 'text', 'text': 'phase 0 / 4', 'absSize': 0.07, 'color': '#faa', 'zIndex': 1, 'position': [0, -0.7]})
    levelTasks.activateAll();
}
function redMountain3_1() {
    levelInit();

    levelFunctions = new Task([
    {callback: function(){
        particles['core']['sides'] = 10 - Math.floor(smallLoopCount / 4)
        if (particles['core']['rotateDegI'] == 0) {
            particles['core']['rotateDegI'] = 1440
        } else {
            particles['core']['rotateDegI'] = 0
        }
        if (smallLoopCount < 20) {levelFunctions.activate(0)}
    }, time: tickSpeed * 400, activated: false},
    {callback: function() {
        if (phase3count % 3 == 1) {particles[`${phase3count}`] = new Particle({'speed': 15 + 5 * Math.random(), 'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'absSize': 0.8, 'effects': ["glow"], 'position': [-0.5, 0.9]}).tickTraceTo(particles.player)}
        if (phase3count % 3 == 2) {particles[`${phase3count}`] = new Particle({'speed': 15 + 5 * Math.random(), 'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'absSize': 0.8, 'effects': ["glow"], 'position': [0, 0.9]}).tickTraceTo(particles.player)}
        if (phase3count % 3 == 0) {particles[`${phase3count}`] = new Particle({'speed': 15 + 5 * Math.random(), 'atk': 2, 'color': hslToRgb(Math.random(), 1, 0.8), 'absSize': 0.8, 'effects': ["glow"], 'position': [0.5, 0.9]}).tickTraceTo(particles.player)}
        if (phase3count % 10 == 0) {
            particles[`Laser_S${phase3count}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'size': [1.2, 0.07 + 0.0005 * phase3count], 'position': [0, Math.random() * 1.8 - 1]});
        }
        if (phase3count % 10 == 9) {
            particles[`Laser${phase3count}`] = new Particle({'atk': 10, 'color': hslToRgb(Math.random(), 1, 0.85), 'size': [1.2, 0.07 + 0.0005 * phase3count], 'hitboxSize': 0.95, 'position': [2.5, particles[`Laser_S${phase3count - 9}`].position[1]], 'outOfBounds': [[-10, 10], [-2, 2]], 'deg': 270, 'speed': 100, 'speedI': 6, 'speedIType': 'multiply'});
          delete particles[`Laser_S${phase3count - 9}`]
        }
        phase3count++
        if (smallLoopCount < 75) {levelFunctions.activate(1)} else {
            for (i in particles) {
                if (i.includes('Laser_S')) {
                    delete particles[i]
                }
            }
        }
    }, time: tickSpeed * 6, activated: false}
    ]);

    levelTasks = new Task([
    {callback: function(){
        screenSettings.color = '#000'
        smallLoopCount = 0
        phase3count = 0
        particles.player["playerSpeed"] = 0.015
        particles.player["hp"] = 120
        // particles.player["screenParallaxPer"] = 1
        particles['core'] = new Particle({'speed': 0, 'deg': 0, 'speedI': 0, 'speedIType': 'span', 'zIndex': 3,
        'color': hslToRgb(Math.random(), 1, 0.8), 'atk': 3, 'breakOnAttack': 0, 'sides': 7, 'absSize': 12, 'position': [0, 0.9],
        'spanPer': 120, 'rotateDeg': 360, 'hsvRotateI': 0.03, 'hsvRotateIType': 'increment', 'rotateDegI': 0, 'rotateDegIType': 'span'})
        particles['core1'] = new Particle({'speed': 0, 'deg': 0, 'speedI': 0, 'speedIType': 'span', 'zIndex': 3,
        'color': hslToRgb(Math.random(), 1, 0.8), 'atk': 3, 'breakOnAttack': 0, 'sides': 5, 'absSize': 9, 'position': [-0.5, 1.2],
        'spanPer': 120, 'rotateDeg': 360, 'hsvRotateI': 0.03, 'hsvRotateIType': 'increment'})
        particles['core2'] = new Particle({'speed': 0, 'deg': 0, 'speedI': 0, 'speedIType': 'span', 'zIndex': 3,
        'color': hslToRgb(Math.random(), 1, 0.8), 'atk': 3, 'breakOnAttack': 0, 'sides': 5, 'absSize': 9, 'position': [0.5, 1.2],
        'spanPer': 120, 'rotateDeg': 360, 'hsvRotateI': 0.03, 'hsvRotateIType': 'increment'})
    }, time: 0, activated: false},
    ]);

    levelLoop = setInterval( function () {
        smallLoopCount++
        if (smallLoopCount == 2) {
            particles['core']['sides'] = 6 + Math.floor(4 * Math.random())
            if (particles['core']['rotateDegI'] == 0) {
                particles['core']['rotateDegI'] = 1440
            } else {
                particles['core']['rotateDegI'] = 0
            }
            levelFunctions.activate(0)
        }
        if (smallLoopCount <= 24) {
            particles['phasetext']['text'] = 'phase 1 / 4'
            if (smallLoopCount % 4 == 1) {

                particles[`${smallLoopCount}_1`] = new Particle({'atk': 2, 'breakOnAttack': 0, 'color': hslToRgb(Math.random(), 1, 0.7),
                'absSize': 2, 'sides': 5, 'position': [(-0.7 * Math.random()) - 0.3, 1], 'spanPer': 50, 'speed': 15,
                'speedI': 0, 'speedIType': 'span', 'onPlayerCollision': `this.type = 'decoration'`})

                particles[`${smallLoopCount}_2`] = new Particle({'atk': 2, 'breakOnAttack': 0, 'color': hslToRgb(Math.random(), 1, 0.7),
                'absSize': 2, 'sides': 5, 'position': [Math.random() * 0.3 * signRand(), 1], 'spanPer': 50, 'speed': 15,
                'speedI': 0, 'speedIType': 'span'})

                particles[`${smallLoopCount}_3`] = new Particle({'atk': 2, 'breakOnAttack': 0, 'color': hslToRgb(Math.random(), 1, 0.7),
                'absSize': 2, 'sides': 5, 'position': [(0.7 * Math.random()) + 0.3, 1], 'spanPer': 50, 'speed': 15,
                'speedI': 0, 'speedIType': 'span'})
            }
            if (smallLoopCount % 4 == 2) {
                seed = 19 + Math.floor(smallLoopCount / 3)

                for (i = 0; i < seed; i++) { particles[`${smallLoopCount}_1_${i}`] = new Particle({'atk': 5,
                'color': hslToRgb(Math.random(), 1, 0.8), 'rotateDeg': 45, 'deg': i * (360 / seed), 'absSize': 1.2,
                'sides': 4, 'position': [particles[`${smallLoopCount - 1}_1`]['position'][0],particles[`${smallLoopCount - 1}_1`]['position'][1]],
                'speed': 20, 'speedI': -10, 'speedC': [-25, 20], 'speedIType': 'increment', 'outOfBounds': [[-4, 4], [-4, 4]]}) }

                for (i = 0; i < seed; i++) { particles[`${smallLoopCount}_2_${i}`] = new Particle({'atk': 5,
                'color': hslToRgb(Math.random(), 1, 0.8), 'rotateDeg': 45, 'deg': i * (360 / seed), 'absSize': 1.2,
                'sides': 4, 'position': [particles[`${smallLoopCount - 1}_2`]['position'][0],particles[`${smallLoopCount - 1}_2`]['position'][1]],
                'speed': 20, 'speedI': -10, 'speedC': [-25, 20], 'speedIType': 'increment', 'outOfBounds': [[-4, 4], [-4, 4]]}) }

                for (i = 0; i < seed; i++) { particles[`${smallLoopCount}_3_${i}`] = new Particle({'atk': 5,
                'color': hslToRgb(Math.random(), 1, 0.8), 'rotateDeg': 45, 'deg': i * (360 / seed), 'absSize': 1.2,
                'sides': 4, 'position': [particles[`${smallLoopCount - 1}_3`]['position'][0],particles[`${smallLoopCount - 1}_3`]['position'][1]],
                'speed': 20, 'speedI': -10, 'speedC': [-25, 20], 'speedIType': 'increment', 'outOfBounds': [[-4, 4], [-4, 4]]}) }

                delete particles[`${smallLoopCount - 1}_1`]
                delete particles[`${smallLoopCount - 1}_2`]
                delete particles[`${smallLoopCount - 1}_3`]
            }
        }
        else if (smallLoopCount >= 30 && smallLoopCount <= 45) {
            particles['phasetext']['text'] = 'phase 2 / 4'
            for (k = 0; k < 5; k++) {
                particles[`${smallLoopCount}_${k}`] = new Particle({'atk': 3, 'color': hslToRgb(Math.random(), 1, 0.8), 'deg': k * 72,
                'speed': 15, 'sides': 5, 'absSize': 1.2, 'zIndex': 1, 'specialAttrs': ['bounce']})
                particles[`${smallLoopCount}_${k}`]['rotateDeg'] = particles[`${smallLoopCount}_${k}`]['deg']
            }
            setTimeout( function() {
                for (k = 0; k < 5; k++) {
                    particles[`${smallLoopCount}_${k}`]['speed'] = 0
                    particles[`${smallLoopCount}_${k}`]['speedI'] = 10
                    particles[`${smallLoopCount}_${k}`]['speedC'] = [0, 15]
                    particles[`${smallLoopCount}_${k}`]['zIndex'] = 4
                    particles[`${smallLoopCount}_${k}`].tickTraceTo(particles.player)
                    particles[`${smallLoopCount}_${k}`].fade(400, 0.3)
                }
            }, tickSpeed * 40)
        }
        else if (smallLoopCount >= 50 && smallLoopCount <= 75) {
            particles['phasetext']['text'] = 'phase 3 / 4'
        } else if (smallLoopCount >= 80 && smallLoopCount <= 110) {
            particles['phasetext']['text'] = 'phase 4 / 4'
            if (smallLoopCount == 80) {
                particles[`Shadow_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                particles[`Shadow2_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                particles[`Shadow3_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                particles[`Shadow4_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
              } else {
                if (smallLoopCount != 110) {
                    particles[`Shadow_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                    particles[`Shadow2_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                    particles[`Shadow3_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                    particles[`Shadow4_${smallLoopCount}`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'speed': 0, 'position': [-1 * Math.random(), -1 * Math.random()], 'absSize': 0.5 * smallLoopCount - 28})
                }
                particles[`Main_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow_${smallLoopCount-1}`].position[0],particles[`Shadow_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(2, 0)
                particles[`Main2_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow2_${smallLoopCount-1}`].position[0],particles[`Shadow2_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(2, 0)
                particles[`Main3_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow3_${smallLoopCount-1}`].position[0],particles[`Shadow3_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(2, 0)
                particles[`Main4_${smallLoopCount}`] = new Particle({'atk': 12, 'alpha': 0.1, 'speed': 0, 'position': [particles[`Shadow4_${smallLoopCount-1}`].position[0],particles[`Shadow4_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(2, 0)
                particles[`Light_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow_${smallLoopCount-1}`].position[0],particles[`Shadow_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(25, 0)
                particles[`Light2_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow2_${smallLoopCount-1}`].position[0],particles[`Shadow2_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(25, 0)
                particles[`Light3_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow3_${smallLoopCount-1}`].position[0],particles[`Shadow3_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(25, 0)
                particles[`Light4_${smallLoopCount}`] = new Particle({'type': 'decoration', 'color': hslToRgb(Math.random(), 1, 0.8), 'speed': 0, 'position': [particles[`Shadow4_${smallLoopCount-1}`].position[0],particles[`Shadow4_${smallLoopCount-1}`].position[1]], 'absSize': 0.5 * smallLoopCount - 28.5}).fade(25, 0)
                for (i = 0; i < 7; i++) {
                    particles[`Normal_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow_${smallLoopCount-1}`].position[0],particles[`Shadow_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                for (i = 0; i < 7; i++) {
                    particles[`Normal2_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow2_${smallLoopCount-1}`].position[0],particles[`Shadow2_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                for (i = 0; i < 7; i++) {
                    particles[`Normal3_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow3_${smallLoopCount-1}`].position[0],particles[`Shadow3_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                for (i = 0; i < 7; i++) {
                    particles[`Normal4_${smallLoopCount}_${i}`] = new Particle({'atk': 2, 'sides': 4 + Math.floor(5 * Math.random()), 'deg': Math.random() * 360,'color': hslToRgb(Math.random(), 1, 0.85), 'speed': 12, 'position': [particles[`Shadow4_${smallLoopCount-1}`].position[0],particles[`Shadow4_${smallLoopCount-1}`].position[1]], 'absSize': 1.2})
                }
                delete particles[`Shadow_${smallLoopCount-1}`]
                delete particles[`Shadow2_${smallLoopCount-1}`]
                delete particles[`Shadow3_${smallLoopCount-1}`]
                delete particles[`Shadow4_${smallLoopCount-1}`]
            }
        }
        // core move
        if (smallLoopCount == 26) {
            particles['core']['speed'] = 7.5
            particles['core']['speedI'] = 0
            particles['core']['rotateDegI'] = 0
        }
        if (smallLoopCount == 42) {
            particles[`coremove`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'size': [0.15, 0.6], 'position': [0, 0.6]});
        }
        if (smallLoopCount == 45) {
            particles['core']['speed'] = -7
            particles['core']['speedI'] = 0
            particles['core']['rotateDegI'] = 1440
            particles['core1']['speed'] = 3
            particles['core2']['speed'] = 3
            delete particles[`coremove`]
        }
        if (smallLoopCount == 50) {
            levelFunctions.activate(1)
        }
        if (smallLoopCount == 80) {
            particles['core1']['speed'] = -3
            particles['core2']['speed'] = -3
            particles['core']['speed'] = -5
            particles['core']['rotateDegI'] = 0
        }
        if (smallLoopCount == 112) {
            particles['core']['speed'] = 4
            particles['text']['text'] = 'clear!'
            particles['phasetext']['text'] = `score: ${particles.player.hp}`
            delete particles[`Shadow_110`]
            delete particles[`Shadow2_110`]
            delete particles[`Shadow3_110`]
            delete particles[`Shadow4_110`]
        }
    }, tickSpeed*100);

    particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
    particles['text'] = new Particle({'type': 'text', 'text': 'boss stage!', 'absSize': 0.11, 'color': '#faa', 'zIndex': 1})
    particles['phasetext'] = new Particle({'type': 'text', 'text': 'phase 0 / 4', 'absSize': 0.07, 'color': '#faa', 'zIndex': 1, 'position': [0, -0.7]})
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
