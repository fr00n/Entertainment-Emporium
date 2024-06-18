/**
 * A module to run requests to the movieReview table.
 * @module models/movieReviews
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const db = require('../helpers/database');

/**
 * Function that runs SQL request to get movieReview record by Id
 * @param {integer} id - The movieReview id to fetch
 * @returns {object} - returns database response of movieReviews found
 */
exports.getMovieReview = async function getMovieReview(id) {
    let query = "SELECT * FROM movieReview WHERE id = ?;";
    return await db.run_query(query, parseInt(id));
}


/**
 * Function that runs SQL request to get movieReview record by Id
 * @param {integer} id - The movie id to fetch
 * @param {integer} page - The page number of results to retrieve
 * @param {integer} limit - The amount of reviews to retrieve
 * @param {string} order - The order of how to display the reviews
 * @returns {object} - returns database response of movieReviews found
 */
exports.getByMovieId = async function getByMovieId(id, page, limit, order) {
    //LIMIT is page size
    //PAGE is page number (OFFSET) -> (page - 1) * LIMIT
    let offset = (page - 1) * limit
    let query = "SELECT * FROM movieReview WHERE movieId = ? ORDER BY ? LIMIT ? OFFSET ?;";
    let values = [id, order, parseInt(limit), offset]
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to create a movieReview
 * @param {object} movieReview - The movieReview data to insert
 * @returns {object} - returns database response of movieReviews insertion
 */
exports.createMovieReview = async function createMovieReview(movieReview) {
    let query = "INSERT INTO movieReview SET ?;";
    return await db.run_query(query, movieReview);
}

/**
 * Function that runs SQL request to update a movieReview
 * @param {object} movieReview - The movieReview data to insert
 * @param {integer} id - The movieReview id to update
 * @returns {object} - returns database response of movieReviews update
 */
exports.updateMovieReview = async function updateMovieReview(movieReview, id) {
    let query = "UPDATE movieReview SET ? WHERE id =?;";
    const values = [movieReview, parseInt(id)];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to delete a movieReview
 * @param {integer} id - The movieReview id to delete
 * @returns {object} - returns database response of movieReviews deletion
 */
exports.deleteMovieReview = async function deleteMovieReview(id) {
    let query = "DELETE FROM movieReview WHERE id=?;";
    return await db.run_query(query, id);
}

/**
 * Function that runs SQL request to get a specific review by a specific user
 * @param {string} username - The username of the reviewer
 * @param {integer} movieId - The movie id to find
 * @returns {object} - returns database response of the review found
 */
exports.getMovieReviewBySpecificUser = async function getMovieReviewBySpecificUser(username, movieId) {
    let query = "SELECT id, userId, score, text FROM movieReview WHERE movieId=? AND username=?;";
    let values = [movieId, username];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get the total reviews for a movie
 * @param {integer} movieId - The movie id to find
 * @returns {object} - returns database response of the count of movieReviews for a movie
 */
exports.getCountForMovieReview = async function getCountForMovieReview(movieId) {
    let query = "SELECT COUNT(*) AS count FROM movieReview WHERE movieId = ?;";
    return await db.run_query(query, movieId);
}