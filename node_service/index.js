'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Main server app instance module.
	Exports the created server instance out for the routes in the routes folder to access it.
	This module only holds some misc. routes like ping and error handling routes like for 404.
*/


const express = require('express');
const app = express();
const http = require('http').Server(app);
const { print, JSON_string } = require('./utils');
const db = require('./db');
// Finalhandler module to deal with responding back to the client and closing the connection

/* Global variables */
const port = 3000;


// Allow express to serve static content to the User from the "static" assets directory
app.use(express.static('static'));


/* Mount all routers from the routes directory onto the Express app */
app.use('/highscore', require('./routes/highscore'));
app.use(require('./routes/multiplayer'));


// Ping Route to check server status
app.get('/ping', (req, res, next) => {
	/*	Things to return to client
		- Number of active connections with socket.io
		- The number of multiplayer game-rooms alive
		- Load of the server?
    */
    res.json({
		status: 200,
		alive_sockets: get_socket_count()
	});
});
// Function to get the number of live web-socket connections held by the server
function get_socket_count() {
    // @TODO Implement the socket number counter
	return 1;
}


// Function invoked at the start of the game after logging in
// Secure this route and redirect to game.html after sending user a JWT
app.get('/game', (req, res, next) => {	
	// UserID is part of the URL encoded query string
    // res.end(req.query.userID);
});


// Route handler for getting the leaderboard
app.get('/leaderboard', (req, res, next) => {
	res.end(JSON_string({
		res: db.get_leaderboard();
	}));
});


// 404 route handler
app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!");
});


// 500 internal server error route handler
app.use((err, req, res, next) => {
	print(err.stack);
	res.status(500).send('Something broke!');
});


// Make the HTTP server listen to the port specified by the global variable
http.listen(port, () => print(`Server listening to port ${port}`));