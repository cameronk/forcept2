/**
 * forcept - flux/Test/TestService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Test:TestService')

export default {
    attach: function(db) {
        return {
            name: 'TestService',

            /**
             * Read and return Tests from Tests table.
             */
            read: function(req, resource, params, config, callback) {
                db.Stage.findAll(params).then(stages => {
                    __debug(stages);
                    callback(null, stages, null);
                });
            }
        }
    }
}
