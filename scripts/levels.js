const timer = ms => new Promise(res => setTimeout(res, ms));

async function levelTest() {
  //phase1
  for (var i = 0; i < 100; i++) {
    particles[`Phase1-Shape${i}`] = new Particle().randMove('rR').setSpeed(10);
  }

  await timer(4000);
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

  await timer(4000);
  //phase3
  screenScaleSpan(1, 10);
  screenSizeSpan(0.8, 10);
  for (var i = 0; i < 10; i++) {
    particles[`Phase3-Shape${i}`] = new Particle({'color' : '#00f'}).setSides(i+4).setDeg(36*i).setSpeed(5).setSize(4);
  }
}
