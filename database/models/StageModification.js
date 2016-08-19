'use strict';
module.exports = function(sequelize, DataTypes) {
    var StageModification = sequelize.define('StageModification', {
        stage: DataTypes.INTEGER,
        by: DataTypes.INTEGER,
        type: DataTypes.ENUM('addition', 'deletion'),
        columnKey: DataTypes.STRING,
        columnDestination: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return StageModification;
};
