/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Environment variables.
 */

require('dotenv').config();

/**
 * Module dependencies.
 */

var express         = require('express'),
    bodyParser      = require('body-parser'),
    errorhandler    = require('errorhandler'),
    favicon         = require('serve-favicon'),
    hbs             = require('express-hbs'),
    methodOverride  = require('method-override'),
    moment          = require('moment'),
    morgan          = require('morgan'),
    path            = require('path'),
    session         = require('express-session'),

    logger          = require('./config/logger').logger,
    routes          = require('./routes/web'),
    oracle          = require('./config/oracledb'),

    environment     = process.env.APP_ENV,
    port            = process.env.APP_PORT;

logger.info('Environment: ' + environment);

// Testing Oracle database connection.
oracle.TestOracledb();

// Express app instance.
var app = express();

// Load configuration package and environment to the new express app.
// Port.
app.set('port', port);

// Configure view template engine.
// Using `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Favicon path.
app.use(favicon(__dirname + '/public/favicon.ico'));

// Logger.
// TODO: Arreglar el error entre wiston y morgan
//app.use(morgan('combined', { 'stream': logger.stream }));
app.use(morgan('dev'));

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride());

// Set Header 'X-Prowered-By'
logger.info('Analytics Website powered by @AlejoJamC');
app.use(function (req, res, next) {
    res.set('X-Powered-By', 'Alejandro Mantilla < @AlejoJamC >');
    next();
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Import static files.
app.use(express.static(path.join(__dirname, 'public')));

// Session.
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '3f1l 4 73g 0t d33n yll43r u s1ht d43r n4c u f1'
}));

// Local variables.
// Current year.
app.locals.currentYear = moment().year();
app.locals.currentEnvironment = environment;

// Setup all routes on express router
//routes.setupRouter(app);

// Error handler available environment
var env = process.env.NODE_ENV || environment;
if ('development' === env){
    app.use(errorhandler());
}

app.listen(app.get('port'), function(){
    logger.info('Analytics website is running on http://localhost:' + port + '/');
});