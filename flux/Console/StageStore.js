/**
 * forcept - flux/Console/StageStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Console:StageStore');

class StageStore extends BaseStore {

    static storeName = 'StageStore'
    static handlers = {
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
    handleAuthLogout(err) {
        window.location.reload();
    }
    handleAuthError(err) {
        this.error = err;
        this.emitChange();
    }
    handleAuthSuccess() {
        window.location.reload();
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

export default StageStore;
