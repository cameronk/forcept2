#!/usr/bin/env node

/**
 * forcept - bin/setup.js
 * @author Azuru Technology
 */

var prompt = require('prompt');
var program = require('commander');
var fs = require('fs');
var data = {};


/// Setup program flags
program
    .version('1.0.0')
    .option('-d, --dev', 'Add development config flags')
    .parse(process.argv);

const storagePath = './storage';
if(!fs.existsSync(storagePath)) {
   fs.mkdirSync(storagePath);
}

const storageFile = storagePath + '/config.json';
if(fs.existsSync(storageFile)) {
    console.log("Loading existing configuration values.");
    var grab = fs.readFileSync(storageFile);
    try {
        data = JSON.parse(grab);
        for(var key in data) {
            console.log(" " + key + " => " + data[key]);
        }
    } catch(e) {
        console.log("Could not parse config file. Starting from scratch.");
        data = {};
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

if(program.dev) {
    schema.properties['devPort'] = {
        description: "Development broadcast port",
        type: 'integer',
        message: 'The port must be a number.',
        default: data.devPort ? parseInt(data.devPort) : 3000
    }
}

//
// Start the prompt
//
prompt.start();

prompt.get(schema, function (err, result) {

    /// If devPort flag was already in file, add it to result
    if(!program.dev && !result.devPort && data.devPort) {
        result['devPort'] = parseInt(data.devPort);
    }

    var result = JSON.stringify(result);
    if(result) {
        fs.writeFile(storageFile, result, function(err) {
            console.log(result);
            if(err) console.error(err);
            console.log("Wrote configuration to file.");
            process.exit();
        });
    } else {
        console.log("ERROR: Result is invalid. Not writing to config.");
        process.exit();
    }
});
