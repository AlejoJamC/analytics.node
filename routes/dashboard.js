/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var express     = require('express');
var crypto      = require('crypto');
var dashRoutes = express.Router();
var logger      = require('../config/logger').logger;
var multer      = require('multer');
var oracledb    = require('oracledb');
var path        = require('path');

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


/* GET Index page | Dashboard. */
dashRoutes.get('/dashboard', function (req, res) {
    // Basic error validator
    // Session
    if(typeof req.session.userId === 'undefined' || typeof req.session.userId === ''){
        res.redirect('/login');
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

/* GET Images handler page | Dashboard. */
dashRoutes.post('/dashboard/images/capture', function (req, res) {
    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        res.redirect('/dashboard/images?error=12');
    }

});

/* GET Images handler page | Dashboard. */
dashRoutes.post('/dashboard/images/input', upload.single('inputpicture'), function (req, res) {
    if( typeof req.body.personid === 'undefined' || req.body.personid === ''){
        logger.info('Login credentials: Empty values.');
        // error=12 No person Id using image capture.
        res.redirect('/login?error=12');
    }

    //logger.info(req.file);
    //logger.info(req.body);

    var personId = req.body.personid;

    var sql = "UPDATE ANALYTICS.\"NPersonas\" SET ANALYTICS.\"NPersonas\".\"Foto\" = '" +
        req.file.path + "' WHERE ANALYTICS.\"NPersonas\".\"idPersona\" =" + personId;

    logger.info(sql);

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
            res.redirect('/dashboard/images?error=0');
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
                                res.redirect('/dashboard/images?error=1');
                            }
                            logger.info('Connection to Oracle closed successfully!');
                        });
                    // Error doing select statement
                    res.redirect('/dashboard/images?error=12');
                }

                logger.info(result);

                // UPDATE image capture success
                connection.close(
                    function(err) {
                        if (err) {
                            // error=1 trying to disconnect of database
                            logger.error(err.message);
                            res.redirect('/dashboard/images?error=1');
                        }
                        logger.info('Connection to Oracle closed successfully!');
                    });
                res.redirect('/dashboard/images?flag=success');
            }
        );

        // Image route
        //var imgroute =
    });

});


module.exports = dashRoutes;