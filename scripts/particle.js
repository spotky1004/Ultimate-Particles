var particles = {};

class Particle {
  constructor(attrs={}) {
    //important attrs
    this.type = attrs.type || 'enemy';

    //view
    this.color = attrs.color || '#000';
    this.sides = attrs.sides || 4;

    //move
    this.position = attrs.posision || [0,0];
    this.deg = attrs.deg || 0;
    this.speed = attrs.speed || 0; this.playerSpeed = attrs.playerSpeed || 0.01;
    this.linearSpeed = attrs.linearSpeed || [0, 0];

    //size
    this.absSize = attrs.absSize || 1; this.absSizeI = attrs.absSizeI || 0; this.absSizeIType = attrs.absSizeIType || 'increment'; this.absSizeC = attrs.absSizeC || [0.001, 999];
    this.size = attrs.size || [0.015, 0.015]; this.sizeI = attrs.sizeI || [0, 0];  this.sizeIType = attrs.sizeIType || 'increment'; this.sizeC = attrs.sizeC || [[0.001, 999], [0.001, 999]];
    this.hitboxSize = attrs.hitboxSize || 1;

    //etc
    this.spanPer = attrs.spanPer || 10;
    this.hp = attrs.hp || 10; this.hpMax = this.hp;
    this.atk = attrs.atk || 1; this.breakOnAtttack = attrs.breakOnAtttack || 1; 
    this.moveType = attrs.moveType || ['normal', null];
  }

  update() {
    switch (this.moveType[0]) {
      case 'trace':
      var toTrace = particles[this.moveType[1]];
      if (toTrace !== undefined) {
        this.deg = (Math.atan2(this.position[1]-toTrace.position[1], this.position[0]-toTrace.position[0])/Math.PI*180+270)%360;
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
      if (toTrace !== undefined) {
        this.deg = Math.atan2(toTrace.position[1]-this.position[1], toTrace.position[0]-this.position[0])/Math.PI*180;
      }
        break;
    }
    this.position[0] += (this.speed*Math.sin(Math.rad(this.deg))+this.linearSpeed[0])/1000*levelSettings.particleSpeed;
    this.position[1] -= (this.speed*Math.cos(Math.rad(this.deg))+this.linearSpeed[1])/1000*levelSettings.particleSpeed;

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

  randMove(type='') {
    type = type.replace(/R/g, Math.floor(Math.random()*4).toString()); //change 'R' to '0' ~ '3', so that change sides random easily!
    switch (type) {
      case 'r0': //top random
      this.position = [Math.random()*2-1, -1];
      this.deg = (Math.random()*180+90)%360;
        break;
      case 'r1': //bottom random
      this.position = [Math.random()*2-1, 1];
      this.deg = (Math.random()*180+270)%360;
        break;
      case 'r2': //left random
      this.position = [-1, Math.random()*2-1];
      this.deg = (Math.random()*180)%360;
        break;
      case 'r3': //right random
      this.position = [1, Math.random()*2-1];
      this.deg = (Math.random()*180+180)%360;
        break;
      default:

    }
    return this;
  }
}

function pushParticle(name=`t${new Date().getTime().toString()}`, attrs={}) {
  particles[name] = new Particle(attrs);
}
