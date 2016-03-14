/**
 * forcept - database/Layer.js
 * @author Azuru Technology
 */

/// Packages
import Sequelize from 'sequelize';
import fs from 'fs';

/// Models
import * as User from './models/User';

/*
 * Check if ./storage/ directory exists.
 * (Run synchronously to block Sequelize instantiation before dir is made)
 */
const storagePath = './storage';
if(!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
}

/// Instantiate Sequelize
const sequelize = new Sequelize(undefined, undefined, undefined, {
    username: null,
    password: null,
    database: 'forcept',
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'storage/forcept.db'
});

const models = {
    User: sequelize.define('User', User.definition, User.settings)
};

export default {
    sequelize: sequelize,
    models: models
};
