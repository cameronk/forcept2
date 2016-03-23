/**
 * forcept - flux/Stage/StageService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';

const __debug = require('debug')('forcept:flux:Console:StagesService')

export default {
    attach: function(models) {
        return {
            name: 'StageService',

            /**
             * Read and return stages from Stages table.
             */
            read: function(req, resource, params, config, callback) {
                models.Stage.findAll(Object.assign(params, {
                    order: ['order']
                })).then(stages => {
                    callback(null, stages, null);
                });
            },

        }
    }
}
