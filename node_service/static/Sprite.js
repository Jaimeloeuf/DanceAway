// Constructor function to create Sprite objects.
function Sprite() {
	this.x = random(width);
	this.y = 0;
	this.gravity = 0.05;
	this.velocity = 0;

	this.show = function (pic) {
		image(pic, this.x, this.y);
	}
	
	this.update = function () {
		this.velocity += this.gravity;
		this.y += this.velocity;
	}
}