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
var oracledb = require('oracledb');

/* POST Login page. */
fingerprintRoutes.post('/api/fingerprints', function (req, res) {
    if(typeof req.body.fingerprint === 'undefined' || req.body.fingerprint === ''
    || typeof req.body.personId === 'undefined' || req.body.personId === ''){
        res.status(422).send('Error validando datos');
    }


    var fingerprint =  req.body.fingerprint;


});


module.exports = fingerprintRoutes;