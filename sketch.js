let video;
let poseNet;
let skeletons = [];
let poses = [];
let noseX = 0;
let noseY = 0;
let eye1X, eye1Y, eye2X, eye2Y;
let song;
let wrist1X, wrist1Y, wrist2X, wrist2Y;
let score = 0;
let firework;

let shongbao = [];			//small hongbao array
let mhongbao = [];			//medium hongbao array
let bhongbao = [];			//big hongbao array
let particles = [];     //explosion array

function preload() {
	song = loadSound('cnysong.mp3');
	hitsound = loadSound('hitsound.mp3');
	let print = console.log;
	print('Loading img now')
	Shongbaop = loadImage('shongbao.png');
	Mhongbaop = loadImage('mhongbao.png');
	Bhongbaop = loadImage('bhongbao.png');
}

function setup() {
	createCanvas(640, 480);
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelReady);
	poseNet.on('pose', gotPoses);
	song.play();
	song.loop();

	shongbao.push(new SHongbao());

}

function gotPoses(poses2) {

	//console.log(poses);
	poses = poses2;
	if (poses.length > 0) {

		noseX = poses[0].pose.keypoints[0].position.x;
		noseY = poses[0].pose.keypoints[0].position.y;

		eye1X = poses[0].pose.keypoints[1].position.x; //left eye
		eye1Y = poses[0].pose.keypoints[1].position.y;

		eye2X = poses[0].pose.keypoints[2].position.x; //right eye
		eye2Y = poses[0].pose.keypoints[2].position.y;

		wrist1X = poses[0].pose.keypoints[9].position.x; //left wrist
		wrist1Y = poses[0].pose.keypoints[9].position.y;

		wrist2X = poses[0].pose.keypoints[10].position.x; //right wrist
		wrist2Y = poses[0].pose.keypoints[10].position.y;
	}
}

function modelReady() {
	console.log('model ready');
}

function draw() {
	image(video, 0, 0);
	//translate(width,0); // move to far corner
	//scale(-1.0,1.0);    // flip x-axis backwards
	//image(video, 0, 0, width, height); //video on canvas, position, dimensions
	let d = dist(noseX, noseY, eye1X, eye1Y) //dist between nose and eye

	fill(255, 0, 0);
	ellipse(noseX, noseY, d); //draw on nose

	//fill(255, 0, 0);
	//ellipse(wrist1X, wrist1Y-20, d); //draw wrist

	//fill(255, 0, 0);
	//ellipse(wrist2X, wrist2Y-20, d);

	eye(eye1X, eye1Y, d, 1); //pass parameters to func eye()
	eye(eye2X, eye2Y, d, -1);

	for (let i = 0; i < particles.length; i++) {
		particles[i].show();
		particles[i].update();
	}


	for (let i = 0; i < shongbao.length; i++) {

		shongbao[i].show(Shongbaop);
		shongbao[i].update();

		const hit = hits(wrist1X, wrist1Y, shongbao[i].x, shongbao[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, shongbao[i].x, shongbao[i].y);
		if (hit) {
			//explode();
			hitsound.play();
			shongbao.splice(i, 1);
			score++;
		}
		if (hit2) {
			//explode();
			hitsound.play();
			shongbao.splice(i, 1);
			score++;
		}
	}
	for (let i = 0; i < mhongbao.length; i++) {

		mhongbao[i].show(Mhongbaop);
		mhongbao[i].update();

		const hit = hits(wrist1X, wrist1Y, mhongbao[i].x, mhongbao[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, mhongbao[i].x, mhongbao[i].y);
		if (hit) {
			//explode();
			hitsound.play();
			mhongbao.splice(i, 1);
			score++;
		}
		if (hit2) {
			//explode();
			hitsound.play();
			mhongbao.splice(i, 1);
			score++;
		}
	}
	for (let i = 0; i < bhongbao.length; i++) {

		bhongbao[i].show(Bhongbaop);
		bhongbao[i].update();

		const hit = hits(wrist1X, wrist1Y, bhongbao[i].x, bhongbao[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, bhongbao[i].x, bhongbao[i].y);
		if (hit) {
			//explode();
			hitsound.play();
			bhongbao.splice(i, 1);
			score++;
		}
		if (hit2) {
			//explode();
			hitsound.play();
			bhongbao.splice(i, 1);
			score++;
		}
	}

	textSize(32);
	text("Score:", 20, 40);
	text(score, 120, 40);

	if (frameCount % 60 == 0) {
		h = int(random(1, 100));
		if (h < 10) {
			shongbao.push(new SHongbao());
		}
		else if (h => 10 && h < 50) {
			mhongbao.push(new MHongbao());
		}
		else {
			bhongbao.push(new BHongbao());
		}
	}
}



function eye(x, y, size, n) {
	let angle = frameCount * 0.2;

	fill(255);
	noStroke();
	ellipse(x, y, size, size);

	fill(56);
	noStroke();
	ellipse(x + cos(angle * n) * size / 5, y + sin(angle * n) * size / 5, size / 2, size / 2);

}

function hits(wx, wy, hbx, hby) {
	if (dist(wx, 0, hbx, 0) < 40) {
		if (dist(0, wy, 0, hby) < 70) {
			return true
		}
	} else return false
}

function hits2(wx, wy, hbx, hby) {
	if (dist(wx, 0, hbx, 0) < 40) {
		if (dist(0, wy, 0, hby) < 70) {
			return true
		}
	} else return false
}

/*function explode(){
  for(let i=0; i<100;i++){
    firework = new Particles(500,60);
    particles.push(firework);
  }
}*/