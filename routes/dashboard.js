/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var dashRoutes = express.Router();

/* GET Index page | Dashboard. */
dashRoutes.get('/dashboard', function (req, res) {
    res.render('dash/index', {
        title   : 'Analytics Website | Index',
        level   : '',
        layout  : 'dash'
    });
});


/* GET Images handler page | Dashboard. */
dashRoutes.get('/dashboard/images', function (req, res) {
    res.render('dash/image', {
        title   : 'Analytics Website | Images',
        level   : '../',
        layout  : 'dash'
    });
});

module.exports = dashRoutes;