/**
 * A module to define permissions for CRUD actions on user data 
 * @module permissions/users
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('user', ['*','!password']);
ac.grant('user').execute('read').on('users', ['*', '!password']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
  .on('user', ['firstName', 'lastName', 'bio', 'password', 'avatarURL']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('user');

ac.grant('verified').execute('read').on('user', ['*','!password']);
ac.grant('verified').execute('read').on('users', ['*', '!password']);
ac.grant('verified').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
  .on('user', ['firstName', 'lastName', 'bio', 'password', 'avatarURL']);
ac.grant('verified').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('user');

ac.grant('admin').execute('read').on('user', ['*','!password']);
ac.grant('admin').execute('read').on('users', ['*','!password']);
ac.grant('admin').execute('update').on('user', ['role', 'firstName', 'lastName', 'bio', 'avatarURL']);
ac.grant('admin').condition({Fn:'NOT_EQUALS', args:
{'requester':'$.owner'}}).execute('delete').on('user');

/**
 * Function that determines requesters rights to read all user resources
 * @param {object} requester - The user making the request 
 * @param {object} data - The user that the user wants to read 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.readAll = (requester) =>
ac.can(requester.role).execute('read').sync().on('users');

/**
 * Function that determines requesters rights to read user resources
 * @param {object} requester - The user making the request 
 * @param {object} data - The user that the user wants to read 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.read = (requester, data) =>
ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('read').sync().on('user');

/**
 * Function that determines requesters rights to update user resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The user that the user wants to update 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('update').sync().on('user');

/**
 * Function that determines requesters rights to delete user resource 
 * @param {object} requester - The user making the request 
 * @param {object} data - The user that the user wants to delete 
 * @returns {object} - returns permission accepted or denied based on role of the user 
 */
exports.delete = (requester, data) =>
  ac.can(requester.role).context({requester:requester.id, owner:data.id}).execute('delete').sync().on('user');

