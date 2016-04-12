/**
 * forcept - database/helper.js
 * @author Azuru Technology
 */

module.exports = {

    /*
     *
     */
    jsonGetter: function(val) {

        if(!val || typeof val !== "string") return {};

        var obj = {};

        try {
            obj = JSON.parse(val);
        } catch(e) {
            obj = {};
            throw e;
        }

        return obj;

    },

    /*
     *
     */
    jsonSetter: function(val) {

        var str = "{}";
        try {
            str = JSON.stringify(val);
        } catch(e) {
            str = "{}";
            throw e;
        }

        return str;

    },

    JsonModel: function(model) {
        if(model.toJSON) return model.toJSON();
        else return model;
    }
    
};
