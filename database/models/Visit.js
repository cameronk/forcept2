'use strict';
module.exports = function(sequelize, DataTypes) {
    var Visit = sequelize.define('Visit', {
        patients: {
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
