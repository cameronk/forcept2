/**
 * forcept - database/models/User.js
 * @author Azuru Technology
 */

import Sequelize from 'sequelize';

export var definition = {
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
};

export var settings = {

};
