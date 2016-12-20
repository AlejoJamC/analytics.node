/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var crypto      = require('crypto');
var dashRoutes = express.Router();
var logger      = require('../config/logger').logger;
var multer      = require('multer');
var oracledb    = require('oracledb');
var path        = require('path');

// Upload and rename files
var storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
var upload = multer({ storage: storage });


/* GET Index page | Dashboard. */
dashRoutes.get('/dashboard', function (req, res) {
    // Basic error validator
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        res.redirect('/login');
    }

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