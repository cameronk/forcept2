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

            /**
             * Upsert a Stage.
             */
            update: function(req, resource, params, body, config, callback) {
                __debug("Upserting:");
                __debug(body);
                __debug(params);
                models.Stage
                    .upsert(body, {
                        id: params.id
                    }).then((x) => {
                        callback(null, x, null);
                    });

            }
        }
    }
}
