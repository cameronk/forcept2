'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('StageModifications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            stage: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            by: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('addition', 'deletion')
            },
            columnKey: {
                type: Sequelize.STRING
            },
            columnDestination: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('StageModifications');
    }
};
