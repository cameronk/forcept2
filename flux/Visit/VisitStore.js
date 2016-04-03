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
        [Actions.VISIT_SET_CURRENT_TAB]: 'handleSetCurrentTab',
        [Actions.VISIT_UPDATE_VISIT]: 'handleUpdateVisit'
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.handling = false;
        this.tab = null;
        this.handleClearVisit();
    }

    /**
     * Clear the Visit visit.
     */
    handleClearVisit() {
        this.visit = {};
    }

    /**
     * Get the current Visit visit.
     */
    getVisit() {
        return this.visit;
    }

    /**
     * Systematically update visit based on passed data.
     * @params data: Object
     *  {
     *      [field]: [value]
     *  }
     */
    handleUpdateVisit(data) {
        __debug("Updating VisitStore visit.");
        for(var field in data) {
            __debug(" | %s = %s", field, data[field]);
            this.visit[field] = data[field];
        }
        this.emitChange();
    }

    /**
     * Set the current tab.
     */
    handleSetCurrentTab(location) {
        if(this.tab !== location) {
            this.tab = location;
            this.emitChange();
        }
    }

    /**
     * Get the current tab.
     */
    getCurrentTab() {
        return this.tab;
    }

    /**
     * H20
     */
    dehydrate() {
        return {
            visit: this.visit,
            handling: this.handling,
            tab: this.tab
        };
    }

    rehydrate(state) {
        this.visit = state.visit;
        this.handling = state.handling;
        this.tab = state.tab
    }

}

export default VisitStore;
