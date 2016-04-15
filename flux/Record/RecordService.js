/**
 * forcept - flux/Record/RecordService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import flatten from 'lodash/flatten';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

import { JsonModel } from '../../database/helper';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Record:RecordService')

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

                /*
                 * Loop through record models and check
                 * each table for records for this patient.
                 */
                for(let modelName in db.RecordModels) {
                    __debug("[read] => %s", modelName);

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
                                __debug("[read] Error while fetching %s", modelName);
                                __debug(err);
                            })
                            .then(records => {
                                __debug("[read] Found %s record(s) in %s", records.length, modelName);
                                return {
                                    [db.RecordModels[modelName]]: records
                                };
                            })
                    );

                }

                /*
                 *
                 */
                Promise.all(promises).then(data => {

                    var collapsed = Object.assign(...data);
                    var patients = {};

                    for(let stageID in collapsed) {
                        collapsed[stageID].map((record) => {
                            var patientID = stageID == 1 ? record.get('id') : record.get('patient');

                            if(!patients.hasOwnProperty(patientID)) {
                                patients[patientID] = {};
                            }

                            /*
                             * Omit null values from object.
                             */
                            patients[patientID][stageID] = omitBy(JsonModel(record), isNil);
                        });
                    }

                    callback(null, patients, null);
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
