/**
 * API module for handling requests to the actors resource
 * @module routes/actors
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/actors')
const auth = require('../controllers/auth');
const can = require('../permissions/actors');
const CustomError = require('../helpers/customError');
const {validateActor} = require('../controllers/validation');


const router = Router({prefix: '/api/v1/actors'});

/** Router to get actor by Id */
router.get('/:id([0-9]{1,})', getById);

/** Router to create an actor */
router.post('/', bodyParser(), validateActor, auth, createActor);

/** Router to edit an actor */
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateActor);

/** Router to delete an actor */
router.del('/:id([0-9]{1,})', auth, deleteActor);

/** Router to get multiple actors by their Ids */
router.get('/:actors', getActors);

/** Router to search for an actor by their last name  */
router.get('/search/:name', findByLastName);

/**
 * Function finds an actor by their last name from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns actors found
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
            throw new CustomError('No actors found', 404);
        }
    } catch (error) {
        console.error('Error during actor fetch by last name:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function finds an actor by their id from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns actors found
 * @throws {CustomError} a custom error dependent on failure
 */
async function getById(ctx) {
    try {
        let id = ctx.params.id;
        let actor = await model.getById(id);
        if (actor.length) {
            ctx.status = 200;
            ctx.body = actor[0];
        } else {
            throw new CustomError('No actor found', 404);
        }
    } catch (error) {
        console.error('Error during actor fetch by id:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function finds multiple actors by their ids (e.g 1,2,3) from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns actors found
 * @throws {CustomError} a custom error dependent on failure
 */

async function getActors(ctx) {
    try {
        let actors = ctx.params.actors;
        let result = await model.getActors(actors);
        if (result.length) {
            ctx.status = 200;
            ctx.body = result;
        } else {
            throw new CustomError('No actors found', 404);
        }
    } catch (error) {
        console.error('Error during multiple actor fetch:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function creates an actor from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message
 * @throws {CustomError} a custom error dependent on failure
 */
async function createActor(ctx) {
    try {
        const permission = can.create(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to create actors', 403);
        } else {
            let actor = ctx.request.body;
            let createActor = await model.createActor(actor);
            if (createActor) {
                ctx.body = {message: "Actor Creation Successful"};
                ctx.status = 200;
            }
        }
    } catch (error) {
        console.error('Error during actor creation:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function updates an actor from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message
 * @throws {CustomError} a custom error dependent on failure
 */
async function updateActor(ctx) {
    try {
        const permission = can.update(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to update actors', 403);
        } else {
            let id = ctx.params.id
            const body = ctx.request.body;
            let result = await model.updateActor(id, body);
            if (result) {
                ctx.status = 200;
                ctx.body = {message: 'Actor Update Successful'}
            }
        }
    } catch (error) {
        console.error('Error during actor update:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function deletes an actor from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message
 * @throws {CustomError} a custom error dependent on failure
 */
async function deleteActor(ctx) {
    try {
        const permission = can.delete(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to delete actors', 403);
        } else {
            let id = ctx.params.id
            let deletion = await model.deleteActor(id);
            if (deletion) {
                ctx.status = 200;
                ctx.body = {message: 'Deleted actor successfully'}
            }
        }
    } catch (error) {
        console.error('Error during actor deletion:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

module.exports = router;
