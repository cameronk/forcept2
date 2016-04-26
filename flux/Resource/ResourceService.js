/**
 * forcept - flux/Resource/ResourceService.js
 * @author Azuru Technology
 */

var fs = require('fs');

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Console:ResourceService');

export default {
    attach: function(db) {
        return {
            name: 'ResourceService',

            /**
             * Read and return Resources from Resources table.
             */
            read: function(req, resource, params, config, callback) {
                db.Resource.findAll(params).then(resources => {
                    callback(null, resources, null);
                });
            },

            /**
             *
             */
            create: function(req, resource, params, { type, data }, config, callback) {
                db.Resource.create({
                    type: type,
                    uploadedBy: req.user.id
                }).then(resource => {
                    if(!resource) {
                        callback(
                            BuildError('Error creating resource record.', {
                                output: {
                                    message: 'Error creating resource record.'
                                },
                                statusCode: HttpStatus.NOT_FOUND
                            })
                        );
                    } else {
                        var buf = new Buffer(data, 'base64');
                        fs.writeFile(`storage/resources/${resource.id}.jpg`, buf, (err) => {
                            if(err) {
                                callback(err);
                            } else {
                                callback(null, resource, null);
                            }
                        });
                    }
                });
            }

        }
    }
}
