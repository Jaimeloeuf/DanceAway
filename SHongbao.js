
function SHongbao() {
  this.y = 0;
  test = random(width);
  if(test > 610){
    this.x = test - 10;
  }
  else if(test < 10){
    this.x = test + 10;
  }
  else{
  this.x = random(width);
  }

  this.gravity = 0.05
  this.velocity = 0;

  this.show = function(hb) {
    image(hb,this.x,this.y);
    //fill(255, 0, 0);
    //rect(this.x, this.y, 20, 60);
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }
}