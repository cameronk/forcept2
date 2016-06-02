'use strict';

var __debug = require('debug')('forcept:db:models:Display');
var ModelHelper = require('../helper.js');
var kebabCase = require('lodash/kebabCase');

module.exports = function(sequelize, DataTypes) {
    var Display = sequelize.define('Display', {
        order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        settings: {
            type: DataTypes.TEXT,
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('settings')
                );
            },
            set: function(val) {
                this.setDataValue('settings', ModelHelper.jsonSetter(val));
            }
        },
        data: {
            type: DataTypes.TEXT,
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('data')
                );
            },
            set: function(val) {
                this.setDataValue('data', ModelHelper.jsonSetter(val));
            }
        }
    }, {
        getterMethods: {

        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Display;
};
