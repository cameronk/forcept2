/**
 * forcept - flux/Patient/PrescriptionStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Pharmacy:PrescriptionStore');

class PrescriptionStore extends BaseStore {

    static storeName = 'PrescriptionStore'
    static handlers = {
        [Actions.PHARMACY_PSET_UPDATE]: "updateSet"
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.set = {};
    }

    /** ========================= **/

    getSet = () => this.set;

    updateSet = (data) => {
        this.set = data;
    }

    /** ========================= **/

    /**
     * H20
     */
    dehydrate() {
        return {
            set: this.set
        };
    }

    rehydrate(state) {
        this.set = state.set
    }

}

export default PrescriptionStore;
