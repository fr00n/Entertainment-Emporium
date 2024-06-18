/**
 * A module to run requests to the tvReview table.
 * @module models/tvReviews
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const db = require('../helpers/database');

/**
 * Function that runs SQL request to get tvReview record by Id
 * @param {integer} id - The tvReview id to fetch
 * @returns {object} - returns database response of tvReviews found
 */
exports.getTvReview = async function getTvReview(id) {
    let query = "SELECT * FROM tvReview WHERE id = ?;";
    return await db.run_query(query, parseInt(id));
}

/**
 * Function that runs SQL request to get tvReview record by Id
 * @param {integer} id - The tv id to fetch
 * @param {integer} page - The page number of results to retrieve
 * @param {integer} limit - The amount of reviews to retrieve
 * @param {string} order - The order of how to display the reviews
 * @returns {object} - returns database response of tvReviews found
 */
exports.getByTvId = async function getByTvId(id, page, limit, order) {
    //LIMIT is page size
    //PAGE is page number (OFFSET) -> (page - 1) * LIMIT
    let offset = (page - 1) * limit
    let query = "SELECT * FROM tvReview WHERE tvId = ? ORDER BY ? LIMIT ? OFFSET ?;";
    let values = [parseInt(id), order, parseInt(limit), offset]
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to create a tvReview
 * @param {object} tvReview - The tvReview data to insert
 * @returns {object} - returns database response of tvReviews insertion
 */
exports.createTvReview = async function createTvReview(tvReview) {
    let query = "INSERT INTO tvReview SET ?;";
    return await db.run_query(query, tvReview);
}

/**
 * Function that runs SQL request to update a tvReview
 * @param {object} tvReview - The tvReview data to insert
 * @param {integer} id - The tvReview id to update
 * @returns {object} - returns database response of tvReviews update
 */
exports.updateTvReview = async function updateTvReview(tvReview, id) {
    let query = "UPDATE tvReview SET ? WHERE id =?;";
    const values = [tvReview, parseInt(id)];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to delete a tvReview
 * @param {integer} id - The tvReview id to delete
 * @returns {object} - returns database response of tvReviews deletion
 */
exports.deleteTvReview = async function deleteTvReview(id) {
    let query = "DELETE FROM tvReview WHERE id=?;";
    return await db.run_query(query, id);
}

/**
 * Function that runs SQL request to get a specific review by a specific user
 * @param {string} username - The username of the reviewer
 * @param {integer} tvId - The tv id to find
 * @returns {object} - returns database response of the review found
 */
exports.getTvReviewBySpecificUser = async function getTvReviewBySpecificUser(username, tvId) {
    let query = "SELECT id, userId, score, text FROM tvReview WHERE tvId=? AND username=?;";
    let values = [tvId, username];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get the total reviews for a tv
 * @param {integer} tvId - The tv id to find
 * @returns {object} - returns database response of the count of tvReviews for a tv
 */
exports.getCountForTvReview = async function getCountForTvReview(tvId) {
    let query = "SELECT COUNT(*) AS count FROM tvReview WHERE tvId = ?;";
    return await db.run_query(query, tvId);
}