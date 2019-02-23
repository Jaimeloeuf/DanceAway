'use strict'; // Enforce use of strict verion of JavaScript

const express = require('express');
const app = express();
const db = require('./db');

/* Global variables */
const port = 3000;

/* Utilities function bindings */
const print = console.log;
const error = console.error;
const write = process.stdout.write;


// Finalhandler module to deal with responding back to the client and closing the connection

// Socket.io used to maintain active web-sockets

// Allow express to serve static content to the User from the static assets directory
app.use(express.static('static'))

// Home page front of the service
app.get('/', (req, res, next) => {
	res.end('Hi');
});

// Ping Route to check server status
app.get('/ping', (req, res, next) => {
	/*	Things to return to client
		- Number of active connections with socket.io
		- The number of multiplayer game-rooms alive
		- Load of the server?
	*/

	res.end('Server up');
});


// API to get the highscore of the user with "userID"
app.get('/highscore/:userID', (req, res, next) => {
	// Get highscore with userID and send it back as a JSON string
	res.end(JSON.stringify({
		res: db.get_highscore(req.params.userID)
	}));
});

// API to set a highscore for user with "userID"
app.post('/highscore/:userID/:score', (req, res, next) => {
	// Update highscore and respond back with a boolean to indicate operation success
	res.end(JSON.stringify({
		res: db.set_highscore(req.params.userID, req.params.score)
	}));
});

// Function to get the leaderboard
app.get('/leaderboard', (req, res, next) => {
	res.end(JSON.stringify({
		res: db.get_leaderboard()
	}));
});

// 404 route handler
app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!")
});

// 500 internal server error route handler
app.use((err, req, res, next) => {
	error(err.stack)
	res.status(500).send('Something broke!')
});

// Listen to the port specified by the global variable
app.listen(port, () => print(`Server listening to port ${port}`));