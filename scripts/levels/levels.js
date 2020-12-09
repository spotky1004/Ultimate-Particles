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
//level 4-2, made by Spotky1004
function level_42() {
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
    var tempS = Math.random()*0.2+0.4;
    var tempL = Math.floor(Math.random()*Math.min(10, levelLoopCount/2)+3+Math.min(10, levelLoopCount/2));
    var tempE = Math.random();
    particles[`P${levelLoopCount}D`] = new Particle({'type': 'decoration', 'position': [particles.player.position[0], particles.player.position[1]], 'alpha': 0.4, 'color': (tempL%2 ? '#00f' : '#f00'), 'size': [1, 1], 'absSize': tempS, 'sides': -1});
    for (var i = 0; i < tempL; i++) {
      if (Math.abs(tempE-i/tempL) < 0.1) continue;
      particles[`P${levelLoopCount}S${i}`] = new Particle({'color': hsvToRgb((i/tempL*0.2-tempE/2+1)%1, 0.8, 0.7),'position': [particles.player.position[0]+tempS*Math.sin(Math.PI*2/tempL*i+(levelLoopCount>30 ? tempE*5 : 0)), particles.player.position[1]-tempS*Math.cos(Math.PI*2/tempL*i+(levelLoopCount>30 ? tempE*5 : 0))], 'speed': 0.4, 'speedI': 7, 'speedIType': 'multiply'}).tickTraceTo(particles.player);
    }
    if (levelLoopCount > 1) {
      delete particles[`P${levelLoopCount-1}D`];
    }
  }, tickSpeed*150);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.12, 'text': 'cilcle v2!', 'color': '#c49b29', 'zIndex': 1});
  levelTasks.activateAll();
}
//level 4-3, made by Spotky1004
function level_43() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      tempL++;
      particles[`S${tempL}`] = new Particle({'position': [Math.sin(Math.PI*2*(tempL/14.556))*1.5, Math.cos(Math.PI*2*(tempL/14.556))*1.5], 'speed': 4+tempL/1000, 'outOfBounds': [[-1.5, 1.5], [-1.5, 1.5]], 'hitboxSize': 0.85}).tickTraceTo(particles.dummy);
      levelFunctions.activate(0);
    }, time: tickSpeed*9, activated: false},
    {callback: function(){
      levelLoopCount++;
      switch (levelLoopCount%4) {
        case 1:
        particles['wall'].positionI = [-0.5, -0.5];
          break;
        case 2:
        particles['wall'].positionI = [0.5, -0.5];
          break;
        case 3:
        particles['wall'].positionI = [0.5, 0.5];
          break;
        case 0:
        particles['wall'].positionI = [-0.5, 0.5];
          break;
      }
      levelFunctions._data[1].time = tickSpeed*Math.max(100, Math.min(190, 230-levelLoopCount));
      levelFunctions.activate(1);
    }, time: tickSpeed*230, activated: false}
  ]);

  levelTasks = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {

  }, tickSpeed*150);

  var tempL = 0;
  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'position': [0.5, -0.5], 'hitboxSize': 0.85});
  particles['wall'] = new Particle({'position': [-0.5, 0.5], 'size': [0.5, 0.5], 'positionI': [-0.5, 0.5], 'positionIType': 'span', 'spanPer': 20, 'breakOnAttack': 0, 'color': '#db5625', 'zIndex': 1});
  particles['dummy'] = new Particle({'type': 'decoration', 'alpha': 0.1, 'color': '#000'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.15, 'text': 'sprial!', 'color': '#c49b29', 'zIndex': 0});
  levelTasks.activateAll();
  levelFunctions.activate(0);
  levelFunctions.activate(1);
}
//level 4-4, made by Spotky1004
function level_44() {
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
    var tempV = Math.min(50, 10+levelLoopCount/6);
    var tempB = -(levelLoopCount%2*2-1);
    var tempM = Math.random()/10+1.1;
    if (Math.floor(Math.random()*2)) {
      var tempP = [-tempM, (levelLoopCount%5 != 0 ? screenRand() : particles.player.position[1])];
      var tempD = 90;
    } else {
      var tempP = [tempM, (levelLoopCount%5 != 0 ? screenRand() : particles.player.position[1])];
      var tempD = 270;
    }
    var tempT = 1000+levelLoopCount*300;
    particles[`P${levelLoopCount}`] = new Particle({'speed': tempB*tempV, 'color': hsvToRgb((tempV/100+2/3-0.4)%1, 0.5, 0.6), 'position': [tempP[0], tempP[1]], 'deg': tempD, 'outOfBounds': [[-1e308, 1e308], [-1e308, 1e308]], 'hitboxSize': 0.7, 'alphaI': calcAlphaI(tempT, 0.7), 'deleteTick': tempT});
    particleSpeedSpan(-(levelLoopCount%2*2-1), 12, 130);
    particles[`P${levelLoopCount}T0`] = new Particle({'color': '#5540D5', 'speed': 5, 'speedI': 4, 'position': [1.2, 1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T1`] = new Particle({'color': '#5540D5', 'speed': 5, 'speedI': 4, 'position': [-1.2, 1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T2`] = new Particle({'color': '#5540D5', 'speed': 5, 'speedI': 4, 'position': [1.2, -1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T3`] = new Particle({'color': '#5540D5', 'speed': 5, 'speedI': 4, 'position': [-1.2, -1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T0C`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [1.2, 0], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T1C`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [0, 1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T2C`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [0, -1.2], 'effects': ['glow']}).tickTraceTo(particles.player);
    particles[`P${levelLoopCount}T3C`] = new Particle({'color': '#5540D5', 'speed': 2, 'speedI': 4, 'position': [-1.2, 0], 'effects': ['glow']}).tickTraceTo(particles.player);
  }, tickSpeed*150);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'playerSpeed': 0.012, 'hp': 10});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.17, 'text': 'swing!', 'color': '#c49b29', 'zIndex': 0});
  levelTasks.activateAll();
}
//level 4-5, made by Spotky1004
function level_45() {
  levelInit();

  levelFunctions = new Task([
    {callback: function(){
      for (var i = 0; i < 100; i++) {
        try {
          delete particles[`P${levelLoopCount-2}S${i}D0`]
        } catch (e) {

        }
        try {
          delete particles[`P${levelLoopCount-2}S${i}D1`]
        } catch (e) {

        }
      }
    }, time: 200, activated: false},
  ]);

  levelTasks = new Task([
    {callback: function(){
      //some functions here!
    }, time: 0, activated: false},
  ]);

  levelLoop = setInterval( function () {
    levelLoopCount++;
    var tempC = 55;
    var tempP = [(levelLoopCount%2 ? -1 : 1), particles.player.position[1]];
    var tempM = (Math.random()*0.008+0.004)*(1+levelLoopCount/28)*signRand();
    var tempM2 = 0;
    var tempL = Math.max(0.1, 0.3-levelLoopCount*(0.2/120))
    for (var i = 0; i < tempC; i++) {
      tempM2 += tempM/20;
      var tempL2 = tempL+Math.abs(tempM2);
      particles[`P${levelLoopCount}S${i}D0`] = new Particle({'color': (i%2 ? '#ed5a5a' : '#fff'), 'position': [tempP[0], tempP[1]+0.7], 'positionIType': 'span', 'positionI': [tempP[0], tempP[1]+tempL2], 'alpha': 0.01, 'alphaI': 2});
      particles[`P${levelLoopCount}S${i}D1`] = new Particle({'color': (i%2 ? '#ed5a5a' : '#fff'), 'position': [tempP[0], tempP[1]-0.7], 'positionIType': 'span', 'positionI': [tempP[0], tempP[1]-tempL2], 'alpha': 0.01, 'alphaI': 2});
      tempP[0] -= (levelLoopCount%2 ? -1 : 1)/tempC*1.9;
      tempP[1] = Math.min(1, Math.max(-1, tempP[1]+tempM2));
      if (Math.abs(tempP[1]) == 1 || Math.abs(tempM2) > (0.01+levelLoopCount/3000)) {
        if (Math.abs(tempP[1]) == 1) {
          tempM2 = 0;
        } else {
          tempM2 = Math.sign(tempM2)*(0.01+levelLoopCount/3000);
        }
        tempM *= -1;
      } else if (Math.max(0.03, 0.01+levelLoopCount*(0.04/240)) > Math.random()) {
        tempM = (Math.random()*0.008+0.004)*(1+levelLoopCount/28)*signRand();
      }
      console.log(`${tempM}, ${tempM2}`);
    }
    if (levelLoopCount > 1) {
      for (var i = 0; i < 100; i++) {
        try {
          particles[`P${levelLoopCount-1}S${i}D0`].positionI = [particles[`P${levelLoopCount-1}S${i}D0`].positionI[0], -2];
          particles[`P${levelLoopCount-1}S${i}D0`].spanPer = 40;
          particles[`P${levelLoopCount-1}S${i}D0`].alpha = 1;
          particles[`P${levelLoopCount-1}S${i}D0`].alphaI = -0.6;
          particles[`P${levelLoopCount-1}S${i}D0`].color = '#222';
        } catch (e) {

        }
        try {
          particles[`P${levelLoopCount-1}S${i}D1`].positionI = [particles[`P${levelLoopCount-1}S${i}D1`].positionI[0], 2];
          particles[`P${levelLoopCount-1}S${i}D1`].spanPer = 40;
          particles[`P${levelLoopCount-1}S${i}D1`].alpha = 1;
          particles[`P${levelLoopCount-1}S${i}D1`].alphaI = -0.6;
          particles[`P${levelLoopCount-1}S${i}D1`].color = '#222';
        } catch (e) {

        }
      }
      levelFunctions.activate(0);
    }
  }, tickSpeed*180);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00', 'playerSpeed': 0.022, 'effects': ['glow'], 'position': [-0.9, 0]});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.17, 'text': 'speed!', 'color': '#333', 'zIndex': 0});
  screenSettings.color = '#444';
  levelTasks.activateAll();
}
//level 4-6, made by Spotky1004
function level_46() {
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
    particles[`P${levelLoopCount}`] = new Particle({'speedI': 3, 'speedIType': 'span', 'spanPer': 200, 'speed': 20, 'position': [(Math.random()*0.5+1.1)*signRand(), (Math.random()*0.5+1.1)*signRand()], 'outOfBounds': [[-5, 5], [-5, 5]], 'deleteTick': 500+levelLoopCount*10, 'alphaI': calcAlphaI(500+levelLoopCount*10, 0.7)});
    for (var i in particles) {
      if (!i.includes('P') || i.includes('E')) continue;
      particles[i].speed = 25;
      particles[i].tickTraceTo(particles.player);
    }
    if (levelLoopCount > 30) {
      if (levelLoopCount%4 == 0) {
        for (var i = 0; i < 10; i++) {
          particles[`P${levelLoopCount}E${i}`] = new Particle({'color': '#e01db9', 'spanPer': 4, 'position': [screenRand(), 1.1*signRand()], 'positionIType': 'span'});
          particles[`P${levelLoopCount}E${i}`].positionI = [particles[`P${levelLoopCount}E${i}`].position[0], Math.sign(particles[`P${levelLoopCount}E${i}`].position[1])*0.9];
        }
      }
      if (levelLoopCount%4 == 1) {
        for (var i = 0; i < 10; i++) {
          particles[`P${levelLoopCount-1}E${i}`].positionI = [0, 0];
          particles[`P${levelLoopCount-1}E${i}`].positionIType = 'increment';
          particles[`P${levelLoopCount-1}E${i}`].spanPer = 200;
          particles[`P${levelLoopCount-1}E${i}`].speed = 30;
          particles[`P${levelLoopCount-1}E${i}`].speedI = 3;
          particles[`P${levelLoopCount-1}E${i}`].speedIType = 'span';
          particles[`P${levelLoopCount-1}E${i}`].color = '#ba1313';
          particles[`P${levelLoopCount-1}E${i}`].tickTraceTo(particles.player);
        }
      }
    }
    if (levelLoopCount > 60) {
      if (levelLoopCount%4 == 1) {
        for (var i = 0; i < 10; i++) {
          particles[`P${levelLoopCount}E${i}`] = new Particle({'color': '#e01db9', 'spanPer': 4, 'position': [1.1*signRand(), screenRand()], 'positionIType': 'span'});
          particles[`P${levelLoopCount}E${i}`].positionI = [Math.sign(particles[`P${levelLoopCount}E${i}`].position[0])*0.9, particles[`P${levelLoopCount}E${i}`].position[1]];
        }
      }
      if (levelLoopCount%4 == 2) {
        for (var i = 0; i < 10; i++) {
          particles[`P${levelLoopCount-1}E${i}`].positionI = [0, 0];
          particles[`P${levelLoopCount-1}E${i}`].positionIType = 'increment';
          particles[`P${levelLoopCount-1}E${i}`].spanPer = 200;
          particles[`P${levelLoopCount-1}E${i}`].speed = 30;
          particles[`P${levelLoopCount-1}E${i}`].speedI = 3;
          particles[`P${levelLoopCount-1}E${i}`].speedIType = 'span';
          particles[`P${levelLoopCount-1}E${i}`].color = '#ba1313';
          particles[`P${levelLoopCount-1}E${i}`].tickTraceTo(particles.player);
        }
      }
    }
  }, tickSpeed*100);

  particles['player'] = new Particle({'type': 'player', 'color': '#f00'});
  particles['text'] = new Particle({'type': 'text', 'absSize': 0.2, 'text': 'dash!', 'color': '#c49b29', 'zIndex': 0});
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
