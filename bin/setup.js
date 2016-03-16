var prompt = require('prompt');
var fs = require('fs');

var data = {};

const storagePath = './storage';
if(!fs.existsSync(storagePath)) {
   fs.mkdirSync(storagePath);
}

const storageFile = storagePath + '/config.json';
if(fs.existsSync(storageFile)) {
    console.log("Loading existing configuration values.");
    var grab = fs.readFileSync(storageFile);
    data = JSON.parse(grab);
    for(var key in data) {
        console.log(" " + key + " => " + data[key]);
    }
}

var schema = {
    properties: {
        appName: {
            description: "Application name",
            type: 'string',
            default: data.appName || 'Forcept'
        },
        port: {
            description: "Broadcast port",
            type: 'integer',
            message: 'The port must be a number.',
            default: data.port ? parseInt(data.port) : 8080
        }
    }
};

//
// Start the prompt
//
prompt.start();

prompt.get(schema, function (err, result) {
    fs.writeFile(storageFile, JSON.stringify(result), function(err) {
        if(err) console.error(err);
        console.log("Wrote configuration to file.");
        return;
    });
});
