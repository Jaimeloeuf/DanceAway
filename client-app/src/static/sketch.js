// Global variables for use of reference
var video;

// Every player starts off with 3 Lives and score of 0
var lives = 3;
var score = 0;

// Global variables to hold the different images
var cc, wt, ck, ap;

let skeletons = [];
let noseX = 0;
let noseY = 0;
let eye1X, eye1Y;
let wrist1X, wrist1Y, wrist2X, wrist2Y;

// GLobal arrays to store the current Sprite objects of the particular types inside the canvas
let cupcake = [];
let water = [];
let coke = [];
let apple = [];

// Function called before setup() to load static resources asynchronously in a blocking way.
function preload() {
	cc = loadImage('cupcake.png');
	wt = loadImage('water.png');
	ck = loadImage('coke.png');
	ap = loadImage('apple.png');
}
var interval;
// Setup function to run before the game begins
function setup() {
	// Create/Draw the canvas out
	createCanvas(640, 480);

	// Read from the WebCam output videostream
	video = createCapture(VIDEO);
	// Size the video to the same size as the canvas
	video.size(640, 480);
	// Hide the video feed, only the AR overlayed videostream is displayed
	video.hide();

	// Use poseNet from ml5 lib to get user's poses
	// let poseNet = ml5.poseNet(video, modelReady);
	// poseNet.on('pose', getPoses);
	ml5.poseNet(video, modelReady).on('pose', getPoses);

	// Create the 2 buttons using p5.js
	pause_button = createButton('Pause');
	pause_button.mousePressed(pause_game);
	continue_button = createButton('Continue');
	continue_button.mousePressed(continue_game);

	// Set text size for the scoreboard and live count
    textSize(32);
    

    interval = setInterval(() => {
        // RNG to choose which item to drop
		let Sprite_object_type = int(random(1, 5));
		console.log(`The random number generated is ${Sprite_object_type}`); // Debug statement

		// Create a new sprite and add it into the array for the generated item type
		switch (Sprite_object_type) {
			case 1: water.push(new Sprite()); break;
			case 2: cupcake.push(new Sprite()); break;
			case 3: coke.push(new Sprite()); break;
			case 4: apple.push(new Sprite()); break;
		}
    }, 2000);
}

function pause_game() {
	// Stop the video capture
	// video.stop();
    // Stop the draw() loop
    noLoop();
    clearInterval(interval);
}

function continue_game() {
	// Start the video capture
	// video.start();
	// Start the draw() loop
    loop();
    setInterval(interval);
}

function getPoses(poses) {
	if (poses.length > 0) {
		noseX = poses[0].pose.keypoints[0].position.x;
		noseY = poses[0].pose.keypoints[0].position.y;
		//left eye
		eye1X = poses[0].pose.keypoints[1].position.x;
		eye1Y = poses[0].pose.keypoints[1].position.y;
		//left wrist
		wrist1X = poses[0].pose.keypoints[9].position.x;
		wrist1Y = poses[0].pose.keypoints[9].position.y;
		//right wrist
		wrist2X = poses[0].pose.keypoints[10].position.x;
		wrist2Y = poses[0].pose.keypoints[10].position.y;
	}
}

function modelReady() {
}

function draw() {
	// Flip the image on the canvas as the camera feed is mirrored
	translate(video.width, 0);
	scale(-1.0, 1.0);
	// Draw the canvas using fames of the video
	image(video, 0, 0);

	// Call to draw wrists out, with nose to eye as reference distance
	let d = dist(noseX, noseY, eye1X, eye1Y);
	ellipse(wrist1X, wrist1Y, d);
	ellipse(wrist2X, wrist2Y, d);

	for (let i = 0, len = cupcake.length; i < len; i++) {
		if (!cupcake[i])
			break;
		cupcake[i].show(cc);
		cupcake[i].update();

		let hit1 = caught(wrist1X, wrist1Y, cupcake[i].x, cupcake[i].y);
		let hit2 = caught(wrist2X, wrist2Y, cupcake[i].x, cupcake[i].y);

		// Unhealthy food category, thus minus a life when caught
		if (hit1) {
			cupcake.splice(0, 1);
			--lives;
		}
		if (hit2) {
			cupcake.splice(0, 1);
			--lives;
		}
	}


	for (let i = 0, len = coke.length; i < len; i++) {
		if (!coke[i])
			break;
		coke[i].show(ck);
		coke[i].update();

		let hit1 = caught(wrist1X, wrist1Y, coke[i].x, coke[i].y);
		let hit2 = caught(wrist2X, wrist2Y, coke[i].x, coke[i].y);

		if (hit1) {
			coke.splice(0, 1);
			--lives;
		}
		if (hit2) {
			coke.splice(0, 1);
			--lives;
		}
	}


	for (let i = 0, len = water.length; i < len; i++) {
		if (!water[i])
			break;
		water[i].show(wt);
		water[i].update();

		let hit1 = caught(wrist1X, wrist1Y, water[i].x, water[i].y);
		let hit2 = caught(wrist2X, wrist2Y, water[i].x, water[i].y);

		if (hit1) {
			water.splice(0, 1);
			score = score + 5;
		}
		if (hit2) {
			water.splice(0, 1);
			score = score + 5;
		}
	}


	for (let i = 0, len = apple.length; i < len; i++) {
		if (!apple[i])
			break;
		apple[i].show(ap);
		apple[i].update();

		let hit1 = caught(wrist1X, wrist1Y, apple[i].x, apple[i].y);
		let hit2 = caught(wrist2X, wrist2Y, apple[i].x, apple[i].y);

		if (hit1) {
			apple.splice(0, 1);
			score = score + 3;
		}
		if (hit2) {
			apple.splice(0, 1);
			score = score + 3;
		}
	}


	// if (frameCount % 60 == 0) {
	// 	// RNG to choose which item to drop
	// 	let Sprite_object_type = int(random(1, 5));
	// 	print(`The random number generated is ${Sprite_object_type}`); // Debug statement

	// 	// Create a new sprite and add it into the array for the generated item type
	// 	switch (Sprite_object_type) {
	// 		case 1: water.push(new Sprite()); break;
	// 		case 2: cupcake.push(new Sprite()); break;
	// 		case 3: coke.push(new Sprite()); break;
	// 		case 4: apple.push(new Sprite()); break;
	// 	}
    // }
    
	// Update the game stats at the end of every drawing/calculation loop
	update_game_stats()

	// End the game if no more lives are left
	if (lives < 1)
		game_end();
}

