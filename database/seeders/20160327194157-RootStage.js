'use strict';

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
        return queryInterface.bulkInsert('Stages', [
            {
                id: 1,
                order: 1,
                name: "Check in",
                type: "basic",
                isRoot: true,
                fields: JSON.stringify({
                    "firstName": {
                        "name": "First name",
                        "type": "text",
                        "mutable": false,
                        "settings": "",
                        "description": ""
                    },
                    "lastName": {
                        "name": "Last name",
                        "type": "text",
                        "mutable": false,
                        "settings": "",
                        "description": ""
                    },
                    "birthday": {
                        "name": "Birthday",
                        "type": "date",
                        "mutable": false,
                        "settings": {
                            "useBroadMonthSelector": false
                        },
                        "description": ""
                    },
                    "photo": {
                        "name": "Photo",
                        "type": "file",
                        "mutable": "false",
                        "settings": {
                            "accept": [
                                "image/*"
                            ]
                        },
                        "description": ""
                    },
                    "priority": {
                        "name": "Priority",
                        "type": "select",
                        "mutable": false,
                        "settings": {
                            "options": {
                                "1452365165801": {
                                    "value": "Normal"
                                },
                                "1452365166192": {
                                    "value": "High"
                                },
                                "1452365166656": {
                                    "value": "Urgent"
                                }
                            },
                            "customizable": "false"
                        },
                        "description": ""
                    },
                }),
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
        // return queryInterface.bulkDelete('Person', null, {});
    }
};
