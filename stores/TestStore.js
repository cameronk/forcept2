/**
 * forcept - stores/TestStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from './RouteStore';

import Actions from '../configs/actions';

class TestStore extends BaseStore {

    static storeName = 'TestStore'
    static handlers = {
        [Actions.TEST_ACTION]: 'handleTestAction'
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.dispatcher = dispatcher;

        this.arr = [];
    }

    handleTestAction(str) {
        this.arr.push(str);
        this.emitChange();
    }

    getArr() {
        return this.arr;
    }

}

export default TestStore;
