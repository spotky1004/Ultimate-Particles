'use strict';

var particles = {};

var propertyI = [
  'rotateDeg', 'alpha', 'hsvRotate',
  'deg', 'speed', 'playerSpeed', 'linearSpeed',
  'absSize', 'size', 'position'
];

class Particle {
  constructor(attrs={}) {
    // important
    this.type = attrs.type || 'enemy'; // 'enemy' for enemy, 'player' for controlable player, 'text' for text, 'decoration' for decoration, 'wall' for player wall (only for square)

    // view
    this.color = attrs.color || '#000'; // fill color for particle and text
    this.rotateDeg = attrs.rotateDeg || 0; // set rotated for shaped particle (this property won't affect to hitbox/collision for now)
    this.zIndex = (attrs.zIndex !== undefined ? attrs.zIndex : 2); // z-index (0~4)
    this.spanPer = (attrs.spanPer !== undefined ? attrs.spanPer : 2); // spanPer for ~IType = 'span', ratio - 1 : spanPer
    this.alpha = (attrs.alpha !== undefined ? attrs.alpha : 1); // alpha/opacity
    this.text = attrs.text || 'text'; // text property for for text
    this.effects = attrs.effects || []; // effects - 'glow'
    this.hsvRotate = attrs.hsvRotate || 0; // hsv deg increment
    this.image = attrs.image || ""; // image (url), this property will overlap other view properties

    // move
    this.moveType = attrs.moveType || ['normal', null]; // moveType - 'trace', 'avoid', 'circle', 'teaceCircle', 'traceAvoid'
    this.specialAttrs = attrs.specialAttrs || []; // specialAttrs - 'bounce'
    this.position = attrs.position || [0,0]; // position
    this.deg = attrs.deg || 0; // degree to move
    this.speed = attrs.speed || 0; // speed
    this.playerSpeed = (attrs.playerSpeed !== undefined ? attrs.playerSpeed : 0.01); // property for player: player move speed with keyboard
    this.screenParallaxPer = attrs.screenParallaxPer || 0; // property for player: screen position move based on playerSpeed
    this.linearSpeed = attrs.linearSpeed || [0, 0]; //linear speed for make 'Constant velocity linear motion' easily

    // shape
    this.sides = (attrs.sides !== undefined ? attrs.sides : 4); // set sides of shaped particle, -1 to circle, -2 to set points
    this.absSize = (attrs.absSize !== undefined ? attrs.absSize : 1); // absSize multiplies both x and y size (or this property set text size)
    this.size = attrs.size || [0.015, 0.015]; this.sizeI = attrs.sizeI || [0, 0];  this.sizeIType = attrs.sizeIType || 'increment'; this.sizeC = attrs.sizeC || [[0.001, 999], [0.001, 999]]; // size for shaped particles
    this.hitboxSize = attrs.hitboxSize || 1; // hitbox, multiplies to final calculate
    this.points = attrs.points || []; // set sides to -2 to active this:  set points of shape want to draw - ex) [{'x': 1, 'y': 1}, {'x': 1, 'y': -1}, {'x': -1, 'y': -1}, {'x': -1, 'y': 1}] to default screen fill square

    // game
    this.hp = (attrs.hp !== undefined ? attrs.hp : 10); // hp for player
    this.atk = (attrs.atk !== undefined ? attrs.atk : 1); // property for enemy, when 'player' is collisionWith 'enemy' player's hp will decreased based on atk
    this.breakOnAttack = (attrs.breakOnAttack !== undefined ? attrs.breakOnAttack : 1); // propertys for enemy, when 'player' is collisionWith 'enemy' player' and breakOnAtttack is true, 'enemy' particle will disappear

    // delete
    this.outOfBounds = attrs.outOfBounds || [[-2, 2], [-2, 2]]; // this is vaild position of particle. if particle's position is out of this square it'll be deleted
    this.deleteTick = attrs.deleteTick || -1; // particle will be deleted after n tick (-1 to disable)

    // event
    this.onPlayerCollision = attrs.onPlayerCollision || ""; // on enemy particle collision with player particle
    this.onDelete = attrs.onDelete || ""; // on delete by 'outOfBounds' or 'deleteTick' etc..

    // advanced
    this.tag = attrs.tag || {}; // place to store data
    this.layer = attrs.layer || 0; // all particles can interect with same layer (-1 to any)
    this.lifeTime = attrs.lifeTime || 0; // increment by 1 every tick

    // Increments
    this.disableC = attrs.disableC || 0;
    for (var i = 0, l = propertyI.length; i < l; i++) {
      if (typeof this[propertyI[i]] == 'number') {
        this[`${propertyI[i]}I`] = attrs[`${propertyI[i]}I`] || 0;
        this[`${propertyI[i]}IType`] = attrs[`${propertyI[i]}IType`] || 'increment';
        this[`${propertyI[i]}C`] = attrs[`${propertyI[i]}C`] || [-999, 999];
      } else {
        this[`${propertyI[i]}I`] = [];
        this[`${propertyI[i]}IType`] = attrs[`${propertyI[i]}IType`] || 'increment';
        this[`${propertyI[i]}C`] = [];
        for (var j = 0, l2 = this[propertyI[i]].length; j < l2; j++) {
          if (attrs[`${propertyI[i]}I`] === undefined) {
            this[`${propertyI[i]}I`][j] = 0;
          } else {
            this[`${propertyI[i]}I`][j] = attrs[`${propertyI[i]}I`][j] || 0;
          }
          if (attrs[`${propertyI[i]}C`] === undefined) {
            this[`${propertyI[i]}C`][j] = [-999, 999];
          } else {
            this[`${propertyI[i]}C`][j] = attrs[`${propertyI[i]}C`][j] || [-999, 999];
          }
        }
      }
    }
  }

