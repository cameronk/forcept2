/**
 * forcept - services/AuthService.js
 * @author Azuru Technology
 */

const __debug = require('debug')('forcept:services:TestService');

export default {
    attach: function(models, passport) {
        return {
            name: 'AuthService',
            read: function(req, resource, params, config, callback) {
                // console.log("req:");
                // console.log(req);
                // if (err) { return next(err); }
                // if (!user) { return res.redirect('/login'); }
                //     req.logIn(user, function(err) {
                // if (err) { return next(err); }
                //     return res.redirect('/users/' + user.username);
                // });
                passport.authenticate('local', function(err, user, info) {
                    console.log("Passport auth:");
                    console.log(err);
                    console.log(user);
                    console.log(info);
                })(req, {}, callback);
            }
        }
    }
}
