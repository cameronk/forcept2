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
        [Actions.PRESCRIPTION_SET_UPDATE]: "updateSets",
        [Actions.PRESCRIPTION_SETS_CLEAR]: "clearSets",
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

    getSet  = (id) => this.sets[id.toString()];

    updateSets = (sets) => {
        for(var patientID in sets) {
            var thisSet = sets[patientID];
            if(this.sets.hasOwnProperty(patientID)) {
                for(var prop in thisSet) {
                    if(prop === "prescriptions" && this.sets[patientID].hasOwnProperty("prescriptions")) {
                        for(var prescriptionID in thisSet.prescriptions) {
                            var thisPrescription = thisSet.prescriptions[prescriptionID];
                            if(thisPrescription === null) {
                                delete this.sets[patientID].prescriptions[prescriptionID];
                            } else {
                                if(!this.sets[patientID].prescriptions.hasOwnProperty(prescriptionID)) {
                                    this.sets[patientID].prescriptions[prescriptionID] = thisPrescription;
                                } else {
                                    for(var prescriptionProp in thisPrescription) {
                                        this.sets[patientID].prescriptions[prescriptionID][prescriptionProp] = thisPrescription[prescriptionProp];
                                    }
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

    clearSets = () => this.setInitialState()

    /** ========================= **/

    /**
     * H20
     */
    dehydrate() {
        return {
            status: this.status,
            sets: this.sets
        };
    }

    rehydrate(state) {
        this.status = state.status;
        this.sets = state.sets;
    }

}

export default PrescriptionStore;
