/**
 * forcept - flux/Console/StageStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Visit:VisitStore');

class VisitStore extends BaseStore {

    static storeName = 'VisitStore'
    static handlers = {
        [Actions.VISIT_SET_CURRENT_TAB]: 'handleSetCurrentTab'
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.handling = false;
        this.tab = null;
    }

    handleSetCurrentTab(location) {
        if(this.tab !== location) {
            this.tab = location;
        }
        this.emitChange();
    }

    getCurrentTab() {
        return this.tab;
    }

    dehydrate() {
        return {
            handling: this.handling,
            tab: this.tab
        };
    }

    rehydrate(state) {
        this.handling = state.handling;
        this.tab = state.tab
    }

}

export default VisitStore;
