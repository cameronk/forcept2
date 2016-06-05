/**
 * forcept - flux/Resource/ResourceService.js
 * @author Azuru Technology
 */

import fs from 'fs';
import shortid from 'shortid';

export default {
    attach: function(db) {
        return {
            name: 'ResourceService',

            /**
             *
             */
            create: function(req, resource, params, { type, data }, config, callback) {
                var id  = shortid.generate();
                var buf = new Buffer(data, 'base64');
                var ext = ".jpg";
                fs.writeFile(`storage/resources/${id}${ext}`, buf, (err) => {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, {
                            type: type,
                            id: id,
                            ext: ext
                        }, null);
                    }
                });
            }

        }
    }
}
