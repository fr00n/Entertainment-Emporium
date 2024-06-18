/**
 * A module to run requests to the actors table.
 * @module models/actors
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */

const db = require('../helpers/database');


/**
 * Function that runs SQL request to get actor record by Id
 * @param {integer} id - The actor id to fetch
 * @returns {object} - returns database response of actors found
 */

exports.getById = async function getById(id) {
    let query = "SELECT * FROM actors WHERE id = ?;";
    let values = [id];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get actor record by last name
 * @param {string} name - The actor's record last name to fetch
 * @returns {object} - returns database response of actors found
 */
exports.findByLastName = async function findByLastName(name) {
    name = '%' + name + '%';
    let query = "SELECT * FROM actors WHERE lastName LIKE ?;";
    return await db.run_query(query, name);
}

/**
 * Function that runs SQL request to create an actor record
 * @param {object} actor - The actor data to insert into the database
 * @returns {object} - returns database response of actor insertion
 */
exports.createActor = async function createActor(actor) {
    const query = "INSERT INTO actors SET ?;";
    return await db.run_query(query, actor);
}

/**
 * Function that runs SQL request to update an actor record
 * @param {object} actor - The actor data to insert into the database
 * @returns {object} - returns database response of actor update
 */
exports.updateActor = async function updateActor(id, actor) {
    let query = "UPDATE actors SET ? WHERE id =?;";
    const values = [actor, id.toString()];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to delete an actor record
 * @param {integer} id - The actor id to delete
 * @returns {object} - returns database response of actor deletion
 */
exports.deleteActor = async function deleteActor(id) {
    let query = "DELETE FROM actors WHERE id=?;";
    return await db.run_query(query, id);
}

/**
 * Function that runs SQL request to get multiple actor records
 * @param {string} actors - The actor ids to search e.g 1,2,3
 * @returns {object} - returns database response of actor search
 */
exports.getActors = async function getActors(actors) {
    actors = "(" + actors + ");"
    let query = "SELECT * FROM actors WHERE id IN " + actors;
    return await db.run_query(query);
}