/**
 *
 *
 */

export function BuildDOMClass(...props) {
    var baseString = "";

    props.forEach((prop) => {
        switch(typeof prop) {
            case "string":
                baseString += (" " + prop);
                break;
            case "object":
                for(var key in prop) {
                    if(prop[key] === true) {
                        baseString += (" " + key);
                    }
                }
                break;
        }
    });

    return baseString.trim();
}
