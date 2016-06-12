'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var MedQuantity = sequelize.define('MedQuantity', {
        medication: DataTypes.INTEGER,
        name: DataTypes.STRING,
        available: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                (models.MedQuantity).belongsTo(models.Medication, {
                    as: 'quantity',
                    foreignKey: 'medication',
                    targetKey: 'id',
                });
            }
        }
    });
    return MedQuantity;
};
