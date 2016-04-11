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
             *
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new Visit.");
                __debug(body);

                /*
                 * Create Visit record.
                 */
                (db.Visit).create(body).then(visit => {
                    callback(null, visit, null);
                }).catch(err => {
                    callback(err);
                });

            },

            /**
             *
             */
            update: function(req, resource, params, body, config, callback) {

                __debug("[update]: Moving visit #%s -> %s", params.id, body.stage);

                (db.Visit).findOne({
                    where: {
                        id: params.id
                    }
                }).then((visit) => {
                    if(!visit) {
                        callback(
                            BuildError('Requested visit not found.', {
                                output: {
                                    message: 'Requested visit not found.'
                                },
                                statusCode: HttpStatus.NOT_FOUND
                            })
                        );
                    } else {
                        visit.set('stage', body.stage);
                        visit.save()
                            .then((visit) => {
                                callback(null, true, null);
                            });
                    }
                });
            }

        }
    }
}
