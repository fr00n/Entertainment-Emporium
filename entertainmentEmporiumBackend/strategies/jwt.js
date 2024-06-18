/**
 * A module to handle JWT authentication 
 * @module strategies/jwt
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const users = require('../models/users');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');

const jwtOptions = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
  };

/**
 * Function checks JWT authentication token and validates it 
 * @param {object} jwtPayload - The JWT payload containing user information 
 * @param {function} done - Handles result return 
 * @returns {function} - returns validated user on success or not validated/error on failure 
 */
const checkJwt = async (jwtPayload, done) => {
    try {
        // find user in database 
        const user = await users.findByUsername(jwtPayload.username);
        const result = user[0];

        // if no user found return no user found 
        if (!result || result.length === 0) {
            console.error(`No user found with username ${jwtPayload.username}`);
            return done(null, false);
        }
        // if user found authenticate user 
        console.log(`Successfully authenticated user ${jwtPayload.username}`); 
        return done(null, result); 
    } catch (error) {
        console.error(`Error during authentication for user ${jwtPayload.username}`);
        return done(error);
    }
}
  
const jwtAuth = new jwtStrategy(jwtOptions, checkJwt);
module.exports = jwtAuth;
