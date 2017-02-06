/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
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

var express             = require('express'),
    bodyParser          = require('body-parser'),
    errorhandler        = require('errorhandler'),
    methodOverride      = require('method-override'),
    moment              = require('moment'),
    path                = require('path'),
    passport            = require('passport'),
    session             = require('express-session'),

    logger              = require('../config/logger').logger,
    morgan              = require('morgan'),

    environment         = process.env.APP_ENV,
    port                = process.env.API_PORT,
    apiPrefix           = process.env.API_PREFIX,
    apiVersion          = process.env.API_VERSION,

    authRoutes          = require('./auth'),
    fingerprintRoutes   = require('./fingerprint');

logger.info('Environment: ' + environment);

// Express app instance.
var app = express();

// Load configuration package and environment to the new express app.
// Port.
app.set('port', port);

// Logger.
// TODO: Arreglar el error entre wiston y morgan
//app.use(morgan('combined', { 'stream': logger.stream }));
app.use(morgan('dev'));

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Set Header 'X-Prowered-By'
logger.info('Indetico API powered by @Identico');
app.use(function (req, res, next) {
    res.set('X-Powered-By', 'Identico Website < @Identico >');
    next();
});

// Session.
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '1w1OyWZUbWKDIb2ItA7xadEe2bGOYNeHcS8tMzllEXyaBGh6Xw'
}));

// Passport middleware
app.use(passport.initialize());

// Setup all routes on express router
var router = express.Router();

// logger for all request will first hits this middleware
router.use(function (req, res, next) {
    var now = moment(new Date());

    var date = now.format('DD-MM-YYYY HH:mm');
    logger.info('%s %s %s', req.method, req.url, date);
    next();
});

// ENDPOINT: /api/v1/fingerprints
var preEndpoint = '/' + apiPrefix + '/' + apiVersion;
router.route('/fingerprints')
    .get(authRoutes.isAuthenticated, fingerprintRoutes.getFingerprint)
    .post(authRoutes.isAuthenticated, fingerprintRoutes.postFingeprint);

// Setup the router in the express app
app.use(preEndpoint, router);

// Error handler available environment
var env = process.env.NODE_ENV || environment;
if ('development' === env){
    app.use(errorhandler());
}

app.listen(app.get('port'), function(){
    logger.info('Analytics API is running on http://localhost:' + port + '/');
});