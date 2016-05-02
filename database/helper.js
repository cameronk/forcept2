/**
 * forcept - database/helper.js
 * @author Azuru Technology
 */

module.exports = {

    /*
     *
     */
    jsonGetter: function(val, def) {

        def = def || {};

        if(!val || typeof val !== "string") return def;

        var obj;

        try {
            obj = JSON.parse(val);
        } catch(e) {
            obj = def;
            throw e;
        }

        return obj;

    },

    /*
     *
     */
    jsonSetter: function(val, def) {

        def = def || "{}";
        var str;

        try {
            str = JSON.stringify(val);
        } catch(e) {
            str = def;
            throw e;
        }

        return str;

    },

    JsonModel: function(model) {
        if(model.toJSON) return model.toJSON();
        else return model;
    }

};
