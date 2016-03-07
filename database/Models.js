/**
 * forcept - Models.js
 * @author Azuru Technology
 */

import Sequelize from 'sequelize';

import { * as User } from './models/User';

const sequelize = new Sequelize("forcept", {
    dialect: 'sqlite3',
    storage: '../storage/forcept.db'
});

const models = {
    'User': sequelize.define(User.definition, User.settings)
};
