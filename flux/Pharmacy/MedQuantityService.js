/**
 * forcept - flux/Pharmacy/MedQuantityService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Pharmacy:MedQuantityService')

export default {
    attach: function(db) {
        return {
            name: 'MedQuantityService',

            /**
             *
             */
            read: function(req, resource, params, config, callback) {
                db.MedQuantity.findAll(params).then(meds => {
                    callback(null, keyBy(meds, 'id'), null);
                })
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new medication quantity.");

                /*
                 * Create patient record.
                 */
                (db.MedQuantity).create(body).then(med => {
                    __debug("[create]: MedQuantity created.");
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

                __debug("[update]: Updating medication quantity #%s", params.id);

                (db.MedQuantity).findOne({
                    where: {
                        id: params.id
                    }
                }).then((med) => {
                    if(!med) {
                        callback(
                            BuildError('Requested medication quantity not found.', {
                                output: {
                                    message: 'Requested medication quantity not found.'
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
