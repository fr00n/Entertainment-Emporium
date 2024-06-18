/**
 * API module for handling requests to the movieReview resource
 * @module routes/movieReviews
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/movieReviews')
const movieModel = require('../models/movies')
const auth = require('../controllers/auth');
const can = require('../permissions/movieReviews')
const CustomError = require('../helpers/customError');
const {validateMovieReview} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/movieReviews'});

/** Router to get movieReview by movie id  */
router.get('/:id([0-9]{1,})/:page([0-9]{1,})/:limit([0-9]{1,})/:order', getByMovieId);

/** Router to create a movieReview  */
router.post('/', bodyParser(), auth, validateMovieReview, createMovieReview)

/** Router to update a movieReview  */
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateMovieReview)

/** Router to delete a movieReview  */
router.del('/:id([0-9]{1,})', auth, deleteMovieReview)

/** Router to get a movieReview by the username of who made the review and the movie id of the review */
router.get('/:username/:movieId([0-9]{1,})', getMovieReviewBySpecificUser);

/**
 * Function finds movieReviews by their movie from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns movieReviews found
 * @throws {CustomError} custom error based on failure
 */
async function getByMovieId(ctx) {
    try {
        let id = parseInt(ctx.params.id);
        let count = await model.getCountForMovieReview(id);

        let reviews = await model.getByMovieId(id, ctx.params.page, ctx.params.limit, ctx.params.order);

        for (review in reviews) {
            reviews[review].links = {user: `/account/${reviews[review].userId}`};
        }


        count = count[0].count;

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
            throw new CustomError('No reviews made for this movie', 404);
        }
    } catch (error) {
        console.error('Error during fetch movieReviews by Movie ID: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function finds movieReviews by their movie and from a specific user from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns movieReviews found
 * @throws {CustomError} custom error based on failure
 */
async function getMovieReviewBySpecificUser(ctx) {
    try {
        let username = ctx.params.username;
        let movieId = parseInt(ctx.params.movieId);
        let reviews = await model.getMovieReviewBySpecificUser(username, movieId);
        for (review in reviews) {
            reviews[review].links = {user: `/account/${reviews[review].userId}`};
        }
        ;
        if (reviews.length) {
            ctx.status = 200;
            ctx.body = reviews;
        } else {
            throw new CustomError('User has not made review for this movie', 404);
        }
    } catch (error) {
        console.error('Error during fetch movieReview by specific User and Movie: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function creates movieReview from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on creation
 * @throws {CustomError} custom error based on failure
 */
async function createMovieReview(ctx) {
    try {
        const permission = can.create(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to create movie reviews', 403);
        } else {
            let movieReview = ctx.request.body;
            movieReview.userId = ctx.state.user.id;
            movieReview.username = ctx.state.user.username;
            if (ctx.state.user.role === "verified") {
                movieReview.verified = 1;
            } else {
                movieReview.verified = 0;
            }
            let createMovieReview = await model.createMovieReview(movieReview);
            if (createMovieReview) {
                let updateMovieScore = await movieModel.calculateMovieScore(movieReview.movieId)
                ctx.body = {message: "Movie Review Creation Successful"}
            }
        }
    } catch (error) {
        console.error('Error during movieReview creation: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function updates movieReview from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on update
 * @throws {CustomError} custom error based on failure
 */
async function updateMovieReview(ctx) {
    try {
        //find the movie review
        let result = await model.getMovieReview(ctx.params.id)
        if (result.length !== 0) {
            const permission = can.update(ctx.state.user, result[0])
            if (!permission.granted) {
                throw new CustomError('You are forbidden to update this review', 403);
            } else {
                let movieReview = ctx.request.body;
                let updateMovieReview = await model.updateMovieReview(movieReview, ctx.params.id)
                let updateMovieScore = await movieModel.calculateMovieScore(movieReview.movieId)
                if (updateMovieReview) {
                    ctx.body = {message: "Movie Review Updated Successfully"}
                }
            }
        } else {
            throw new CustomError('Movie review was not found', 404);
        }
    } catch (error) {
        console.error('Error during update of movieReview: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function deletes movieReview from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on deletion
 * @throws {CustomError} custom error based on failure
 */
async function deleteMovieReview(ctx) {
    try {
        //find the movie review
        let result = await model.getMovieReview(ctx.params.id)
        if (result.length !== 0) {
            let userId = result[0].userId;
            const permission = can.delete(ctx.state.user, result[0])
            if (!permission.granted) {
                throw new CustomError('You are forbidden to delete this review', 403);
            } else {
                let movieId = result[0].movieId
                let deleteMovieReview = await model.deleteMovieReview(ctx.params.id)
                let updateMovieScore = await movieModel.calculateMovieScore(movieId)
                if (deleteMovieReview) {
                    ctx.body = {message: "Movie Review Deleted Successfully"}
                }
            }
        } else {
            throw new CustomError('Movie review was not found', 404);
        }
    } catch (error) {
        console.error('Error during movieReview deletion: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

module.exports = router;
