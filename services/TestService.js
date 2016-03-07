/**
 * forcept - services/TestService.js
 * @author Azuru Technology
 */

export default {
    name: 'TestService',
    read: function(req, resource, params, config, callback) {
        var data = 'response';
        callback(null, data, null);
    }
}
