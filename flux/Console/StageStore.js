/**
 * forcept - flux/Console/StageStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Console:StageStore');

class StageStore extends BaseStore {

    static storeName = 'StageStore'
    static handlers = {
        [Actions.CONSOLE_STAGES_LOADED]: 'handleStagesLoaded',
        [Actions.CONSOLE_STAGES_UPDATE_CACHE]: 'handleUpdateCache'
    }

    /**
     * Constructor / setup
     */
    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.stages = {};
        this.cache  = {
            name: "",
            type: "basic",
            fields: {}
        };
    }

    /**
     * Event handlers
     */
    handleStagesLoaded(stages) {
        if(typeof stages === "object" && stages !== null) {
            this.stages = stages;
        }
        this.emitChange();
    }

    /*
     * Update cache data
     */
    handleUpdateCache(data) {
        for(var k in data) {
            if(k === "fields") {
                for(var f in data.fields) {
                    this.cache.fields[f] = data.fields[f];
                }
            } else if(this.cache.hasOwnProperty(k)) {
                this.cache[k] = data[k];
            }
        }
        this.emitChange();
    }
    /*
     * Get current cache data.
     */
    getCache() {
        return this.cache;
    }

    /**
     * Getters
     */
    getStages() {
        return this.stages;
    }

    hasLoadedStages() {
        return Object.keys(this.stages).length > 0;
    }

    /**
     * H20
     */
    dehydrate() {
        return {
            stages: this.stages,
            cache:  this.cache
        };
    }
    rehydrate(state) {
        this.stages = state.stages;
        this.cache  = state.cache;
    }
}

export default StageStore;
