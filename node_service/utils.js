'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	This module provides utiliy functions to the other modules.
*/

/* Utility function binding */
module.exports.print = console.log;

// Wrapper function over JSON.stringify to catch potential errors with a try/catch block
module.exports.JSON_string = function (object) {
	try {
		return JSON.stringify(object);
	} catch (err) { print(err); } // Log errors to stdout if any and continue
}