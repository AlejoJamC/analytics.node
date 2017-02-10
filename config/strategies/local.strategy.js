var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var oracledb        = require('oracledb');

module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password'
    },
        function (username, password, callback) {
            oracledb.getConnection({
                user            : process.env.ORACLE_USERNAME,
                password        : process.env.ORACLE_PASSWORD,
                connectString   : process.env.ORACLE_HOST + ':' + process.env.ORACLE_PORT
                + '/' + process.env.ORACLE_SID
            }, function (err, connection) {
                if (err){
                    logger.error(err.message);
                    // error=0 trying to connect with database
                    return callback(err);
                }

                // Login credentidas

                var sql = "SELECT HUELLA.\"USUARIOS\".\"idUsuario\", HUELLA.\"USUARIOS\".\"nombre\", " +
                    " HUELLA.\"USUARIOS\".\"usuario\", HUELLA.\"USUARIOS\".\"password\" " +
                    " FROM HUELLA.\"USUARIOS\" " +
                    " WHERE \"USUARIOS\".\"usuario\" ='"+ username +"' AND \"USUARIOS\".\"password\" ='" +  password + "'";

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
                                        return callback(err.message);
                                    }
                                    logger.info('Connection to Oracle closed successfully!');
                                });
                            // Error doing select statement
                            return callback(err);
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
                                        return callback(err.message);
                                    }
                                    logger.info('Connection to Oracle closed successfully!');
                                });
                            return callback('Empty values returned. [1]');
                        } else if(typeof result.rows[0] === 'undefined') {
                            logger.info('Validation error, empty values returned.');
                            connection.close(
                                function(err) {
                                    if (err) {
                                        // error=1 trying to disconnect of database
                                        logger.error(err.message);
                                        return callback(err.message);
                                    }
                                    logger.info('Connection to Oracle closed successfully!');
                                });
                            return callback('Empty values returned. [2]');
                        } else {
                            if(result.rows[0] == ''){
                                logger.info('Error trying to validate user credentials');
                                connection.close(
                                    function(err) {
                                        if (err) {
                                            // error=1 trying to disconnect of database
                                            logger.error(err.message);
                                            return callback(err.message);
                                        }
                                        logger.info('Connection to Oracle closed successfully!');
                                    });
                                return callback('Empty values returned. [3]');
                            }
                        }

                        var user = {
                            'userId' : result.rows[0][0],
                            'userFullName' : result.rows[0][1]
                        };

                        connection.close(
                            function(err) {
                                if (err) {
                                    // error=1 trying to disconnect of database
                                    logger.error(err.message);
                                    return callback(err.message);
                                }
                                logger.info('Connection to Oracle closed successfully!');
                            });
                        return callback(null, user);
                    }
                );
            });
        }
    ));
};