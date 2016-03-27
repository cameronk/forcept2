'use strict';

var __debug = require('debug')('forcept:db:models:stage');
var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Stage = sequelize.define('Stage', {
        order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('basic', 'pharmacy'),
            allowNull: false
        },
        isRoot: {
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
        getterMethods: {
            tableName: function() {
                return 'stage_' + this.id;
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Stage;
};
