/**
 * forcept - flux/Search/SearchService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import HttpStatus from 'http-status-codes';
import BuildError from '../../utils/BuildError';
import UpdateStageDefinition, { BaseStageDefinition } from '../../database/StageDefinition';
const __debug = require('debug')('forcept:flux:Console:SearchService')

export default {
    attach: function(db) {
        return {
            name: 'SearchService',

            /**
             *
             */
            read: function(req, resource, { context, query }, config, callback) {

                /// Split query by spaces for searching
                query = query.split(" ");

                var where = {
                    $or: []
                };

                switch(context) {
                    case "name":
                        if(query.length > 1) {

                            query.map(term => {
                                where['$or'].push({
                                    firstName: {
                                        $like: `%${term}%`
                                    }
                                });

                                where['$or'].push({
                                    lastName: {
                                        $like: `%${term}%`
                                    }
                                });
                            });

                        } else {
                            where = {
                                $or: [
                                    {
                                        firstName: {
                                            $like: `%${query[0]}%`
                                        }
                                    },
                                    {
                                        lastName: {
                                            $like: `%${query[0]}%`
                                        }
                                    }
                                ]
                            };
                        }
                        break;
                }

                __debug("Searching for patients...")
                __debug("...with query: %j", query);
                __debug("...with parameters: %j", where);

                (db.Record('Patient')).findAll({
                    where: where
                }).then(patients => {
                    __debug("Found %s patients.", patients.length);
                    callback(null, keyBy(patients, "id"), null);
                });
            },

            /**
             *
             */
            create: function(req, resource, params, body, config, callback) {

            },

            /**
             *
             */
            update: function(req, resource, params, body, config, callback) {

            }
        }
    }
}
