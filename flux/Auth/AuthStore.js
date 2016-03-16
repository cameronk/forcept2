/**
 * forcept - flux/Auth/AuthStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Auth:AuthStore');

class AuthStore extends BaseStore {

    static storeName = 'AuthStore'
    static handlers = {
        [Actions.AUTH_ERROR]: 'handleAuthError',
        [Actions.AUTH_SUCCESS]: 'handleAuthSuccess',
        [Actions.AUTH_CREDENTIAL_CHANGE]: 'handleCredentialChange'
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.error = null;
        this.username = "";
        this.password = "";
    }

    /*
     * Setters
     */
    handleAuthError(err) {
        this.error = err;
        this.emitChange();
    }
    handleAuthSuccess() {
        window.location.reload();
        this.setInitialState();
    }
    handleCredentialChange({username, password}) {
        if(typeof username !== "undefined") {
            this.username = username;
        }
        if(typeof password !== "undefined") {
            this.password = password;
        }
        this.emitChange();
    }

    /*
     * Getters
     */
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getError() {
        return this.error;
    }
    getCredentials() {
        return {
            username: this.getUsername(),
            password: this.getPassword()
        };
    }
    dehydrate() {
        return {
        };
    }
    rehydrate(state) {
    }
}

export default AuthStore;
