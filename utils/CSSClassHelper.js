/**
 *
 *
 */

export function BuildDOMClass(baseString, classes={}) {
    for(var key in classes) {
        if(classes[key] === true) {
            baseString += (" " + key);
        }
    }
    return baseString;
}
