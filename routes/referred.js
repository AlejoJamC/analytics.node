/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var referredRouter = express.Router();
var logger      = require('../config/logger').logger;
var oracledb    = require('oracledb');
// TODO: Agregar passport
var base64      = require('../config/base64');
var crypto      = require('crypto');
var fs          = require('fs');
var multer      = require('multer');
var path        = require('path');
var uuid        = require('node-uuid');
var moment      = require('moment');

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
referredRouter.get('/referred', function (req, res) {
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
    res.render('dash/referredDetails', {
        title   : 'Detalle de Referido | Identico',
        level   : '',
        layout  : 'dash',
        error   : error
    });
});

referredRouter.get('/referred/edit', function (req, res) {
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
    res.render('dash/referredDetailsEdit', {
        title   : 'Editar Referido | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

// Obtener detalle del referido por ID
referredRouter.get('/referred/:id', function (req, res){
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

    // verifico la url del afiliado
    var afiliadoURL = '#';
    if(typeof req.query.afiliado !== 'undefined'){
        afiliadoURL = req.query.afiliado;
    }
    var idreferido = req.params.id;
    var currentURL = '/referred/' + idreferido;
    var referidoResult = {};

    // Consulto el los datos del afiliado

    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(currentURL + '?error=0');
        }

        /*var sql = "SELECT \"NPERSONAS\".* " +
         "FROM \"NPERSONAS\" " +
         "WHERE \"NPERSONAS\".\"IDPERSONA\"=" + idAfiliado;*/

        var sql = "SELECT a.IDPERSONA, p.PRIMERAPELLIDO, p.SEGUNDOAPELLIDO," +
            " p.PRIMERNOMBRE, p.SEGUNDONOMBRE, p.IDDOCUMENTO, p.NODOCUMENTO," +
            " p.FECHA_NACIMIENTO, GENERO, IDZONA, IDETNIA, IDMUNICIPIO, IDDEPARTAMENTO, DIRECCION, DIRCOMPLEMENTARIA, CORREO," +
            " p.TELEFONOFIJO, p.TELEFONOMOVIL, p.huella1, p.huella2, p.foto , trunc(months_between(sysdate, p.FECHA_NACIMIENTO)/12) EDAD" +
            " FROM NAFILIADOS a,NPERSONAS p" +
            " WHERE p.IDPERSONA = a.IDPERSONA" +
            " AND a.IDPERSONA ="  +idreferido;

        //logger.info(sql);

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
                                return res.redirect(currentURL + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(currentURL + '?error=12');
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
                                return res.redirect(currentURL + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(currentURL + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(currentURL + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(currentURL + '?error=13');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(currentURL + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(currentURL + '?error=14');
                    }
                }

                logger.info(result.rows[0]);

                referidoResult.IDPERSONA = result.rows[0][0];
                referidoResult.PRIMERAPELLIDO = ((result.rows[0][1] === null) ? '': (result.rows[0][1].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                referidoResult.SEGUNDOAPELLIDO = ((result.rows[0][2] === null) ? '': (result.rows[0][2].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                referidoResult.PRIMERNOMBRE = ((result.rows[0][3] === null) ? '': (result.rows[0][3].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                referidoResult.SEGUNDONOMBRE = ((result.rows[0][4] === null) ? '': (result.rows[0][4].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                referidoResult.IDDOCUMENTO = result.rows[0][5];
                referidoResult.NODOCUMENTO = result.rows[0][6];
                referidoResult.FECHA_NACIMIENTO = moment(result.rows[0][7]).format('DD/MM/YYYY');
                referidoResult.GENERO = result.rows[0][8];
                referidoResult.ZONA = result.rows[0][9];
                referidoResult.ETNIA = result.rows[0][10];
                referidoResult.MUNICIPIO = result.rows[0][11];
                referidoResult.DEPARTAMENTO = result.rows[0][12];
                referidoResult.DIRECCION = result.rows[0][13];
                referidoResult.DETALLEDIRECCION = result.rows[0][14];
                referidoResult.CORREO = result.rows[0][15];
                referidoResult.TELEFONOFIJO = result.rows[0][16];
                referidoResult.TELEFONOMOVIL = result.rows[0][17];
                referidoResult.HUELLA1 = result.rows[0][18];
                referidoResult.HUELLA2 = result.rows[0][19];
                referidoResult.FOTO = result.rows[0][20];
                referidoResult.EDAD = result.rows[0][21];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(currentURL + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                // If ............
                return res.render('dash/referredDetails', {
                    title   : 'Detalle de  Referido | Identico',
                    level   : '../',
                    layout  : 'dash',
                    error   : error,
                    idReferido : idreferido,
                    idUserSession : req.session.userId,
                    referido : referidoResult,
                    afiliadoURL : afiliadoURL
                });
            }
        );
    });
});


referredRouter.get('/newreferred', function (req, res) {
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
    res.render('dash/addReferred', {
        title   : 'Agregar Referido | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});


/* GET Images input / capture page. */
referredRouter.get('/referred/images', function (req, res) {
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
    res.render('dash/referredImages', {
        title   : 'Cargar Imagen Referido | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* POST Images handler page | Dashboard. */
referredRouter.post('/referred/images/capture',  function (req, res) {

    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/referred?error=12');
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

        var sql = "UPDATE USUARIOS.\"NPERSONAS\" SET USUARIOS.\"NPERSONAS\".\"FOTO\" = '" +
            imagepath + "' WHERE USUARIOS.\"NPERSONAS\".\"IDPERSONA\" =" + personId;

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
                return res.redirect('/referred/images?error=0');
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
                                    return res.redirect('/referred/images?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        // Error doing select statement
                        return res.redirect('/referred/images?error=12');
                    }

                    logger.info(result);

                    // UPDATE image capture success
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/referred/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    res.redirect('/referred?flag=success');
                }
            );
        });
    });
});

/* POST Images handler page | referred. */
referredRouter.post('/referred/images/input', upload.single('inputpicture'), function (req, res) {
    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/referred?error=12');
    }

    //logger.info(req.file);
    //logger.info(req.body);

    var personId = req.body.personid;

    var sql = "UPDATE USUARIOS.\"NPERSONAS\" SET USUARIOS.\"NPERSONAS\".\"FOTO\" = '" +
        req.file.path + "' WHERE USUARIOS.\"NPERSONAS\".\"IDPERSONA\" =" + personId;

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
            return res.redirect('/referred/images?error=0');
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
                                return res.redirect('/referred/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect('/referred/images?error=12');
                }

                logger.info(result);

                // UPDATE image capture success
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect('/referred/images?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                res.redirect('/referred?flag=success');
            }
        );
    });
});

module.exports = referredRouter;