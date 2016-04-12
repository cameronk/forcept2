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
        [Actions.VISIT_SET_DESTINATION]: 'handleSetDestination',
        [Actions.VISIT_SET_RECENT_DATA]: 'handleSetRecentData',
        [Actions.VISIT_SET_MODIFIED]: 'handleSetModified',
        [Actions.VISIT_UPDATE_VISIT]: 'handleUpdateVisit',
        [Actions.VISIT_CLEAR]: 'handleClearVisit'
    }

    // =============================== \\

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.recentData = null;
        this.handleClearVisit();
    }

    // =============================== \\

    /**
     * Get the current Visit visit.
     */
    getVisit() {
        return this.visit;
    }

    /**
     * Clear the visit.
     */
    handleClearVisit() {
        this.tab = null;
        this.modified = false;
        this.destination = null;
        this.visit = { id: null };
        this.emitChange();
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

    // =============================== \\

    /**
     *
     */
    handleSetRecentData(data) {
        if(data === null) {
            if(this.recentData !== null) {
                this.recentData = null;
                this.emitChange();
            }
        } else {
            this.recentData = data;
            this.emitChange();
        }
    }

    /**
     *
     */
    getRecentData() {
        return this.recentData;
    }

    // =============================== \\

    handleSetModified(state) {
        if(this.modified !== state) {
            this.modified = state;
            this.emitChange();
        }
    }

    isModified() {
        return this.modified;
    }

    // =============================== \\

    /**
     * Get the current tab.
     */
    getCurrentTab() {
        return this.tab;
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

    // =============================== \\

    /**
     *
     */
    getDestination() {
        return this.destination;
    }

    /**
     *
     */
    handleSetDestination(destination) {
        if(this.destination !== destination) {
            this.destination = destination;
            this.emitChange();
        }
    }

    // =============================== \\

    /**
     * H20
     */
    dehydrate() {
        return {
            visit: this.visit,
            modified: this.modified,
            destination: this.destination,
            recentData: this.recentData,
            tab: this.tab
        };
    }

    rehydrate(state) {
        this.visit = state.visit;
        this.modified = state.modified;
        this.destination = state.destination;
        this.recentData = state.recentData;
        this.tab = state.tab
    }

}

export default VisitStore;
