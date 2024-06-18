/**
 * A module to use JWT authentication on API endpoints
 * @module controllers/auth
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */

const passport = require('koa-passport');
const jwtAuth = require('../strategies/jwt');

passport.use(jwtAuth);

module.exports = passport.authenticate(['jwt'], {session: false});