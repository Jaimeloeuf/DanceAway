'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Server Routes for highscore
*/


// Dependencies. The server app instance and the db functions
const app = require('../index').app;
const db = require('./db');

// API to get the highscore of the user with "userID"
app.get('/highscore/:userID', (req, res, next) => {
	// Get highscore with userID and send it back as a JSON string
	res.end(JSON_string({
		res: db.get_highscore(req.params.userID)
	}));
});

// API to set a highscore for user with "userID"
// Supposed to post the highscore using the request body, but much easier to implement into the URL for now
app.post('/highscore/:userID/:score', (req, res, next) => {
	// Update highscore and respond back with a boolean to indicate operation success
	res.end(JSON_string({
		res: db.set_highscore(req.params.userID, req.params.score)
	}));
});