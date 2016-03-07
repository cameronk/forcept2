/**
 * forcept - services/TestService.js
 * @author Azuru Technology
 */

export default {
    name: 'TestService',
    read: function(req, resource, params, config, callback) {
        setTimeout(function() {
            var data = 'response';
            callback(null, data, null);
        }, 1000);
    }
}
