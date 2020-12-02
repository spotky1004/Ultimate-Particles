var particles = {};

class Particle {
  constructor(attrs={}) {
    //important attrs
    this.type = attrs.type || 'enemy'; // 'enemy' for enemy, 'player' for controlable player, 'text' for text, 'decoration' for decoration

    //view
    this.color = attrs.color || '#000'; // fill color for particle and text
    this.sides = attrs.sides || 4; // set sides of shaped particle
    this.rotateDeg = attrs.rotateDeg || 180; // set rotated for shaped particle (this property won't affect to hitbox/collision for now)
    this.zIndex = attrs.zIndex || 2; // z-index (0~5)
    this.spanPer = attrs.spanPer || 10; // spanPer for ~IType = 'span', ratio - 1 : spanPer
    this.alpha = attrs.alpha || 1; // alpha/opacity
    this.text = attrs.text || 'text'; // text property for for text

    //move
    this.moveType = attrs.moveType || ['normal', null]; // moveType - 'trace', 'avoid', 'circle', 'teaceCircle', 'traceAvoid'
    this.position = attrs.position || [0,0]; // position
    this.deg = attrs.deg || 0; // degree to move
    this.speed = attrs.speed || 0; this.speedI = attrs.speedI || 0; this.speedIType = attrs.speedIType || 'increment'; this.speedC = attrs.speedC || [0.001, 999]; // speed
    this.playerSpeed = attrs.playerSpeed || 0.01; this.screenParallaxPer = attrs.screenParallaxPer || 0; // propertys for player: playerSpeed is player move speed with keyboard, screenParallaxPer is screen position move based on playerSpeed
    this.linearSpeed = attrs.linearSpeed || [0, 0]; this.linearSpeedI = attrs.linearSpeedI || [0, 0]; this.linearSpeedIType = attrs.linearSpeedIType || 'increment'; this.linearSpeedC = attrs.linearSpeedC || [[0.001, 999], [0.001, 999]]; //linear speed for make 'Constant velocity linear motion' easily

    //size
    this.absSize = attrs.absSize || 1; this.absSizeI = attrs.absSizeI || 0; this.absSizeIType = attrs.absSizeIType || 'increment'; this.absSizeC = attrs.absSizeC || [0.001, 999]; // absSize multiplies both x and y size (or this property set text size)
    this.size = attrs.size || [0.015, 0.015]; this.sizeI = attrs.sizeI || [0, 0];  this.sizeIType = attrs.sizeIType || 'increment'; this.sizeC = attrs.sizeC || [[0.001, 999], [0.001, 999]]; // size for shaped particles
    this.hitboxSize = attrs.hitboxSize || 1; // hitbox, multiplies to final calculate

    //etc
    this.hp = attrs.hp || 10; this.hpMax = this.hp; // hp for player
    this.atk = attrs.atk || 1; this.breakOnAtttack = attrs.breakOnAtttack || 1; // propertys for enemy, when 'player' is collisionWith 'enemy' player's hp will decreased based on atk, also if breakOnAtttack is true: 'enemy' particle will disappear
  }

  update() {
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
    this.position[0] += (this.speed*Math.sin(Math.rad(this.deg))+this.linearSpeed[0])/1000*levelSettings.particleSpeed;
    this.position[1] -= (this.speed*Math.cos(Math.rad(this.deg))+this.linearSpeed[1])/1000*levelSettings.particleSpeed;

    // increment properties
    var speedI = 1/tps;
    switch (this.absSizeIType) {
      case 'increment':
      this.absSize = Math.min(Math.max(this.absSize+this.absSizeI*speedI, this.absSizeC[0]), this.absSizeC[1]);
        break;
      case 'multiply':
      this.absSize = Math.min(Math.max(this.absSize*this.absSizeI^speedI, this.absSizeC[0]), this.absSizeC[1]);
        break;
      case 'span':
      this.absSize = (this.absSizeI+this.absSize*this.spanPer)/(this.spanPer+1);
        break;
    }
    switch (this.sizeIType) {
      case 'increment':
      this.size[0] = Math.min(Math.max(this.size[0]+this.sizeI[0]*speedI, this.sizeC[0][0]), this.sizeC[0][1]);
      this.size[1] = Math.min(Math.max(this.size[1]+this.sizeI[1]*speedI, this.sizeC[1][0]), this.sizeC[1][1]);
        break;
      case 'multiply':
      this.size[0] = Math.min(Math.max(this.size[0]*this.sizeI[0]^speedI, this.sizeC[0][0]), this.sizeC[0][1]);
      this.size[1] = Math.min(Math.max(this.size[1]*this.sizeI[1]^speedI, this.sizeC[1][0]), this.sizeC[1][1]);
        break;
      case 'span':
      this.size[0] = (this.sizeI[0]+this.size[0]*this.spanPer)/(this.spanPer+1);
      this.size[1] = (this.sizeI[1]+this.size[1]*this.spanPer)/(this.spanPer+1);
        break;
    }
    switch (this.speedIType) {
      case 'increment':
      this.speed = Math.min(Math.max(this.speed+this.speedI*speedI, this.speedC[0]), this.speedC[1]);
        break;
      case 'multiply':
      this.speed = Math.min(Math.max(this.speed*this.speedI^speedI, this.speedC[0]), this.speedC[1]);
        break;
      case 'span':
      this.speed = (this.speedI+this.speed*this.spanPer)/(this.spanPer+1);
        break;
    }
    switch (this.linearSpeedIType) {
      case 'increment':
      this.linearSpeed[0] = Math.min(Math.max(this.linearSpeed[0]+this.linearSpeedI[0]*speedI, this.linearSpeedC[0][0]), this.linearSpeedC[0][1]);
      this.linearSpeed[1] = Math.min(Math.max(this.linearSpeed[1]+this.linearSpeedI[1]*speedI, this.linearSpeedC[1][0]), this.linearSpeedC[1][1]);
        break;
      case 'multiply':
      this.linearSpeed[0] = Math.min(Math.max(this.linearSpeed[0]*this.linearSpeedI[0]^speedI, this.linearSpeedC[0][0]), this.linearSpeedC[0][1]);
      this.linearSpeed[1] = Math.min(Math.max(this.linearSpeed[1]*this.linearSpeedI[1]^speedI, this.linearSpeedC[1][0]), this.linearSpeedC[1][1]);
        break;
      case 'span':
      this.linearSpeed[0] = (this.linearSpeedI[0]+this.linearSpeed[0]*this.spanPer)/(this.spanPer+1);
      this.linearSpeed[1] = (this.linearSpeedI[1]+this.linearSpeed[1]*this.spanPer)/(this.spanPer+1);
        break;
    }
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
}

function pushParticle(name=`t${new Date().getTime().toString()}`, attrs={}) {
  particles[name] = new Particle(attrs);
}
