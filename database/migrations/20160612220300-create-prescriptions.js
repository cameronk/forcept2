'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('Prescriptions', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            setID: {
                type: Sequelize.INTEGER
            },
            quantityID: {
                type: Sequelize.INTEGER
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            completed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdBy: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable('Prescriptions');
    }
};
