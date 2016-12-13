/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var indexRouter = express.Router();

/* GET Login page. */
indexRouter.get('/', function (req, res) {
    res.render('auth/index', {
        title   : 'Analytics Website | Login',
        level   : '',
        layout  : 'auth'
    });
});

module.exports = indexRouter;