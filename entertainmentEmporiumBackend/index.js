const app = require('./app');
/** Sets port to environment variable or 3000 */
let port = process.env.PORT || 3000;

/** Launches application  */
app.listen(port);
console.log(`API server running on port ${port}`)
