'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Server Routes for accessing and using highscores
*/


// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../db');

// API to get the highscore of the user with "userID"
router.get('/:userID', (req, res) => {
	// Get highscore with userID and send it back as a JSON string
	res.json({
		res: db.get_highscore(req.params.userID)
	});
});

// API to set a highscore for user with "userID"
// Supposed to post the highscore using the request body, but much easier to implement into the URL for now
router.post('/:userID/:score', (req, res) => {
	// Update highscore and respond back with a boolean to indicate operation success
	res.json({
		res: db.set_highscore(req.params.userID, req.params.score)
	});
});

module.exports = router;