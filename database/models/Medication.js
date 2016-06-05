'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Medication = sequelize.define('Medication', {
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Medication;
};
