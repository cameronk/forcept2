'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var MedQuantity = sequelize.define('MedQuantity', {
        medicatin: DataTypes.INTEGER,
        name: DataTypes.STRING,
        quantity: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return MedQuantity;
};
