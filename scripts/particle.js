var particles = {};

class Particle {
  constructor(attrs={}) {
    this.type = attrs.type || 'enemy';
    this.position = attrs.posision || [0,0];
    this.speed = attrs.speed || 0;
    this.color = attrs.color || '#000';
    this.absSize = attrs.absSize || 1;
    this.size = attrs.size || [0.015, 0.015];
    this.sides = attrs.sides || 4;
    this.deg = attrs.deg || 0;
    this.hitboxSize = attrs.hitboxSize || 1;
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
