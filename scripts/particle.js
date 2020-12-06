var particles = {};

var propertyI = [
  'rotateDeg', 'alpha',
  'deg', 'speed', 'playerSpeed', 'linearSpeed',
  'absSize', 'size', 'position'
];
var iTypes = [
  'I', 'IType', 'C'
];

class Particle {
  constructor(attrs={}) {
    // important
    this.type = attrs.type || 'enemy'; // 'enemy' for enemy, 'player' for controlable player, 'text' for text, 'decoration' for decoration

    // view
    this.color = attrs.color || '#000'; // fill color for particle and text
    this.sides = attrs.sides || 4; // set sides of shaped particle
    this.rotateDeg = attrs.rotateDeg || 180; // set rotated for shaped particle (this property won't affect to hitbox/collision for now)
    this.zIndex = attrs.zIndex || 2; // z-index (0~4)
    this.spanPer = attrs.spanPer || 10; // spanPer for ~IType = 'span', ratio - 1 : spanPer
    this.alpha = attrs.alpha || 1; // alpha/opacity
    this.text = attrs.text || 'text'; // text property for for text
    this.effects = attrs.effects || []; // effects - 'glow'

    // move
    this.moveType = attrs.moveType || ['normal', null]; // moveType - 'trace', 'avoid', 'circle', 'teaceCircle', 'traceAvoid'
    this.specialAttrs = attrs.specialAttrs || []; // specialAttrs - 'bounce'
    this.position = attrs.position || [0,0]; // position
    this.deg = attrs.deg || 0; // degree to move
    this.speed = attrs.speed || 0; // speed
    this.playerSpeed = attrs.playerSpeed || 0.01; // property for player: player move speed with keyboard
    this.screenParallaxPer = attrs.screenParallaxPer || 0; // property for player: screen position move based on playerSpeed
    this.linearSpeed = attrs.linearSpeed || [0, 0]; //linear speed for make 'Constant velocity linear motion' easily

    // size
    this.absSize = attrs.absSize || 1; // absSize multiplies both x and y size (or this property set text size)
    this.size = attrs.size || [0.015, 0.015]; this.sizeI = attrs.sizeI || [0, 0];  this.sizeIType = attrs.sizeIType || 'increment'; this.sizeC = attrs.sizeC || [[0.001, 999], [0.001, 999]]; // size for shaped particles
    this.hitboxSize = attrs.hitboxSize || 1; // hitbox, multiplies to final calculate

    // game
    this.hp = attrs.hp || 10; // hp for player
    this.atk = attrs.atk || 1; this.breakOnAtttack = attrs.breakOnAtttack || 1; // propertys for enemy, when 'player' is collisionWith 'enemy' player's hp will decreased based on atk, also if breakOnAtttack is true: 'enemy' particle will disappear

    // delete
    this.outOfBounds = attrs.outOfBounds || [[-2, 2], [-2, 2]]; // this is vaild position of particle. if particle's potition is out of this square it'll be deleted
    this.deleteTick = attrs.deleteTick || -1; // particle will be deleted after n tick (-1 to disable)

    // Increments
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

  update(name) {
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
      var centerDeg = (Math.atan2(this.position[1]-center[1], this.position[0]-center[0])/Math.PI*180+270+this.speed)%360;
      this.position = [-Math.sin(Math.rad(centerDeg))*dist, Math.cos(Math.rad(centerDeg))*dist];
        break;
    }

    // move
    if (this.moveType[0] != 'circle') {
      this.position[0] = Math.min(this.positionC[0][1], Math.max(this.positionC[0][0], this.position[0]+(this.speed*Math.sin(Math.rad(this.deg))+this.linearSpeed[0])/1000*levelSettings.particleSpeed));
      this.position[1] = Math.min(this.positionC[1][1], Math.max(this.positionC[1][0], this.position[1]-(this.speed*Math.cos(Math.rad(this.deg))-this.linearSpeed[1])/1000*levelSettings.particleSpeed));
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

    // increment properties
    var speedI = 1/tps;
    for (var i = 0, l = propertyI.length; i < l; i++) {
      if ((this[`${propertyI[i]}I`] == 0 || this[`${propertyI[i]}I`] == [0, 0]) && this[`${propertyI[i]}IType`] == 'increment') continue;
      if (typeof this[`${propertyI[i]}`] == 'number') {
        switch (this[`${propertyI[i]}IType`]) {
          case 'increment':
          this[`${propertyI[i]}`] = Math.min(this[`${propertyI[i]}C`][1], Math.max(this[`${propertyI[i]}C`][0], incrementCalc(this[`${propertyI[i]}`], this[`${propertyI[i]}I`], speedI)));
            break;
          case 'multiply':
          this[`${propertyI[i]}`] = Math.min(this[`${propertyI[i]}C`][1], Math.max(this[`${propertyI[i]}C`][0], multiplyCalc(this[`${propertyI[i]}`], this[`${propertyI[i]}I`], speedI)));
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
            this[`${propertyI[i]}`][j] = Math.min(this[`${propertyI[i]}C`][j][1], Math.max(this[`${propertyI[i]}C`][j][0], incrementCalc(this[`${propertyI[i]}`][j], this[`${propertyI[i]}I`][j], speedI)));
              break;
            case 'multiply':
            this[`${propertyI[i]}`][j] = Math.min(this[`${propertyI[i]}C`][j][1], Math.max(this[`${propertyI[i]}C`][j][0], multiplyCalc(this[`${propertyI[i]}`][j], this[`${propertyI[i]}I`][j], speedI)));
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
      delete particles[name];
      return 0;
    }
    if (this.deleteTick != -1) {
      this.deleteTick--;
    }
    return 1;
  }

  collisionWith(particle) {
    if (
      Math.abs(this.position[0]-particle.position[0]) < Math.abs(this.size[0]*particle.absSize*this.hitboxSize+particle.size[0]*particle.hitboxSize*particle.absSize) &&
      Math.abs(this.position[1]-particle.position[1]) < Math.abs(this.size[1]*particle.absSize*this.hitboxSize+particle.size[1]*particle.hitboxSize*particle.absSize)
    ) {
      return 1;
    }
    return 0;
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

  getTotAbsSize() {
    return [this.absSize*this.size[0], this.absSize*this.size[1]];
  }
}

function pushParticle(name=`t${new Date().getTime().toString()}`, attrs={}) {
  particles[name] = new Particle(attrs);
}
