/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */

const {Validator, ValidationError} = require('jsonschema');
const userSchema = require('../schemas/users.json').definitions.user;
const actorSchema = require('../schemas/actors.json').definitions.actor;
const directorSchema = require('../schemas/directors.json').definitions.director;
const loginSchema = require('../schemas/login.json').definitions.login;
const movieReviewsSchema = require('../schemas/movieReviews.json').definitions.movieReview;
const tvReviewsSchema = require('../schemas/tvReviews.json').definitions.tvReview;
const movieSchema = require('../schemas/movies.json').definitions.movie;
const tvSchema = require('../schemas/tv.json').definitions.tv;


const v = new Validator();

const validationOptions = {
    throwError: true,
    allowUnknownAttributes: false
};

/**
 * Wrapper that returns validation for user request.
 * @param {object} userSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateUser = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, userSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for actor request.
 * @param {object} actorSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateActor = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, actorSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for director request.
 * @param {object} directorSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateDirector = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, directorSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for login request.
 * @param {object} loginSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateLogin = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, loginSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for movie review request.
 * @param {object} movieReviewsSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateMovieReview = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, movieReviewsSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for tv review request.
 * @param {object} tvReviewsSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateTvReview = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, tvReviewsSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for movie request.
 * @param {object} movieSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */

exports.validateMovie = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, movieSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}

/**
 * Wrapper that returns validation for tv request.
 * @param {object} tvSchema - The JSON schema definition of the resource
 * @param {object} body - The body of the request
 * @param {object} validationOptions - The options of validation and how to handle failure
 * @returns {function} - returns validator response
 */


exports.validateTv = async (ctx, next) => {

    const body = ctx.request.body;

    try {
        v.validate(body, tvSchema, validationOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}