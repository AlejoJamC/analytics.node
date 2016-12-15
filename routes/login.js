/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var indexRouter = express.Router();
var logger      = require('../config/logger').logger;
var oracledb    = require('oracledb');

/* GET Index page. */
indexRouter.get('/', function (req, res) {
    res.redirect('/login');
});


/* GET Login page. */
indexRouter.get('/login', function (req, res) {
    var error = '';

    // Basic error validator
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
    }

    res.render('auth/index', {
        title   : 'Analytics Website | Login',
        level   : '',
        layout  : 'auth',
        error   : error
    });
});
    });
});

module.exports = indexRouter;