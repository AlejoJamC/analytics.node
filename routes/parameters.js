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

/* GET Index ajax method. */
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
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET departamentos ajax method. */
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

/* GET documentos page. */
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
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET documentos ajax method. */
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

/* GET etnias page. */
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

/* GET etnias ajax method. */
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

/* GET municipios ajax method. */
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

/* GET paises ajax method. */
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
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

/* GET zonas ajax method. */
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
        title   : 'Detalle de Parametos| Identico',
        level   : '../',
        layout  : 'dash',
        error   : error
    });
});

module.exports = parametersRoutes;