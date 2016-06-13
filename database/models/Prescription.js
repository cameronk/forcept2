'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Prescription = sequelize.define('Prescription', {
        setID: DataTypes.INTEGER,
        quantityID: DataTypes.INTEGER,
        amount: {
            type: DataTpes.INTEGER,
            defaultValue: 1,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdBy: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Prescription;
};
