/**
 * forcept - utils/GetConfig.js
 * @author Azuru Technology
 */

var fs = require('fs');

module.exports = function(cb) {

    var data = {};
    const storagePath = './storage';

    fs.exists(storagePath, function(exists) {
        if(!exists) {
            console.log("ERROR: Forcept not yet configured. [Missing storage directory]");
            console.log("Please run 'node bin/setup.js'.");
            process.exit();
        }

        const storageFile = storagePath + '/config.json';

        fs.exists(storageFile, function(exists) {
            if(!exists) {
                console.log("ERROR: Forcept not yet configured. [Missing config.json]");
                console.log("Please run 'node bin/setup.js'.");
                process.exit();
            }

            fs.readFile(storageFile, function(err, str) {
                if(err) {
                    console.log("ERROR: Could not read storageFile");
                    console.log(error);
                    process.exit();
                }

                try {
                    data = JSON.parse(str);
                } catch(e) {
                    console.log("ERROR: Could not parse config file.");
                    process.exit();
                } finally {
                    cb(data);
                }

            });
        });

    });
};
