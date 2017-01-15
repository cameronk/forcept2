/**
 * forcept - flux/Pharmacy/DosageService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Pharmacy:DosageService')

export default {
    attach: function(db) {
        return {
            name: 'DosageService',

            /**
             *
             */
            read: function(req, resource, params, config, callback) {
                db.Dosage.findAll(params).then(meds => {
                    callback(null, keyBy(meds, 'id'), null);
                })
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new medication dosage.");

                /*
                 * Create patient record.
                 */
                (db.Dosage).create(body).then(med => {
                    __debug("[create]: Dosage %s created.", med.id);
                    callback(null, med.toJSON(), null);
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

                __debug("[update]: Updating medication dosage #%s", params.id);

                (db.Dosage).findOne({
                    where: {
                        id: params.id
                    }
                }).then((med) => {
                    if(!med) {
                        callback(
                            BuildError('Requested medication dosage not found.', {
                                output: {
                                    message: 'Requested medication dosage not found.'
                                },
                                statusCode: HttpStatus.NOT_FOUND
                            })
                        );
                    } else {

                        /*
                         * Apply fields passed to body to the Visit record.
                         */
                        for(let field in body) {
                            __debug("[update]: |==> %s = %s", field, body[field]);
                            med.set(field, body[field]);
                        }

                        med.save()
                            .then((medication) => {
                                callback(null, {
                                    id: medication.id
                                }, null);
                            });

                    }

                });
            }
        }
    }
}
