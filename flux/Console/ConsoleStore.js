/**
 * forcept - flux/Console/ConsoleStore.js
 * @author Azuru Technology
 */

import Actions from '../actions';
import BaseStore from 'fluxible/addons/BaseStore';

class ConsoleStore extends BaseStore {

    static storeName = 'ConsoleStore'
    static handlers  = {
        [Actions.CONSOLE_SET_STATUS]: "setStatus"
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.status = null;
    }

    /** ============================ **/

    getStatus = () => this.status;

    setStatus = (status) => {
        if(this.status !== status) {
            this.status = status;
            this.emitChange();
        }
    }

    /** ============================ **/

    /*
     * H20
     */
    dehydrate() {
        return {
            status: this.status
        };
    }
    rehydrate(state) {
        this.status = state.status;
    }
}

export default ConsoleStore;
