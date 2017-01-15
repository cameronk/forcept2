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

                var record = {
                    username: body.username,
                    password: SHA256.update(body.password).digest('hex')
                };

                if(body.isAdmin) {
                    record.isAdmin = true;
                };

                /*
                 * Create patient record.
                 */
                db.User.create(record).then(user => {
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
            delete: function(req, resource, params, config, callback) {
                __debug("[delete]: deleting user %s", params.id);
                db.User.findOne({
                    where: {
                        id: params.id
                    }
                }).then(user => {
                    if(user) {
                        user.destroy()
                            .then(() => {
                                callback(null, params.id, null);
                            });
                    } else {
                        callback(
                            BuildError(`User ${params.id} not found.`, {
                                output: {
                                    message: `User ${params.id} not found.`
                                },
                                statusCode: HttpStatus.NOT_FOUND
                            })
                        );
                    }
                }).catch(err => {
                    __debug("[delete]: ERROR:");
                    __debug(err);
                    callback(err);
                });
            }

        }
    }
}
