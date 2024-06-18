/**
 * A module to define permissions for CRUD actions on directors data 
 * @module permissions/directors
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('create').on('director', ['!*']);

ac.grant('verified').execute('create').on('director', ['!*']);


ac.grant('admin').execute('create').on('director');
ac.grant('admin').execute('update').on('director', ['*']);
ac.grant('admin').execute('delete').on('director');


/**
 * Function that determines requesters rights to update directors resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The director that the user wants to update 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('update').sync().on('director');

/**
 * Function that determines requesters rights to delete directors resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The director that the user wants to delete 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.delete = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('delete').sync().on('director');

/**
 * Function that determines requesters rights to create directors resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The director that the user wants to create
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.create = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('create').sync().on('director');