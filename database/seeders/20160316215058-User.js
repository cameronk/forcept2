'use strict';

var pwd = require('password-hash-and-salt');

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
        return pwd('1234').hash(function(err, hash) {
            if(err) throw err;
            console.log(hash);
            return queryInterface.bulkInsert('Users', [
                {
                    username: 'admin',
                    password: hash,
                    admin: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ], {});
        });
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
