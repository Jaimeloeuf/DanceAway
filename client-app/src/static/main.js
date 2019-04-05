'use strict'; // Enforce use of strict JavaScript

// Given a key, find the matching value in the URL query if any.
function getQuery(field) {
    let url = window.location.href;
    try {
        let reg = new RegExp('[?&' + field + '=([^&#]*)', 'i');
        search_result = reg.exec(url)
        return search_result[1]; // Possible return value includes undefined
    } catch (err) {
        // If userID not available or cannot be parsed
        return undefined;
    }
}