/**
 * A module to define permissions for CRUD actions on tvReview data 
 * @module permissions/tvReviews
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('create').on('tvReview');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update').on('tvReview');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('tvReview');

ac.grant('verified').execute('create').on('tvReview');
ac.grant('verified').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update').on('tvReview');
ac.grant('verified').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('tvReview');

ac.grant('admin').execute('create').on('tvReview');
ac.grant('admin').execute('delete').on('tvReview');
ac.grant('admin').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update').on('tvReview');

/**
 * Function that determines requesters rights to update tvReview resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The tvReview that the user wants to update 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.id, owner:data.userId}).execute('update').sync().on('tvReview');

/**
 * Function that determines requesters rights to delete tvReview resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The tvReview that the user wants to delete 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.delete = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.userId}).execute('delete').sync().on('tvReview');

/**
 * Function that determines requesters rights to create tvReview resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The tvReview that the user wants to create
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.create = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('create').sync().on('tvReview');