/**
 *
 *
 */

/*
 *
 */
export default function ValueDefined(type, value) {
    switch(type) {
        case "teeth-screener":
            return Object.keys(value).length > 0;
            break;
        default:
            return (value && value.length > 0);
            break;
    }
}
