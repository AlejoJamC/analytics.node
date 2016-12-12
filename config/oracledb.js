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
var logger      = require('./logger').logger;
var oracledb    = require('oracledb');

/**
 * SetupMongoDB
 *
 * @description Configures and initiates the connection with the NoSQL MongoDB database.
 */

function SetupConnection (){
    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            return;
        }

        logger.info('Connected to Oracle successfully!');

    });
}

/**
 * TestOracledb
 *
 * @description Configures and initiates the connection with the NoSQL MongoDB database.
 */

function TestOracledb (){
    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            return;
        }

        logger.info('Connected to Oracle successfully!');

        connection.close(
            function (err) {
                if(err){
                    logger.error(err.message);
                    return
                }

                logger.info('Connection to Oracle closed successfully!');
            }
        );
    });
}

/**
 * Export the function that initialize the connection
 */

module.exports.SetupConnection  = SetupConnection;
module.exports.TestOracledb     = TestOracledb;