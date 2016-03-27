'use strict';
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.TEXT,
        isAdmin: DataTypes.BOOLEAN,
        device: DataTypes.STRING,
        platform: DataTypes.STRING,
        browser: DataTypes.STRING
    }, {
        /**
         * Exclude password from returned attribtues.
         */
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return User;
};
