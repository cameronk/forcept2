'use strict';

var __debug = require('debug')('forcept:db:models:DisplayGroup');
var ModelHelper = require('../helper.js');
var kebabCase = require('lodash/kebabCase');

module.exports = function(sequelize, DataTypes) {
    var DisplayGroup = sequelize.define('DisplayGroup', {
        order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        getterMethods: {
            slug: function() {
                let slug = [ this.id ];
                if(this.name && this.name.length > 0) slug.push(kebabCase(this.name));
                return slug.join("-");
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return DisplayGroup;
};
