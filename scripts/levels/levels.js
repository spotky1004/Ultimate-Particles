//level 1-1, made by Spotky1004
function level_11() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      levelLoopCount++;
      for (var i = 0; i < 5+Math.sqrt(levelLoopCount); i++) {
        particles[`Phase${levelLoopCount}Shape${i}`] = new Particle({'color': hsvToRgb(Math.random(), 0.5, 0.6), 'speed': 2+levelLoopCount/10}).randMove('rR');
      }
      screenSizeSpan(Math.max(1-0.005*levelLoopCount, 0.6), 10, 50);
      levelTasks.activate(0);
    }, time: tickSpeed*100, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      levelFunctions.activate(0);
    }, time: 0, activated: false},
  ]);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.15, 'text': 'welcome!', 'color': '#c49b29', 'zIndex': 1})
  levelTasks.activateAll();
}

//level 2-1, made by PillowPrism
function level_21() {
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

      if (levelLoopCount > 30 && levelLoopCount <= 120) {
        for (var i = 0; i < 4; i++) {
          particles[`${levelLoopCount}with${i}withTwo`] = new Particle({'speed': 12, 'deg': (PillowDeg + i*90 + 45)%360, 'color': '#600', 'position': [PillowX,PillowY]})
        }
      }
      if (levelLoopCount > 60 && levelLoopCount <= 120) {
        for (var i = 0; i < 8; i++) {
          particles[`${levelLoopCount}with${i}withThree`] = new Particle({'speed': 15, 'deg': (PillowDeg + i*45)%360, 'color': '#600', 'position': [PillowX,PillowY]})
          particles[`${levelLoopCount}with${i}withFour`] = new Particle({'speed': 18, 'deg': (PillowDeg + i*45)%360, 'color': '#600', 'position': [PillowX,PillowY]})
        }
        for (var i = 0; i < 4; i++) {
          particles[`${levelLoopCount}with${i}withFive`] = new Particle({'speed': 15, 'deg': (PillowDeg + i*90+22.5)%360, 'color': '#600', 'position': [PillowX,PillowY]})
        }
      }
      if (levelLoopCount > 120) {
        for (var i = 0; i < 16; i++) {
          particles[`${levelLoopCount}with${i}withSix`] = new Particle({'speed': 18, 'deg': (PillowDeg + i*22.5)%360, 'color': '#600', 'position': [PillowX,PillowY]})
          particles[`${levelLoopCount}with${i}withSeven`] = new Particle({'speed': 22, 'deg': (PillowDeg + i*22.5)%360, 'color': '#600', 'position': [PillowX,PillowY]})
        }
        for (var i = 0; i < 6; i++) {
          particles[`${levelLoopCount}with${i}withEight`] = new Particle({'speed': 8, 'spanper': 60, 'speedI': 30, 'speedIType': 'span', 'deg': (PillowDeg + i*60)%360, 'color': '#006', 'position': [PillowX,PillowY]})
        }
      }

      delete particles[`${levelLoopCount}` - 1]
    }
}, tickSpeed*32);

particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
particles['text'] = new Particle({'type': 'text', 'absSize': 0.2, 'text': 'boom!', 'color': '#c49b29', 'zIndex': 1})
levelTasks.activateAll();
}
//level 2-2, made by Spotky1004
function level_22() {
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

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'hp': 15});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.17, 'text': 'circle!', 'color': '#c49b29', 'zIndex': 1})
  //levelTasks.activateAll();
}
//level 2-3, made by PillowPrism
function level_23() {
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
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.17, 'text': 'zigzag!', 'color': '#c49b29', 'zIndex': 1})
  levelTasks.activateAll();
  levelFunctions.activate(0);
  levelFunctions.activate(1);
  levelFunctions.activate(2);
}

