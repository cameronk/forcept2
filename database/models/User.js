/**
 * forcept - database/models/User.js
 * @author Azuru Technology
 */

import Sequelize from 'sequelize';

export var definition = {
    firstName: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'last_name'
    }
};

export var settings = {

};
