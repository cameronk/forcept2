/**
 * forcept - flux/Auth/AuthService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';

const __debug = require('debug')('forcept:flux:Auth:service');

export default {
    attach: function(models) {
        return {
            name: 'AuthService',
            read: function(req, resource, params, config, callback) {
                __debug("[read]: Attempting to login '%s'", params.username);

                models.User.findOne({
                    where: {
                        username: params.username,
                        password: params.password
                    }
                }).then(user => {

                    if(!user) {
                        __debug("[read]: => login failed! user not found");
                        callback(
                            BuildError('Unable to locate matching credentials.', {
                                statusCode: HttpStatus.UNAUTHORIZED,
                            })
                        );
                        return;
                    }

                    __debug("[read]: => user found!");

                    req.logIn(user, err => {
                        if(err) {
                            __debug("[read]: ERROR: passport returned err");
                            callback(err, null, null);
                            return;
                        }
                        __debug("[read]: request login seems to have succeeded.");
                        callback(null, user, null);
                    });
                });
            }
        }
    }
}