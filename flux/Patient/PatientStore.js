/**
 * forcept - flux/Patient/PatientStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Patient:PatientStore');

class PatientStore extends BaseStore {

    static storeName = 'PatientStore'
    static handlers = {
        [Actions.PATIENT_UPDATE]: 'handleUpdatePatient',
        [Actions.PATIENT_CLEAR_ALL]: 'handleClearPatients'
    }

    constructor(dispatcher) {
       super(dispatcher);
       this.setInitialState();
    }

    setInitialState() {
        this.handleClearPatients();
    }

    /**
     * Clear out the patients cache.
     */
    handleClearPatients() {
        __debug("Clearing patients");
        this.patients = {};
        this.emitChange();
    }

    /**
     * Get the current patient cache.
     */
    getPatients() {
        return this.patients;
    }

    /**
     * Systematically update cache based on passed data.
     * @params data: Object
     *  {
     *      [patient ID]: {
     *          [stage ID]: {
     *              [field ID]: [value]
     *          }
     *      }
     *  }
     */
    handleUpdatePatient(data) {
        __debug("Updating PatientStore cache.");
        __debug(data);

        for(var patient in data) {
            __debug(" | patient id #%s", patient);

            if(!isNaN(patient)) {

                var thisPatient = data[patient];

                /*
                 * If this patient hasn't been added yet...
                 */
                if(!this.patients.hasOwnProperty(patient)) {

                    __debug(" |==> Creating new patient.");
                    this.patients[patient] = thisPatient;

                } else {

                    for(var stageID in thisPatient) {

                        __debug(" |==> %s", stageID);

                        var updateName = false;
                        var thisPatientStage = thisPatient[stageID];

                        /*
                         * If the patient exists, but not with this stage...
                         */
                        if(!this.patients[patient].hasOwnProperty(stageID)) {

                            __debug(" |--|==> pushed stage: %s", stageID);
                            this.patients[patient][stageID] = thisPatientStage;

                        }

                        /*
                         * Otherwise, loop through the fields applied.
                         */
                        else {

                            for(var field in thisPatientStage) {

                                __debug(" |--|==> %s = %s", field, thisPatientStage[field]);
                                this.patients[patient][stageID][field] = thisPatientStage[field];

                            }

                        }

                        /*
                         * update fullName as necessary
                         */
                        if(this.patients[patient][stageID].hasOwnProperty('fullName')) {
                            __debug(" |==> Updating name.");
                            let name = [];

                            if(this.patients[patient][stageID].firstName) name.push(this.patients[patient][stageID].firstName);
                            if(this.patients[patient][stageID].lastName)  name.push(this.patients[patient][stageID].lastName);

                            this.patients[patient][stageID].fullName = name.join(" ");
                        }

                    }

                }

            }

        }

        this.emitChange();
    }


    /**
     * H20
     */
    dehydrate() {
        return {
            patients: this.patients
        };
    }

    rehydrate(state) {
        this.patients = state.patients;
    }

}

export default PatientStore;
