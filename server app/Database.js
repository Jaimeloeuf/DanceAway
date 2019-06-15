'use strict'; // Enforce use of strict verion of JavaScript

const fs = require('fs');

/*  @Doc
    This module contains the DB Class and factory function that can be used to
    create database objects to interface with the databases which are essentially
    data stored in JSON files.
    In this case, databases or database objects basically means that they are
    data objects with built in methods to store the data in the object to
    the hard disk and able to read and reconstruct the JS object given the
    unique key identifier which is the database name.

    @Todo
    - Decide on 1 to keep, either the ES6 Class syntax or the factory function
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

const update = (db) => (data) => update_db(db, data);

// Write the DB data held in memory into the "db" DB file
const update_db = (db, data) => {
    // Write to the "DB" json file asynchronously
    fs.writeFile(`./Databases/${db}.json`, JSON.stringify(data), (err) => {
        // Let any errors bubble up
        if (err) throw err;
    });
}

// Class syntax for creating DB objects
class DB_class {
    constructor(database_string) {
        this.database = database_string;

        this.data = this.read_db(database_string);
        this._save = update(this.database);
    }

    read() {
        this.data = read_db(this.database);
    }

    save() {
        this._save(this.data);
    }
}

// Async factory function for creating database objects
async function DB(database_string) {
    this.name = database_string;

    // Method to read data from the database with name in closure
    this.read = () => read_db(this.name);

    // Initialize DB object by reading data in
    this.data = await this.read();

    // Internal save method is a partially applied update function
    this._save = update(this.name);

    // Save method builds on internal _save to save
    this.save = this._save(this.data);
}

// The only thing that is exported is the DB factory function.
// Module users cannot access the other disk read and write functions
module.exports = DB;