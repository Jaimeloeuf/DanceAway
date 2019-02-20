function BHongbao() {
  this.y = 0;
  test = random(width);
  if(test > 590){
    this.x = test - 30;
  }
  else if(test < 30){
    this.x = test + 30;
  }
  else{
  this.x = random(width);
  }

  this.gravity = 0.05
  this.velocity = 0;

  this.show = function(hb) {
    image(hb,this.x,this.y);
    //fill(255, 0, 0);
    //rect(this.x, this.y, 60, 180);
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }
}