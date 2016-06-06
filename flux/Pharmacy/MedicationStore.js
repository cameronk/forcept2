/**
 * forcept - flux/Patient/MedicationStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Pharmacy:MedicationStore');

class MedicationStore extends BaseStore {

    static storeName = 'MedicationStore'
    static handlers = {
        [Actions.PHARMACY_SET_STATUS]: "setStatus",
        [Actions.PHARMACY_MEDS_CACHE_UPDATE]: "updateCache",
        [Actions.PHARMACY_MEDS_CACHE_MODIFIED]: "cacheWasModified",
        [Actions.PHARMACY_MEDS_CACHE_CLEAR]: "clearCache",
        [Actions.PHARMACY_MEDS_UPDATE]: "updateMedications"
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.medications = {};
        this.status = null;
        this.clearCache();
    }

    /** ========================= **/

    getStatus = () => this.status;

    setStatus = (status) => {
        if(this.status !== status) {
            this.status = status;
            this.emitChange();
        }
    }

    /** ========================= **/

    getCache = () => this.cache;

    isCacheModified = () => this.cacheModified;

    updateCache = (data) => {
        for(var prop in data) {
            var thisProp = data[prop];
            if(prop === "quantities" && this.cache.hasOwnProperty('quantities')) {
                for(var qID in thisProp) {
                    var thisQuantity = thisProp[qID];
                    if(this.cache.quantities.hasOwnProperty(qID)) {
                        for(var quantProp in thisQuantity) {
                            this.cache.quantities[qID][quantProp] = thisQuantity[quantProp];
                        }
                    } else {
                        this.cache.quantities[qID] = thisProp[qID];
                    }
                }
            } else {
                this.cache[prop] = data[prop];
            }
        }
        this.emitChange();
    }

    cacheWasModified = (state) => {
        if(this.cacheModified !== state) {
            this.cacheModified = state;
            this.emitChange();
        }
    }

    clearCache = () => {
        this.cache = {
            name: ""
        };
        this.cacheModified = false;
    }

    /** ========================= **/

    getMedications = () => this.medications;

    updateMedications = (meds) => {
        for(var med in meds) {
            this.medications[med] = meds[med];
        }
        this.emitChange();
    }

    /**
     * H20
     */
    dehydrate() {
        return {
            medications: this.medications,
            cache: this.cache,
            statis: this.status,
            cacheModified: this.cacheModified
        };
    }

    rehydrate(state) {
        this.medications = state.medications;
        this.cache = state.cache;
        this.status = state.status;
        this.cacheModified = state.cacheModified;
    }

}

export default MedicationStore;
