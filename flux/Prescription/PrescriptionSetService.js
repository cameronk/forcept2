/**
 * forcept - flux/Pharmacy/PrescriptionService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Pharmacy:PrescriptionSetService')

export default {
    attach: function(db) {
        return {
            name: 'PrescriptionSetService',

            /**
             *
             */
            read: function(req, resource, params, config, callback) {

                var config = {};

                if(params.where) {
                    config.where = params.where;
                }

                if(params.getPrescriptions) {
                    __debug("[read] getting prescriptions");
                    config.include = [{
                        model: db.Prescription,
                        as: 'prescriptions'
                    }];
                }

                db.PrescriptionSet.findAll(config).then(sets => {
                    sets = sets.map(set => {
                        set = set.toJSON();
                        set.prescriptions = keyBy(set.prescriptions, 'id')
                        return set;
                    });
                    callback(null, sets, null);
                });
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new prescription set.");

                /*
                 * Create patient record.
                 */
                (db.PrescriptionSet).create(body).then(set => {
                    __debug("[create]: Prescription set created.");
                    set.prescriptions = new Object;
                    callback(null, set, null);
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

                __debug("[update]: Updating prescription set #%s", params.id);

                (db.PrescriptionSet).findOne({
                    where: {
                        id: params.id
                    }
                }).then((set) => {
                    if(!set) {
                        callback(
                            BuildError('Requested prescription set not found.', {
                                output: {
                                    message: 'Requested prescription set not found.'
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
                            set.set(field, body[field]);
                        }

                        set.save()
                            .then((set) => {
                                callback(null, {
                                    id: set.id
                                }, null);
                            });

                    }

                });
            }
        }
    }
}
