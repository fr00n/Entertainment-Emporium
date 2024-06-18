/**
 * A module to run requests to the movies table.
 * @module models/movies
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const db = require('../helpers/database');
const calc = require('../helpers/calculator')

/**
 * Function that runs SQL request to get movie record by Id
 * @param {integer} id - The movie id to fetch
 * @returns {object} - returns database response of movie found
 */
exports.getById = async function getById(id) {
    let query = "SELECT * FROM movies WHERE ID = ?;";
    let values = [id];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to create a movie
 * @param {object} movie - The movie to insert into the database
 * @returns {object} - returns database response of movie creation
 */
exports.createMovie = async function createMovie(movie) {
    const query = "INSERT INTO movies SET ?;";
    return await db.run_query(query, movie);
}

/**
 * Function that runs SQL request to update a movie
 * @param {integer} id - The movie id to update
 * @param {object} movie - The movie data to update with
 * @returns {object} - returns database response of movie update
 */
exports.updateMovie = async function updateMovie(id, movie) {
    let query = "UPDATE movies SET ? WHERE id =?;";
    const values = [movie, id.toString()];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to delete a movie
 * @param {integer} id - The movie id to delete
 * @returns {object} - returns database response of movie deletion
 */
exports.deleteMovie = async function deleteMovie(id) {
    let query = "DELETE FROM movies WHERE id=?;";
    return await db.run_query(query, id);
}

/**
 * Function that runs SQL request to get multiple movies with pagination
 * @param {integer} page - The page number of results to retrieve
 * @param {integer} limit - The amount of movies to retrieve
 * @param {string} column - The column of which to order movies by
 * @param {string} order - The order of how to display the movies
 * @returns {object} - returns database response of movies found
 */
exports.getFilteredMovies = async function getFilteredMovies(page, limit, column, order) {
    //LIMIT is page size
    //PAGE is page number (OFFSET) -> (page - 1) * LIMIT
    let offset = (page - 1) * limit
    let query = "SELECT * FROM movies ORDER BY " + column + " " + order + " LIMIT ? OFFSET ?;";

    let values = [parseInt(limit), offset];
    return await db.run_query(query, values);
}

/**
 * Function that runs SQL request to get a movie by it's title
 * @param {string} title - The movie title to search by
 * @returns {object} - returns database response of movies found by title
 */
exports.getByTitle = async function getByTitle(title) {
    title = '%' + title + '%';
    let query = "SELECT * FROM movies WHERE title LIKE ?;";
    return await db.run_query(query, title);
}

/**
 * Function that runs SQL request to get the total movies stored
 * @returns {object} - returns database response of the count of movies
 */
exports.getCountForMovie = async function getCountForMovie() {
    let query = "SELECT COUNT(*) AS count FROM movies;";
    return await db.run_query(query, null);
}

/**
 * Function that updates the percentage scores for movies when a review is made/altered/deleted
 * @param {integer} id - The movie id to update the score for
 * @returns {object} - returns database response if score is updated succesfully or not
 */
exports.calculateMovieScore = async function calculateMovieScore(id) {

    // normal reviewers
    let audienceQuery = "SELECT score FROM movieReview WHERE movieId = ? AND verified = 0;";
    const audienceResponse = await db.run_query(audienceQuery, id);

    if (audienceResponse.length !== 0) {
        // reviews exist, need to calculate the score
        const audiencePercentage = await calc.calculate(audienceResponse)
        let updateAudienceQuery = "UPDATE movies SET audiencePercentage = ? WHERE id = ?;";
        let updateAudienceValues = [audiencePercentage, id]
        const updateAudience = await db.run_query(updateAudienceQuery, updateAudienceValues);

    } else {
        // no reviews, set null value in database
        let noAudience = "UPDATE movies SET audiencePercentage = NULL WHERE id = ?;";
        const noAudienceResponse = await db.run_query(noAudience, id);
    }

    // verified reviewers
    let verifiedQuery = "SELECT score FROM movieReview WHERE movieId = ? AND verified = 1;";
    const verifiedResponse = await db.run_query(verifiedQuery, id);
    if (verifiedResponse.length !== 0) {
        // reviews exist, need to calculate the score
        const verifiedPercentage = await calc.calculate(verifiedResponse)
        let updateVerifiedQuery = "UPDATE movies SET verifiedPercentage = ? WHERE id = ?;";
        let updateVerifiedValues = [verifiedPercentage, id]
        const updateVerified = await db.run_query(updateVerifiedQuery, updateVerifiedValues);
    } else {
        // no reviews, set null value in database
        let noVerified = "UPDATE movies SET verifiedPercentage = NULL WHERE id = ?;";
        const noVerifiedResponse = await db.run_query(noVerified, id);
    }
}
