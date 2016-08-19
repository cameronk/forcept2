'use strict';
module.exports = function(sequelize, DataTypes) {
    var Resource = sequelize.define('Resource', {
        type: DataTypes.STRING,
        data: DataTypes.TEXT,
        isReferenced: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        uploadedBy: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Resource;
};
