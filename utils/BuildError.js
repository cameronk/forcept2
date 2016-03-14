/**
 * forcept - utils/BuildError.js
 * @author Azuru Technology
 */

export default function BuildError(err, props) {
    let error = new Error(err);
    for(var key in props) {
        error[key] = props[key];
    }

    if(!error.hasOwnProperty('output') || typeof error.output !== "object" || error.output === null) {
        error.output = {};
    }

    if(!error.output.message) {
        error.output.message = err;
    }

    return error;
}
