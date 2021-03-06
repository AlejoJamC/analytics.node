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
// TODO: Agregar passport

/* GET Login page. */
indexRouter.get('/login', function (req, res) {
    var error = '';

    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
    }
    // Session
    if(!(typeof req.session.userId === 'undefined' || typeof req.session.userId === '')){
        return res.redirect('/');
    }

    res.render('auth/index', {
        title   : 'Login | Identico',
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
        return res.redirect('/login?error=11');
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
            return res.redirect('/login?error=0');
        }

        // Login credentidas
        var user        = req.body.username;
        var password    = req.body.password;

        var sql = "SELECT \"PUSUARIOS\".* " +
            " FROM \"PUSUARIOS\" " +
            " WHERE " +
            " \"PUSUARIOS\".\"USUARIO_USER\" ='" + user + "' " +
            " AND " +
            " \"PUSUARIOS\".\"USUARIO_PASS\"='" + password + "'";

        connection.execute(
            // The statement to execute
            sql,
            [ ],

            // The Callback function handles the SQL execution results
            function (err, result) {
                if (err) {
                    logger.error(err.message);
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/login?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                    });
                    // Error doing select statement
                    return res.redirect('/login?error=12');
                }

                // Login success
                // Create the session
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/login?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect('/login?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/login?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect('/login?error=13');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect('/login?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect('/login?error=14');
                    }
                }

                req.session.userId = result.rows[0][0];
                req.session.userFullName = result.rows[0][1];
                // TODO: Verificar el tipo de usuario

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect('/login?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                });
                res.redirect('/');
            }
        );
    });
});

/* GET Logout page. */
indexRouter.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if(err){
            logger.info(err);
        }
        res.redirect('/login');
    });
});

module.exports = indexRouter;