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
        [Actions.PATIENT_UPDATE]: 'handleUpdatePatient'
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
        this.patients = {};
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
     *          [field]: [value]
     *      }
     *  }
     */
    handleUpdatePatient(data) {
        __debug("Updating PatientStore cache.");
        __debug(data);

        for(var patient in data) {
            __debug(" | patient id #%s", patient);

            var thisPatient = data[patient];
            var updateName = false;

            /*
             * If this patient hasn't been added yet...
             */
            if(!this.patients.hasOwnProperty(patient)) {

                __debug(" |==> added");
                this.patients[patient] = thisPatient;

            }

            /*
             * Otherwise, loop through the fields applied.
             */
            else {

                for(var field in thisPatient) {

                    __debug(" |==> %s = %s", field, thisPatient[field]);
                    this.patients[patient][field] = thisPatient[field];

                }

            }

            // this.updateFullName()


            /*
             * update fullName as necessary
             */

            __debug(" |==> Updating name.");
            let name = [];
            if(this.patients[patient].firstName) name.push(this.patients[patient].firstName);
            if(this.patients[patient].lastName)  name.push(this.patients[patient].lastName);

            this.patients[patient].fullName = name.join(" ");

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
