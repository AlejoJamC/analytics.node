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
var parametersRoutes = express.Router();
var logger      = require('../config/logger').logger;
var oracledb    = require('oracledb');


/* GET Index page. */
parametersRoutes.get('/parametros/afiliados', function (req, res) {
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
    res.render('dash/tableAfiliados', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/autorizaciones', function (req, res) {
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
    res.render('dash/tableAutorizaciones', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/personas', function (req, res) {
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
    res.render('dash/tablePersonas', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/abreviaturas', function (req, res) {
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
    res.render('dash/tableAbreviaturas', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/departamentos', function (req, res) {
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
    res.render('dash/tableDepartamentos', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});


/* GET Index page. */
parametersRoutes.get('/parametros/documentos', function (req, res) {
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
    res.render('dash/tableDocumentos', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});
/* GET Index page. */
parametersRoutes.get('/parametros/etnias', function (req, res) {
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
    res.render('dash/tableEtnias', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/municipios', function (req, res) {
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
    res.render('dash/tableMunicipios', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/paises', function (req, res) {
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
    res.render('dash/tablePaises', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Index page. */
parametersRoutes.get('/parametros/zonas', function (req, res) {
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
    res.render('dash/tableZonas', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});
/* GET Index page. */
parametersRoutes.get('/parametros/usuarios', function (req, res) {
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
    res.render('dash/tableUsuarios', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

module.exports = parametersRoutes;