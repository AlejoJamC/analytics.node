/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies
 */

var logger = require('../config/logger').logger;
var moment = require('moment');
var express = require('express');
var router = express.Router();

/**
 * SetupWebRouter
 *
 * @description  Configure all routes on express router
 *
 * @param {express}      app      The application server
 */

function SetupWebRouter(app) {
    // logger for all request will first hits this middleware
    router.use(function (req, res, next) {
        var now = moment(new Date());

        var date = now.format('DD-MM-YYYY HH:mm');
        logger.info('%s %s %s', req.method, req.url, date);
        next();
    });

    app.use(router);

    /**
     *  Declare all routes
     */
    var affiliateRoutes     = require('./affiliate');
    var dashRoutes          = require('./dashboard');
    var fingerprintRoutes   = require('./fingerprint');
    var loginRoutes         = require('./login');
    var settingRoutes       = require('./settings');
    var referredRoutes      = require('./referred');

    app.use('/', affiliateRoutes);
    app.use('/', dashRoutes);
    app.use('/', fingerprintRoutes);
    app.use('/', loginRoutes);
    app.use('/', settingRoutes);
    app.use('/', referredRoutes);

}

// Export setup function
module.exports.SetupWebRouter = SetupWebRouter;