'use strict'; // Enforce use of strict verion of JavaScript

const express = require('express');
const app = express();
module.exports.app = app;

const http = require('http').Server(app);
const { print, write, error, JSON_string } = require('./utils');
// Socket.io used to maintain active web-sockets
const io = require('socket.io')(http);
const db = require('./db');
// Finalhandler module to deal with responding back to the client and closing the connection


/*	@Doc
	Main server app instance module.
	Exports the created server instance out for the routes in the routes folder to access it.
	This module only holds some misc. routes like ping and error handling routes like for 404.
*/


/* Global variables */
const port = 3000;

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