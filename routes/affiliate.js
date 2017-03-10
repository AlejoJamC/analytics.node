/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var affiliateRouter = express.Router();
var logger      = require('../config/logger').logger;
var oracledb    = require('oracledb');
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

/* GET Affiliates Index page. */
affiliateRouter.get('/affiliates', function (req, res) {
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
    res.render('dash/affiliateDetails', {
        title   : 'Detalle de Afiliado | Identico',
        level   : '',
        layout  : 'dash',
        error   : error
    });
});

/* GET Affiliates by Id page. */
affiliateRouter.get('/affiliates/:id', function (req, res, next) {
    if(req.params.id === 'referred'){
        next();
    }
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

    var idAfiliado = req.params.id;
    var currentURL = '/affiliates/' + idAfiliado;
    var afiliadoResult = {};

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
            " p.TELEFONOFIJO, p.TELEFONOMOVIL, p.huella1, p.huella2, p.foto" +
            " FROM NAFILIADOS a,NPERSONAS p" +
            " WHERE p.IDPERSONA = a.IDPERSONA" +
            " AND a.IDPERSONA ="  +idAfiliado;

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

                afiliadoResult.IDPERSONA = result.rows[0][0];
                afiliadoResult.PRIMERAPELLIDO = result.rows[0][1];
                afiliadoResult.SEGUNDOAPELLIDO = result.rows[0][2];
                afiliadoResult.PRIMERNOMBRE = result.rows[0][3];
                afiliadoResult.SEGUNDONOMBRE = result.rows[0][4];
                afiliadoResult.IDDOCUMENTO = result.rows[0][5];
                afiliadoResult.NODOCUMENTO = result.rows[0][6];
                afiliadoResult.FECHA_NACIMIENTO = moment(result.rows[0][7]).format('DD/MM/YYYY');
                afiliadoResult.GENERO = result.rows[0][8];
                afiliadoResult.ZONA = result.rows[0][9];
                afiliadoResult.ETNIA = result.rows[0][10];
                afiliadoResult.MUNICIPIO = result.rows[0][11];
                afiliadoResult.DEPARTAMENTO = result.rows[0][12];
                afiliadoResult.DIRECCION = result.rows[0][13];
                afiliadoResult.DETALLEDIRECCION = result.rows[0][14];
                afiliadoResult.CORREO = result.rows[0][15];
                afiliadoResult.TELEFONOFIJO = result.rows[0][16];
                afiliadoResult.TELEFONOMOVIL = result.rows[0][17];
                afiliadoResult.HUELLA1 = result.rows[0][18];
                afiliadoResult.HUELLA2 = result.rows[0][19];
                afiliadoResult.FOTO = result.rows[0][20];

               /* logger.info(JSON.stringify(afiliadoResult));
                logger.info(afiliadoResult);*/

                //afiliadoResult = result.rows;
                 logger.info(JSON.stringify(afiliadoResult));
                 //logger.info("Llego afiliado"+afiliadoResult);

/*
                logger.info("Id Persona:" + result.rows[0][0]);
                logger.info("Primer apellido:" + result.rows[0][1]);
                logger.info("Segundo apellido:" + result.rows[0][2]);
                logger.info("Primer Nombre:" + result.rows[0][3]);
                logger.info("Segundo Nombre:" + result.rows[0][4]);
                logger.info("Id docuemnto:" + result.rows[0][5]);
                logger.info("N .Documento:" + result.rows[0][6]);
                logger.info("Fecha de nacimiento:" + result.rows[0][7]);
                logger.info("Telefono Fijo:" + result.rows[0][8]);
                logger.info("Telefono Movil:" +result.rows[0][9]);*/


                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(currentURL + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                //res.redirect('/');
                // User Rol
                // If ............
                res.render('dash/affiliateDetails', {
                    title   : 'Detalle de Afiliado | Identico',
                    level   : '../',
                    layout  : 'dash',
                    error   : error,
                    idAfiliado : idAfiliado,
                    idUserSession : req.session.userId,
                    afiliado : afiliadoResult
                });
            }
        );
    });
});

