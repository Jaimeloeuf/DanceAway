'use strict'; // Enforce use of strict verion of JavaScript

/*  @Doc
    This module contains all interface for data persistence

    @Todo
    - Fixed the highscore related functions following API change of DB objects
*/

const DB = require('./Database');

/* Utility function binding */
const print = console.log;


// Every DB is a corresponding JSON file that already exists.
/*  Global in memory reference to the user DB.
    Users are basically kv pairs of userID and highscore.

    Schema
    userID (string Key) : highscore (Int Prop)  */
const userDB = DB('user');


/*  Global in memory reference of leaderboard DB.
    leaderboard is an array of user objects.

    Schema
    position (int key) : user Obj => {
        userID (string Key) : highscore (Int Prop)
    }   */
const leaderboard = DB('leaderboard');


// Function that creates a user entry in the userDB with "userID"
function create_user(userID) {
    // Creates a user entry in the userDB if the input userID does not collide with existing names

    if (Object(userDB.data).hasOwnKeys(userID))
        return false; // To indicate operation failure

    else {
        userDB.data[userID] = 0; // Create user entry and set default highscore to 0
        // Update user DB after the change of the in memory data object
        userDB.save();
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

function update_leaderboard(user) {
    /*  Update leaderboard function is only called if user broke own record
        user's last highscore is definetly overwritten which means that we
        just need to check if the user exists on the board first */


    // Function to delete user if they have a older placing on the leaderboard
    function delete_user_if_exist_in_leaderboard(user) {
        for (let i = 0, len = leaderboard.length; i < len; i++) {
            // First step is check if the user is already on the leaderboard
            if (user.userID === leaderboard[i].userID) {
                leaderboard.splice(i, 1); // Delete the user
                // Once the user is deleted, we can now return a true and exit the function
                return true;
            }
        }
    }


    // Function to insert the user into the leaderboard if the scoring criteria is met
    function insert_user_into_leaderboard(user) {
        for (let i = 0, len = leaderboard.length; i < len; i++) {
            // If the score is higher than insert it before that score
            if (user.score > leaderboard[i]) {
                // Insert user Obj without deletion
                leaderboard.splice(i, 0, user);
                // Return true to indicate that there is an insertion
                return true;
            }
        }
    }


    // If user earned a place on the leaderboard
    if (insert_user_into_leaderboard(user)) {
        /*  Remove original placing if any.
            If user no old placing,
            remove last user so top 10 leaderboard only have 10 users
        */
        if (!delete_user_if_exist_in_leaderboard(user))
            if (leaderboard.length > 10)
                leaderboard.pop();

        // Persists these changes/updates to the leaderboard onto disk
        update_db('leaderboard', { top10: leaderboard });
    }
}


// To deprecate after tests
function update_leaderboard_old(user) {
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