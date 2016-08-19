/**
 * forcept - flux/App/AppService.js
 * @author Azuru Technology
 */

import fs from 'fs';

export default {
    attach: function(db) {
        return {
            name: 'AppService',

            /**
             *
             */
            update: function(req, resource, params, body, config, callback) {
                var newConfig = JSON.stringify(
                    Object.assign(body.current, body.changes)
                );
                fs.writeFile(`storage/config.json`, newConfig, (err) => {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, true, null);
                    }
                });
            }

        }
    }
}
