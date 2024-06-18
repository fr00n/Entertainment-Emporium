/**
 * API module for handling login request
 * @module routes/login
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const hasher = require('../helpers/hash');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const auth = require('../controllers/auth');
const model = require('../models/users');
const config = require('../config');
const CustomError = require('../helpers/customError');
const {validateLogin} = require('../controllers/validation');


const router = Router({prefix: '/api/v1/login'});

/** Router to login a user  */
router.post('/', bodyParser(), validateLogin, login)

/**
 * Function to verify a users password
 * @param {object} user - The user attempting to log in
 * @param {string} password - The password entered
 * @returns {object} - returns the result if the passwords match or not
 */
const verifyPassword = function (user, password) {
    // compare user.password with the password supplied
    try {
        return hasher.checkPassword(password, user.password);
    } catch (error) {
        console.error("Error during verifying password: ", error);
    }
}

/**
 * Function to authenticate a user
 * @param {object} ctx - Request information sent
 * @returns {object} - returns id, username, role, token and links of user authenticated
 * @throws {CustomError} custom error based on failure
 */
async function login(ctx) {


    let attemptedLogin = ctx.request.body;


    try {
        // Find user by username
        const result = await model.findByUsername(attemptedLogin.username);


        // Check if user exists and password is correct

        if (!result.length) {
            throw new CustomError('Account with this username does not exist', 404);
        }


        const user = result[0];

        if (!(await verifyPassword(user, attemptedLogin.password))) {
            throw new CustomError('Wrong password entered', 403);
        }


        const {id, username, role} = user;

        const userPayload = {
            id,
            username,
            role
        };

        const token = jwt.sign(userPayload, config.jwtSecret, {expiresIn: '2h'});

        const links = {
            self: `/account`
        };
        ctx.body = {id, username, role, token, links};
        ctx.status = 200;

    } catch (error) {
        console.error('Error during login: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}


module.exports = router;