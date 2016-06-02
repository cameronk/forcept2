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
        [Actions.DISPLAY_GROUP_UPDATE]: "updateGroups"
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.groups = null;
    }

    /** ============================ **/

    getGroups = () => this.groups;

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

    /*
     * H20
     */
    dehydrate() {
        return {
            groups: this.groups
        };
    }
    rehydrate(state) {
        this.groups = state.groups;
    }
}

export default DisplayStore;
