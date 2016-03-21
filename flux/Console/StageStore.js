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
        [Actions.CONSOLE_STAGES_LOADED]: "handleStagesLoaded"
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
            stages: this.stages
        };
    }
    rehydrate(state) {
        this.stages = state.stages || {};
    }
}

export default StageStore;
