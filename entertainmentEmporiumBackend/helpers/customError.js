/**
 * A class to handle custom errors.
 * @module helpers/customError
 * @author Francesca Passmore
 * @see models/* for the models that require this module
 */

/**
 * Takes message and status code and generates a class instance of custom error
 * @param {string} message the error message
 * @param {integer} statusCode the error status code
 * @returns {object} custom error of data provided
 */
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = parseInt(statusCode);
    }
}

module.exports = CustomError;