/* GET Referred by Id Affiliate page. */
affiliateRouter.get('/affiliates/referred/:id', function (req, res) {
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

    var idAfiliado = req.params.id;
    var afiliadoResult = {};

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
            return res.json({error: 'Error=0 trying to connect with database'});
        }

        var sql = "SELECT a.IDPERSONA, p.PRIMERAPELLIDO, p.SEGUNDOAPELLIDO, " +
            "p.PRIMERNOMBRE, p.SEGUNDONOMBRE, p.IDDOCUMENTO, p.NODOCUMENTO, " +
            "p.FECHA_NACIMIENTO, GENERO, IDZONA, IDETNIA, IDMUNICIPIO, IDDEPARTAMENTO, DIRECCION, DIRCOMPLEMENTARIA, CORREO," +
            "p.TELEFONOFIJO, p.TELEFONOMOVIL, p.huella1, p.huella2, p.foto, t.IDREFERIDO, " +
            " r.PRIMERAPELLIDO, r.SEGUNDOAPELLIDO, r.PRIMERNOMBRE, r.SEGUNDONOMBRE, r.IDDOCUMENTO, r.NODOCUMENTO, " +
            "r.FECHA_NACIMIENTO, r.TELEFONOFIJO, r.TELEFONOMOVIL, r.huella1, r.huella2, r.foto " +
            "FROM NAFILIADOS a,NPERSONAS p, NAUTORIZACIONES t, NPERSONAS r " +
            "WHERE p.IDPERSONA = a.IDPERSONA " +
            "AND t.IDAFILIADO = a.IDPERSONA       " +
            "AND r.idpersona = t.IDREFERIDO  " +
            "AND a.IDPERSONA=" + idAfiliado;

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
                                return res.json({error: 'Error=1 trying to disconnect of database'});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.json({error: 'Error doing select statement'});
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
                                return res.json({error: 'Error=1 trying to disconnect of database'});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.json({error: 'Error doing select statement'});
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.json({error: 'Error=1 trying to disconnect of database'});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.json({error: 'Error doing select statement'});
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.json({error: 'Error=1 trying to disconnect of database'});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.json({error: 'Error doing select statement'});
                    }
                }

                afiliadoResult = result.rows;





                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.json({error: 'Error=1 trying to disconnect of database'});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.json({response : afiliadoResult});

            }
        );
    });
});

affiliateRouter.get('/affiliates/edit', function (req, res) {
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
    res.render('dash/affiliateDetailsEdit', {
        title   : 'Editar Afiliado | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

affiliateRouter.get('/editarafiliado', function (req, res) {
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
    res.render('dash/affiliateDetailsEdit', {
        title   : 'Editar Afiliado | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Create New Affiliate page. */
affiliateRouter.get('/affiliates/new', function (req, res) {
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
    res.render('dash/addAffiliate', {
        title   : 'Agregar Afiliado | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

affiliateRouter.get('/addAffiliates', function (req, res) {
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
    res.render('dash/addAffiliate', {
        title   : 'Agregar Afiliado | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET Images input / capture page. */
affiliateRouter.get('/affiliates/images', function (req, res) {
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
    res.render('dash/affiliateImages', {
        title   : 'Cargar Imagen Afiliado | Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* POST Images handler page | Dashboard. */
affiliateRouter.post('/affiliates/images/capture',  function (req, res) {

    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/affiliates?error=12');
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
                return res.redirect('/affiliates/images?error=0');
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
                                    return res.redirect('/affiliates/images?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        // Error doing select statement
                        return res.redirect('/affiliates/images?error=12');
                    }

                    logger.info(result);

                    // UPDATE image capture success
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/affiliates/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    res.redirect('/affiliates?flag=success');
                }
            );
        });
    });
});

/* POST Images handler page | affiliates. */
affiliateRouter.post('/affiliates/images/input', upload.single('inputpicture'), function (req, res) {
    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/affiliates?error=12');
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
            return res.redirect('/affiliates/images?error=0');
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
                                return res.redirect('/affiliates/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect('/affiliates/images?error=12');
                }

                logger.info(result);

                // UPDATE image capture success
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect('/affiliates/images?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                res.redirect('/affiliates?flag=success');
            }
        );
    });
});



module.exports = affiliateRouter;