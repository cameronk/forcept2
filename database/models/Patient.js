'use strict';

var ModelHelper = require('../helper.js');

module.exports = function(sequelize, DataTypes) {
  var Patient = sequelize.define('Patient', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    birthday: DataTypes.STRING,
    photo: {
        type: DataTypes.TEXT,
        get: function() {
            return ModelHelper.jsonGetter(
                this.getDataValue('photo')
            );
        },
        set: function(val) {
            this.setDataValue('photo', ModelHelper.jsonSetter(val));
        }
    },
    currentVisit: DataTypes.INTEGER,
    visits: {
        type: DataTypes.TEXT,
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
    concrete: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Patient;
};
