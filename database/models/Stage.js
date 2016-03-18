'use strict';

var __debug = require('debug')('forcept:db:models:stage');
var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Stage = sequelize.define('Stage', {
        order: DataTypes.INTEGER,
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: DataTypes.ENUM('basic', 'pharmacy'),
        root: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fields: {
            type: DataTypes.TEXT,
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('fields')
                );
            },
            set: function(val) {
                this.setDataValue('fields', ModelHelper.jsonSetter(val));
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Stage;
};