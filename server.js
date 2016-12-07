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

require('dotenv}').config();

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
    session         = require('express-session'),

    routes          = require('./routes/web'),

    environment     = process.env.APP_ENV,
    port            = process.env.APP_PORT;

