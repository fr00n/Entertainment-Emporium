/**
 * API module for handling requests to the directors resource
 * @module routes/directors
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/directors');
const auth = require('../controllers/auth');
const can = require('../permissions/directors');
const CustomError = require('../helpers/customError');
const {validateDirector} = require('../controllers/validation');


const router = Router({prefix: '/api/v1/directors'});

/** Router to get director by Id */
router.get('/:id([0-9]{1,})', getById);

/** Router to create director */
router.post('/', bodyParser(), validateDirector, auth, createDirector);

/** Router update director by Id */
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateDirector);

/** Router to delete director by Id */
router.del('/:id([0-9]{1,})', auth, deleteDirector);

/** Router to get multiple directors by Ids */
router.get('/:directors', getDirectors);

/** Router to get director by last name */
router.get('/search/:name', findByLastName);

/**
 * Function finds a director by their id from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns directors found
 * @throws {CustomError} a custom error dependent on failure
 */
async function getById(ctx) {
    try {
        let id = ctx.params.id;
        let director = await model.getById(id);
        if (director.length) {
            ctx.body = director[0];
        } else {
            throw new CustomError('No director found', 404);
        }
    } catch (error) {
        console.error('Error during director fetch by Id: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function finds a director by their last name from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns directors found
 * @throws {CustomError} a custom error dependent on failure
 */
async function findByLastName(ctx) {
    try {
        let name = ctx.params.name;
        let results = await model.findByLastName(name);
        if (results.length !== 0) {
            ctx.status = 200;
            ctx.body = results;
        } else {
            throw new CustomError('No directors found', 404);
        }
    } catch (error) {
        console.error('Error during director fetch by last name: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function finds multiple directors by their ids e.g 1,2,3 from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns directors found
 * @throws {CustomError} a custom error dependent on failure
 */
async function getDirectors(ctx) {
    try {
        let directors = ctx.params.directors;
        let result = await model.getDirectors(directors);
        if (result.length) {
            ctx.body = result;
        } else {
            throw new CustomError('No directors found', 404);
        }
    } catch (error) {
        console.error('Error during multiple director fetch: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function create a director from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns sucess message on creation
 * @throws {CustomError} a custom error dependent on failure
 */
async function createDirector(ctx) {
    try {
        const permission = can.create(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to create directors', 403);
        } else {
            let director = ctx.request.body;
            let createDirector = await model.createDirector(director);
            if (createDirector) {
                ctx.status = 200;
                ctx.body = {message: "Director Creation Successful"}
            }
        }
    } catch (error) {
        console.error('Error during director creation:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function updates a director from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on update
 * @throws {CustomError} a custom error dependent on failure
 */
async function updateDirector(ctx) {
    try {
        const permission = can.update(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to update directors', 403);
        } else {
            let id = ctx.params.id
            const body = ctx.request.body;
            let result = await model.updateDirector(id, body);
            if (result) {
                ctx.status = 200;
                ctx.body = {message: 'Director Update Successful'}
            }
        }
    } catch (error) {
        console.error('Error during director update: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function deletes a director from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns sucess message on deletion
 * @throws {CustomError} a custom error dependent on failure
 */
async function deleteDirector(ctx) {
    try {
        const permission = can.delete(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to delete directors', 403);
        } else {
            let id = ctx.params.id
            let deletion = await model.deleteDirector(id);
            if (deletion) {
                ctx.status = 200;
                ctx.body = {message: 'Deleted Director Successfully'}
            }
        }
    } catch (error) {
        console.error('Error during director deletion: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

module.exports = router;
