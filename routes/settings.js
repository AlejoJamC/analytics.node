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
parametersRoutes.get('/settings/afiliados', function (req, res) {
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
parametersRoutes.get('/settings/afiliados/ajax', function (req, res) {
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
parametersRoutes.get('/settings/autorizaciones', function (req, res) {
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
parametersRoutes.get('/settings/autorizaciones/ajax', function (req, res) {
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
parametersRoutes.get('/settings/personas', function (req, res) {
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
parametersRoutes.get('/settings/personas/ajax', function (req, res) {
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








parametersRoutes.get('/settings/abbreviations', function (req, res) {
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

parametersRoutes.get('/settings/abbreviations/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableAbreviaturas', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            abreviaturas : null,
            idabreviatura : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PABREVIATURAS.IDABREVIATURA, HUELLA.PABREVIATURAS.ABREVIATURA " +
            " FROM HUELLA.PABREVIATURAS " +
            " WHERE HUELLA.PABREVIATURAS.IDABREVIATURA ='" + verficiarId.toUpperCase() + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.value = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableAbreviaturasEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    abreviaturas : data,
                    idabreviatura : verficiarId
                });
            }
        );
    });
});

parametersRoutes.get('/settings/abbreviations/new', function (req, res) {
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
    res.render('dash/tableAbreviaturasNew', {
        title   : 'Crear Parametro| Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

parametersRoutes.get('/settings/abbreviations/ajax', function (req, res) {
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

parametersRoutes.get('/settings/abbreviations/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PABREVIATURAS.IDABREVIATURA, HUELLA.PABREVIATURAS.ABREVIATURA " +
            " FROM HUELLA.PABREVIATURAS " +
            " WHERE HUELLA.PABREVIATURAS.IDABREVIATURA ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

parametersRoutes.post('/settings/abbreviations/ajax', function (req, res) {
    var id = req.body.id;
    var value = req.body.value;

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

        var sql = "INSERT INTO HUELLA.PABREVIATURAS VALUES ('" + id + "' , '" + value + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + value + ' se creo exitosamente.',
                    idnuevo : id
                });
            }
        );
    });
});

parametersRoutes.put('/settings/abbreviations/:id/ajax', function (req, res) {
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
    var urlRedirect = '/settings/abbreviations';
    var sql = "SELECT  \"Pabbreviations\".\"IDABREVIATURA\",  " +
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

parametersRoutes.delete('/settings/abbreviations/:id/ajax', function (req, res) {
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









/* GET roles list page. */
parametersRoutes.get('/settings/states', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/states/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/states/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/states/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/states/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/states/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/states/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/states/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

/* GET departamentos page. */
parametersRoutes.get('/settings/states', function (req, res) {
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

parametersRoutes.get('/settings/states/editar/:id', function (req, res) {
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
    var urlRedirect = '/settings/departamentos';

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

parametersRoutes.get('/settings/states/nuevo', function (req, res) {
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

parametersRoutes.post('/settings/departamentos/crear/ajax', function (req, res) {
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

parametersRoutes.post('/settings/departamentos/actualizar/ajax', function (req, res) {
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

parametersRoutes.get('/settings/departamentos/ajax', function (req, res) {
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









/* GET roles list page. */
parametersRoutes.get('/settings/documents', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/documents/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/documents/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/documents/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/documents/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/documents/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/documents/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/documents/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

/* GET Documentos page. */
parametersRoutes.get('/settings/documentos', function (req, res) {
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

parametersRoutes.get('/settings/documentos/editar/:id', function (req, res) {
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
    var urlRedirect = '/settings/documentos';

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

parametersRoutes.get('/settings/documentos/nuevo', function (req, res) {
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

parametersRoutes.post('/settings/documentos/crear/ajax', function (req, res) {
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

parametersRoutes.post('/settings/documentos/actualizar/ajax', function (req, res) {
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

parametersRoutes.get('/settings/documentos/ajax', function (req, res) {
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







/* GET roles list page. */
parametersRoutes.get('/settings/ethnicities', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/ethnicities/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/ethnicities/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/ethnicities/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/ethnicities/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/ethnicities/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/ethnicities/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/ethnicities/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

/* GET Etnias page. */
parametersRoutes.get('/settings/etnias', function (req, res) {
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

parametersRoutes.get('/settings/etnias/editar/:id', function (req, res) {
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
    var urlRedirect = '/settings/etnias';

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

parametersRoutes.get('/settings/etnias/nuevo', function (req, res) {
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

parametersRoutes.post('/settings/etnias/crear/ajax', function (req, res) {
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

parametersRoutes.post('/settings/etnias/actualizar/ajax', function (req, res) {
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

parametersRoutes.get('/settings/etnias/ajax', function (req, res) {
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






/* GET roles list page. */
parametersRoutes.get('/settings/cities', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/cities/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/cities/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/cities/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/cities/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/cities/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/cities/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/cities/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

/* GET municipios page. */
parametersRoutes.get('/settings/municipios', function (req, res) {
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

parametersRoutes.get('/settings/municipios/editar/:id', function (req, res) {
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
    var urlRedirect = '/settings/municipios';

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

parametersRoutes.get('/settings/municipios/nuevo', function (req, res) {
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

parametersRoutes.post('/settings/municipios/crear/ajax', function (req, res) {
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

parametersRoutes.post('/settings/municipios/actualizar/ajax', function (req, res) {
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

parametersRoutes.get('/settings/municipios/ajax', function (req, res) {
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







/* GET roles list page. */
parametersRoutes.get('/settings/countries', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/countries/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/countries/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/countries/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/countries/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/countries/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/countries/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/countries/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

/* GET paises page. */
parametersRoutes.get('/settings/paises', function (req, res) {
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

parametersRoutes.get('/settings/paises/editar/:id', function (req, res) {
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
    var urlRedirect = '/settings/paises';

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

parametersRoutes.get('/settings/paises/nuevo', function (req, res) {
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

parametersRoutes.post('/settings/paises/crear/ajax', function (req, res) {
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

parametersRoutes.post('/settings/paises/actualizar/ajax', function (req, res) {
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

parametersRoutes.get('/settings/paises/ajax', function (req, res) {
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

















/* GET roles list page. */
parametersRoutes.get('/settings/roles', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/roles/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/roles/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/roles/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/roles/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/roles/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/roles/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/roles/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

















/* GET roles list page. */
parametersRoutes.get('/settings/zones', function (req, res) {
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

/* GET update rol page. */
parametersRoutes.get('/settings/zones/:id', function (req, res, next) {
    if(req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check'){
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if(typeof req.query.error !== 'undefined'){
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title   : 'Detalle de Afiliado | Identico',
            level   : '../',
            layout  : 'dash',
            error   : error,
            rol     : null,
            idrol   : req.params.id
        });
    }
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title   : 'Editar Parametros| Identico',
                    level   : '../../',
                    layout  : 'dash',
                    error   : error,
                    rol     : data,
                    idrol   : verficiarId
                });
            }
        );
    });
});

/* GET create new rol page. */
parametersRoutes.get('/settings/zones/new', function (req, res) {
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
    res.render('dash/tableRolesNew', {
        title   : 'Nuevo Rol | Identico',
        level   : '../../',
        layout  : 'dash',
        error   : error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/zones/ajax', function (req, res) {
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

/* GET check if exists by ajax. */
parametersRoutes.get('/settings/zones/check/:id/ajax', function (req, res) {
    var verficiarId = req.params.id;
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

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId + "'";

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

                // Query success
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
                    return res.send({ code: 1, data : 'Empty values returned. [1]'});
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
                    return res.send({ code: 2,  data : 'Empty values returned. [2]'});
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
                        return res.send({ code: 3, data : 'Empty values returned. [3]'});
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

/* POST create new rol by ajax. */
parametersRoutes.post('/settings/zones/ajax', function (req, res) {
    var idrol = req.body.id;
    var rol = req.body.rol;

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

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo : idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/zones/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.rol;

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

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/zones/:id/ajax', function (req, res) {
    var idrol = req.params.id;

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

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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

                // Insert success
                //logger.info(result);

                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({ err : 'trying to disconnect of database.' , errCode : 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El rol de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});

/* GET zonas page. */
parametersRoutes.get('/settings/zonas', function (req, res) {
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

parametersRoutes.get('/settings/zonas/editar/:id', function (req, res) {
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
    var urlRedirect = '/settings/zonas';

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

parametersRoutes.get('/settings/zonas/nuevo', function (req, res) {
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

parametersRoutes.post('/settings/zonas/crear/ajax', function (req, res) {
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

parametersRoutes.post('/settings/zonas/actualizar/ajax', function (req, res) {
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

parametersRoutes.get('/settings/zonas/ajax', function (req, res) {
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
parametersRoutes.get('/settings/usuarios', function (req, res) {
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

module.exports = parametersRoutes;