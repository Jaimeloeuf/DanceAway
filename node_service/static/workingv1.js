let count;
let video;
let poseNet;
let skeletons = [];
let poses = [];
let noseX = 0;
let noseY = 0;
let eye1X, eye1Y, eye2X, eye2Y;
let wrist1X, wrist1Y, wrist2X, wrist2Y, elbow1X, elbow1Y, elbow2X, elbow2Y;
let cupcake = [];
let water = [];
let coke = [];
let apple = [];

function preload() {
	cc = loadImage('cupcake.png');
	wt = loadImage('water.png');
	ck = loadImage('coke.png');
	ap = loadImage('apple.png');
}
function setup() {
	createCanvas(640, 580);
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelReady);
	poseNet.on('pose', gotPoses);
	score = 0;
	time = 0;
	count = 0;
}
function gotPoses(poses2) {
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

		elbow1X = poses[0].pose.keypoints[7].position.x; //left elbow
		elbow1Y = poses[0].pose.keypoints[7].position.y;

		elbow2X = poses[0].pose.keypoints[8].position.x; //right elbow
		elbow2Y = poses[0].pose.keypoints[8].position.y;
	}
}
function modelReady() {
}
function draw() {
	tint(255, 255, 255);
	image(video, 0, 0);


	let d = dist(noseX, noseY, eye1X, eye1Y);

	fill(255, 0, 0);
	ellipse(wrist1X, wrist1Y, d); //draw wrist

	fill(255, 0, 0);
	ellipse(wrist2X, wrist2Y, d);

	fill(255, 0, 0);
	ellipse(elbow1X, elbow1Y, d); //draw wrist

	fill(255, 0, 0);
	ellipse(elbow2X, elbow2Y, d);

	for (let i = 0; i < cupcake.length; i++) {
		cupcake[i].show(cc);
		cupcake[i].update();

		const hit = hits(wrist1X, wrist1Y, cupcake[i].x, cupcake[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, cupcake[i].x, cupcake[i].y);

		if (hit) {
			cupcake.splice(0, 1);
			score = score - 3;
		}
		if (hit2) {
			cupcake.splice(0, 1);
			score = score - 3;
		}
	}

	for (let i = 0; i < coke.length; i++) {
		coke[i].show(ck);
		coke[i].update();

		const hit = hits(wrist1X, wrist1Y, coke[i].x, coke[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, coke[i].x, coke[i].y);
		if (hit) {
			coke.splice(0, 1);
			score = score - 5;
		}
		if (hit2) {
			coke.splice(0, 1);
			score = score - 5;
		}
	}

	for (let i = 0; i < water.length; i++) {

		water[i].show(wt);
		water[i].update();

		const hit = hits(wrist1X, wrist1Y, water[i].x, water[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, water[i].x, water[i].y);

		if (hit) {
			water.splice(0, 1);
			score = score + 5;
		}
		if (hit2) {
			water.splice(0, 1);
			score = score + 5;
		}

	}

	for (let i = 0; i < apple.length; i++) {

		apple[i].show(ap);
		apple[i].update();

		const hit = hits(wrist1X, wrist1Y, apple[i].x, apple[i].y);
		const hit2 = hits2(wrist2X, wrist2Y, apple[i].x, apple[i].y);

		if (hit) {
			apple.splice(0, 1);
			score = score + 3;
		}
		if (hit2) {
			apple.splice(0, 1);
			score = score + 3;
		}
	}

	if (frameCount % 60 == 0) {
		i = int(random(1, 5));
		console.log(i);
		if (i == 1) {
			water.push(new Sprite());
		}
		else if (i == 2) {
			cupcake.push(new Sprite());
		}
		else if (i == 3) {
			coke.push(new Sprite());
		}
		else if (i == 4) {
			apple.push(new Sprite());
		}
	}
	textSize(32);
	text("Score:", 20, 40);
	text(score, 120, 40);
}
function hits(wx, wy, hbx, hby) {
	if (dist(wx, 0, hbx, 0) < 80) {
		if (dist(0, wy, 0, hby) < 80) {
			return true;
		}
	} else return false
}

function hits2(wx, wy, hbx, hby) {
	if (dist(wx, 0, hbx, 0) < 80) {
		if (dist(0, wy, 0, hby) < 80) {
			return true
		}
	} else return false
}