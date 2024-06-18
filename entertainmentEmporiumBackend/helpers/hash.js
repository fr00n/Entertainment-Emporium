/**
 * A bcrypt module to handling hashing and comparing passwords.
 * @module helpers/hash
 * @author Francesca Passmore
 * @see models/* for the models that require this module
 */

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Hashes a password using bcrypt with a random salt
 * @param {string} plainTextPassword the plain text password to hash
 * @returns {string} hashed password
 */
exports.hashPassword = async function hashPassword(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
            if (err) {
                console.error("Error while hashing password: ", err)
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

/**
 * Checks entered password to hash saved in database
 * @param {string} plainTextPassword the plain text password
 * @param {string} hash the hashed password saved in db
 * @returns {boolean} returns true if passwords match, false otherwise
 */
exports.checkPassword = async function checkPassword(plainTextPassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, hash, function (err, result) {
            if (err) {
                console.error("Error while checking password: ", err)
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}