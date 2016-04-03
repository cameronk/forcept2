/**
 * forcept - flux/Visit/VisitService.js
 * @author Azuru Technology
 */

import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
const __debug = require('debug')('forcept:flux:Visit:VisitService')

export default {
    attach: function(db) {
        return {
            name: 'VisitService',

            /**
             * Read and return Visits from the Visits table.
             */
            read: function(req, resource, params, config, callback) {
                db.Visit.findAll(params).then(visits => {
                    callback(null, visits, null);
                });
            },

            /**
             * Create a stage record in `stages`.
             * Create a stage-specific table
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new Visit.");
                __debug(body);
                
                /*
                 * Create Visit record.
                 */
                (db.Visit).create(Object.assign(body, {
                    createdBy: req.user.id,
                    lastModifiedBy: req.user.id
                })).then(visit => {
                    callback(null, visit, null);
                }).catch(err => {
                    callback(err);
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
                        var newFields  = body.fields;
                        var tableName  = stage.get('tableName');
                        let prevFields = stage.get('fields');
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
                        for(var field in prevFields) {
                            if(!newFields.hasOwnProperty(field)) {
                                deletions++;
                                updates.push(
                                    schema.removeColumn(
                                        tableName,
                                        field
                                    )
                                );
                            }
                        }

                        /*
                         * Additions:
                         * - Are new fields present?
                         */
                        for(var field in newFields) {
                            if(!prevFields.hasOwnProperty(field)) {
                                additions++;
                                updates.push(
                                    schema.addColumn(
                                        tableName,
                                        field,
                                        {
                                            type: db.Sequelize.TEXT
                                        }
                                    )
                                );
                            }
                        }

                        __debug("[update]: Running %s additions, %s deletions", additions, deletions);

                        Promise.all(updates).then(() => {
                            __debug("[update]: ...done!");
                            __debug("[update]: saving fields to stage record");

                            stage.set('name', body.name);
                            stage.set('type', body.type);
                            stage.set('fields', newFields);
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
