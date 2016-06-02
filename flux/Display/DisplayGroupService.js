/**
 * forcept - flux/Display/DisplayGroupService.js
 * @author Azuru Technology
 */

import keyBy from 'lodash/keyBy';

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
            create: function(req, resource, params, { type, data }, config, callback) {

            }

        }
    }
}
