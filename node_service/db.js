'use strict'; // Enforce use of strict verion of JavaScript

const fs = require('fs');

/* Utility function binding */
const print = console.log;

// Global in memory reference of the user DB. Users are basically kv pairs of userID and highscore
var userDB;
// Global in memory reference of leaderboard DB. Will be an array of user objects
var leaderboard;
/*	The leaderboard structure only holds the top 10 scores.
	Once a user is kicked off the top 10, it will no longer be stored.
*/

/*	Every DB is a corresponding JSON file that already exists.

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


// Write the DB data held in memory into the "db" DB file
const update_db = (db, data) => {
    // Write to the "DB" json file asynchronously
    fs.writeFile(`./Databases/${db}.json`, JSON.stringify(data), (err) => {
        // Let any errors bubble up
        if (err) throw err;
    });
}

// Self-invoking setup function that runs when this module is "required"
(function setup() {
    // Read all the data from the "DB" files into memory at setup
    read_db('user')
        .then((data) => userDB = data);
    // Read array property of 'top10' key out and store in memory
    read_db('leaderboard')
        .then((data) => leaderboard = data['top10']);
})();

// Function that creates a user entry in the userDB with "userID"
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
    if (!userDB.user.userID) {
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

// Update leaderboard function that's only called if user broke his/her own record
function update_leaderboard(user) {
    // Loop through the leaderboard to see if score qualifies
    for (let i = 0; i < 10; i++) {
        if (user.score > leaderboard[i].score) {
            // Insert the element into the array at the specified index
            leaderboard.splice(i, 0, user);

            // Loop through the rest of the leaderboard to find if same user had other leaderboard entries
            for (let j = (i + 1); j < 10; j++) {
                // If the user have any other entries with a lower highscore
                if (user.userID === leaderboard[j].userID) {
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

    // Loop through leaderboard to see if score qualifies
    for (let i = 0, len = Object.keys(leaderboard).length; i < len; i++) {
        if (user.score > leaderboard[i].score) {
            // Insert the element into the array at the specified index
            leaderboard.splice(i, 0, user);

            // Loop through the rest of the leaderboard to find if same user had other leaderboard entries
            for (let j = (i + 1); j < len; j++) {
                // If the user have any other entries with a lower highscore
                if (user.userID === leaderboard[j].userID) {
                    // Remove the entry with the lower highscore
                    leaderboard.splice(j, 1);
                    // Persists the changes/updates to the leaderboard onto disk
                    update_db('leaderboard', { top10: leaderboard });
                    // Break out of the function after cleaning up the score and making sure the leaderboard is still for top 10 players
                    return;
                }
            }

            // If there is more than 10 user in the top 10 leaderboard
            if (len > 10)
                // Remove last user if no other entry from the same user
                leaderboard.pop();
            // Persists the changes/updates to the leaderboard onto disk
            update_db('leaderboard', { top10: leaderboard });
            // Break out of the loop after insertion and maintaining 10 ppl in the leaderboard
            return;
        }
    }

    /* Might need to rewrite the loop
    What if the user just nice overwrite his own high score?
    What if the user have a placing higher? Than the check wont work */

    for (let i = 0, len = Object.keys(leaderboard).length; i < len; i++) {

        // If user's score is higher than a highscore on the leaderboard
        if (user.score > leaderboard[i].score) {

            // Insert the element into the array at the specified index
            leaderboard.splice(i, 0, user);

            /* Remove from leaderboard if user have another placing on it */
            // Loop through the rest of the list to see if user have another placing
            for (let j = (i + 1); j < len; j++) {

                // If user have another placing
                if (leader.userID === user.userID) {
                    // Remove the entry with the lower highscore
                    leaderboard.splice(j, 1);
                }

            }
        }
    }
}

/*	Exported items:
	- Methods to read, update and reset user's highscore.
	- Method to read a copy of the in memory leaderboard

	Notes:
	- External modules have no direct access to the userDB or their scores, only those
	  produced by the methods, which prevent them from modifying the values stored in
	  the DB randomly.
	- The leaderboard is ony available as a copy of the leaderboard held in memory that
	  is true at time of request only, if leaderboard in memory is updated, the value
	  that external modules hold through the get_leaderboard method is not updated, thus
	  the requested value should only be used once, and should be requested and generated
	  over again everytime.
	- External modules have no direct access to the userDB memory structure to prevent
	  accidental access and modifications
*/
module.exports = {
    // Allow external modules to use all highscore related functions
    get_highscore: get_highscore,
    set_highscore: set_highscore,
    reset_highscore: reset_highscore,
    // Allow external modules access to a copy of the leaderboard array
    get_leaderboard: () => leaderboard.slice(0)
};