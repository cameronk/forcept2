'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var PrescriptionSet = sequelize.define('PrescriptionSet', {
        visit: DataTypes.INTEGER,
        patient: DataTypes.INTEGER,
        createdBy: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.PrescriptionSet.hasMany(models.Prescription, {
                    as: 'prescriptions',
                    foreignKey: 'setID'
                });
            }
        }
    });
    return PrescriptionSet;
};
