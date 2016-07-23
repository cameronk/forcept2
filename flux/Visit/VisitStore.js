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
        [Actions.VISIT_SET_CURRENT_TAB]: 'setCurrentTab',
        [Actions.VISIT_SET_DESTINATION]: 'setDestination',
        [Actions.VISIT_SET_RECENT_DATA]: 'setRecentData',
        [Actions.VISIT_SET_STATUS]: 'setStatus',
        [Actions.VISIT_SET_SIDEBAR_VISIBILITY]: 'setSidebarVisibility',

        /*
         * Visit actions
         */
        [Actions.VISIT_UPDATE_VISIT]: 'updateVisit',
        [Actions.VISIT_CLEAR]: 'clearVisit',
        [Actions.VISIT_SET_MODIFIED]: 'setModified',

        /*
         * List actions
         */
        [Actions.VISIT_LIST_UPDATE]: 'updateList',
        [Actions.VISIT_LIST_CLEAR]: 'clearList'
    }

    // =============================== \\

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {

        this.status = null;
        this.recentData = null;
        this.overviewModes = {};
        this.sidebarVisibility = false;

        this.clearVisit();
        this.clearList();
    }

    // =============================== \\

    setSidebarVisibility = (status) => {
        if(this.sidebarVisibility !== status) {
            this.sidebarVisibility = status;
            this.emitChange();
        }
    }

    getSidebarVisibility = () => this.sidebarVisibility;

    // =============================== \\

    setStatus = (status) => {
        if(this.status !== status) {
            this.status = status;
            this.emitChange();
        }
    }

    getStatus = () => this.status;

    // =============================== \\

    /*
     * Get the current Visit visit.
     */
    getVisit = () => this.visit;

    /*
     * Clear the visit.
     */
    clearVisit = () => {
        __debug("Clearing visit.");
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
    updateVisit = (data) => {
        __debug("Updating VisitStore visit.");
        for(var field in data) {
            __debug(" | %s = %s", field, data[field]);
            this.visit[field] = data[field];
        }
        this.emitChange();
    }

    // =============================== \\

    /**
     * Visit List
     * => Stores an array of visits with respective patient information
     *    for viewing on the "stage visits" page.
     *
     * Values:
     * -> null:   no visits loaded into visit list
     * -> array:  array of visits w/ pre-loaded information
     */
    getList = () => this.list;

    clearList = () => {
        __debug("Clearing visit list.");
        this.list = null;
    }

    updateList = (visits) => {
        this.list = visits;
        this.emitChange();
    }

    // =============================== \\

    /*
     *
     */
    getRecentData = () => this.recentData;

    /*
     *
     */
    setRecentData = (data) => {
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


    // =============================== \\

    setModified = (state) => {
        if(this.modified !== state) {
            this.modified = state;
            this.emitChange();
        }
    }

    isModified = () => this.modified;

    // =============================== \\

    /*
     * Get the current tab.
     */
    getCurrentTab = () => this.tab;

    /*
     * Set the current tab.
     */
    setCurrentTab = (location) => {
        if(this.tab !== location) {
            this.tab = location;
            this.emitChange();
        }
    }

    // =============================== \\

    /*
     *
     */
    getDestination = () => this.destination;

    /*
     *
     */
    setDestination = (destination) => {
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
            status: this.status,
            visit: this.visit,
            modified: this.modified,
            destination: this.destination,
            recentData: this.recentData,
            tab: this.tab
        };
    }

    rehydrate(state) {
        this.status = state.status;
        this.visit = state.visit;
        this.modified = state.modified;
        this.destination = state.destination;
        this.recentData = state.recentData;
        this.tab = state.tab
    }

}

export default VisitStore;