  // in-game
  update(name) {
    this.lifeTime++;

    // moveType
    switch (this.moveType[0]) {
      case 'trace':
      var toTrace = particles[this.moveType[1]];
      if (toTrace !== undefined) {
        this.deg = (Math.atan2(this.position[1]-toTrace.position[1], this.position[0]-toTrace.position[0])/Math.PI*180+270)%360;
      }
        break;
      case 'avoid':
      var toTrace = particles[this.moveType[1]];
      if (toTrace !== undefined) {
        this.deg = (Math.atan2(this.position[1]-toTrace.position[1], this.position[0]-toTrace.position[0])/Math.PI*180+90)%360;
      }
        break;
      case 'traceAvoid':
      var toTrace = particles[this.moveType[1]];
      if (toTrace !== undefined) {
        this.deg = Math.atan2(toTrace.position[1]-this.position[1], -(toTrace.position[0]-this.position[0]))/Math.PI*180;
      }
        break;
      case 'traceCircle':
      var toTrace = particles[this.moveType[1]];
      var dist = this.moveType[2] || 1;
      if (toTrace !== undefined) {
        this.deg = Math.atan2(toTrace.position[1]-this.position[1], toTrace.position[0]-this.position[0])/Math.PI*180*dist;
      }
        break;
      case 'circle':
      var center = this.moveType[1] || [0, 0];
      var dist = Math.sqrt((this.position[0]-center[0])**2+(this.position[1]-center[1])**2);
      var centerDeg = (Math.atan2(this.position[1]-center[1], this.position[0]-center[0])*180/Math.PI-(this.speed%360)+810)%360;
      //console.log(`deg: ${centerDeg}\ndist: ${dist}\nn: ${this.position[0]}, ${this.position[1]}\nf: ${Math.sin(Math.rad(centerDeg))*dist}, ${-Math.cos(Math.rad(centerDeg))*dist}`);
      this.position = [Math.sin(Math.rad(centerDeg))*dist+center[0], -Math.cos(Math.rad(centerDeg))*dist+center[1]];
        break;
    }

    // move
    if (this.moveType[0] != 'circle') {
      this.position[0] = Math.min(this.positionC[0][1]+this.disableC*1e308, Math.max(this.positionC[0][0]-this.disableC*1e308, this.position[0]+(this.speed*Math.sin(Math.rad(this.deg))+this.linearSpeed[0])/1000*levelSettings.particleSpeed));
      this.position[1] = Math.min(this.positionC[1][1]+this.disableC*1e308, Math.max(this.positionC[1][0]-this.disableC*1e308, this.position[1]-(this.speed*Math.cos(Math.rad(this.deg))-this.linearSpeed[1])/1000*levelSettings.particleSpeed));
    }

    // special
    // bounce
    if (this.specialAttrs.includes('bounce')) {
      if (this.position[0]+this.getTotAbsSize()[0]/2 > getScreenAbsSize()+screenSettings.p[0] && (0 < this.deg && this.deg < 180)) {
        this.position[0] = getScreenAbsSize()-this.getTotAbsSize()[0]/2;
        this.deg = (360-this.deg)%360;
      }
      if (this.position[0]-this.getTotAbsSize()[0]/2 < -getScreenAbsSize()+screenSettings.p[0] && (180 < this.deg && this.deg < 360)) {
        this.position[0] = -getScreenAbsSize()+this.getTotAbsSize()[0]/2;
        this.deg = (360-this.deg)%360;
      }
      if (this.position[1]+this.getTotAbsSize()[1]/2 > getScreenAbsSize()+screenSettings.p[1] && (90 < this.deg && this.deg < 270)) {
        this.position[1] = getScreenAbsSize()-this.getTotAbsSize()[1]/2;
        this.deg = (540-this.deg)%360;
      }
      if (this.position[1]-this.getTotAbsSize()[1]/2 < -getScreenAbsSize()+screenSettings.p[1] && (270 < this.deg || this.deg < 90)) {
        this.position[1] = -getScreenAbsSize()+this.getTotAbsSize()[1]/2;
        this.deg = (540-this.deg)%360;
      }
    }

    // wall
    if (levelSettings.advancedMode && this.type == "wall") {
      for (var i in particles) {
        if (!particles[i].specialAttrs.includes('bounce') || name == i) continue;
        if (!this.collisionWith(particles[i])) continue;
        var vx = (particles[i].position[0]-this.position[0])/particles[i].getTotAbsSize()[0]/this.getTotAbsSize()[0], vy = (particles[i].position[1]-this.position[1])/particles[i].getTotAbsSize()[1]/this.getTotAbsSize()[1];
        if (vy**2 > vx**2) {
          if (vy < 0) {
            particles[i].position[1] = this.position[1]-this.getTotAbsSize()[1]-particles[i].getTotAbsSize()[1];
          } else {
            particles[i].position[1] = this.position[1]+this.getTotAbsSize()[1]+particles[i].getTotAbsSize()[1];
          }
          particles[i].deg = (540-particles[i].deg)%360;
        } else {
          if (vx < 0) {
            particles[i].position[0] = this.position[0]-this.getTotAbsSize()[0]-particles[i].getTotAbsSize()[0];
          } else {
            particles[i].position[0] = this.position[0]+this.getTotAbsSize()[0]+particles[i].getTotAbsSize()[0];
          }
          particles[i].deg = (360-particles[i].deg)%360;
        }
      }
    }

    // increment properties
    var speedI = 1/tps;
    for (var i = 0, l = propertyI.length; i < l; i++) {
      if ((this[`${propertyI[i]}I`] == 0 || (typeof this[`${propertyI[i]}I`] == 'object' && this[`${propertyI[i]}I`].every(ele => ele == 0))) && this[`${propertyI[i]}IType`] == 'increment') continue;
      if (typeof this[`${propertyI[i]}`] == 'number') {
        switch (this[`${propertyI[i]}IType`]) {
          case 'increment':
          this[`${propertyI[i]}`] = Math.min(this[`${propertyI[i]}C`][1]+this.disableC*1e308, Math.max(this[`${propertyI[i]}C`][0]-this.disableC*1e308, incrementCalc(this[`${propertyI[i]}`], this[`${propertyI[i]}I`], speedI)));
            break;
          case 'multiply':
          this[`${propertyI[i]}`] = Math.min(this[`${propertyI[i]}C`][1]+this.disableC*1e308, Math.max(this[`${propertyI[i]}C`][0]-this.disableC*1e308, multiplyCalc(this[`${propertyI[i]}`], this[`${propertyI[i]}I`], speedI)));
            break;
          case 'span':
          this[`${propertyI[i]}`] = spanCalc(this[`${propertyI[i]}`], this[`${propertyI[i]}I`], this.spanPer);
            break;
          case 'sine':

            break;
          case 'bump':

            break;
        }
      } else {
        for (var j = 0, l2 = this[`${propertyI[i]}`].length; j < l2; j++) {
          switch (this[`${propertyI[i]}IType`]) {
            case 'increment':
            this[`${propertyI[i]}`][j] = Math.min(this[`${propertyI[i]}C`][j][1]+this.disableC*1e308, Math.max(this[`${propertyI[i]}C`][j][0]-this.disableC*1e308, incrementCalc(this[`${propertyI[i]}`][j], this[`${propertyI[i]}I`][j], speedI)));
              break;
            case 'multiply':
            this[`${propertyI[i]}`][j] = Math.min(this[`${propertyI[i]}C`][j][1]+this.disableC*1e308, Math.max(this[`${propertyI[i]}C`][j][0]-this.disableC*1e308, multiplyCalc(this[`${propertyI[i]}`][j], this[`${propertyI[i]}I`][j], speedI)));
              break;
            case 'span':
            this[`${propertyI[i]}`][j] = spanCalc(this[`${propertyI[i]}`][j], this[`${propertyI[i]}I`][j], this.spanPer);
              break;
            case 'bump':

              break;
          }
        }
      }
    }

    //delete
    if (!(this.outOfBounds[0][0] <= this.position[0] && this.position[0] <= this.outOfBounds[0][1] && this.outOfBounds[1][0] <= this.position[1] && this.position[1] <= this.outOfBounds[1][1]) || (this.deleteTick <= 0 && this.deleteTick != -1)) {
      new Function('pName', this.onDelete).bind(this)(name);
      delete particles[name];
      return 0;
    }
    if (this.deleteTick != -1) {
      this.deleteTick--;
    }
    return 1;
  }

