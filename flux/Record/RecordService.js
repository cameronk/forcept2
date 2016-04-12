/**
 * forcept - flux/Record/RecordService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import flatten from 'lodash/flatten';
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

                for(let modelName in db.RecordModels) {
                    __debug("[read] => %s", modelName);

                    var where = {};

                    /**
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

                    /**
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

                Promise.all(promises).then(data => {

                    var collapsed = Object.assign(...data);
                    var patients = {};

                    for(let stageID in collapsed) {
                        collapsed[stageID].map((record) => {
                            var patientID = stageID == 1 ? record.get('id') : record.get('patient');

                            if(!patients.hasOwnProperty(patientID)) {
                                patients[patientID] = {};
                            }

                            patients[patientID][stageID] = JsonModel(record);
                        });
                    }

                    callback(null, patients, null);
                });

            },

            /**
             * Upsert a Stage.
             */
            update: function(req, resource, params, body, config, callback) {
                __debug("[update]: Updating a record => %s", params.model);
                __debug(body);
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
