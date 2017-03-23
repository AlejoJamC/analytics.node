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


/* GET Afiliados page. */
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
        page    : 'affiliates',
        error   : error
    });
});

/* GET Afiliados ajax method. */
parametersRoutes.get('/parametros/afiliados/ajax', function (req, res) {
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

        var sql = "SELECT \"NAFILIADOS\".\"IDPERSONA\", " +
            "\"NAFILIADOS\".\"GENERO\", " +
            "\"NAFILIADOS\".\"IDZONA\", " +
            "\"NAFILIADOS\".\"IDMUNICIPIO\", " +
            "\"NAFILIADOS\".\"IDDEPARTAMENTO\" " +
            "FROM " +
            "\"NAFILIADOS\" " +
            "ORDER BY " +
            "\"NAFILIADOS\".\"IDPERSONA\" ASC";

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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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

/* GET autorizaciones page. */
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

/* GET autorizaciones ajax method. */
parametersRoutes.get('/parametros/autorizaciones/ajax', function (req, res) {
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

        var sql = "SELECT \"NAUTORIZACIONES\".\"IDAFILIADO\", " +
            "\"NAUTORIZACIONES\".\"IDREFERIDO\", " +
            "\"NAUTORIZACIONES\".\"ESTADO\" " +
            "FROM " +
            "\"NAUTORIZACIONES\" " +
            "ORDER BY " +
            "\"NAUTORIZACIONES\".\"IDAFILIADO\" ASC";

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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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

/* GET personas page. */
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

/* GET personas ajax method. */
parametersRoutes.get('/parametros/personas/ajax', function (req, res) {
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

        var sql = "SELECT \"NPERSONAS\".\"IDPERSONA\", " +
            "\"NPERSONAS\".\"PRIMERAPELLIDO\", " +
            "\"NPERSONAS\".\"SEGUNDOAPELLIDO\", " +
            "\"NPERSONAS\".\"PRIMERNOMBRE\", " +
            "\"NPERSONAS\".\"SEGUNDONOMBRE\"," +
            "\"NPERSONAS\".\"IDDOCUMENTO\", " +
            "\"NPERSONAS\".\"NODOCUMENTO\" " +
            "FROM " +
            "\"NPERSONAS\" " +
            "ORDER BY " +
            "\"NPERSONAS\".\"IDPERSONA\" ASC";


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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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




/* GET abreviaturas page. */
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
    res.render('dash/tableAbreviaturas', {
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/abreviaturas/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos de la abreviatura
    var idAbreviatura = req.params.id;
    idAbreviatura = idAbreviatura.toUpperCase();
    var urlRedirect = '/parametros/abreviaturas';
    var sql = "SELECT  \"PABREVIATURAS\".\"IDABREVIATURA\",  " +
        "\"PABREVIATURAS\".\"ABREVIATURA\" " +
        "FROM   \"PABREVIATURAS\"   " +
        "WHERE  \"PABREVIATURAS\".\"IDABREVIATURA\" ='" + idAbreviatura + "'";

    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tableAbreviaturasEdit', {
                    title   : 'Editar abreviatura por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/abreviaturas/nuevo', function (req, res) {
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
    res.render('dash/tableAbreviaturasSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/abreviaturas/crear/ajax', function (req, res) {
    if(typeof req.body.idabreviatura === 'undefined' || req.body.idabreviatura === '' ||
        typeof req.body.abreviatura === 'undefined' || req.body.abreviatura === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PABREVIATURAS " +
            "VALUES  " +
            "('" + req.body.idabreviatura + "', '" + req.body.abreviatura + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/abreviaturas/actualizar/ajax', function (req, res) {
    if(typeof req.body.idabreviatura === 'undefined' || req.body.idabreviatura === '' ||
        typeof req.body.abreviatura === 'undefined' || req.body.abreviatura === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PABREVIATURAS " +
            "SET " +
            "HUELLA.PABREVIATURAS.IDABREVIATURA = '" + req.body.idabreviatura + "', " +
            "HUELLA.PABREVIATURAS.ABREVIATURA = '" + req.body.abreviatura + "' " +
            "WHERE HUELLA.PABREVIATURAS.IDABREVIATURA = '" + req.body.idabreviatura + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/abreviaturas/ajax', function (req, res) {
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

        var sql = "SELECT \"PABREVIATURAS\".\"IDABREVIATURA\", " +
            "\"PABREVIATURAS\".\"ABREVIATURA\"  " +
            "FROM " +
            "\"PABREVIATURAS\" " +
            "ORDER BY " +
            "\"PABREVIATURAS\".\"ABREVIATURA\" ASC";

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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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



/* GET departamentos page. */
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
        title   : 'Detalle de Parametros| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/departamentos/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos del departamento
    var idDepartamento = req.params.id;
    idDepartamento = idDepartamento.toUpperCase();
    var urlRedirect = '/parametros/departamentos';

    var sql = "SELECT  \"PDEPARTAMENTOS\".\"IDDEPARTAMENTO\",  " +
        "\"PDEPARTAMENTOS\".\"DEPARTAMENTO\", " +
        "\"PDEPARTAMENTOS\".\"IDPAIS\" " +
        "FROM   \"PDEPARTAMENTOS\"   " +
        "WHERE  \"PDEPARTAMENTOS\".\"IDDEPARTAMENTO\" ='" + idDepartamento + "'";


    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tableDepartamentosEdit', {
                    title   : 'Editar Departamento por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/departamentos/nuevo', function (req, res) {
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
    res.render('dash/tableDepartamentosSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/departamentos/crear/ajax', function (req, res) {
    if(typeof req.body.iddepartamento === 'undefined' || req.body.iddepartamento === '' ||
        typeof req.body.departamento === 'undefined' || req.body.departamento === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PDEPARTAMENTOS " +
            "VALUES  " +
            "('" + req.body.iddepartamento + "', '" + req.body.departamento + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/departamentos/actualizar/ajax', function (req, res) {
    if(typeof req.body.iddepartamento === 'undefined' || req.body.iddepartamento === '' ||
        typeof req.body.departamento === 'undefined' || req.body.departamento === '' ||
        typeof req.body.idpais === 'undefined' || req.body.idpais === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PDEPARTAMENTOS " +
            "SET " +
            "HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO = '" + req.body.iddepartamento + "', " +
            "HUELLA.PDEPARTAMENTOS.DEPARTAMENTO = '" + req.body.departamento + "', " +
            "HUELLA.PDEPARTAMENTOS.IDPAIS = '" + req.body.idpais + "' " +

            "WHERE HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO = '" + req.body.iddepartamento + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/departamentos/ajax', function (req, res) {
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

        var sql = "SELECT \"PDEPARTAMENTOS\".\"IDDEPARTAMENTO\", " +
            "\"PDEPARTAMENTOS\".\"DEPARTAMENTO\", " +
            "\"PDEPARTAMENTOS\".\"IDPAIS\"  " +
            "FROM " +
            "\"PDEPARTAMENTOS\" " +
            "ORDER BY " +
            "\"PDEPARTAMENTOS\".\"IDDEPARTAMENTO\" ASC";


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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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


/* GET Documentos page. */
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
        title   : 'Detalle de Parametros| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/documentos/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos del departamento
    var idDocumento = req.params.id;
    idDocumento = idDocumento.toUpperCase();
    var urlRedirect = '/parametros/documentos';

    var sql = "SELECT  \"PDOCUMENTOS\".\"IDDOCUMENTO\",  " +
        "\"PDOCUMENTOS\".\"DOCUMENTO\" " +
        "FROM   \"PDOCUMENTOS\"   " +
        "WHERE  \"PDOCUMENTOS\".\"IDDOCUMENTO\" ='" + idDocumento + "'";


    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tableDocumentosEdit', {
                    title   : 'Editar Documento por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/documentos/nuevo', function (req, res) {
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
    res.render('dash/tableDocumentosSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/documentos/crear/ajax', function (req, res) {
    if(typeof req.body.iddocumento === 'undefined' || req.body.iddocumento === '' ||
        typeof req.body.documento === 'undefined' || req.body.documento === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PDOCUMENTOS " +
            "VALUES  " +
            "('" + req.body.iddocumento + "', '" + req.body.documento + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/documentos/actualizar/ajax', function (req, res) {
    if(typeof req.body.iddocumento === 'undefined' || req.body.iddocumento === '' ||
        typeof req.body.documento === 'undefined' || req.body.documento === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PDOCUMENTOS " +
            "SET " +
            "HUELLA.PDOCUMENTOS.IDDOCUMENTO = '" + req.body.iddocumento + "', " +
            "HUELLA.PDOCUMENTOS.DOCUMENTO = '" + req.body.documento + "' " +
            "WHERE HUELLA.PDOCUMENTOS.IDDOCUMENTO = '" + req.body.iddocumento + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/documentos/ajax', function (req, res) {
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

        var sql = "SELECT \"PDOCUMENTOS\".\"IDDOCUMENTO\", " +
            "\"PDOCUMENTOS\".\"DOCUMENTO\"  " +
            "FROM " +
            "\"PDOCUMENTOS\" " +
            "ORDER BY " +
            "\"PDOCUMENTOS\".\"IDDOCUMENTO\" ASC";


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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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



/* GET Etnias page. */
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

parametersRoutes.get('/parametros/etnias/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos del departamento
    var idEtnia = req.params.id;
    idEtnia = idEtnia.toUpperCase();
    var urlRedirect = '/parametros/etnias';

    var sql = "SELECT  \"PETNIAS\".\"IDETNIA\",  " +
        "\"PETNIAS\".\"ETNIA\" " +
        "FROM   \"PETNIAS\"   " +
        "WHERE  \"PETNIAS\".\"IDETNIA\" ='" + idEtnia + "'";


    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tableEtniasEdit', {
                    title   : 'Editar etnia por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/etnias/nuevo', function (req, res) {
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
    res.render('dash/tableEtniasSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/etnias/crear/ajax', function (req, res) {
    if(typeof req.body.idetnia === 'undefined' || req.body.idetnia === '' ||
        typeof req.body.etnia === 'undefined' || req.body.etnia === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PETNIAS " +
            "VALUES  " +
            "('" + req.body.idetnia + "', '" + req.body.etnia + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/etnias/actualizar/ajax', function (req, res) {
    if(typeof req.body.idetnia === 'undefined' || req.body.idetnia === '' ||
        typeof req.body.etnia === 'undefined' || req.body.etnia === ''){
        return res.send({ data : 'Empty values returned. [1]'});
    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PETNIAS " +
            "SET " +
            "HUELLA.PETNIAS.IDETNIA = '" + req.body.idetnia + "', " +
            "HUELLA.PETNIAS.ETNIA = '" + req.body.etnia + "' " +
            "WHERE HUELLA.PETNIAS.IDETNIA = '" + req.body.idetnia + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/etnias/ajax', function (req, res) {
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

        var sql = "SELECT \"PETNIAS\".\"IDETNIA\", " +
            "\"PETNIAS\".\"ETNIA\"  " +
            "FROM " +
            "\"PETNIAS\" " +
            "ORDER BY " +
            "\"PETNIAS\".\"IDETNIA\" ASC";


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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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


/* GET municipios page. */
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

parametersRoutes.get('/parametros/municipios/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos del municipio
    var idMunicipio = req.params.id;
    idMunicipio = idMunicipio.toUpperCase();
    var urlRedirect = '/parametros/municipios';

    var sql = "SELECT  \"PMUNICIPIOS\".\"IDMUNICIPIO\",  " +
        "\"PMUNICIPIOS\".\"IDDEPARTAMENTO\", " +
        "\"PMUNICIPIOS\".\"MUNICIPIO\" " +
        "FROM   \"PMUNICIPIOS\"   " +
        "WHERE  \"PMUNICIPIOS\".\"IDMUNICIPIO\" ='" + idMunicipio + "'";


    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tableMunicipiosEdit', {
                    title   : 'Editar Municipio por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/municipios/nuevo', function (req, res) {
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
    res.render('dash/tableMunicipiosSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/municipios/crear/ajax', function (req, res) {
    if(typeof req.body.idmunicipio === 'undefined' || req.body.idmunicipio === '' ||
        typeof req.body.iddepartamento === 'undefined' || req.body.iddepartamento === '' ||
        typeof req.body.municipio === 'undefined' || req.body.municipio === ''){
        return res.send({ data : 'Empty values returned. [1]'});

    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PMUNICIPIOS " +
            "VALUES  " +
            "('" + req.body.idmunicipio + "', '" + req.body.iddepartamento + "', '" + req.body.municipio + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/municipios/actualizar/ajax', function (req, res) {
    if(typeof req.body.idmunicipio === 'undefined' || req.body.idmunicipio === '' ||
        typeof req.body.iddepartamento === 'undefined' || req.body.iddepartamento === '' ||
        typeof req.body.municipio === 'undefined' || req.body.municipio === ''){
        return res.send({ data : 'Empty values returned. [1]'});

    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PMUNICIPIOS " +
            "SET " +
            "HUELLA.PMUNICIPIOS.IDMUNICIPIO = '" + req.body.idmunicipio + "', " +
            "HUELLA.PMUNICIPIOS.IDDEPARTAMENTO = '" + req.body.iddepartamento + "', " +
            "HUELLA.PMUNICIPIOS.MUNICIPIO = '" + req.body.municipio + "' " +

            "WHERE HUELLA.PMUNICIPIOS.IDMUNICIPIO = '" + req.body.idmunicipio + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/municipios/ajax', function (req, res) {
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

        var sql = "SELECT \"PMUNICIPIOS\".\"IDMUNICIPIO\", " +
            "\"PMUNICIPIOS\".\"IDDEPARTAMENTO\", " +
            "\"PMUNICIPIOS\".\"MUNICIPIO\"  " +
            "FROM " +
            "\"PMUNICIPIOS\" " +
            "ORDER BY " +
            "\"PMUNICIPIOS\".\"IDMUNICIPIO\" ASC";


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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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



/* GET paises page. */
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

parametersRoutes.get('/parametros/paises/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos del municipio
    var idPais = req.params.id;
    idPais = idPais.toUpperCase();
    var urlRedirect = '/parametros/paises';

    var sql = "SELECT  \"PPAISES\".\"IDPAIS\",  " +
        "\"PPAISES\".\"PAIS\" " +
        "FROM   \"PPAISES\"   " +
        "WHERE  \"PPAISES\".\"IDPAIS\" ='" + idPais + "'";


    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tablePaisesEdit', {
                    title   : 'Editar Pais por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/paises/nuevo', function (req, res) {
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
    res.render('dash/tablePaisesSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/paises/crear/ajax', function (req, res) {
    if(typeof req.body.idpais === 'undefined' || req.body.idpais === '' ||
        typeof req.body.pais === 'undefined' || req.body.pais === ''){
        return res.send({ data : 'Empty values returned. [1]'});

    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PPAISES " +
            "VALUES  " +
            "('" + req.body.idpais + "', '" + req.body.pais + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/paises/actualizar/ajax', function (req, res) {
    if(typeof req.body.idpais === 'undefined' || req.body.idpais === '' ||
        typeof req.body.pais === 'undefined' || req.body.pais === ''){
        return res.send({ data : 'Empty values returned. [1]'});

    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PPAISES " +
            "SET " +
            "HUELLA.PPAISES.IDPAIS = '" + req.body.idpais + "', " +
            "HUELLA.PPAISES.PAIS = '" + req.body.pais + "' " +

            "WHERE HUELLA.PPAISES.IDPAIS = '" + req.body.idpais + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/paises/ajax', function (req, res) {
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

        var sql = "SELECT \"PPAISES\".\"IDPAIS\", " +
            "\"PPAISES\".\"PAIS\"  " +
            "FROM " +
            "\"PPAISES\" " +
            "ORDER BY " +
            "\"PPAISES\".\"IDPAIS\" ASC";


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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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





/* GET zonas page. */
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
        title   : 'Detalle de Parametros| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/zonas/editar/:id', function (req, res) {
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

    if(typeof req.params.id === 'undefined' || req.params.id === ''){
        res.redirect('back');
    }

    // Consulto los datos del municipio
    var idZona = req.params.id;
    idZona = idZona.toUpperCase();
    var urlRedirect = '/parametros/zonas';

    var sql = "SELECT  \"PZONAS\".\"IDZONA\",  " +
        "\"PZONAS\".\"ZONA\" " +
        "FROM   \"PZONAS\"   " +
        "WHERE  \"PZONAS\".\"IDZONA\" ='" + idZona + "'";


    oracledb.getConnection({
        user            : process.env.ORACLE_USERNAME,
        password        : process.env.ORACLE_PASSWORD,
        connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err){
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.redirect(urlRedirect + '?error=0');
        }

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
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.redirect(urlRedirect + '?error=12');
                }

                // get the answer
                if(typeof result.metaData === 'undefined' && typeof result.rows === 'undefined'){
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=13');
                } else if(typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function(err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.redirect(urlRedirect + '?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.redirect(urlRedirect + '?error=14');
                } else {
                    if(result.rows[0] == ''){
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.redirect(urlRedirect + '?error=1');
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.redirect(urlRedirect + '?error=15');
                    }
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.redirect(urlRedirect + '?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });

                res.render('dash/tableZonasEdit', {
                    title   : 'Editar zona por detalle | Identico',
                    level   : '../../../',
                    layout  : 'dash',
                    error   : error,
                    data    : result.rows
                });
            }
        );
    });
});

parametersRoutes.get('/parametros/zonas/nuevo', function (req, res) {
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
    res.render('dash/tableZonasSave', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.post('/parametros/zonas/crear/ajax', function (req, res) {
    if(typeof req.body.idzona === 'undefined' || req.body.idzona === '' ||
        typeof req.body.zona === 'undefined' || req.body.zona === ''){
        return res.send({ data : 'Empty values returned. [1]'});

    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "INSERT INTO " +
            "HUELLA.PZONAS " +
            "VALUES  " +
            "('" + req.body.idzona + "', '" + req.body.zona + "')";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });

});

parametersRoutes.post('/parametros/zonas/actualizar/ajax', function (req, res) {
    if(typeof req.body.idzona === 'undefined' || req.body.idzona === '' ||
        typeof req.body.zona === 'undefined' || req.body.zona === ''){
        return res.send({ data : 'Empty values returned. [1]'});

    }

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
            return res.send({ err : 'Error trying to connect with database.' , errCode : 0});
        }

        var sql = "UPDATE HUELLA.PZONAS " +
            "SET " +
            "HUELLA.PZONAS.IDZONA = '" + req.body.idzona + "', " +
            "HUELLA.PZONAS.ZONA = '" + req.body.zona + "' " +

            "WHERE HUELLA.PZONAS.IDZONA = '" + req.body.idzona + "'";

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
                                return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({ err : 'Error doing select statement.'});
                }

                // Login success
                // Create the session
                if(typeof result.rowsAffected === 'undefined' && typeof result.rowsAffected === 'undefined'){
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
                    return res.send({ data : 'Empty values returned. [1]'});
                }

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.send(result);
            }
        );
    });
});

parametersRoutes.get('/parametros/zonas/ajax', function (req, res) {
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

      var sql = "SELECT \"PZONAS\".\"IDZONA\", " +
            "\"PZONAS\".\"ZONA\"  " +
            "FROM " +
            "\"PZONAS\" " +
            "ORDER BY " +
            "\"PZONAS\".\"ZONA\" ASC";

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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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






/* GET usuarios page. */

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
        title   : 'Detalle de Parametros| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});






parametersRoutes.get('/parametros/roles', function (req, res) {
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
    res.render('dash/tableRoles', {
        title   : 'Detalle de Roles| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/roles/new', function (req, res) {
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
    res.render('dash/tableRoles', {
        title   : 'Detalle de Roles| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/roles/edit', function (req, res) {
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
    res.render('dash/tableRolesEdit', {
        title   : 'Editar Parametros| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/parametros/roles/ajax', function (req, res) {
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

        /*   var sql = "SELECT \"PZONAS\".\"IDZONA\", " +
         "\"PZONAS\".\"ZONA\"  " +
         "FROM " +
         "\"PZONAS\" " +
         "ORDER BY " +
         "\"PZONAS\".\"ZONA\" ASC";*/

        var sql = "SELECT \"PROLES\".\"ROL_CODE\", " +
            "\"PROLES\".\"ROL_DESC\"  " +
            "FROM " +
            "\"PROLES\" " +
            "ORDER BY " +
            "\"PROLES\".\"ROL_CODE\" ASC";





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
                    return res.send({ data : 'Empty values returned. [1]'});
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
                    return res.send({ data : 'Empty values returned. [2]'});
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
                        return res.send({ data : 'Empty values returned. [3]'});
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




module.exports = parametersRoutes;