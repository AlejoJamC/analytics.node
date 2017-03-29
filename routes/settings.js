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

var express = require('express');
var parametersRoutes = express.Router();
var logger = require('../config/logger').logger;
var oracledb = require('oracledb');


/* GET Afiliados page. */
parametersRoutes.get('/settings/afiliados', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableAfiliados', {
        title: 'Detalle de Parametos| Identico',
        level: '../',
        layout: 'dash',
        page: 'affiliates',
        error: error
    });
});

/* GET Afiliados ajax method. */
parametersRoutes.get('/settings/afiliados/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableAutorizaciones', {
        title: 'Detalle de Parametos| Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET autorizaciones ajax method. */
parametersRoutes.get('/settings/autorizaciones/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tablePersonas', {
        title: 'Detalle de Parametos| Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET personas ajax method. */
parametersRoutes.get('/settings/personas/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    res.render('dash/tableAbreviaturas', {
        title: 'Detalle de Abreviatura | Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

parametersRoutes.get('/settings/abbreviations/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableAbreviaturasEdit', {
            title: 'Detalle de Abreviatura | Identico',
            level: '../',
            layout: 'dash',
            error: error,
            abreviatura: null,
            idabreviatura: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PABREVIATURAS.IDABREVIATURA, HUELLA.PABREVIATURAS.ABREVIATURA " +
            " FROM HUELLA.PABREVIATURAS " +
            " WHERE HUELLA.PABREVIATURAS.IDABREVIATURA ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.value = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableAbreviaturasEdit', {
                    title: 'Editar Abreviatura | Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    abreviatura: data,
                    idabreviatura: verficiarId
                });
            }
        );
    });
});

parametersRoutes.get('/settings/abbreviations/new', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    res.render('dash/tableAbreviaturasNew', {
        title: 'Crear Abreviatura | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

parametersRoutes.get('/settings/abbreviations/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT " +
            " HUELLA.PABREVIATURAS.IDABREVIATURA,  " +
            " HUELLA.PABREVIATURAS.ABREVIATURA  " +
            " FROM  HUELLA.PABREVIATURAS ORDER BY IDABREVIATURA ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PABREVIATURAS.IDABREVIATURA, HUELLA.PABREVIATURAS.ABREVIATURA " +
            " FROM HUELLA.PABREVIATURAS " +
            " WHERE HUELLA.PABREVIATURAS.IDABREVIATURA ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PABREVIATURAS VALUES ('" + id + "' , '" + value + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'La abreviatura: ' + value + ' se creo exitosamente.',
                    idnuevo: id
                });
            }
        );
    });
});