// Function to run when the game ends
function game_end() {
	// Stop the game
	pause_game();
	// Clear the whole sketch
	remove();
	// Remove the 'lives' stats
	document.getElementById('lives').innerHTML = '';

	// Now that the game has ended check if the user have entered their userID before the game
	let userID = getQuery('userID');
	// If user entered a userID
	if (userID) {
		// Create a XHTTP object
		const xhttp = new XMLHttpRequest();
		// For now do nothing when the server responds back
		xhttp.onreadystatechange = (e) => {};
		// Generate the URL endpoint to post to for updating highscore if possible and open an AJAX connection with it
		xhttp.open("GET", `http://localhost:3000/highscore/${userID}/${score}`);
		// Make the request
		xhttp.send();
	}

	// Write to the user about the results and the leaderboard
	print_leaderboard();
	// Get food trivia and display onto the canvas
	getFood();
}

function generateRandomQuestion() {
	var fruits = ["How many vitamin c are there in 2 apples?", "How many vitamin c are there in 2 Orange?", "How many vitamin c are there in 2 Banana?"];
	return fruits[Math.floor((Math.random() * 2) + 1)]
}

function getFood() {
	const http = new XMLHttpRequest();
	var question = generateRandomQuestion();
	const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/quickAnswer?q=' + encodeURI(question);
	http.onreadystatechange = (e) => document.getElementById('lives').innerHTML = `Foood Trivia:</h4><br><h4>${JSON.parse(http.responseText).answer}`;
	http.open("GET", url);
	http.setRequestHeader("X-RapidAPI-Key", "15409923e6mshd754f3ed4a3971ap11964djsn74692d63785c");
	http.send();
}

// Basically the fetch function
function get(url, callback) {
	const xhttp = new XMLHttpRequest();
	// Call the callback function with this AJAX object
	xhttp.onreadystatechange = () => callback(xhttp);
	// Make the AJAX request in async manner
	xhttp.open("GET", url, true);
	// xhttp.setRequestHeader("", "");
	xhttp.send();
}

function print_leaderboard() {
	/* Fetch the leaderboard data from the server and create HTML block to display */
	get("http://localhost:3000/leaderboard", (xhttp) => {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			/* Create the HTML element */
			// Find a <table> element with id="leaderboard":
			let table = document.getElementById("leaderboard");
			// Create an empty <tr> element and add it to the 1st position of the table:
			let row = table.insertRow(-1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			row.insertCell(0).innerHTML = "Username";
			row.insertCell(1).innerHTML = "Highscore";

			// Parse and extract out the leaderboard
			let leaderboard = JSON.parse(xhttp.responseText).res;

			for (let i = 0; i < 10; i++) {
				row = table.insertRow(-1);
				row.insertCell(0).innerHTML = leaderboard[i].userID;
				row.insertCell(1).innerHTML = leaderboard[i].score;
			}
		}
	});
}

function update_game_stats() {
	document.getElementById('lives').innerHTML = `Lives: ${lives}`;
	document.getElementById('score').innerHTML = `Score: ${score}`;
}

// The smaller the value the threshold, the nearer the 2 points must meet to catch the item.
const dist_threshold = 50;

function caught(wx, wy, hbx, hby) {
	if (dist(wx, 0, hbx, 0) < dist_threshold) {
		if (dist(0, wy, 0, hby) < dist_threshold) {
			return true;
		}
	} else return false
}