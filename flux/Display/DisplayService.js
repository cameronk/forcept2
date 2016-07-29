/**
 * forcept - flux/Display/DisplayService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';
import debug from 'debug';

const __debug = debug('forcept:flux:Display:DisplayService');

export default {
    attach: function(db) {
        return {
            name: 'DisplayService',

            read: function(req, resource, params, config, callback) {
                db.Display.findAll(params).then(displays => {
                    callback(null, keyBy(displays, 'id'), null);
                }).catch(err => callback(err));
            },

            /**
             *
             */
            create: function(req, resource, params, body, config, callback) {

                __debug("[create]: Creating a new Display.");

                /*
                 * Create Display record.
                 */
                (db.Display).create(body).then(display => {
                    callback(null, display, null);
                }).catch(err => {
                    callback(err);
                });

            },


            /**
             *
             */
            update: function(req, resource, params, body, config, callback) {

                __debug("[update]: Updating display #%s", params.id);

                (db.Display).findOne({
                    where: {
                        id: params.id
                    }
                }).then((display) => {
                    if(!display) {
                        callback(
                            BuildError('Requested display not found.', {
                                output: {
                                    message: 'Requested display not found.'
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
                            display.set(field, body[field]);
                        }

                        display.save()
                            .then((display) => {
                                callback(null, {
                                    id: display.id
                                }, null);
                            });

                    }

                });
            }

        }
    }
}
