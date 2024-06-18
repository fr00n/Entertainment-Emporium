/**
 * A module to define permissions for CRUD actions on movieReview data 
 * @module permissions/movieReviews
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('create').on('movieReview');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update').on('movieReview');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('movieReview');

ac.grant('verified').execute('create').on('movieReview');
ac.grant('verified').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update').on('movieReview');
ac.grant('verified').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('movieReview');

ac.grant('admin').execute('create').on('movieReview');
ac.grant('admin').execute('delete').on('movieReview');
ac.grant('admin').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update').on('movieReview');

/**
 * Function that determines requesters rights to update movieReview resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The movieReview that the user wants to update 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.id, owner:data.userId}).execute('update').sync().on('movieReview');

/**
 * Function that determines requesters rights to delete movieReview resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The movieReview that the user wants to delete 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.delete = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.userId}).execute('delete').sync().on('movieReview');

/**
 * Function that determines requesters rights to create movieReview resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The movieReview that the user wants to create
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.create = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('create').sync().on('movieReview');