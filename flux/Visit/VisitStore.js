/**
 * forcept - flux/Console/StageStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Visit:VisitStore');

/**
 * visit (Object) => stores data about visit currently being modified
 * list (Array)   => sorted list of visits within current stage
 */
class VisitStore extends BaseStore {

    static storeName = 'VisitStore'
    static handlers = {

        /*
         * Misc. actions
         */
        [Actions.VISIT_SET_CURRENT_TAB]: 'handleSetCurrentTab',
        [Actions.VISIT_SET_DESTINATION]: 'handleSetDestination',
        [Actions.VISIT_SET_RECENT_DATA]: 'handleSetRecentData',
        [Actions.VISIT_SET_OVERVIEW_MODE]: 'handleSetOverviewMode',

        /*
         * Visit actions
         */
        [Actions.VISIT_UPDATE_VISIT]: 'handleUpdateVisit',
        [Actions.VISIT_CLEAR]: 'handleClearVisit',
        [Actions.VISIT_SET_MODIFIED]: 'handleSetModified',

        /*
         * List actions
         */
        [Actions.VISIT_LIST_UPDATE]: 'handleUpdateList',
        [Actions.VISIT_LIST_CLEAR]: 'handleClearList'
    }

    // =============================== \\

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.recentData = null;
        this.overviewModes = {};

        this.handleClearVisit();
        this.handleClearList();
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
        __debug("Clearing visit");
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
    getList() {
        return this.list;
    }

    /**
     *
     */
    handleClearList() {
        this.list = [];
    }

    /**
     *
     */
    handleUpdateList(visits) {
        this.list = visits;
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

    handleSetOverviewMode(payload) {
        var changed = false;
        for(var stage in payload) {
            if(this.overviewModes[stage] !== payload[stage]) {
                changed = true;
                this.overviewModes[stage] = payload[stage];
            }
        }

        if(changed) this.emitChange();
    }

    getOverviewModes() {
        return this.overviewModes;
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
            overviewModes: this.overviewModes,
            tab: this.tab
        };
    }

    rehydrate(state) {
        this.visit = state.visit;
        this.modified = state.modified;
        this.destination = state.destination;
        this.recentData = state.recentData;
        this.overviewModes = state.overviewModes;
        this.tab = state.tab
    }

}

export default VisitStore;
