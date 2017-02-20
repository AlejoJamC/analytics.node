/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

/**
 * Module dependencies
 */

// Load required packages
var BasicStrategy   = require('passport-http').BasicStrategy;
var LocalStrategy   = require('passport-local').Strategy;
var passport        = require('passport');
var logger          = require('../config/logger').logger;
var oracledb        = require('oracledb');

passport.use(new BasicStrategy(
    function (username, password, callback) {
        oracledb.getConnection({
            user            : process.env.ORACLE_USERNAME,
            password        : process.env.ORACLE_PASSWORD,
            connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
            + '/' + process.env.ORACLE_SID
        }, function (err, connection) {
            if (err){
                logger.error(err.message);
                // error=0 trying to connect with database
                return callback(err);
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
                                    return callback(err.message);
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        // Error doing select statement
                        return callback(err);
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
                                    return callback(err.message);
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return callback('Empty values returned. [1]');
                    } else if(typeof result.rows[0] === 'undefined') {
                        logger.info('Validation error, empty values returned.');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return callback(err.message);
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return callback('Empty values returned. [2]');
                    } else {
                        if(result.rows[0] == ''){
                            logger.info('Error trying to validate user credentials');
                            connection.close(
                                function(err) {
                                    if (err) {
                                        // error=1 trying to disconnect of database
                                        logger.error(err.message);
                                        return callback(err.message);
                                    }
                                    logger.info('Connection to Oracle closed successfully!');
                                });
                            return callback('Empty values returned. [3]');
                        }
                    }

                    var user = {
                        'userId' : result.rows[0][0],
                        'userFullName' : result.rows[0][1]
                    };

                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return callback(err.message);
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return callback(null, user);
                }
            );
        });
    }
));