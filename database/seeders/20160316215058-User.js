'use strict';

const SHA256 = require('crypto').createHash("sha256");

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkInsert('Person', [{
            name: 'John Doe',
            isBetaMember: false
        }], {});
        */
        return queryInterface.bulkInsert('Users', [
            {
                username: 'admin',
                password: SHA256.update('1234').digest('hex'),
                isAdmin: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ], {});
    },

    down: function (queryInterface, Sequelize) {
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkDelete('Person', null, {});
        */
        return queryInterface.bulkDelete('Users', null, {});
    }
};