parametersRoutes.put('/settings/abbreviations/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PABREVIATURAS SET HUELLA.PABREVIATURAS.ABREVIATURA = '" + rol + "' WHERE HUELLA.PABREVIATURAS.IDABREVIATURA = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'La abreviatura de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

parametersRoutes.delete('/settings/abbreviations/:id/ajax', function (req, res) {
    var idrol = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'La abreviatura de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET roles list page. */
parametersRoutes.get('/settings/states', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableDepartamentos', {
        title: 'Detalle de Departamentos | Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/states/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableDepartamentos', {
            title: 'Detalle de Departamento | Identico',
            level: '../../',
            layout: 'dash',
            error: error,
            state: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO, HUELLA.PDEPARTAMENTOS.DEPARTAMENTO, HUELLA.PDEPARTAMENTOS.IDPAIS " +
            " FROM HUELLA.PDEPARTAMENTOS " +
            " WHERE HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.departamento = result.rows[0][1];
                data.idpais = result.rows[0][2];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableDepartamentosEdit', {
                    title: 'Editar Parametros | Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    state: data,
                    idstate: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableDepartamentosNew', {
        title: 'Nuevo Departamento | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/states/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT " +
            " HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO," +
            " HUELLA.PDEPARTAMENTOS.DEPARTAMENTO," +
            " HUELLA.PDEPARTAMENTOS.IDPAIS" +
            " FROM" +
            " HUELLA.PDEPARTAMENTOS ORDER BY IDDEPARTAMENTO ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO, HUELLA.PDEPARTAMENTOS.DEPARTAMENTO, HUELLA.PDEPARTAMENTOS.IDPAIS " +
            " FROM HUELLA.PDEPARTAMENTOS " +
            " WHERE HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    var rol = req.body.value;
    var idpais = req.body.idpais;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PDEPARTAMENTOS VALUES ('" + idrol + "' , '" + rol + "' , '" + idpais + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Departamento: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/states/:id/ajax', function (req, res) {
    var id = req.params.id;
    var value = req.body.value;
    var idpais = req.body.idpais;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PDEPARTAMENTOS SET HUELLA.PDEPARTAMENTOS.DEPARTAMENTO = '" + value +
            "', HUELLA.PDEPARTAMENTOS.IDPAIS = '" + idpais +
            "' WHERE HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO = '" + id + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El departamento de Id: ' + id + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/states/:id/ajax', function (req, res) {
    var id = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PDEPARTAMENTOS WHERE HUELLA.PDEPARTAMENTOS.IDDEPARTAMENTO = '" + id + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El departamento de Id: ' + id + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET roles list page. */
parametersRoutes.get('/settings/documents', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableDocumentos', {
        title: 'Detalle de Documentos | Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/documents/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableDocumentos', {
            title: 'Detalle de Afiliado | Identico',
            level: '../../',
            layout: 'dash',
            error: error,
            documento: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PDOCUMENTOS.IDDOCUMENTO, HUELLA.PDOCUMENTOS.DOCUMENTO " +
            " FROM HUELLA.PDOCUMENTOS " +
            " WHERE HUELLA.PDOCUMENTOS.IDDOCUMENTO ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.value = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableDocumentosEdit.hbs', {
                    title: 'Editar Parametros| Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    documento: data,
                    idrol: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableDocumentosNew', {
        title: 'Nuevo documento | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/documents/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT " +
            " HUELLA.PDOCUMENTOS.IDDOCUMENTO, " +
            " HUELLA.PDOCUMENTOS.DOCUMENTO " +
            " FROM " +
            " HUELLA.PDOCUMENTOS ORDER BY IDDOCUMENTO ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PDOCUMENTOS.IDDOCUMENTO, HUELLA.PDOCUMENTOS.DOCUMENTO " +
            " FROM HUELLA.PDOCUMENTOS " +
            " WHERE HUELLA.PDOCUMENTOS.IDDOCUMENTO ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PDOCUMENTOS VALUES ('" + idrol + "' , '" + rol + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Documento: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/documents/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PDOCUMENTOS SET HUELLA.PDOCUMENTOS.DOCUMENTO = '" + rol + "' WHERE HUELLA.PDOCUMENTOS.IDDOCUMENTO = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El documento de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/documents/:id/ajax', function (req, res) {
    var idrol = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PDOCUMENTOS WHERE HUELLA.PDOCUMENTOS.IDDOCUMENTO = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El documento de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET roles list page. */
parametersRoutes.get('/settings/ethnicities', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableEtnias', {
        title: 'Detalle de Etnias| Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/ethnicities/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableEtnias', {
            title: 'Detalle de Etnias | Identico',
            level: '../',
            layout: 'dash',
            error: error,
            etnia: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PETNIAS.IDETNIA, HUELLA.PETNIAS.ETNIA " +
            " FROM HUELLA.PETNIAS " +
            " WHERE HUELLA.PETNIAS.IDETNIA ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.value = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableEtniasEdit', {
                    title: 'Editar Parametros | Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    etnia: data,
                    idetnia: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableEtniasNew.hbs', {
        title: 'Nueva Etnia | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/ethnicities/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT " +
            " HUELLA.PETNIAS.IDETNIA, HUELLA.PETNIAS.ETNIA" +
            " FROM" +
            " HUELLA.PETNIAS";
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PETNIAS.IDETNIA, HUELLA.PETNIAS.ETNIA " +
            " FROM HUELLA.PETNIAS " +
            " WHERE HUELLA.PETNIAS.IDETNIA ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PETNIAS VALUES ('" + idrol + "' , '" + rol + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'La etnia: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/ethnicities/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PETNIAS SET HUELLA.PETNIAS.ETNIA = '" + rol + "' WHERE HUELLA.PETNIAS.IDETNIA = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'La etnia de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/ethnicities/:id/ajax', function (req, res) {
    var idrol = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PETNIAS WHERE HUELLA.PETNIAS.IDETNIA = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'La etnia de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET roles list page. */
parametersRoutes.get('/settings/cities', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableMunicipios', {
        title: 'Detalle de Municipios | Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/cities/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableMunicipios.hbs', {
            title: 'Detalle de Municipio | Identico',
            level: '../',
            layout: 'dash',
            error: error,
            municipio: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PMUNICIPIOS.IDMUNICIPIO, HUELLA.PMUNICIPIOS.IDDEPARTAMENTO, HUELLA.PMUNICIPIOS.MUNICIPIO " +
            " FROM HUELLA.PMUNICIPIOS " +
            " WHERE HUELLA.PMUNICIPIOS.IDMUNICIPIO ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableMunicipiosEdit', {
                    title: 'Editar Parametros| Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    municipio: data,
                    idrol: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableMunicipiosNew', {
        title: 'Nuevo Ciudad | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/cities/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT " +
            " HUELLA.PMUNICIPIOS.IDMUNICIPIO, " +
            " HUELLA.PMUNICIPIOS.IDDEPARTAMENTO, " +
            "HUELLA.PMUNICIPIOS.MUNICIPIO " +
            "FROM " +
            "HUELLA.PMUNICIPIOS ORDER BY IDMUNICIPIO ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PMUNICIPIOS.IDMUNICIPIO, HUELLA.PMUNICIPIOS.IDDEPARTAMENTO, HUELLA.PMUNICIPIOS.MUNICIPIO " +
            " FROM HUELLA.PMUNICIPIOS " +
            " WHERE HUELLA.PMUNICIPIOS.IDMUNICIPIO ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    var iddepartamento = req.body.iddepartamento;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PMUNICIPIOS VALUES ('" + idrol + "' , '" + iddepartamento + "' , '" + rol + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El municipio: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/cities/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var iddepartamento = req.params.iddepartamento;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PMUNICIPIOS SET HUELLA.PMUNICIPIOS.IDDEPARTAMENTO = '" + iddepartamento
            + "', HUELLA.PMUNICIPIOS.MUNICIPIO = '" + rol + "' WHERE HUELLA.PMUNICIPIOS.IDMUNICIPIO = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El municipio de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/cities/:id/ajax', function (req, res) {
    var idrol = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PMUNICIPIOS WHERE HUELLA.PMUNICIPIOS.IDMUNICIPIO = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El municipio de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET roles list page. */
parametersRoutes.get('/settings/countries', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tablePaises', {
        title: 'Detalle de Paises | Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/countries/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tablePaises', {
            title: 'Detalle de Afiliado | Identico',
            level: '../',
            layout: 'dash',
            error: error,
            pais: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PPAISES.IDPAIS, HUELLA.PPAISES.PAIS " +
            " FROM HUELLA.PPAISES " +
            " WHERE HUELLA.PPAISES.IDPAIS ='" + verficiarId.toUpperCase() + "' ORDER BY IDPAIS ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.value = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title: 'Editar Parametros| Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    pais: data,
                    idrol: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tablePaisesNew', {
        title: 'Nuevo Pais | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/countries/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT" +
            " HUELLA.PPAISES.IDPAIS, " +
            " HUELLA.PPAISES.PAIS " +
            " FROM " +
            " HUELLA.PPAISES ORDER BY IDPAIS ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PPAISES.IDPAIS, HUELLA.PPAISES.PAIS " +
            " FROM HUELLA.PPAISES " +
            " WHERE HUELLA.PPAISES.IDPAIS ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PPAISES VALUES ('" + idrol + "' , '" + rol + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El pais: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/countries/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PPAISES SET HUELLA.PPAISES.PAIS = '" + rol + "' WHERE HUELLA.PPAISES.IDPAIS = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El pais de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/countries/:id/ajax', function (req, res) {
    var idrol = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PPAISES WHERE HUELLA.PPAISES.IDPAIS = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'El pais de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET roles list page. */
parametersRoutes.get('/settings/roles', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableRoles', {
        title: 'Detalle de Roles| Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/roles/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableRoles', {
            title: 'Detalle de Afiliado | Identico',
            level: '../',
            layout: 'dash',
            error: error,
            rol: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title: 'Editar Parametros| Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    rol: data,
                    idrol: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableRolesNew', {
        title: 'Nuevo Rol | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/roles/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT \"PROLES\".\"ROL_CODE\", " +
            "\"PROLES\".\"ROL_DESC\"  " +
            "FROM " +
            "\"PROLES\" " +
            "ORDER BY " +
            "\"PROLES\".\"ROL_CODE\" ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PROLES.ROL_CODE, HUELLA.PROLES.ROL_DESC " +
            " FROM HUELLA.PROLES " +
            " WHERE HUELLA.PROLES.ROL_CODE ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PROLES VALUES ('" + idrol + "' , '" + rol + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'El Rol: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PROLES SET HUELLA.PROLES.ROL_DESC = '" + rol + "' WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PROLES WHERE HUELLA.PROLES.ROL_CODE = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableZonas', {
        title: 'Detalle de Zonas| Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

/* GET update rol page. */
parametersRoutes.get('/settings/zones/:id', function (req, res, next) {
    if (req.params.id === 'new' || req.params.id === 'ajax' || req.params.id === 'check') {
        next();
        return;
    }
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
        logger.error(error);
        return res.render('dash/tableZonas', {
            title: 'Detalle de Zonas | Identico',
            level: '../',
            layout: 'dash',
            error: error,
            zona: null,
            idrol: req.params.id
        });
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }

    // Rol by id
    var verficiarId = req.params.id;

    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PZONAS.IDZONA, HUELLA.PZONAS.ZONA " +
            " FROM HUELLA.PZONAS " +
            " WHERE HUELLA.PZONAS.IDZONA ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = {};
                data.id = result.rows[0][0];
                data.descripcion = result.rows[0][1];

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.render('dash/tableRolesEdit', {
                    title: 'Editar Parametros| Identico',
                    level: '../../',
                    layout: 'dash',
                    error: error,
                    zona: data,
                    idrol: verficiarId
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
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableZonasNew', {
        title: 'Nuevo Zona | Identico',
        level: '../../',
        layout: 'dash',
        error: error
    });
});

/* GET roles list by ajax. */
parametersRoutes.get('/settings/zones/ajax', function (req, res) {
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT " +
            " HUELLA.PZONAS.IDZONA, " +
            " HUELLA.PZONAS.ZONA " +
            " FROM HUELLA.PZONAS ORDER BY IDZONA ASC";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "SELECT HUELLA.PZONAS.IDZONA, HUELLA.PZONAS.ZONA " +
            " FROM HUELLA.PZONAS " +
            " WHERE HUELLA.PZONAS.IDZONA ='" + verficiarId.toUpperCase() + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Query success
                // Create the session
                if (typeof result.metaData === 'undefined' && typeof result.rows === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 1, data: 'Empty values returned. [1]'});
                } else if (typeof result.rows[0] === 'undefined') {
                    logger.info('Validation error, empty values returned.');
                    connection.close(
                        function (err) {
                            if (err) {
                                // error=1 trying to disconnect of database
                                logger.error(err.message);
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    return res.send({code: 2, data: 'Empty values returned. [2]'});
                } else {
                    if (result.rows[0] == '') {
                        logger.info('Error trying to validate user credentials');
                        connection.close(
                            function (err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return res.send({err: 'trying to disconnect of database.', errCode: 1});
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return res.send({code: 3, data: 'Empty values returned. [3]'});
                    }
                }

                var data = result;

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
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
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "INSERT INTO HUELLA.PZONAS VALUES ('" + idrol + "' , '" + rol + "')";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({
                    message: 'La zona: ' + rol + ' se creo exitosamente.',
                    idnuevo: idrol
                });
            }
        );
    });
});

/* PUT update arol by ajax. */
parametersRoutes.put('/settings/zones/:id/ajax', function (req, res) {
    var idrol = req.params.id;
    var rol = req.body.value;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "UPDATE HUELLA.PZONAS SET HUELLA.PZONAS.ZONA = '" + rol + "' WHERE HUELLA.PZONAS.IDZONA = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'La zona de Id: ' + idrol + ' fue actualizado exitosamente.'});
            }
        );
    });
});

/* DELETE a rol by id using ajax. */
parametersRoutes.delete('/settings/zones/:id/ajax', function (req, res) {
    var idrol = req.params.id;

    oracledb.autoCommit = true;
    oracledb.getConnection({
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
        + '/' + process.env.ORACLE_SID
    }, function (err, connection) {
        if (err) {
            logger.error(err.message);
            // error=0 trying to connect with database
            return res.send({err: 'Error trying to connect with database.', errCode: 0});
        }

        var sql = "DELETE FROM HUELLA.PZONAS WHERE HUELLA.PZONAS.IDZONA = '" + idrol + "'";

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
                                return res.send({err: 'trying to disconnect of database.', errCode: 1});
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    return res.send({err: 'Error doing select statement.'});
                }

                // Insert success
                //logger.info(result);

                connection.close(
                    function (err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            return res.send({err: 'trying to disconnect of database.', errCode: 1});
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                return res.json({message: 'La zona de Id: ' + idrol + ' fue eliminado exitosamente.'});
            }
        );
    });
});


/* GET usuarios page. */
parametersRoutes.get('/settings/usuarios', function (req, res) {
    var error = '';
    // Basic error validator
    // Error
    if (typeof req.query.error !== 'undefined') {
        error = req.query.error;
    }
    // Session
    if (typeof req.session.userId === 'undefined' || typeof req.session.userId === '') {
        return res.redirect('/login');
    }
    // User Rol
    // If ............
    res.render('dash/tableUsuarios', {
        title: 'Detalle de Parametros| Identico',
        level: '../',
        layout: 'dash',
        error: error
    });
});

module.exports = parametersRoutes;