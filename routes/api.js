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

var logger = require('../config/Logger').Logger;
var moment = require('moment');

/**
 * SetupApiRouter
 *
 * @description  Configure all routes on express router
 *
 * @param {express}      app      The application server
 */

function SetupApiRouter(app) {
    // Initialize all routes
    var fingerprintRoutes = require('./fingerprint');

    app.use('/', fingerprintRoutes);
}

// Export setup function
module.exports.SetupApiRouter = SetupApiRouter;