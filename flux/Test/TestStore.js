/**
 * forcept - flux/Console/StageStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const ___debug = debug('forcept:flux:Stage:StageStore');

const __debug = (...args) => {
    if(process.env.BROWSER) {
        ___debug(...args);
    }
}

class TestStore extends BaseStore {

    static storeName = 'TestStore'
    static handlers = {
        [Actions.TEST_PUSH_MODEL]: 'handlePushModel',
        [Actions.TEST_UPDATE_MODEL]: 'handleUpdateModel',
    }

    /**
     * Constructor / setup
     */
    constructor(dispatcher) {
        super(dispatcher);
        this.model = null;
    }

    /*
     *
     */
    getModel() {
        return this.model;
    }

    handleUpdateModel(values) {
        this.model.set(values);
        this.emitChange();
    }

    /*
     *
     */
    handlePushModel(model) {
        __debug(model);
        __debug(model.set)
        this.model = model;
        this.emitChange();
    }

}

export default TestStore
