'use strict'; // Enforce use of strict verion of JavaScript

const fs = require('fs');

/* Utilities function bindings */
const print = console.log;


// Global in memory reference of the user DB. Users are basically kv pairs of userID and highscore
var userDB;
// Global in memory reference of leaderboard DB. Will be an array of user objects
var leaderboard;

/*
	Every DB is a corresponding JSON file that already exists.

	User DB stores
		userID (string Key) : highscore (Int Prop)

	Leader board
		position (int key) : user Obj => {
			userID (string Key) : highscore (Int Prop)
		}

*/

// Read DB file "db" and return it to function caller
const read_db = (db) =>
	new Promise((resolve, reject) => {
		// Read the "DB" json file asynchronously
		fs.readFile(`./Databases/${db}.json`, 'utf8', function (err, data) {
			// Let any errors bubble up
			if (err) throw err;
			// Resolve with the parsed JSON file
			try { resolve(JSON.parse(data)); }
			catch (err) { return reject(err); }
		});
	});


// Read DB file "db" and return it to function caller
const update_db = (db, data) => {
	// Write to the "DB" json file asynchronously
	fs.writeFile(`./Databases/${db}.json`, JSON.stringify(data), (err) => {
		// Let any errors bubble up
		if (err) throw err;
	});
}

// Self-invoking setup function
(function setup() {
	// Read all the data from the "DB" files into memory at setup
	read_db('user')
		.then((data) => userDB = data);
	// Read array property of 'top10' key out and store in memory
	read_db('leaderboard')
		.then((data) => leaderboard = data['top10']);
})();


function create_user(userID) {
	// Creates a user entry in the userDB if the input userID does not collide with existing names

	if (Object(userDB).hasOwnKeys(userID))
		return false; // To indicate operation failure

	else {
		userDB[userID] = 0; // Create user entry and set default highscore to 0
		// Update user DB after the change of the in memory data object
		update_db('user', userDB);
		return true; // To indicate operation success
	}
}


/* Highscore related functions */
function get_highscore(userID) {
	// If user with userID does not exist, create a new user entry
	if (!userDB.user.userID){
		create_user(userID);
	}
	// SHould I call create_user always but expect a false to be returned to continue with getting highscore
	// Because even if no such user exists, a call to the create_user function will always ensure that the user
	// with that userID now exists regardless of whether it is newly created or not.

	// Return the highscore of the user
	return userDB[userID];
};

// What if it is a new user?
function set_highscore(userID, score) {
	// Set the score as highscore if score higher than highscore
	if (score > get_highscore(userID)) {
		// Set the score into the in-memory object
		userDB[userID] = score;
		// Update the leaderboard if needed. Pass in a user Object
		update_leaderboard({ userID: userID, score: score });
		// Call function to update the user DB with the new data
		update_db('user', userDB);
		// Return true to indicate update success
		return true;
	}
	// Return false to indicate update failed as score not new highscore
	return false;
};

function reset_highscore(userID) {
	// if userID is specified, reset the user with userID's highscore to 0
	if (userID) {
		// Reset the score in the in-memory object
		userDB[userID] = 0;
		// Call function to update the user DB with the new data
		update_db('user', userDB);
	}
	else {
		for (let userID in userDB)
			userDB[userID] = 0;
		// Call function to update the user DB with the new data
		update_db('user', userDB);
	}
}

// Function only called if the user broke his/her own record
function update_leaderboard(userObj) {
	// Loop through the leaderboard to see if score qualifies
	for (let i = 0; i < 10; i++) {
		if (userObj.score > leaderboard[i].score) {
			// Insert the element into the array at the specified index
			leaderboard.splice(i, 0, userObj);

			// Loop through the rest of the leaderboard to find if same user had other leaderboard entries
			for (let j = (i + 1); j < 10; j++) {
				// If the user have any other entries with a lower highscore
				if (userObj.userID === leaderboard[j].userID) {
					// Remove the entry with the lower highscore
					leaderboard.splice(j, 1);
					// Persists the changes/updates to the leaderboard onto disk
					update_db('leaderboard', { top10: leaderboard });
					// Break out of the function after cleaning up the score and making sure the leaderboard is still for top 10 players
					return;
				}
			}
			
			// Remove the last element from the leaderboard if no other entry from the same user
			leaderboard.pop();
			// Persists the changes/updates to the leaderboard onto disk
			update_db('leaderboard', { top10: leaderboard });
			// Break out of the loop after insertion and maintaining 10 ppl in the leaderboard
			return;
		}
	}
}

module.exports = {
	// Allow external modules to use all highscore related functions
	get_highscore: get_highscore,
	set_highscore: set_highscore,
	reset_highscore: reset_highscore,
	// Allow external modules access to a copy of the leaderboard array
	get_leaderboard: () => leaderboard.slice(0)
};