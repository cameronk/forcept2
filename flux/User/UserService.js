/*
 * forcept - flux/User/UserService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
import crypto from 'crypto';
import debug from 'debug';

const SHA256 = crypto.createHash('sha256');
const __debug = debug('forcept:flux:User:UserService')

export default {
    attach: function(db) {
        return {
            name: 'UserService',

            /**
             * Read and return Users from Users table.
             */
            read: function(req, resource, params, config, callback) {
                db.User.findAll(params).then(users => {
                    callback(null, users, null);
                });
            },

            /**
             *
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new user, '%s'.", body.username || "unnamed");

                /*
                 * Create patient record.
                 */
                db.User.create({
                    username: body.username,
                    password: SHA256.update(body.password).digest('hex')
                }).then(user => {
                    __debug("[create]: User created.");
                    callback(null, user, null);
                }).catch(err => {
                    __debug("[create]: ERROR:");
                    __debug(err);
                    callback(err);
                });

            },

            /**
             *
             */
            delete: function(req, resource, params, body, config, callback) {
                __debug("[delete]: ");
                
            }

        }
    }
}
