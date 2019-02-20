function Particles(x,y){
  this.pos = createVector(x,y);
  this.vel = p5.Vector.random2D();
  this.acc = createVector(0,0);
  
this.applyForce = function(force){
  this.acc.add(force);
}

this.update = function(){
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
}

this.show = function(){
  ellipse(this.pos.x,this.pos.y,10,10);
  point(this.pos.x,this.pos.y);
}
}