/**
 * forcept - stores/AppStore.js
 * @author Azuru Technology
 */

import debug from 'debug';

import Actions from '../actions';
import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from '../Route/RouteStore';

const __debug = debug('forcept:flux:Display:DisplayStore');

class DisplayStore extends BaseStore {

    static storeName = 'DisplayStore'
    static handlers  = {
        [Actions.DISPLAY_GROUP_UPDATE]: "updateGroups",
        [Actions.DISPLAY_GROUP_CACHE_CLEAR]: "clearGroupCache",
        [Actions.DISPLAY_GROUP_CACHE_UPDATE]: "updateGroupCache",
        [Actions.DISPLAY_GROUP_CACHE_MODIFIED]: "cacheWasModified",
        [Actions.DISPLAY_ADD_LOADING_CONTEXT]: "addLoadingContext",
        [Actions.DISPLAY_REMOVE_LOADING_CONTEXT]: "removeLoadingContext"
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.groups = null;
        this.cacheModified = false;
        this.loadingContext = [];
        this.clearGroupCache();
    }

    /** ============================ **/

    getGroupCache = () => this.groupCache;

    updateGroupCache = (data) => {
        for(var column in data) {
            if(column === "displays") {
                var displays = data.displays;
                if(!this.groupCache.hasOwnProperty("displays")) {
                    this.groupCache.displays = displays;
                } else {
                    for(var displayKey in displays) {
                        var thisDisplay = displays[displayKey];
                        if(!this.groupCache.displays.hasOwnProperty(displayKey)) {
                            this.groupCache.displays[displayKey] = thisDisplay;
                        } else {
                            for(var displayProp in thisDisplay) {
                                var thisProp = thisDisplay[displayProp];
                                if(displayProp === "settings") {
                                    for(var setting in thisProp) {
                                        this.groupCache.displays[displayKey].settings[setting] = thisProp[setting];
                                    }
                                } else {
                                    this.groupCache.displays[displayKey][displayProp] = thisProp;
                                }
                            }
                        }
                    }
                }
            } else {
                this.groupCache[column] = data[column];
            }
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

    getLoadingContext = () => this.loadingContext;

    addLoadingContext = (ctx) => {
        if(this.loadingContext.indexOf(ctx) === -1) {
            this.loadingContext.push(ctx);
        }
    }

    removeLoadingContext = (ctx) => {
        var index = this.loadingContext.indexOf(ctx);
        if(index !== -1) {
            this.loadingContext.splice(index, 1);
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
