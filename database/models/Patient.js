'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
    var Patient = sequelize.define('Patient', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthday: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photo: {
            type: DataTypes.TEXT,
            allowNull: true,
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('photo')
                );
            },
            set: function(val) {
                this.setDataValue('photo', ModelHelper.jsonSetter(val));
            }
        },
        currentVisit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        visits: {
            type: DataTypes.TEXT,
            defaultValue: "[]",
            get: function() {
                return ModelHelper.jsonGetter(
                    this.getDataValue('visits')
                );
            },
            set: function(val) {
                this.setDataValue('visits', ModelHelper.jsonSetter(val));
            }
        },
        createdBy: DataTypes.INTEGER,
        lastModifiedBy: DataTypes.INTEGER,
        concrete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
        tableName: 'stage_1',
        getterMethods: {
            fullName: function() {
                let name = [];
                if(this.firstName) name.push(this.firstName);
                if(this.lastName)  name.push(this.lastName);

                return name.join(" ");
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Patient;
};
