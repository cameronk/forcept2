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
        [Actions.PRESCRIPTION_UPDATE_STATUS]: "updateStatus",
        [Actions.PRESCRIPTION_SET_UPDATE]: "updateSets"
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.status = null;
        this.sets = {};
    }

    /** ========================= **/

    getStatus = () => this.status;

    updateStatus = (status) => {
        if(this.status !== status) {
            this.status = status;
            this.emitChange();
        }
    }

    /** ========================= **/

    getSets = () => this.sets;

    updateSets = (sets) => {
        for(var patientID in sets) {
            var thisSet = sets[patientID];
            if(this.sets.hasOwnProperty(patientID)) {
                for(var prop in thisSet) {
                    if(prop === "prescriptions" && this.sets[patientID].hasOwnProperty("prescriptions")) {
                        for(var prescriptionID in thisSet.prescriptions) {
                            var thisPrescription = thisSet.prescriptions[prescriptionID];
                            if(!this.sets[patientID].prescriptions.hasOwnProperty(prescriptionID)) {
                                this.sets[patientID].prescriptions[prescriptionID] = thisPrescription;
                            } else {
                                for(var prescriptionProp in thisPrescription) {
                                    this.sets[patientID].prescriptions[prescriptionID][prescriptionProp] = thisPrescription[prescriptionProp];
                                }
                            }
                        }
                    } else {
                        this.sets[patientID][prop] = thisSet[prop];
                    }
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
