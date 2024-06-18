/**
 * A module to run requests to the tv table.
 * @module models/tv
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */

const db = require('../helpers/database');
const calc = require('../helpers/calculator')

/**
 * Function that runs SQL request to get tv record by Id
 * @param {integer} id - The tv id to fetch
 * @returns {object} - returns database response of tv found
 */
exports.getById = async function getById(id) {
    let query = "SELECT * FROM tv WHERE ID = ?;";
    let values = [id];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to create a tv record
 * @param {object} tv - The tv data to insert into the database
 * @returns {object} - returns database response of tv creation
 */
exports.createTv = async function createTv(tv) {
    const query = "INSERT INTO tv SET ?;";
    return await db.run_query(query, tv);
}

/**
 * Function that runs SQL request to update a tv record
 * @param {integer} id - The tv id to update
 * @param {object} tv - The tv data to update with
 * @returns {object} - returns database response of tv update
 */
exports.updateTv = async function updateTv(id, tv) {
    let query = "UPDATE tv SET ? WHERE id =?;";
    const values = [tv, id.toString()];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get multiple tv shows with pagination
 * @param {integer} page - The page number of results to retrieve
 * @param {integer} limit - The amount of tv shows to retrieve
 * @param {string} column - The column of which to order tv shows by
 * @param {string} order - The order of how to display the tv shows
 * @returns {object} - returns database response of tv shows found
 */
exports.getFilteredTv = async function getFilteredtvs(page, limit, column, order) {
    //LIMIT is page size
    //PAGE is page number (OFFSET) -> (page - 1) * LIMIT
    let offset = (page - 1) * limit
    let query = "SELECT * FROM tv ORDER BY " + column + " " + order + " LIMIT ? OFFSET ?;";
    let values = [parseInt(limit), offset]
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get a tv record by it's title
 * @param {string} title - The tv title to search by
 * @returns {object} - returns database response of tv records found by title
 */
exports.getByTitle = async function getByTitle(title) {
    title = '%' + title + '%';
    let query = "SELECT * FROM tv WHERE title LIKE ?;";
    return await db.run_query(query, title);
}


/**
 * Function that runs SQL request to delete a tv record
 * @param {integer} id - The tv id to delete
 * @returns {object} - returns database response of tv deletion
 */
exports.deleteTv = async function deleteTv(id) {
    let query = "DELETE FROM tv WHERE id=?;";
    return await db.run_query(query, id);
}

/**
 * Function that runs SQL request to get the total tv shows stored
 * @returns {object} - returns database response of the count of tv shows
 */
exports.getCountForTv = async function getCountForTv() {
    let query = "SELECT COUNT(*) AS count FROM tv;";
    return await db.run_query(query, null);
}

/**
 * Function that updates the percentage scores for tv show when a review is made/altered/deleted
 * @param {integer} id - The tv id to update the score for
 * @returns {object} - returns database response if score is updated succesfully or not
 */
exports.calculateTvScore = async function calculateTvScore(id) {

    // normal reviewers
    let audienceQuery = "SELECT score FROM tvReview WHERE tvId = ? AND verified = 0;";
    const audienceResponse = await db.run_query(audienceQuery, id);

    if (audienceResponse.length !== 0) {
        // reviews exist, need to calculate the score
        const audiencePercentage = await calc.calculate(audienceResponse)
        let updateAudienceQuery = "UPDATE tv SET audiencePercentage = ? WHERE id = ?;";
        let updateAudienceValues = [audiencePercentage, id]
        const updateAudience = await db.run_query(updateAudienceQuery, updateAudienceValues);

    } else {
        // no reviews, set null vallue in database
        let noAudience = "UPDATE tv SET audiencePercentage = NULL WHERE id = ?;";
        const noAudienceResponse = await db.run_query(noAudience, id);
    }

    // verified reviewers
    let verifiedQuery = "SELECT score FROM tvReview WHERE tvId = ? AND verified = 1;";
    const verifiedResponse = await db.run_query(verifiedQuery, id);
    if (verifiedResponse.length !== 0) {
        // reviews exist, need to calculate the score
        const verifiedPercentage = await calc.calculate(verifiedResponse)
        let updateVerifiedQuery = "UPDATE tv SET verifiedPercentage = ? WHERE id = ?;";
        let updateVerifiedValues = [verifiedPercentage, id]
        const updateVerified = await db.run_query(updateVerifiedQuery, updateVerifiedValues);
    } else {
        // no reviews, set null vallue in database
        let noVerified = "UPDATE tv SET verifiedPercentage = NULL WHERE id = ?;";
        const noVerifiedResponse = await db.run_query(noVerified, id);
    }
}