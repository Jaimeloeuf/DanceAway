'use strict'; // Enforce use of strict verion of JavaScript

const express = require('express');
const app = express();
const http = require('http').Server(app);
// Socket.io used to maintain active web-sockets
const io = require('socket.io')(http);
const db = require('./db');
// Finalhandler module to deal with responding back to the client and closing the connection


/* Global variables */
const port = 3000;

/* Utilities function bindings */
const print = console.log;
const error = console.error;
const write = process.stdout.write;


// socket.io events
// io.on('connection', (socket) => {
// 	print('a user connected');
// 	socket.on('disconnect', () => print('user disconnected'));
// 	socket.on('message', (msg) => print(msg));
// 	// socket.emit('message', 'New msg from server')
// 	socket.broadcast.emit('message', 'msg to all units')
// });


// Allow express to serve static content to the User from the static assets directory
app.use(express.static('static'))

// Wrapper function over JSON.stringify to catch potential errors with a try/catch block
function JSON_string(object) {
	try {
		return JSON.stringify(object);
	} catch (err) { error(err); } // Log errors if any and continue
}

// Ping Route to check server status
app.get('/ping', (req, res, next) => {
	/*	Things to return to client
		- Number of active connections with socket.io
		- The number of multiplayer game-rooms alive
		- Load of the server?
	*/

	res.end(JSON_string({
		status: 'Server Up',
		alive_sockets: get_socket_count()
	}));
});

app.get('/game', (req, res, next) => {	
	// UserID is part of the URL encoded query string
	res.end(req.query.userID);
});

// Function to get the number of live web-socket connections held by the server
function get_socket_count() {
	return 1;
}

// API to get the highscore of the user with "userID"
app.get('/highscore/:userID', (req, res, next) => {
	// Get highscore with userID and send it back as a JSON string
	res.end(JSON_string({
		res: db.get_highscore(req.params.userID)
	}));
});

// API to set a highscore for user with "userID"
app.post('/highscore/:userID/:score', (req, res, next) => {
	// Update highscore and respond back with a boolean to indicate operation success
	res.end(JSON_string({
		res: db.set_highscore(req.params.userID, req.params.score)
	}));
});

// Function to get the leaderboard
app.get('/leaderboard', (req, res, next) => {
	res.end(JSON_string({
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

// Make the HTTP server listen to the port specified by the global variable
http.listen(port, () => print(`Server listening to port ${port}`));