  // bool return
  collisionWith(particle) {
    if (!this.layerCheck(particle)) return 0;
    if ((this.sides == -1 && particle.sides != -1) || (this.sides != -1 && particle.sides == -1)) {
      var point = (this.sides > particle.sides ? this : particle).getPoints();
      var circle = (this.sides < particle.sides ? this : particle);
      for (var i = 0, l = point.length; i < l; i++) {
        if (Math.abs(Math.sqrt((point[i].x-circle.position[0])**2+(point[i].y-circle.position[1])**2)) < circle.size[0]*circle.absSize) return 1;
      }
    } else if (this.sides == 4 && particle.sides == 4 && particle.rotateDeg == 0 && this.rotateDeg == 0) {
      if (
        Math.abs(this.position[0]-particle.position[0]) < Math.abs(this.getHitboxSize()[0]+particle.getHitboxSize()[0]) &&
        Math.abs(this.position[1]-particle.position[1]) < Math.abs(this.getHitboxSize()[1]+particle.getHitboxSize()[1])
      ) {
        return 1;
      }
    } else {
      if (doPolygonsIntersect(particle.getPoints(), this.getPoints())) {
        return 1;
      }
    }
    return 0;
  }
  layerCheck(particle) {
    if (this.layer == particle.layer || this.layer == -1 || particle.layer == -1) return true;
    return false;
  }

