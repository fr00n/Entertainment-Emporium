/**
 * API module for handling requests to the tv resource
 * @module routes/tv
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/tv')
const auth = require('../controllers/auth');
const can = require('../permissions/tv');
const CustomError = require('../helpers/customError');
const {validateTv} = require('../controllers/validation');


const router = Router({prefix: '/api/v1/tv'});

/** Router to get a tv show by its id  */
router.get('/:id([0-9]{1,})', getById);

/** Router to create a tv show  */
router.post('/', bodyParser(), validateTv, auth, createTv);

/** Router to update a tv show  */
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateTv);

//** Router to delete a tv show  */
router.del('/:id([0-9]{1,})', auth, deleteTv);

/** Router to get tv shows with pagination   */
router.get('/:page([0-9]{1,})/:limit([0-9]{1,})/:column/:order', getFilteredTv)

/** Router to get tv shows by title    */
router.get('/:title', getByTitle);

/**
 * Function find a tv show by its id from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns tv show found
 * @throws {CustomError} custom error based on failure
 */
async function getById(ctx) {
    try {
        let id = ctx.params.id;
        let tv = await model.getById(id);
        if (tv.length) {
            ctx.body = tv[0];
        } else {
            throw new CustomError('No Tv Show Found', 404);
        }
    } catch (error) {
        console.error('Error during tv fetch by id: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function find a tv show by its title from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns tv shows found
 * @throws {CustomError} custom error based on failure
 */
async function getByTitle(ctx) {
    try {
        let tv = await model.getByTitle(ctx.params.title);
        if (tv.length) {
            ctx.body = tv;
        } else {
            throw new CustomError('No Tv Shows Found', 404);
        }
    } catch (error) {
        console.error('Error during tv fetch by title: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function finds tv shows with paginatiom from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns tv shows found
 * @throws {CustomError} custom error based on failure
 */
async function getFilteredTv(ctx) {
    try {
        const page = ctx.params.page;
        const limit = ctx.params.limit;
        const order = ctx.params.order;
        const column = ctx.params.column;
        let tv = await model.getFilteredTv(page, limit, column, order);
        let count = await model.getCountForTv();


        count = count[0].count;

        for (show in tv) {
            tv[show].links = {self: `/tv/${tv[show].id}`};
        }

        let response = {
            tv,
            "count": count,
            "page": page,
            "limit": limit
        }

        if (tv.length) {
            ctx.body = response;
            ctx.status = 200;
        } else {
            throw new CustomError('No Tv Shows Found', 404);
        }
    } catch (error) {
        console.error('Error during tv fetch by pagination: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function creates a tv show from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on creation
 * @throws {CustomError} custom error based on failure
 */
async function createTv(ctx) {
    try {
        const permission = can.create(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to create tv shows', 403);
        } else {
            let tv = ctx.request.body;
            let createTv = await model.createTv(tv);
            let link = {self: `/tv/${createTv.insertId}`}
            if (createTv) {
                ctx.body = {message: "Tv Creation Successful", links: link}
                ctx.status = 200
            }
        }
    } catch (error) {
        console.error('Error during tv creation: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function updates a tv show from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on update
 * @throws {CustomError} custom error based on failure
 */
async function updateTv(ctx) {
    try {
        const permission = can.update(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to update tv shows', 403);
        } else {
            let id = ctx.params.id
            const body = ctx.request.body;
            let result = await model.updateTv(id, body);
            if (result) {
                ctx.body = {message: "Tv Show Update Successful"}
                ctx.status = 200
            }
        }
    } catch (error) {
        console.error('Error during tv update: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function deletes a tv show from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on deletion
 * @throws {CustomError} custom error based on failure
 */
async function deleteTv(ctx) {
    try {
        const permission = can.delete(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to delete tv shows', 403);
        } else {
            let id = ctx.params.id
            let deletion = await model.deleteTv(id);
            if (deletion) {
                ctx.status = 200;
                ctx.body = {message: 'Tv Show Deleted Successfully'}
            }
        }
    } catch (error) {
        console.error('Error during tv deletion: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

module.exports = router;

