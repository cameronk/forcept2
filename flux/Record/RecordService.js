/**
 * forcept - flux/Record/RecordService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import pick from 'lodash/pick';
import invert from 'lodash/invert';

import { JsonModel } from '../../database/helper';
import BuildError from '../../utils/BuildError';

const __debug = require('debug')('forcept:flux:Record:RecordService');

export default {
    attach: function(db) {
        return {
            name: 'RecordService',

            /**
             * Read and return records from all stages.
             */
            read: function(req, resource, params, config, callback) {
                __debug("[read]: ...");

                var promises = [];
                var constrainedRecordModels = {};

                if(!params.stages) {

                    callback(
                        BuildError('Missing stages constraint for RecordService call.', {
                            output: {
                                message: 'Missing stages constraint for RecordService call.'
                            },
                            statusCode: HttpStatus.NOT_FOUND
                        })
                    );

                    return;
                } else {
                    if(typeof params.stages === "string") {
                        switch(params.stages) {
                            case "*":
                                constrainedRecordModels = db.RecordModels;
                                break;
                        }
                    } else if(Array.isArray(params.stages)) {
                        constrainedRecordModels = invert(pick(invert(db.RecordModels), params.stages));
                    }
                }

                __debug("[read]: Constraining to models: %s", Object.keys(constrainedRecordModels).join(", "));

                /*
                 * Loop through record models and check
                 * each table for records for this patient.
                 */
                for(let modelName in constrainedRecordModels) {
                    __debug("[read]==> %s", modelName);

                    var where = {};

                    /*
                     * Stage is root, use root query structure
                     */
                    if(modelName === "Patient") {
                        where = {
                            id: {
                                $in: params.patients
                            },
                            currentVisit: params.visit
                        };
                    }

                    /*
                     * This is some other stage
                     */
                    else {
                        where = {
                            patient: {
                                $in: params.patients
                            },
                            visit: params.visit
                        };
                    }

                    promises.push(
                        db.Record(modelName)
                            .findAll({
                                where: where
                            })
                            .catch(err => {
                                __debug("[read] Error while fetching from '%s' model", modelName);
                                __debug(err);
                                throw err;
                            })
                            .then(records => {
                                __debug("[read]: Found %s record(s) in %s", records.length, modelName);
                                return {
                                    [db.RecordModels[modelName]]: records
                                };
                            })
                    );

                }

                /*
                 * Return unprocessed data for handling by calling action.
                 */
                Promise.all(promises).then(data => {
                    callback(null, data, null);
                }).catch(err => {
                    callback(err);
                });

            },

            /**
             * Upsert a Stage.
             */
            update: function(req, resource, params, body, config, callback) {
                __debug("[update]: Updating %s fields on record %s", Object.keys(body).length, params.model);

                var model = db.Record(params.model);

                var complete = (record) => {
                    for(let field in body) {
                        record.set(field, body[field]);
                    }
                    record.save()
                        .then(record => {
                            callback(null, record, null);
                        })
                        .catch((err) => {
                            callback(err);
                        })
                };

                model.findOne({
                    where: params.identify
                }).then(record => {
                    if(!record) {
                        model.create(params.identify)
                            .then(newRecord => {
                                complete(newRecord);
                            });
                    } else {
                        complete(record);
                    }
                }).catch(err => {
                    callback(err);
                });

            }
        }
    }
}
