/**
 * forcept - flux/Pharmacy/MedicationService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
import { JsonModel } from '../../database/helper';
const __debug = require('debug')('forcept:flux:Pharmacy:MedicationService')

export default {
    attach: function(db) {
        return {
            name: 'MedicationService',

            /**
             *
             */
            read: function(req, resource, params, config, callback) {

                __debug("[read] ...");

                var config = {};

                if(params.getDosages) {
                    __debug("[read] getting dosages");
                    config.include = [{
                        model: db.Dosage,
                        as: 'dosages'
                    }];
                }

                db.Medication.findAll(config).then(meds => {
                    meds = meds.map(med => {
                        med = med.toJSON();
                        med.dosages = keyBy(med.dosages, 'id')
                        return med;
                    });
                    __debug("[read] found %s medications", meds.length);
                    callback(null, keyBy(meds, 'id'), null);
                })
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new medication.");

                /*
                 * Create patient record.
                 */
                (db.Medication).create(body).then(med => {
                    __debug("[create]: Medication created.");
                    callback(null, med, null);
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

                __debug("[update]: Updating medication #%s", params.id);

                (db.Medication).findOne({
                    where: {
                        id: params.id
                    }
                }).then((med) => {
                    if(!med) {
                        callback(
                            BuildError('Requested medication not found.', {
                                output: {
                                    message: 'Requested medication not found.'
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
