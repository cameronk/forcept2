/**
 * forcept - services/TestService.js
 * @author Azuru Technology
 */

const __debug = require('debug')('forcept:services:TestService');

export default {
    attach: function(models) {
        return {
            name: 'TestService',
            read: function(req, resource, params, config, callback) {
                console.log(models);
                models.User.findOne().then(function(user) {
                    callback(null, user.firstName, null)
                });
            }
        }
    }
}
