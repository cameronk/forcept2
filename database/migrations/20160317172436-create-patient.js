'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('Patients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            /*
             * Immutable fields in root stage
             */
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
            priority: {
                type: Sequelize.STRING
            },

            /*
             * Meta
             */
            currentVisit: {
                type: Sequelize.INTEGER
            },
            visits: {
                type: Sequelize.TEXT
            },
            concrete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdBy: {
                type: Sequelize.INTEGER
            },
            lastModifiedBy: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable('Patients');
    }
};
