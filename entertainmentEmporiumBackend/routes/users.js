/**
 * API module for handling requests to the user resource
 * @module routes/users
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users')
const auth = require('../controllers/auth');
const {validateUser} = require('../controllers/validation');
const can = require('../permissions/users');
const CustomError = require('../helpers/customError');


const router = Router({prefix: '/api/v1/users'});

/** Router to get user by their id  */
router.get('/:id([0-9]{1,})', auth, getById);

/** Router to create a user  */
router.post('/', bodyParser(), validateUser, createUser);

/** Router to update a user  */
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateUser);

/** Router to delete a user  */
router.del('/:id([0-9]{1,})', auth, deleteUser);

/** Router to get user by their username  */
router.get('/:username', auth, getByUsername);

/**
 * Function find a user by their id from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns user found
 * @throws {CustomError} custom error based on failure
 */
async function getById(ctx) {
    try {
        ctx.params.id = parseInt(ctx.params.id);
        const permission = can.read(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to view this resource', 403);
        } else {
            let id = ctx.params.id;
            let user = await model.getById(id);
            if (user.length) {
                ctx.body = permission.filter(user[0]);
                ctx.status = 200;
            } else {
                throw new CustomError('No user found', 404);
            }
        }
    } catch (error) {
        console.error('Error during user fetch by id: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function find a user by their username from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns user found
 * @throws {CustomError} custom error based on failure
 */
async function getByUsername(ctx) {
    try {
        username = ctx.params.username;
        let user = await model.findByUsername(username);
        if (!user.length) {
            throw new CustomError('No user found', 404);
        }

        const permission = can.read(ctx.state.user, user[0]);
        if (!permission.granted) {
            throw new CustomError('You are forbidden to view this resource', 403);
        } else {
            ctx.body = permission.filter(user[0])
            ctx.status = 200;
        }
    } catch (error) {
        console.error('Error during user fetch by username: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function creates a user from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on creation
 * @throws {CustomError} custom error based on failure
 */
async function createUser(ctx) {
    try {
        let user = ctx.request.body;
        let userExist = await model.findByUsername(user.username);
        if (userExist.length) {
            throw new CustomError('Username is already taken', 400)
        }

        let createUser = await model.createUser(user);
        if (createUser) {

            ctx.status = 200;
            ctx.body = {message: "Account Creation Successful"};
        }
    } catch (error) {
        console.error('Error during user creation: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;

    }
}

/**
 * Function updates a user from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on update
 * @throws {CustomError} custom error based on failure
 */
async function updateUser(ctx) {
    try {
        ctx.params.id = parseInt(ctx.params.id);
        const permission = can.update(ctx.state.user, ctx.params);
        if (!permission.granted) {
            throw new CustomError('You are forbidden to update this resource', 403);
        } else {
            let id = ctx.params.id
            const body = ctx.request.body;
            let result = await model.updateUser(id, body);
            if (result) {
                ctx.status = 200;
                ctx.body = {message: "Account Update Successful"};
            }
        }
    } catch (error) {
        console.error('Error during user update: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;

    }
}

/**
 * Function deletes a user from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on deletion
 * @throws {CustomError} custom error based on failure
 */
async function deleteUser(ctx) {
    try {
        ctx.params.id = parseInt(ctx.params.id);
        const permission = can.delete(ctx.state.user, ctx.params);
        if (!permission.granted) {
            throw new CustomError('You are forbidden to delete this user', 403);
        } else {
            let result = await model.deleteUser(ctx.params.id);
            if (result) {
                ctx.status = 200;
                ctx.body = {message: 'User deleted'}
            }
        }
    } catch (error) {
        console.error('Error during user deletion: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

module.exports = router;