  // change properties easily
  tickTraceTo(particle) {
    var toTrace = particle;
    if (toTrace !== undefined) {
      this.deg = (Math.atan2(this.position[1]-toTrace.position[1], this.position[0]-toTrace.position[0])/Math.PI*180+270)%360;
    }

    return this;
  }
  randMove(type='') {
    type = type.replace(/R/g, Math.floor(Math.random()*4).toString()); //change 'R' to '0' ~ '3', so that change sides random easily!
    switch (type) {
      case 'r0': //top random
      this.position = [Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[0], -getScreenAbsSize()+screenSettings.p[1]];
      this.deg = (Math.random()*180+90)%360;
        break;
      case 'r1': //bottom random
      this.position = [Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[0], getScreenAbsSize()+screenSettings.p[1]];
      this.deg = (Math.random()*180+270)%360;
        break;
      case 'r2': //left random
      this.position = [-getScreenAbsSize()+screenSettings.p[0], Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[1]];
      this.deg = (Math.random()*180)%360;
        break;
      case 'r3': //right random
      this.position = [getScreenAbsSize()+screenSettings.p[0], Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[1]];
      this.deg = (Math.random()*180+180)%360;
        break;
      case 's0': //top speared
      this.position = [Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[0], -getScreenAbsSize()+screenSettings.p[1]-0.5];
      this.deg = (Math.random()*180+90)%360;
        break;
      case 's1': //bottom speared
      this.position = [Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[0], getScreenAbsSize()+screenSettings.p[1]+0.5];
      this.deg = (Math.random()*180+270)%360;
        break;
      case 's2': //left speared
      this.position = [-getScreenAbsSize()+screenSettings.p[0]-0.5, Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[1]];
      this.deg = (Math.random()*180)%360;
        break;
      case 's3': //right speared
      this.position = [getScreenAbsSize()+screenSettings.p[0]+0.5, Math.random()*getScreenAbsSize()*2-getScreenAbsSize()+screenSettings.p[1]];
      this.deg = (Math.random()*180+180)%360;
        break;
      default:

    }
    return this;
  }
  fade(deleteTick=100, alpha=0.3) {
    this.deleteTick = deleteTick;
    this.alphaI = (this.alpha-alpha)/(deleteTick+1)*-1000/tickSpeed;
    return this;
  }

