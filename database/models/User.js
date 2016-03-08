/**
 * forcept - database/models/User.js
 * @author Azuru Technology
 */

import Sequelize from 'sequelize';

export var definition = {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
};

export var settings = {

};
