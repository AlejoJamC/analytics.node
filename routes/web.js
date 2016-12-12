/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * SetupRouter
 *
 * @description  Configure all routes on express router
 *
 * @param {express}      app      The application server
 */

function SetupRouter(app) {
    // Initialize all routes
    var indexRoutes = require('./login');

    app.use('/', indexRoutes);

}

// Export setup function
module.exports.SetupRouter = SetupRouter;