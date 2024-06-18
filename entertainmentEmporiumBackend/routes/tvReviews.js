/**
 * API module for handling requests to the tvReview resource
 * @module routes/tvReviews
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/tvReviews')
const tvModel = require('../models/tv')
const auth = require('../controllers/auth');
const can = require('../permissions/tvReviews');
const CustomError = require('../helpers/customError');
const {validateTvReview} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/tvReviews'});

/** Router to get a tv reviews paginated by tv id  */
router.get('/:id([0-9]{1,})/:page([0-9]{1,})/:limit([0-9]{1,})/:order', getByTvId);

/** Router to create a tv review   */
router.post('/', bodyParser(), validateTvReview, auth, createTvReview)

/** Router to update a tv review   */
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateTvReview)

/** Router to delete a tv review   */
router.del('/:id([0-9]{1,})', auth, deleteTvReview)

/** Router to get a tv review on a specific tv show by specific user  */
router.get('/:username/:tvId([0-9]{1,})', getTvReviewBySpecificUser);


/**
 * Function find a tv review by its id from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns tv review found
 * @throws {CustomError} custom error based on failure
 */
async function getByTvId(ctx) {
    try {
        let id = ctx.params.id;
        let count = await model.getCountForTvReview(ctx.params.id);
        let reviews = await model.getByTvId(id, ctx.params.page, ctx.params.limit, ctx.params.order);
        count = count[0].count;

        for (review in reviews) {
            reviews[review].links = {user: `/account/${reviews[review].userId}`};
        }


        let response = {
            reviews,
            "count": count,
            "page": ctx.params.page,
            "limit": ctx.params.limit
        }
        if (reviews.length) {
            ctx.status = 200;
            ctx.body = response;
        } else {
            throw new CustomError('No reviews made for this tv show', 404);
        }
    } catch (error) {
        console.error('Error during fetch tv reviews by id: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function finds tvReviews by their tv show and from a specific user from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns tvReviews found
 * @throws {CustomError} custom error based on failure
 */
async function getTvReviewBySpecificUser(ctx) {
    try {
        let username = ctx.params.username;
        let tvId = parseInt(ctx.params.tvId);
        let reviews = await model.getTvReviewBySpecificUser(username, tvId);
        for (review in reviews) {
            reviews[review].links = {user: `/account/${reviews[review].userId}`};
        }
        if (reviews.length) {
            ctx.status = 200;
            ctx.body = reviews;
        } else {
            throw new CustomError('User has not made review for this tv show', 404);
        }
    } catch (error) {
        console.error('Error during fetch tv review by a specific user: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function creates tvReview from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on creation
 * @throws {CustomError} custom error based on failure
 */
async function createTvReview(ctx) {
    try {
        const permission = can.create(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to create tv reviews', 403);
        } else {
            let tvReview = ctx.request.body;
            tvReview.userId = ctx.state.user.id
            if (ctx.state.user.role === "verified") {
                tvReview.verified = 1;
            } else {
                tvReview.verified = 0;
            }

            tvReview.username = ctx.state.user.username
            let createTvReview = await model.createTvReview(tvReview);
            if (createTvReview) {
                let updateTvScore = await tvModel.calculateTvScore(tvReview.tvId);
                ctx.body = {message: "Tv Review Creation Successful"}
                ctx.status = 200;
            }
        }
    } catch (error) {
        console.error('Error during create tv review: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function updates tvReview from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on update
 * @throws {CustomError} custom error based on failure
 */
async function updateTvReview(ctx) {
    try {
        //find the Tv review
        let result = await model.getTvReview(ctx.params.id)
        if (result.length !== 0) {
            const permission = can.update(ctx.state.user, result[0])
            if (!permission.granted) {
                throw new CustomError('You are forbidden to update this review', 403);
            } else {
                let tvReview = ctx.request.body;
                let updateTvReview = await model.updateTvReview(tvReview, ctx.params.id)
                if (updateTvReview) {
                    let updateTvScore = await tvModel.calculateTvScore(tvReview.tvId);
                    ctx.body = {message: "Tv Review Updated Successfully"}
                }
            }
        } else {
            throw new CustomError('Tv review not found', 404);
        }
    } catch (error) {
        console.error('Error during update tv review: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function deletes tvReview from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on deletion
 * @throws {CustomError} custom error based on failure
 */
async function deleteTvReview(ctx) {
    try {
        //find the Tv review
        let result = await model.getTvReview(ctx.params.id)
        if (result.length !== 0) {
            const permission = can.delete(ctx.state.user, result[0])
            if (!permission.granted) {
                throw new CustomError('You are forbidden to delete this tv review', 403);
            } else {
                let tvId = result[0].tvId;
                let deleteTvReview = await model.deleteTvReview(ctx.params.id)
                if (deleteTvReview) {
                    let updateTvScore = await tvModel.calculateTvScore(tvId);
                    ctx.status = 200;
                    ctx.body = {message: "Tv Review Deleted Successfully"}
                }
            }
        } else {
            ctx.body = "Tv Review not found"
        }
    } catch (error) {
        console.error('Error during tv review deletion: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

module.exports = router;
