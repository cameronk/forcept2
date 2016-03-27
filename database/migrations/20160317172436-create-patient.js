'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('stage_1', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            birthday: {
                type: Sequelize.STRING
            },
            photo: {
                type: Sequelize.TEXT
            },
            currentVisit: {
                type: Sequelize.INTEGER
            },
            visits: {
                type: Sequelize.TEXT
            },
            createdBy: {
                type: Sequelize.INTEGER
            },
            lastModifiedBy: {
                type: Sequelize.INTEGER
            },
            concrete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        return queryInterface.dropTable('stage_1');
    }
};
