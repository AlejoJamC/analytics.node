/**
 * Copyright (c) 2017-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var logger = require('../config/logger').logger;
var oracledb = require('oracledb');

module.exports.postFingeprint = function (req, res) {
    // Save the fingerprint by user
    res.json({ data : 'Guardar huella'});
};

module.exports.getFingerprint = function (req, res) {
    // Verify the byte array with the stored
    res.json({ data : 'obtener huella'});
};