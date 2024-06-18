/**
 * A module to run the main API for Entertainment Emporium
 * @module index
 * @author Francesca Passmore
 * @see schemas/* for JSON Schema definition files
 */
const Koa = require('koa');
const passport = require('koa-passport');
const cors = require('@koa/cors');
const app = new Koa();

/** Allow all listed methods on API requests */
var options = {
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH']
}

/** Enable cors in order to handle API request */
app.use(cors(options));

/** Initialises authentication for API */
app.use(passport.initialize());

/** Declare route for movies endpoint */
const movies = require('./routes/movies.js');

/** Declare route for tv endpoint */
const tv = require('./routes/tv.js');

/** Declare route for directors endpoint */
const directors = require('./routes/directors.js');

/** Declare route for actors endpoint */
const actors = require('./routes/actors.js');

/** Declare route for tvReviews endpoint */
const tvReviews = require('./routes/tvReviews.js');

/** Declare route for movieReviews endpoint */
const movieReviews = require('./routes/movieReviews.js');

/** Declare route for users endpoint */
const users = require('./routes/users.js');

/** Declare route for login endpoint */
const login = require('./routes/login.js');

/** Initialise route for movies endpoint */
app.use(movies.routes());

/** Initialise route for tv endpoint */
app.use(tv.routes());

/** Initialise route for directors endpoint */
app.use(directors.routes());

/** Initialise route for actors endpoint */
app.use(actors.routes());

/** Initialise route for tvReviews endpoint */
app.use(tvReviews.routes());

/** Initialise route for movieReviews endpoint */
app.use(movieReviews.routes());

/** Initialise route for users endpoint */
app.use(users.routes());

/** Initialise route for login endpoint */
app.use(login.routes());


module.exports = app;