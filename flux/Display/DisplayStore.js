/**
 * forcept - stores/AppStore.js
 * @author Azuru Technology
 */

import Actions from '../actions';
import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from '../Route/RouteStore';

class DisplayStore extends BaseStore {

    static storeName = 'DisplayStore'
    static handlers  = {
        [Actions.DISPLAY_GROUP_UPDATE]: "updateGroups",
        [Actions.DISPLAY_GROUP_CACHE_CLEAR]: "clearGroupCache",
        [Actions.DISPLAY_GROUP_CACHE_UPDATE]: "updateGroupCache",
        [Actions.DISPLAY_GROUP_CACHE_MODIFIED]: "cacheWasModified"
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.groups = null;
        this.cacheModified = false;
        this.consoleStatus = null;
        this.clearGroupCache();
    }

    /** ============================ **/

    getGroupCache = () => this.groupCache;

    updateGroupCache = (data) => {
        for(var key in data) {
            this.groupCache[key] = data[key];
        }
        this.emitChange();
    }

    clearGroupCache = () => {
        this.groupCache  = {
            name: ""
        };
        this.cacheModified = false;
    }

    /** ============================ **/

    isCacheModified = () => this.cacheModified;

    cacheWasModified = () => {
        if(this.cacheModified === false) {
            this.cacheModified = true;
            this.emitChange();
        }
    }

    /** ============================ **/

    getGroups = () => this.groups;

    hasLoadedGroups = () => (this.groups !== null);

    updateGroups = (groups) => {
        if(this.groups === null) {
            this.groups = {};
        }
        for(var group in groups) {
            var thisGroup = groups[group];
            if(thisGroup !== null) {
                this.groups[group] = thisGroup;
            } else {
                if(this.groups.hasOwnProperty(group)) {
                    delete this.groups[group];
                }
            }
        }
        this.emitChange();
    }

    /** ============================ **/

    getDisplays = (group) => {
        if(group && this.displays.hasOwnProperty(group)) {
            return this.displays[group];
        } else {
            return this.displays;
        }
    }

    /** ============================ **/

    /*
     * H20
     */
    dehydrate() {
        return {
            groups: this.groups,
            groupCache: this.groupCache,
            consoleStatus: this.consoleStatus,
            cacheModified: this.cacheModified
        };
    }
    rehydrate(state) {
        this.groups = state.groups;
        this.groupCache = state.groupCache;
        this.consoleStatus = state.consoleStatus;
        this.cacheModified = state.cacheModified;
    }
}

export default DisplayStore;
