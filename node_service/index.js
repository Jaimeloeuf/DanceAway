'use strict'; // Enforce use of strict verion of JavaScript

const express = require('express')
const app = express()

/* Global variables */
const port = 3000;

/* Utilities function bindings */
const print = console.log;
const error = console.error;
const write = process.stdout.write;


// Finalhandler module to deal with responding back to the client and closing the connection

// Socket.io used to maintain active web-sockets



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


/* Should I create my own db module wrapper or is the DB part easy enough for the individual funcs to use */

app.post('/highscore/:userID', (req, res, next) => {
	// Get highscore with userID and set it as the response body
	res.body = get_highscore(req.params.userID);

});

app.get('/', (req, res, next) => {

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


app.listen(port, () => print(`Server listening to port ${port}`));