/**
 * forcept - flux/Auth/AuthService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';

const __debug = require('debug')('forcept:flux:Auth:service')

export default {
    attach: function(models) {
        return {
            name: 'AuthService',
            create: function(req, resource, params, body, config, callback) {
                __debug("[read]: Attempting to login '%s'", params.username);

                models.User.findOne({
                    where: {
                        username: params.username,
                        password: require('crypto').createHash("sha256").update(params.password).digest('hex')
                    }
                }).then(user => {

                    if(!user) {
                        __debug("[read]: => login failed! user not found");
                        callback(
                            BuildError('Unable to locate matching credentials.', {
                                output: {
                                    identifier: "errors.auth.credentialMismatch"
                                },
                                statusCode: HttpStatus.UNAUTHORIZED
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
            },
            delete: function(req, resource, params, config, callback) {
                req.logout();
                return callback(null, true, null);
            }
        }
    }
}
