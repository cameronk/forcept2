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
        [Actions.PHARMACY_PSET_UPDATE]: "updateSets"
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.sets = {};
    }

    /** ========================= **/

    getSets = () => this.sets;

    updateSets = (sets) => {

        __debug(sets);
        for(var patientID in sets) {
            var thisSet = sets[patientID];
            if(this.sets.hasOwnProperty(patientID)) {
                for(var prop in thisSet) {
                    this.sets[patientID][prop] = thisSet[prop];
                }
            } else {
                this.sets[patientID] = thisSet;
            }
        }
        this.emitChange();
    }

    /** ========================= **/

    /**
     * H20
     */
    dehydrate() {
        return {
            sets: this.sets
        };
    }

    rehydrate(state) {
        this.sets = state.sets
    }

}

export default PrescriptionStore;
