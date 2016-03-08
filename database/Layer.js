/**
 * forcept - database/Layer.js
 * @author Azuru Technology
 */

import Sequelize from 'sequelize';

import * as User from './models/User';

const sequelize = new Sequelize(undefined, undefined, undefined, {
    username: null,
    password: null,
    database: 'forcept',
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'storage/forcept.db'
});

const models = {
    'User': sequelize.define('User', User.definition, User.settings)
};

export default {
    sequelize: sequelize,
    models: models
};
