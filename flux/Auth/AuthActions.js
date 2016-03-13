/**
 * forcept - actions/AuthActions.js
 * @author Azuru Technology
 */

import Actions from '../actions';
import AuthStore from './AuthStore';

/*
 * Attempt to log a user in.
 */
export function LoginAction(context, payload, done) {
    context.service
        .read('AuthService')
        .params(context.getStore(AuthStore).getCredentials())
        .end(function(err, data, meta) {
            if(err) {
                context.dispatch(Actions.AUTH_ERROR, err);
                done();
            }
            context.dispatch(Actions.AUTH_SUCCESS);
            console.log(err, data, meta);
        });
}

/*
 * Update AuthStore with new credentials.
 */
export function CredentialChangeAction(context, payload, done) {
    context.dispatch(Actions.AUTH_CREDENTIAL_CHANGE, payload);
}
