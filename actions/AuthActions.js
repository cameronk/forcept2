/**
 * forcept - actions/AuthActions.js
 * @author Azuru Technology
 */

import Actions from '../configs/actions';

/*
 * Attempt to log a user in.
 */
export function LoginAction(context, payload, done) {
    console.log("LoginAction: %s", payload);
    context.service
        .read('AuthService')
        .params(payload)
        .end(function(err, data, meta) {
            // context.dispatch()
            console.log("LoginAction:end -> %s", data);
        });
}