  // change a property
  moveTo(position=[0,0]) {
    this.position = position;
    return this;
  }
  setSpeed(speed=0) {
    this.speed = speed;
    return this;
  }
  setDeg(deg=0) {
    this.deg = deg;
    return this;
  }
  setSides(sides=4) {
    this.sides = sides;
    return this;
  }
  setSize(size=4) {
    this.absSize = size;
    return this;
  }

  // get info
  getTotAbsSize() {
    return [this.absSize*this.size[0], this.absSize*this.size[1]];
  }
  getHitboxSize(){
    return [this.getTotAbsSize()[0]*this.hitboxSize, this.getTotAbsSize()[1]*this.hitboxSize];
  }
  getPoints() {
    var points = [];
    if (this.sides == -1) {
      points = new Particle({'sides': 50, 'size': [this.size[0], this.size[0]]}).getPoints();
    } else if (this.sides != -2) {
      var p = this.position;
      var s = this.sides;
      var d = -this.rotateDeg;
      var d1 = (-d + 180 / s) % 360;
      var sScale = 1/(this.sides/2*Math.cos(Math.rad((180-(180/this.sides*(this.sides-2)))/2)))/0.7071067811865475*(this.sides==3?0.7071067811865475:1);
      var centerL = Math.csc(Math.rad(180 / s)) * this.absSize*sScale*this.hitboxSize*-1;
      var tempPosition = [
        p[0] - Math.sin(Math.rad(d1)) * centerL * this.size[0],
        p[1] - Math.cos(Math.rad(d1)) * centerL * this.size[1]
      ];
      for (var i = 0; i < this.sides; i++) {
        points.push({'x': tempPosition[0], 'y': tempPosition[1]});
        tempPosition[0] += Math.sin(Math.PI * 2 / this.sides * i + Math.rad(d + 270)) * (this.getHitboxSize()[0]) * sScale * 2;
        tempPosition[1] -= Math.cos(Math.PI * 2 / this.sides * i + Math.rad(d + 270)) * (this.getHitboxSize()[1]) * sScale * 2;
      }
    } else {
      var tempPoints = JSON.parse(JSON.stringify(this.points));
      if (!(this.position.every(ele => ele == 0))) {
        for (var i = 0, l = tempPoints.length; i < l; i++) {
          tempPoints[i].x += this.position[0];
          tempPoints[i].y += this.position[1];
        }
      }
      var center = getCenter(tempPoints);
      for (var i = 0; i < tempPoints.length; i++) {
        var dist = Math.sqrt((tempPoints[i].x-center[0])**2+(tempPoints[i].y-center[1])**2);
        var centerDeg = (Math.atan2(tempPoints[i].y-center[1], tempPoints[i].x-center[0])*180/Math.PI-(this.rotateDeg%360)+630)%360;
        points.push({'x': -Math.sin(Math.rad(centerDeg))*dist*this.absSize+center[0], 'y': -Math.cos(Math.rad(centerDeg))*dist*this.absSize+center[1]});
      }
    }
    return points;
  }
  awayFrom(particles) {
    return Math.sqrt((this.position[0]-particles.position[0])**2+(this.position[0]-particles.position[0])**2);
  }

  // debug
  spawnAtPoints() {
    var points = this.getPoints();
    var k = Math.floor(Math.random()*16**5).toString(16);
    for (var i = 0; i < points.length; i++) {
      particles[`K${k}T${new Date().getTime()}P${i}`] = new Particle({'position': [points[i].x, points[i].y], 'zIndex': this.zIndex+1, 'color': '#f00', 'type': 'decoration'});
    }
  }
}

function pushParticle(name=`t${new Date().getTime().toString()}`, attrs={}) {
  particles[name] = new Particle(attrs);
}
