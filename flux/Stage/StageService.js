/**
 * forcept - flux/Stage/StageService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
import UpdateStageDefinition, { BaseStageDefinition } from '../../database/StageDefinition';

import Manifest from '../manifest';

const __debug = require('debug')('forcept:flux:Console:StageService');

export default {
    attach: function(db) {
        return {
            name: 'StageService',

            /**
             * Read and return stages from Stages table.
             */
            read: function(req, resource, params, config, callback) {
                db.Stage.findAll(params).then(stages => {
                    callback(null, stages, null);
                });
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new stage.");

                /*
                 * Create stage record.
                 */
                (db.Stage).create(body, {
                    fields: ['name', 'type']
                }).then(stage => {

                    var stageID   = stage.get('id');

                    stage.set('order', stageID);
                    stage.save().then(() => {

                        let tableName = stage.get('tableName');
                        let schema    = db.sequelize.getQueryInterface();

                        __debug("[create]: Created new stage record with ID: %s", stageID);
                        __debug("[create]: Now creating stage-specific table: %s", tableName);

                        /*
                         * Create stage-specific table with default columns.
                         */
                        schema.createTable(tableName, BaseStageDefinition(false, db)).then(() => {
                            __debug("[create]: Created!");
                            callback(null, {
                                id: stageID
                            }, null);
                        }).catch(err => {
                            __debug("[create]: Error :(");
                            __debug(err);
                            callback(err);
                        });

                    });

                });

            },

            /**
             * Upsert a Stage.
             */
            update: function(req, resource, params, body, config, callback) {

                __debug("[update]: Updating stage %s.", params.id);

                (db.Stage).findOne({
                    where: {
                        id: params.id
                    }
                }).then((stage) => {
                    if(!stage) {
                        callback(
                            BuildError('Requested stage not found.', {
                                output: {
                                    message: 'Requested stage not found.'
                                },
                                statusCode: HttpStatus.NOT_FOUND
                            })
                        );
                    } else {

                        var stageID    = stage.get('id');
                        var newFields  = body.fields; /// HAS THE CURRENT FIELD ORDER
                        var prevFields = stage.get('fields');
                        var updatedFields = {};
                        var tableName  = stage.get('tableName');

                        let schema     = db.sequelize.getQueryInterface();
                        let updates    = [];
                        let additions  = 0;
                        let deletions  = 0;

                        __debug("[update]: Previous fields (%s)", typeof prevFields);
                        __debug(Object.keys(prevFields));
                        __debug("[update]: New fields (%s)", typeof newFields);
                        __debug(Object.keys(newFields));

                        /*
                         * Deletions:
                         * - Are previous fields excluded in newFields?
                         */
                        for(let field in prevFields) {


                            if(!newFields.hasOwnProperty(field)) {

                                deletions++;

                                /// Add old fields to our updatedFields object...
                                /// just in case removeColumn fails, we don't want to remove
                                /// the entry in the fields JSON object.
                                updatedFields[field] = prevFields[field];

                                updates.push(
                                    new Promise((resolve, reject) => {

                                        var thisField = field;
                                        __debug(" -> Deleting %s", thisField);

                                        schema.removeColumn(
                                            tableName,
                                            thisField
                                        ).catch(err => {
                                            reject(err);
                                        }).then(() => {
                                            /// Now that we know the removal was successful,
                                            /// delete the field from updatedFields.
                                            delete updatedFields[thisField];
                                            resolve(thisField);
                                        });
                                    })
                                );
                            } else {
                                /// The field is still in newFields, add that version.
                                updatedFields[field] = newFields[field];
                            }

                        }

                        /*
                         * Additions:
                         * - Are new fields present?
                         */
                        for(let field in newFields) {

                            /// Don't add the field to updatedFields until we know
                            /// addColumn actually worked.

                            if(!prevFields.hasOwnProperty(field)) {

                                if(Manifest.Fields[newFields[field].type].storageMethod === "none") {
                                    /// No storage method for this field, just add it to the object.
                                    updatedFields[field] = newFields[field];
                                } else {

                                    additions++;
                                    updates.push(
                                        new Promise((resolve, reject) => {

                                            var thisField = field;
                                            __debug(" -> Adding %s", thisField);

                                            schema.addColumn(
                                                tableName,
                                                thisField,
                                                {
                                                    type: db.Sequelize.TEXT
                                                }
                                            ).catch(err => {
                                                reject(err);
                                            }).then(() => {
                                                /// Now that addColumn was successful, we can
                                                /// add the field to the updatedFields object.
                                                updatedFields[thisField] = newFields[thisField];
                                                resolve(thisField);
                                            });
                                        })
                                    );

                                }

                            }
                        }

                        __debug("[update]: Running %s additions, %s deletions", additions, deletions);

                        Promise.all(updates).then((status) => {

                            __debug("[update]: ...done!");
                            __debug("[update] %j", status);
                            __debug("[update]: saving fields to stage record");

                            var reorderedFields = {};

                            for(var key in newFields) {
                                if(updatedFields.hasOwnProperty(key)){
                                    reorderedFields[key] = updatedFields[key];
                                }
                            }

                            stage.set('name', body.name);
                            stage.set('type', body.type);
                            stage.set('fields', reorderedFields);
                            stage.save()
                                .then((stage) => {
                                    __debug("[update]: ...done!");

                                    /// Update the Sequelize stage definition.
                                    UpdateStageDefinition(stage, db);

                                    callback(null, {
                                        id: stageID
                                    }, null);

                                }).catch(err => {
                                    __debug("[update]: Error during final stage-record saving.");
                                    __debug(err);
                                    callback(err);
                                });

                        }).catch(err => {
                            __debug("[update]: Error during update execution.");
                            __debug(err);
                            callback(err);
                        });

                    }
                });

            }
        }
    }
}
