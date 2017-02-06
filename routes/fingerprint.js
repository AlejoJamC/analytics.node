/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express = require('express');
var fingerprintRoutes = express.Router();
var logger = require('../config/logger').logger;
var base64      = require('../config/base64');
var oracledb = require('oracledb');

/* GET Fingerprint save page. */
fingerprintRoutes.get('/fingerprints', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/fingerprint', {
        title   : 'Detalle de Afiliado | Identico',
        level   : '',
        layout  : 'dash',
        error   : error
    });
});

module.exports = fingerprintRoutes;