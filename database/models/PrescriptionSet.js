'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var PrescriptionSet = sequelize.define('PrescriptionSet', {
        visit: DataTypes.INTEGER,
        patient: DataTypes.INTEGER,
        createdBy: DataTypes.INTEGER,
        prescriptions: {
            type: DataTypes.TEXT,
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('prescriptions')
                );
            },
            set: function(val) {
                this.setDataValue('prescriptions', ModelHelper.jsonSetter(val));
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return PrescriptionSet;
};
