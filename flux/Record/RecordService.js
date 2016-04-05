/**
 * forcept - flux/Record/RecordService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
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

                var promises = [];

                __debug(db.sequelize.models);

                db.ForceptStages.map(modelName => {
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
                        db.sequelize.models[modelName]
                            .findAll({
                                where: where
                            })
                            .catch(err => {
                                __debug("[read] Error while fetching %s", modelName);
                                __debug(err);
                            })
                            .then(ret => {
                                __debug(modelName);
                                __debug(ret);
                                return ret;
                            })
                    );

                });

                Promise.all(promises).then(data => {
                    __debug("Got callback: ");
                    __debug(data);
                    callback(null, "lol", null);
                });
            },

            /**
             * Upsert a Stage.
             */
            update: function(req, resource, params, body, config, callback) {
                __debug("[update]: Updating a record => %s", params.model);
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
