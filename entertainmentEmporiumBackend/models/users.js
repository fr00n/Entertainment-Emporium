/**
 * A module to run requests to the users table.
 * @module models/users
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const db = require('../helpers/database');
const hasher = require('../helpers/hash')


/**
 * Function that runs SQL request to get user record by Id
 * @param {integer} id - The user id to fetch
 * @returns {object} - returns database response of user found
 */
exports.getById = async function getById(id) {
    let query = "SELECT * FROM users WHERE id = ?;";
    let values = [id];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get user record by their username
 * @param {string} username - The username used to find the user
 * @returns {object} - returns database response of user found
 */
exports.findByUsername = async function findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?;";
    return await db.run_query(query, username);
}

/**
 * Function that runs SQL request to create a user
 * @param {object} user - The user data to insert into the database
 * @returns {object} - returns database response of user insertion
 */
exports.createUser = async function createUser(user) {
    user.password = await hasher.hashPassword(user.password);
    const query = "INSERT INTO users SET ?;";
    return await db.run_query(query, user);
}

/**
 * Function that runs SQL request to update a user
 * @param {integer} id - The user id in which to update
 * @param {object} user - The user data to insert into the database
 * @returns {object} - returns database response of user update
 */
exports.updateUser = async function updateUser(id, user) {
    let hashedPW;
    if (user.password) {
        hashedPW = await hasher.hashPassword(user.password)
        user.password = hashedPW
    }
    let query = "UPDATE users SET ? WHERE ID =  ?;";
    const values = [user, id.toString()];
    let data = await db.run_query(query, values);
    return data;
}

/**
 * Function that runs SQL request to delete a user
 * @param {integer} id - The user id in which to delete
 * @returns {object} - returns database response of user deletion
 */
exports.deleteUser = async function deleteUser(id) {
    let query = "DELETE FROM users WHERE ID = ?;";
    return await db.run_query(query, id.toString());
}