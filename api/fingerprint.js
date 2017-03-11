/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var logger = require('../config/logger').logger;
var oracledb = require('oracledb');
var fs = require('fs');
var util = require('util');
var formidable = require('formidable');

// ENDPOINT: /api/v1/fingerprints METHOD: GET
module.exports.getFingerprint = function (req, res) {
    if( typeof req.query.personId === 'undefined' || req.query.personId === ''){
        logger.error('Empty value: personId value required.');
        return res.send('Empty value: personId value required.');
    }

    var personId = req.query.personId;

    var sql = "SELECT HUELLA.\"NPERSONAS\".\"IDPERSONA\" AS personId, " +
        "utl_raw.cast_to_varchar2(HUELLA.\"NPERSONAS\".\"HUELLA1\") AS huella1," +
        " utl_raw.cast_to_varchar2(HUELLA.\"NPERSONAS\".\"HUELLA2\") AS huella2 " +
    " FROM HUELLA.\"NPERSONAS\"  WHERE HUELLA.\"NPERSONAS\".\"IDPERSONA\" =" + personId;

    logger.info(sql);

    // Get the bytes
    oracledb.autoCommit = true;
    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            return res.send(err.message);
        }

        connection.execute(
            sql,
            // The Callback function handles the SQL execution results
            function (err, result) {
                if (err) {
                    logger.error(err.message);
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send(err.message);
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send(err.message);
                }

                logger.info(result);

                var person = {
                    'personId' : result.rows[0][0],
                    'fingerprint1' : result.rows[0][1],
                    'fingerprint2' : result.rows[0][2]
                };

                // SELECT person by id success
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send(err.message);
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                res.status(200).json({ message:"Fingerprints updated succesfully", data: person });
            }
        );
    });
};

// ENDPOINT: /api/v1/fingerprints METHOD: POST
module.exports.postFingeprint = function (req, res) {
    logger.info('Entro al metodo post');
    // if( typeof req.body.personId === 'undefined' || req.body.personId === ''
    //     || typeof req.body.fingerprint === 'undefined' || req.body.fingerprint === ''
    //     || typeof req.body.fingerprintNumber === 'undefined' || req.body.fingerprintNumber === ''){
    //     logger.error('Empty values: personId and both fingerprints values required.');
    //     return res.send('Empty values: personId and both fingerprints values required.');
    // }

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var buf = fs.readFileSync(files.fingerprint.path);
        //fs.writeFileSync('uploads/huella.fpt', buf);

        var personId            = fields.personId;
        var fingerprintNumber   = fields.fingerprintNumber;

        var sql = "";

        if (fingerprintNumber == 1){
            sql = "UPDATE HUELLA.\"NPERSONAS\" SET HUELLA.\"NPERSONAS\".\"HUELLA1\" = :blob " +
                " WHERE HUELLA.\"NPERSONAS\".\"IDPERSONA\" =" + personId;
        }else{
            sql = "UPDATE HUELLA.\"NPERSONAS\" SET HUELLA.\"NPERSONAS\".\"HUELLA2\" = :blob " +
                " WHERE HUELLA.\"NPERSONAS\".\"IDPERSONA\" =" + personId;
        }

        logger.info(sql);

        // Save fignerprint bytes
        oracledb.autoCommit = true;
        oracledb.getConnection({
            user            : process.env.ORACLE_USERNAME,
            password        : process.env.ORACLE_PASSWORD,
            connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
            + '/' + process.env.ORACLE_SID
        }, function (err, connection) {
            logger.info('entro al postback');
            if (err){
                logger.info('00');
                logger.error(err.message);
                return res.send(err.message);
            }
            connection.execute(
                sql,
                [buf],
                // The Callback function handles the SQL execution results
                function (err, result) {
                    logger.info('entro al execute');
                    if (err) {
                        logger.info('11');
                        logger.error(err.message);
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.info('22');
                                    logger.error(err.message);
                                    return res.send(err.message);
                                }
                                logger.info('33');
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        // Error doing select statement
                        return res.send(err.message);
                    }

                    logger.info(result);

                    // UPDATE image capture success
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send(err.message);
                            }
                            logger.info('44');
                            logger.info('Connection to Oracle closed successfully!');
                    });
                    res.status(200).json({ code: 200, data: result, message:"Huella #" + fingerprintNumber + " guardada exitosamente." });
                }
            );
        });

    });
};