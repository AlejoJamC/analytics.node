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

    environment     = process.env.APP_ENV,
    port            = process.env.APP_PORT;

logger.info('Environment: ' + environment);

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