//level 3-1, made by PillowPrism
function level_31() {
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
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.17, 'text': 'grid!', 'color': '#c49b29', 'zIndex': 1})
  levelTasks.activateAll();
}
//level 3-2, made by Spotky1004
function level_32() {
  levelInit();

  screenSettings.color = '#000'
  levelFunctions = new Task([
    {callback: function(){
      particles['player'].playerSpeed = (1+levelLoopCount/90)/100;
      particles[`P${levelLoopCount}LC`] = new Particle({'type': 'decoration', 'alpha': 0.2, 'color': '#fff', 'size': [1.2, 0.05+levelLoopCount/1000], 'position': [0, Math.random()*((levelLoopCount%2) ? 1 : -1 )]});
      if (levelLoopCount > 1) {
        particles[`P${levelLoopCount-1}L`] = new Particle({'atk': 5, 'color': '#fff', 'size': [1.2, (0.05+(levelLoopCount-1)/1000)], 'hitboxSize': 0.95, 'position': [2.5, particles[`P${levelLoopCount-1}LC`].position[1]], 'outOfBounds': [[-10, 10], [-2, 2]], 'deg': 270, 'speed': 100, 'speedI': 6, 'speedIType': 'multiply'});
        particles[`P${levelLoopCount-1}L`].positionC[0][0] = 0;
        levelFunctions.activate(1);
        var pow = (8+levelLoopCount)/1000;
        screenSettings.p = [Math.random()*pow*2-pow, Math.random()*pow*2-pow];
        delete particles[`P${levelLoopCount-1}LC`];
      }
      if (levelLoopCount > 2) {
        try {
          particles[`P${levelLoopCount-2}L`].positionC = [[-999, 999], [-999, 999]];
        } catch (e) {

        }
      }
    }, time: tickSpeed*2, activated: false},
    {callback: function(){
      screenSettings.p = [0, 0];
      try {
        var tempD = Math.min(180, 60+levelLoopCount/3);
        for (var i = 0; i < Math.random()*2+levelLoopCount/5; i++) {
          particles[`P${levelLoopCount-1}LP${i}`] = new Particle({'color': '#fff', 'speed': 9, 'hitboxSize': 0.5, 'sides': Math.floor(Math.random()*3)+4, 'position': [-1, particles[`P${levelLoopCount-1}L`].position[1]], 'deg': (360+(180-tempD)/2+Math.random()*tempD)%360, 'zIndex': 0});
        }
      } catch (e) {

      }
    }, time: 80, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    levelFunctions.activate(0);
  }, tickSpeed*40);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'hp': 15});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.17, 'text': 'laser!', 'color': '#fff', 'zIndex': 1, 'alpha': 0.3})
  levelTasks.activateAll();
}
//level 3-3, made by Spotky1004
function level_33() {
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
    for (var i = 0; i < 4+Math.sqrt(levelLoopCount)/2; i++) {
      particles[`P${levelLoopCount}S${i}`] = new Particle({'specialAttrs': ['bounce'], 'speed': 4+Math.log(levelLoopCount, 10), 'speedC': [0, 40], 'color': '#250e99', 'deleteTick': 400+levelLoopCount*6, 'alphaI': 0.7/(400+levelLoopCount*6)*-1000/tickSpeed}).randMove('rR');
    }
  }, tickSpeed*100);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.15, 'text': 'bounce!', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
}
//level 3-4, made by Spotky1004
function level_34() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){

    }, time: tickSpeed*10, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    while (tempP === undefined || (Math.abs(tempP[0]-screenSettings.p[0]) < 0.5 && Math.abs(tempP[1]-screenSettings.p[1]) < 0.5) || (Math.abs(tempP[0]-screenSettings.p[0]) > 0.7 || Math.abs(tempP[1]-screenSettings.p[1]) > 0.7)) {
      var tempP = [(Math.floor(Math.random()*3)-1)*(2/3), (Math.floor(Math.random()*3)-1)*(2/3)];
    }
    screenPositionLinear([tempP[0], tempP[1]], 70);
    var orbLv = Math.floor(Math.random()*3)
    particles[`P${levelLoopCount}`] = new Particle({'speed': Math.random()*0.3+0.2, 'moveType': ['circle', [0, 0]], 'position': [0, (orbLv+1)*(1/3)], 'color': hsvToRgb(orbLv/3, 0.6, 0.7)});
  }, tickSpeed*100);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'playerSpeed': 0.015});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.2, 'text': 'move!', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
  screenSettings.size = 0;
  screenSizeSpan(1/3, 3, 10);
}
//level 3-5, made by Spotky1004
function level_35() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      particles[`Wall${new Date().getTime()}`] = new Particle({'color': (Math.floor(Math.random()*2) ? '#000' : '#fff'), 'incrementI': 20, 'speed': 5, 'deg': 175+Math.random()*10, 'position': [(Math.floor(Math.random()*2) ? -0.95 : 0.95), -1]});
      levelFunctions.activate(0);
    }, time: tickSpeed*5, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    for (var i = 0; i < 3+levelLoopCount/10; i++) {
      particles[`P${levelLoopCount}S${i}`] = new Particle({'color': (levelLoopCount%2 ? '#fff' : '#000'), 'speed': -(Math.random()*5+30)*Math.min(2, 1+levelLoopCount/100), 'speedI': 0, 'speedIType': 'span', 'absSizeI': 1, 'absSizeIType': 'span', 'spanPer': 15});
      particles[`P${levelLoopCount}S${i}`].position = [Math.random()*2-1, -1];
    }
    screenSettings.color = (levelLoopCount%2 ? '#000' : '#fff');
    particles['text'].color = (levelLoopCount%2 ? '#fff' : '#000');
    particles['text'].alpha = 0.3;
    for (var name in particles) {
      if (name == 'player' || name == 'text' || Number(name.replace(/P|S[0-9]*/g, ''))%2 != levelLoopCount%2) continue;
      particles[name].speed = -(Math.random()*3+32)*Math.min(2, 1+levelLoopCount/100);
      particles[name].absSize = Math.min(1.3, 1.1+levelLoopCount/500);
    }
  }, tickSpeed*100);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.14, 'text': 'stop,go!', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
  levelFunctions.activate(0);
}

//level 4-1, made by PillowPrism
function level_41() {
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
    particles[`${levelLoopCount}with${i}`] = new Particle({'linearSpeed': [PillowDeg,PillowRandom], 'linearSpeedI': [0,-60], 'linearSpeedIType': 'increment', 'color': '#cc9514', 'position':[Math.random()*2-1,-1], 'effects': ['glow']})
    }
    particles['lava'].position[1] -= 0.04;
    particles['lava'].positionI = [0, Math.min(-1.7, -1.95+levelLoopCount/200)]
  }, tickSpeed*40);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'hp': 16});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.2, 'text': 'lava!', 'color': '#e00', 'zIndex': 1, 'alpha': 0.6});
  particles['lava'] = new Particle({'breakOnAttack': 0, 'color': '#A00', 'effects': ['glow'], 'size': [1.2, 1], 'position': [0, -1.99], 'positionI': [0, -1.95], 'positionIType': 'span', 'zIndex': 4});
  screenSettings.color = '#222';
  levelTasks.activateAll();
}

function levelTemplate() {
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
    //some functions here!
  }, tickSpeed*10);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}

function lagTest() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      for (var i = 0; i < 2000; i++) {
        particles[`t${i}`] = new Particle({'speed': 3}).randMove('rR');
      }
    }, time: 0, activated: false},
  ]);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
function debugLevel() {
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
    //some functions here!
  }, tickSpeed*10);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  levelTasks.activateAll();
}
