'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('Displays', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            group: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            settings: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            data: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('Displays');
    }
};
