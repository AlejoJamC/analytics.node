/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var base64      = require('../config/base64');
var crypto      = require('crypto');
var dashRoutes  = express.Router();
var fs          = require('fs');
var logger      = require('../config/logger').logger;
var multer      = require('multer');
var oracledb    = require('oracledb');
var path        = require('path');
var uuid        = require('node-uuid');

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


/* GET Index page. */
dashRoutes.get('/', function (req, res) {
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
    res.render('dash/search', {
        title   : 'Buscar | Identico',
        level   : '',
        layout  : 'dash',
        error   : error
    });
});

dashRoutes.get('/search/ajax', function (req, res) {
    var personDoc = req.query.cedula;
    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "SELECT N.IDPERSONA,N.PRIMERAPELLIDO,N.SEGUNDOAPELLIDO,N.PRIMERNOMBRE,N.SEGUNDONOMBRE," +
            "A.IDPERSONA AFILIADO, T.IDREFERIDO REFERIDO, " +
            "DECODE (NVL2(A.IDPERSONA,1,0) + NVL2(T.IDREFERIDO,2,0), 0, 'NO AFILIADO NI REFERIDO'," +
            " 1, 'AFILIADO', 2, 'REFERIDO',3, 'AFILIADO Y REFERIDO') TIPO" +
            " FROM NPERSONAS N, NAFILIADOS A, NAUTORIZACIONES T" +
            " WHERE N.IDPERSONA=A.IDPERSONA(+) AND N.IDPERSONA=T.IDREFERIDO(+) " +
            "AND N.NODOCUMENTO=" + personDoc;

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({ data : 'Empty values returned.', code : 1});
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({ data : 'Empty values returned.', code : 2});
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({ data : 'Empty values returned.', code : 3});
                    }
                }

                var data = result;

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(data);
            }
        );
    });
});


/* GET Index page | Dashboard. */
dashRoutes.get('/dashboard', function (req, res) {
    // Basic error validator
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
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

/* POST Images handler page | Dashboard. */
dashRoutes.post('/dashboard/images/capture',  function (req, res) {

    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/dashboard/images?error=12');
    }

    //logger.info(req.body);

    //var encoded_image = req.body.finalimage;
    var binary_data = req.body.finalimage;

    // Random uuid to asign the new image
    var randomImageName = uuid.v4();
    var imagepath = 'uploads/' + randomImageName +'.jpg';
    // Create the file inside uploads folder
    var fileresult = fs.writeFile(imagepath, binary_data, {encoding: 'base64'}, function (err) {
        if(err){
            logger.info(err);
            logger.info('Error creating capture image');
            return res.redirect('/login?error=15');
        }

        // Save the image path in the database
        var personId = req.body.personid;

        var sql = "UPDATE ANALYTICS.\"NPersonas\" SET ANALYTICS.\"NPersonas\".\"Foto\" = '" +
            imagepath + "' WHERE ANALYTICS.\"NPersonas\".\"idPersona\" =" + personId;

        //logger.info(sql);

        // Save image route
        oracledb.autoCommit = true;
        oracledb.getConnection({
            user            : process.env.ORACLE_USERNAME,
            password        : process.env.ORACLE_PASSWORD,
            connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
            + '/' + process.env.ORACLE_SID
        }, function (err, connection) {
            if (err){
                logger.error(err.message);
                // error=0 trying to connect with database
                return res.redirect('/dashboard/images?error=0');
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
                                    return res.redirect('/dashboard/images?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        // Error doing select statement
                        return res.redirect('/dashboard/images?error=12');
                    }

                    logger.info(result);

                    // UPDATE image capture success
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/dashboard/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    res.redirect('/dashboard/images?flag=success');
                }
            );
        });
    });
});

/* POST Images handler page | Dashboard. */
dashRoutes.post('/dashboard/images/input', upload.single('inputpicture'), function (req, res) {
    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/login?error=12');
    }

    //logger.info(req.file);
    //logger.info(req.body);

    var personId = req.body.personid;

    var sql = "UPDATE ANALYTICS.\"NPersonas\" SET ANALYTICS.\"NPersonas\".\"Foto\" = '" +
        req.file.path + "' WHERE ANALYTICS.\"NPersonas\".\"idPersona\" =" + personId;

    //logger.info(sql);

    // Save image route
    oracledb.autoCommit = true;
    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect('/dashboard/images?error=0');
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
                                return res.redirect('/dashboard/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect('/dashboard/images?error=12');
                }

                logger.info(result);

                // UPDATE image capture success
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect('/dashboard/images?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                res.redirect('/dashboard/images?flag=success');
            }
        );
    });
});


module.exports = dashRoutes;