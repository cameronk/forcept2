/**
 * forcept - flux/Search/SearchStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Search:SearchStore');

class StageStore extends BaseStore {

    static storeName = 'SearchStore'
    static handlers = {
        [Actions.SEARCH_SET_CONTEXT]: 'setContext',
        [Actions.SEARCH_SET_QUERY]: 'setQuery',
        [Actions.SEARCH_SET_STATUS]: 'setStatus',
        [Actions.SEARCH_SET_RESULTS]: 'setResults',
        [Actions.SEARCH_SET_SELECTED]: 'setSelected',
        [Actions.SEARCH_RESET_RELATIVES]: 'resetRelatives',
        [Actions.SEARCH_CLEAR_QUERY]: 'clearQuery'
    }

    /**
     * Constructor / setup
     */
    constructor(dispatcher) {
        super(dispatcher);
        this.clearQuery();
        this.resetRelatives();
    }

    /** =================== **/

    clearQuery = () => {
        this.context = "name";
        this.query = "";
        this.status = null;
    }

    resetRelatives = () => {
        this.results = null;
        this.selected = [];
    }

    /** =================== **/

    getContext = () => this.context;

    setContext = (context) => {
        if(this.context !== context) {
            this.context = context;
            this.emitChange();
        }
    }

    /** =================== **/

    getQuery = () => this.query;

    setQuery = (query) => {
        if(this.query !== query) {
            this.query = query;
            this.emitChange();
        }
    }

    /** =================== **/

    getStatus = () => this.status;

    setStatus = (status) => {
        __debug("setStatus() to %s", status);
        if(this.status !== status) {
            this.status = status;
            this.emitChange();
        }
    }

    /** =================== **/

    getResults = () => this.results;

    setResults = (results) => {
        this.results = results;
        this.emitChange();
    }

    /** =================== **/

    getSelected = () => this.selected;

    setSelected = (selected) => {
        __debug("Updating selected patients: %j", selected);

        var modified = false;

        for(var selection in selected) {

            let thisIndex = this.selected.indexOf(selection);

            __debug("Removing patient %s (index: %s)", selection, thisIndex);

            switch(selected[selection]) {
                case "add":
                    if(thisIndex === -1) {
                        this.selected.push(selection);
                        modified = true;
                    }
                    break;
                case "del":
                    if(thisIndex !== -1) {
                        this.selected.splice(thisIndex, 1);
                        modified = true;
                    }
                    break;
            }
        }

        if(modified) {
            this.emitChange();
        }
    }

    /** =================== **/

    /**
     * H20
     */
    dehydrate() {
        return {
            context: this.context,
            query: this.query,
            status: this.status,
            results: this.results
        };
    }
    rehydrate(state) {
        this.context = state.context;
        this.query = state.query;
        this.status = state.status;
        this.results = state.results;
    }
}

export default StageStore;
