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

/* POST Login page. */
indexRouter.post('/login', function (req, res) {
    if( typeof req.body.username === 'undefined'&& req.body.username === ''
        && typeof req.body.password === 'undefined' && req.body.password === ''){
        logger.info('Login credentials: Empty values.');
        // error=11 Login credentials: Empty values.
        res.redirect('/login?error=11');
    }

    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            res.redirect('/login?error=0');
        }

        // Login credentidas
        var user        = req.body.username;
        var password    = req.body.password;

        connection.execute(
            // The statement to execute
            "SELECT ANALYTICS.\"Usuarios\".\"idUsuario\", ANALYTICS.\"Usuarios\".\"nombre\", " +
            " ANALYTICS.\"Usuarios\".\"usuario\", ANALYTICS.\"Usuarios\".\"password\" " +
            " FROM ANALYTICS.\"Usuarios\" " +
            " WHERE \"Usuarios\".\"usuario\" =':user' AND \"Usuarios\".\"password\" =':password'",
            { user : user , password : password },

            // The Callback function handles the SQL execution results
            function (err, result) {
                logger.info("SELECT ANALYTICS.\"Usuarios\".\"idUsuario\", ANALYTICS.\"Usuarios\".\"nombre\", " +
                    " ANALYTICS.\"Usuarios\".\"usuario\", ANALYTICS.\"Usuarios\".\"password\" " +
                    " FROM ANALYTICS.\"Usuarios\" " +
                    " WHERE \"Usuarios\".\"usuario\" ='" + user +
                    "' AND \"Usuarios\".\"password\" ='" + password + "'");
                if (err) {
                    logger.error(err.message);
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                res.redirect('/login?error=1');
                            }
                    });
                    // Error doing select statement
                    res.redirect('/login?error=12');
                }

                // Login success
                // Create the session
                logger.info(result.metaData);
                logger.info(result.rows);
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            res.redirect('/login?error=1');
                        }
                });
                res.redirect('/dashboard');
            }

        );

    });


});

module.exports = indexRouter;