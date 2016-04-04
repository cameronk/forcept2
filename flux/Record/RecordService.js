/**
 * forcept - flux/Record/RecordService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Record:RecordService')

export default {
    attach: function(db) {
        return {
            name: 'RecordService',

            /**
             * Read and return Visits from the Visits table.
             */
            read: function(req, resource, params, config, callback) {

            },

            /**
             * Upsert a Stage.
             */
            update: function(req, resource, params, body, config, callback) {
                __debug("[update]: Updating a record => %s", params.model);
                (db.sequelize.models[params.model]).upsert(body).then(record => {
                    __debug("[update]: ...done.");
                    __debug("[update]: response: %s", record);
                    callback(null, record, null);
                }).catch(err => {
                    callback(err);
                });
            }
        }
    }
}
