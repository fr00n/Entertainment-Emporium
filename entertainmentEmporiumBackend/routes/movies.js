/**
 * API module for handling requests to the movie resource
 * @module routes/movies
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/movies')
const auth = require('../controllers/auth');
const can = require('../permissions/movies');
const CustomError = require('../helpers/customError');
const {validateMovie} = require('../controllers/validation');


const router = Router({prefix: '/api/v1/movies'});

/** Router to get a movie by its id  */
router.get('/:id([0-9]{1,})', getById);

/** Router to create a movie */
router.post('/', bodyParser(), validateMovie, auth, createMovie);

/** Router to update a movie */
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateMovie);

/** Router to delete a movie */
router.del('/:id([0-9]{1,})', auth, deleteMovie);

/** Router to get movies with pagination  */
router.get('/:page([0-9]{1,})/:limit([0-9]{1,})/:column/:order', getFilteredMovies);

/** Router to get movies by their titles  */
router.get('/:title', getByTitle);

/**
 * Function find a movie by its id from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns movie found
 * @throws {CustomError} custom error based on failure
 */
async function getById(ctx) {
    try {
        let id = ctx.params.id;
        let movie = await model.getById(id);
        if (movie.length) {
            ctx.body = movie[0];
        } else {
            throw new CustomError('No Movie Found', 404);
        }
    } catch (error) {
        console.error('Error during movie fetch by id:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function find a movie by its title from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns movies found
 * @throws {CustomError} custom error based on failure
 */
async function getByTitle(ctx) {
    try {
        let movies = await model.getByTitle(ctx.params.title);
        if (movies.length) {
            ctx.body = movies;
        } else {
            throw new CustomError('No Movies Found', 404);
        }
    } catch (error) {
        console.error('Error during movie fetch by title:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function finds movies with paginatiom from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns movies found
 * @throws {CustomError} custom error based on failure
 */
async function getFilteredMovies(ctx) {
    try {
        const page = ctx.params.page
        const limit = ctx.params.limit
        const column = ctx.params.column;
        const order = ctx.params.order;
        let movies = await model.getFilteredMovies(page, limit, column, order);
        let count = await model.getCountForMovie();

        count = count[0].count;
        for (movie in movies) {
            movies[movie].links = {self: `/movie/${movies[movie].id}`};
        }

        let response = {
            movies,
            "count": count,
            "page": page,
            "limit": limit
        }
        if (movies.length) {
            ctx.body = response;
            ctx.status = 200;
        } else {
            throw new CustomError('No Movies Found', 404);
        }
    } catch (error) {
        console.error('Error during movie fetch with pagination:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }
}

/**
 * Function creates a movie from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on creation
 * @throws {CustomError} custom error based on failure
 */
async function createMovie(ctx) {
    try {
        const permission = can.create(ctx.state.user, ctx.params);
        if (!permission.granted) {
            throw new CustomError('You are forbidden to create movies', 403);
        } else {
            let movie = ctx.request.body;
            let createMovie = await model.createMovie(movie);
            let link = {self: `/movie/${createMovie.insertId}`}
            if (createMovie) {
                ctx.body = {message: "Movie Creation Successful", links: link};
                ctx.status = 200;
            }
        }
    } catch (error) {
        console.error('Error during movie creation:', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function updates a movie from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on update
 * @throws {CustomError} custom error based on failure
 */
async function updateMovie(ctx) {
    try {
        const permission = can.update(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to update movies', 403);
        } else {
            let id = ctx.params.id
            const body = ctx.request.body;
            let result = await model.updateMovie(id, body);
            if (result) {
                ctx.body = {message: "Movie Update Successful"};
                ctx.status = 200
            }
        }
    } catch (error) {
        console.error('Error during movie update: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}

/**
 * Function deletes a movie from API request
 * @param {object} ctx - Request information sent
 * @returns {object} - returns success message on deletion
 * @throws {CustomError} custom error based on failure
 */
async function deleteMovie(ctx) {
    try {
        const permission = can.delete(ctx.state.user, ctx.params)
        if (!permission.granted) {
            throw new CustomError('You are forbidden to delete movies', 403);
        } else {
            let id = ctx.params.id
            let deletion = await model.deleteMovie(id);
            if (deletion) {
                ctx.status = 200;
                ctx.body = {message: 'Movie Deleted Successfully'};
            }
        }
    } catch (error) {
        console.error('Error during movie deletion: ', error);
        ctx.body = {error: error.message}
        ctx.status = error.statusCode;
    }

}


module.exports = router;

