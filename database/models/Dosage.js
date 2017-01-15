'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Dosage = sequelize.define('Dosage', {
        medication: DataTypes.INTEGER,
        name: DataTypes.STRING,
        available: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                (models.Dosage).belongsTo(models.Medication, {
                    as: 'dosage',
                    foreignKey: 'medication',
                    targetKey: 'id',
                });
            }
        }
    });
    return Dosage;
};
