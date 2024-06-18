/**
 * A module to run requests to the directors table.
 * @module models/directors
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const db = require('../helpers/database');

/**
 * Function that runs SQL request to get director record by Id
 * @param {integer} id - The director id to fetch
 * @returns {object} - returns database response of directors found
 */
exports.getById = async function getById(id) {
    let query = "SELECT * FROM directors WHERE id = ?;";
    let values = [id];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get multiple director records
 * @param {string} directors - The director ids to search e.g 1,2,3
 * @returns {object} - returns database response of director search
 */
exports.getDirectors = async function getDirectors(directors) {
    directors = "(" + directors + ");";
    let query = "SELECT * FROM directors WHERE id IN " + directors;
    return await db.run_query(query);
}

/**
 * Function that runs SQL request to create an director record
 * @param {object} director - The director data to insert into the database
 * @returns {object} - returns database response of director insertion
 */
exports.createDirector = async function createDirector(director) {
    const query = "INSERT INTO directors SET ?;";
    return await db.run_query(query, director);
}

/**
 * Function that runs SQL request to update an director record
 * @param {object} director - The director data to insert into the database
 * @returns {object} - returns database response of director update
 */
exports.updateDirector = async function updateDirector(id, director) {
    let query = "UPDATE directors SET ? WHERE id =?;";
    const values = [director, id.toString()];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to delete an director record
 * @param {integer} id - The director id to delete
 * @returns {object} - returns database response of director deletetion
 */
exports.deleteDirector = async function deleteDirector(id) {
    let query = "DELETE FROM directors WHERE id=?;";
    return await db.run_query(query, id);
}

/**
 * Function that runs SQL request to get director record by last name
 * @param {string} name - The director's record last name to fetch
 * @returns {object} - returns database response of directors found
 */
exports.findByLastName = async function findByLastName(name) {
    name = '%' + name + '%';
    let query = "SELECT * FROM directors WHERE lastName LIKE ?;";
    return await db.run_query(query, name);
}
