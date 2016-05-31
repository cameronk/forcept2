'use strict';

var __debug = require('debug')('forcept:db:models:Visit');
var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Visit = sequelize.define('Visit', {
        patients: {
            type: DataTypes.TEXT,
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('patients')
                );
            },
            set: function(val) {
                this.setDataValue('patients', ModelHelper.jsonSetter(val));
            }
        },
        stage: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Visit;
};
