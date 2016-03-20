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

    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
    }


    getStages() {
        return {};
    }

    dehydrate() {
        return {
        };
    }
    rehydrate(state) {
    }
}

export default StageStore;
