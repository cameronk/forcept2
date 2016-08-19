/**
 * forcept - flux/Display/DisplayGroupService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import debug from 'debug';

const __debug = debug('forcept:flux:Display:DisplayGroupService');

export default {
    attach: function(db) {
        return {
            name: 'DisplayGroupService',

            read: function(req, resource, params, config, callback) {
                db.DisplayGroup.findAll(params).then(groups => {
                    callback(null, keyBy(groups, 'id'), null);
                }).catch(err => callback(err));
            },

            /**
             *
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new DisplayGroup.");

                /*
                 * Create DisplayGroup record.
                 */
                (db.DisplayGroup).create(body).then(group => {
                    callback(null, {
                        id: group.id
                    }, null);
                }).catch(err => {
                    callback(err);
                });

            },


            /**
             *
             */
            update: function(req, resource, params, body, config, callback) {

                __debug("[update]: Updating display group #%s", params.id);

                (db.DisplayGroup).findOne({
                    where: {
                        id: params.id
                    }
                }).then((group) => {
                    if(!group) {
                        callback(
                            BuildError('Requested display group not found.', {
                                output: {
                                    message: 'Requested display group not found.'
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
                            group.set(field, body[field]);
                        }

                        group.save()
                            .then((group) => {
                                callback(null, {
                                    id: group.id
                                }, null);
                            });

                    }

                });
            }

        }
    }
}
