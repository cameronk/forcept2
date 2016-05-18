/**
 * forcept - flux/Console/UserStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:User:UserStore');

class UserStore extends BaseStore {

    static storeName = 'UserStore'
    static handlers = {
        [Actions.USERS_UPDATE]: 'handleUpdateUsers',
        [Actions.USERS_UPDATE_NURSERY]: 'handleUpdateNursery',
    }

    /**
     * Constructor / setup
     */
    constructor(dispatcher) {
        super(dispatcher);
        this.cache = {};
        this.handleClearUsers();
    }

    // =============================== \\

    handleUpdateCache(cache) {
        if(cache === null) {
            this.cache = {};
        } else {
            for(var item in cache) {
                this.cache[item] = cache[item];
            }
        }
    }


    // =============================== \\

    handleUpdateUsers(users) {
        __debug("Adding users: %j", users);
        for(var id in users) {
            if(users[id] === null && this.users.hasOwnProperty(id)) {
                delete this.users[id];
            } else {
                this.users[id] = users[id];
            }
        }
        this.emitChange();
    }

    getUsers() {
        return this.users;
    }

    handleClearUsers() {
        this.users = {};
        this.emitChange();
    }
    // =============================== \\

    /*
     * H20
     */
    dehydrate() {
        return {
            users: this.users,
            cache: this.cache,
            nursery: this.nursery,
        };
    }

    rehydrate(state) {
        this.users = state.users;
        this.cache = state.cache;
        this.nursery = state.nursery;
    }

}

export default UserStore;
