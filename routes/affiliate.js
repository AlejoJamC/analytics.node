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
var async       = require('async');

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
    if(req.params.id === 'referred' || req.params.id === 'images'){
        next();
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/affiliateDetails', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            idAfiliado : null,
            idUserSession : req.session.userId,
            afiliado : null
        });
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
        " p.TELEFONOFIJO, p.TELEFONOMOVIL, p.huella1, p.huella2, p.foto , trunc(months_between(sysdate, p.FECHA_NACIMIENTO)/12) EDAD" +
        " FROM NAFILIADOS a,NPERSONAS p" +
        " WHERE p.IDPERSONA = a.IDPERSONA" +
        " AND a.IDPERSONA ="  +idAfiliado;

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

                afiliadoResult.IDPERSONA = result.rows[0][0];
                afiliadoResult.PRIMERAPELLIDO = ((result.rows[0][1] === null) ? '': (result.rows[0][1].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                afiliadoResult.SEGUNDOAPELLIDO = ((result.rows[0][2] === null) ? '': (result.rows[0][2].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                afiliadoResult.PRIMERNOMBRE = ((result.rows[0][3] === null) ? '': (result.rows[0][3].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
                afiliadoResult.SEGUNDONOMBRE = ((result.rows[0][4] === null) ? '': (result.rows[0][4].toLowerCase()).replace(/\b\w/g, function(l){ return l.toUpperCase() }));
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
                afiliadoResult.EDAD = result.rows[0][21];

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
                return res.render('dash/affiliateDetails', {
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

/* GET Referred by affiliate Id  page. */
affiliateRouter.get('/affiliates/referred/:id', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    //logger.info((typeof req.query.error !== 'undefined'));
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.json({error: error});
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    var idAfiliado = req.params.id;

    // Consulto el los datos del afiliado
    oracledb.fetchAsString = [ oracledb.CLOB ];

    var doquery = function(conn, cb) {
        oracledb.getConnection({
            user: process.env.ORACLE_USERNAME,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
            + '/' + process.env.ORACLE_SID
        }, function (err, connection) {
            if (err) {
                logger.error(err.message);
                // error=0 trying to connect with database
                return res.json({error: 'Error=0 trying to connect with database'});
            }

            var sql = "SELECT a.IDPERSONA, p.PRIMERAPELLIDO, p.SEGUNDOAPELLIDO, " +
                "p.PRIMERNOMBRE, p.SEGUNDONOMBRE, p.IDDOCUMENTO, p.NODOCUMENTO, " +
                "p.FECHA_NACIMIENTO, GENERO, IDZONA, IDETNIA, IDMUNICIPIO, IDDEPARTAMENTO, DIRECCION, DIRCOMPLEMENTARIA, CORREO," +
                "p.TELEFONOFIJO, p.TELEFONOMOVIL, p.huella1, p.huella2, p.foto, t.IDREFERIDO, " +
                " r.PRIMERAPELLIDO, r.SEGUNDOAPELLIDO, r.PRIMERNOMBRE, r.SEGUNDONOMBRE, r.IDDOCUMENTO, r.NODOCUMENTO, " +
                "r.FECHA_NACIMIENTO, trunc(months_between(sysdate,r.FECHA_NACIMIENTO)/12) EDAD, r.TELEFONOFIJO, r.TELEFONOMOVIL, r.huella1, r.huella2, r.foto " +
                "FROM NAFILIADOS a,NPERSONAS p, NAUTORIZACIONES t, NPERSONAS r " +
                "WHERE p.IDPERSONA = a.IDPERSONA " +
                "AND t.IDAFILIADO = a.IDPERSONA       " +
                "AND r.idpersona = t.IDREFERIDO  " +
                "AND a.IDPERSONA=" + idAfiliado;

            //logger.info(sql);

            connection.execute(
                // The statement to execute
                sql,
                [],

                // The Callback function handles the SQL execution results
                function (err, result) {
                    if (err) {
                        logger.error(err.message);
                        connection.close(
                            function (err) {
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
                    if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                        logger.info('Validation error, empty values returned.');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.json({error: 'Error=1 trying to disconnect of database'});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.json({error: 'Error doing select statement'});
                    } else if (typeof result.rows[0] === 'undefined') {
                        logger.info('Validation error, empty values returned.');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.json({error: 'Error=1 trying to disconnect of database'});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.json({error: 'Error doing select statement'});
                    } else {
                        if (result.rows[0] == '') {
                            logger.info('Error trying to validate user credentials');
                            connection.close(
                                function (err) {
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

                    return res.send(result.rows);
                }
            );
        });
    };

    var dorelease = function(conn) {
        conn.close(function (err) {
            if (err) {
                // error=1 trying to disconnect of database
                logger.error(err.message);
                return res.json({error: 'Error=1 trying to disconnect of database'});
            }
            logger.info('Connection to Oracle closed successfully!');
        });
    };

    async.waterfall([
            doquery
        ],
        function (err, conn) {
            if (err) { logger.error("Error disconnecting " + err); }
            if (conn)
                dorelease(conn);
        });
});

/* GET Affiliate image by affiliate Id page. */
affiliateRouter.get('/affiliates/images/ajax/:id', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    //logger.info((typeof req.query.error !== 'undefined'));
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.json({error: error});
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    var idAfiliado = req.params.id;

    // Consulto el los datos del afiliado
    oracledb.fetchAsString = [ oracledb.CLOB ];

    var doquery = function(conn, cb) {
        oracledb.getConnection({
            user: process.env.ORACLE_USERNAME,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
            + '/' + process.env.ORACLE_SID
        }, function (err, connection) {
            if (err) {
                logger.error(err.message);
                // error=0 trying to connect with database
                return res.json({error: 'Error=0 trying to connect with database'});
            }

            var sql = "SELECT HUELLA.NPERSONAS.FOTO " +
                " FROM HUELLA.NPERSONAS " +
                "WHERE HUELLA.NPERSONAS.IDPERSONA =" + idAfiliado;

            //logger.info(sql);

            connection.execute(
                // The statement to execute
                sql,
                [],

                // The Callback function handles the SQL execution results
                function (err, result) {
                    if (err) {
                        logger.error(err.message);
                        connection.close(
                            function (err) {
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
                    if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                        logger.info('Validation error, empty values returned.');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.json({error: 'Error=1 trying to disconnect of database'});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.json({error: 'Error doing select statement'});
                    } else if (typeof result.rows[0] === 'undefined') {
                        logger.info('Validation error, empty values returned.');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.json({error: 'Error=1 trying to disconnect of database'});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.json({error: 'Error doing select statement'});
                    }

                    //logger.info(result.rows[0]);

                    var buff = new Buffer( result.rows[0], 'binary' );
                    var imgbase64 =  buff.toString('base64');

                    return res.json({img: imgbase64 });
                }
            );
        });
    };

    var dorelease = function(conn) {
        conn.close(function (err) {
            if (err) {
                // error=1 trying to disconnect of database
                logger.error(err.message);
                return res.json({error: 'Error=1 trying to disconnect of database'});
            }
            logger.info('Connection to Oracle closed successfully!');
        });
    };

    async.waterfall([
            doquery
        ],
        function (err, conn) {
            if (err) { logger.error("Error disconnecting " + err); }
            if (conn)
                dorelease(conn);
        });
});

/* GET Affiliates images input / capture page. */
affiliateRouter.get('/affiliates/images/:id', function (req, res) {
    var error = '';
    var idaffiliate =  req.params.id;
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Valido si retorna la bandera success
    var flag = '';
    if(typeof req.query.flag !== 'undefined'){
        if(req.query.flag === 'success'){
            flag = 'success';
        }
    }

    res.render('dash/affiliateImages', {
        title   : 'Cargar Imagen Afiliado | Identico',
        level   : '../../',
        layout  : 'dash',
        affiliate: idaffiliate,
        error   : error,
        flag    : flag
    });
});

/* POST Affiliate images handler page | affiliates. */
affiliateRouter.post('/affiliates/images/capture',  function (req, res) {

    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/affiliates/images/' + personId + '?error=12');
    }

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
        // read the file
        var buf = fs.readFileSync(imagepath);
        var sql = "UPDATE HUELLA.NPERSONAS SET HUELLA.NPERSONAS.FOTO = :blob WHERE HUELLA.NPERSONAS.IDPERSONA =" + personId;

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
                return res.redirect('/affiliates/images/' + personId + '?error=0');
            }
            connection.execute(
                sql,
                [buf],
                // The Callback function handles the SQL execution results
                function (err, result) {
                    if (err) {
                        logger.error(err.message);
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect('/affiliates/images/' + personId + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        // Error doing select statement
                        return res.redirect('/affiliates/images/' + personId + '?error=12');
                    }

                    //logger.info(result);

                    // UPDATE image capture success
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/affiliates/images/' + personId + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    res.redirect('/affiliates/images/' + personId + '?flag=success');
                }
            );
        });
    });
});

/* POST Affiliate images handler page | affiliates. */
affiliateRouter.post(' /affiliates/images/input', upload.single('inputpicture'), function (req, res) {
    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        return res.redirect('/login?error=12');
    }

    var personId = req.body.personid;

    // read the file
    var buf = fs.readFileSync(req.file.path);

    /*var sql = "UPDATE HUELLA.NPERSONAS SET HUELLA.NPERSONAS.FOTO = " +
     buf + " WHERE HUELLA.NPERSONAS.IDPERSONA =" + personId;*/

    var sql = "UPDATE HUELLA.NPERSONAS SET HUELLA.NPERSONAS.FOTO = :blob WHERE HUELLA.NPERSONAS.IDPERSONA =" + personId;

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
            return res.redirect('/affiliates/images/' + personId + '?error=0');
        }

        connection.execute(
            sql,
            [buf],
            // The Callback function handles the SQL execution results
            function (err, result) {
                if (err) {
                    logger.error(err.message);
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect('/affiliates/images/' + personId + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect('/affiliates/images/' + personId + '?error=12');
                }

                if (result.rowsAffected != 1) {
                    logger.info('Error updating the image');
                    return res.redirect('/affiliates/images/' + personId + '?error=2');
                }

                //logger.info(result);

                // UPDATE image capture success
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect('/affiliates/images/' + personId + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                res.redirect('/affiliates/images/' + personId + '?flag=success');
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

module.exports = affiliateRouter;