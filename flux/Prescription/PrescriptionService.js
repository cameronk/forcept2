/**
 * forcept - flux/Pharmacy/PrescriptionService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Pharmacy:PrescriptionService')

export default {
    attach: function(db) {
        return {
            name: 'PrescriptionService',

            /**
             *
             */
            read: function(req, resource, params, config, callback) {
                db.Prescription.findAll(params).then(prescriptions => {
                    callback(null, prescriptions, null);
                })
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new prescription.");

                /*
                 * Create patient record.
                 */
                (db.Prescription).create(body).then(prescription => {
                    __debug("[create]: Prescription created.");
                    callback(null, prescription, null);
                }).catch(err => {
                    __debug("[create]: ERROR:");
                    __debug(err);
                    callback(err);
                });

            },

            /**
             *
             */
            update: function(req, resource, params, body, config, callback) {

                __debug("[update]: Updating prescription #%s", params.id);

                (db.Prescription).findOne({
                    where: {
                        id: params.id
                    }
                }).then((prescription) => {
                    if(!prescription) {
                        callback(
                            BuildError('Requested prescription not found.', {
                                output: {
                                    message: 'Requested prescription not found.'
                                },
                                statusCode: HttpStatus.NOT_FOUND
                            })
                        );
                    } else {

                        /*
                         * Apply fields passed to body to the prescription record.
                         */
                        for(let field in body) {
                            __debug("[update]: |==> %s = %s", field, body[field]);
                            prescription.set(field, body[field]);
                        }

                        prescription.save()
                            .then((updatedPrescription) => {
                                callback(null, updatedPrescription, null);
                            });

                    }

                });
            },

            /**
             *
             */

            delete: function(req, resource, params, config, callback) {
                /*
                 * Create patient record.
                 */
                (db.Prescription).findOne({
                    where: {
                        id: params.id
                    }
                }).then(prescription => {
                    callback(null, {
                        status: prescription.destroy()
                    }, null);
                }).catch(err => {
                    __debug("[delete]: ERROR:");
                    __debug(err);
                    callback(err);
                });
            }
        }
    }
}
