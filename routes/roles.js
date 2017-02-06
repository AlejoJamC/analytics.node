/**
 * Created by crisp on 2/02/2017.
 */
/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var rolesRouter = express.Router();
var logger      = require('../config/logger').logger;
var oracledb    = require('oracledb');


/* GET Index page. */
rolesRouter.get('/roles', function (req, res) {
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
    res.render('dash/rolUsurs', {
        title   : 'Detalle de Roles | Identico',
        level   : '',
        layout  : 'dash',
        error   : error
    });
});

module.exports = rolesRouter;