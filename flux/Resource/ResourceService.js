/**
 * forcept - flux/Resource/ResourceService.js
 * @author Azuru Technology
 */

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
            create: function(req, resource, params, body, config, callback) {
                db.Resource.create(body).then(resource => {
                    callback(null, resource, null);
                })
            }

        }
    }
}
