/**
 * A module to calculate the percentage of the reviews given.
 * @module helpers/calculator
 * @author Francesca Passmore
 * @see models/* for the models that require this module
 */

/**
 * Takes the server reponse, add all scores together, divide by the maximum score possible and multiply by one hundered
 * @param {object} serverResponse all the reviews for a piece of media
 * @returns {integer} percentage results for the piece of media
 */
exports.calculate = async function calculate(serverResponse) {
    const string = JSON.stringify(serverResponse);
    const json = JSON.parse(string);
    let score = 0;
    let maxScore = 5 * json.length

    for (let pos = 0; pos < json.length; pos++) {
        score = score + json[pos].score
    }

    return (score / maxScore) * 100;

}