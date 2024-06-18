/**
 * A module to define permissions for CRUD actions on actors data 
 * @module permissions/actors
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */

const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('create').on('actor', ['!*']);

ac.grant('verified').execute('create').on('actor', ['!*']);


ac.grant('admin').execute('create').on('actor');
ac.grant('admin').execute('update').on('actor', ['*']);
ac.grant('admin').execute('delete').on('actor');


/**
 * Function that determines requesters rights to update actors resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The actor that the user wants to update 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('update').sync().on('actor');

/**
 * Function that determines requesters rights to delete actors resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The actor that the user wants to delete 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.delete = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('delete').sync().on('actor');

/**
 * Function that determines requesters rights to create actors resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The actor that the user wants to create
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.create = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('create').sync().on('actor');