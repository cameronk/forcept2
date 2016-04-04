/**
 * forcept - flux/Stage/StageService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Patient:PatientService')

export default {
    attach: function(db) {
        return {
            name: 'PatientService',

            /**
             * Read and return patients from the Patients table.
             */
            read: function(req, resource, params, config, callback) {
                // db.Stage.findAll(params).then(stages => {
                //     callback(null, stages, null);
                // });
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new patient.");

                /*
                 * Create patient record.
                 */
                (db.Patient).create({
                    createdBy: req.user.id,
                    lastModifiedBy: req.user.id
                }).then(patient => {
                    callback(null, patient, null);
                }).catch(err => {
                    __debug("[create]: ERROR:");
                    __debug(err);
                    callback(err);
                });

            }
        }
    }
}
