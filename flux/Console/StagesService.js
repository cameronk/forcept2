/**
 * forcept - flux/Console/StagesService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';

const __debug = require('debug')('forcept:flux:Console:StagesService')

export default {
    attach: function(models) {
        return {
            name: 'ConsoleStagesService',
            create: function(req, resource, params, body, config, callback) {

            },

            /**
             * Read and return stages from Stages table.
             */
            read: function(req, resource, params, config, callback) {
                models.Stage.findAll({
                    where: params || {},
                    // attributes: ['id', 'name'],
                    order: ['order']
                }).then(stages => {
                    callback(null, stages, null);
                });
            },

            delete: function(req, resource, params, config, callback) {
                req.logout();
                return callback(null, true, null);
            }
        }
    }
}
