/**
 * forcept - flux/Console/ResourceStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Resource:ResourceStore');

/**
 * ResourceStore schematic
 *
 * Cache: maintains state of various inputs once files are chosen but before they are uploaded
 *
 */
class ResourceStore extends BaseStore {

    static storeName = 'ResourceStore'
    static handlers = {
        [Actions.RESOURCES_UPDATE_STATE]: 'handleUpdateState'
    }

    // =============================== \\

        constructor(dispatcher) {
            super(dispatcher);
            this.state = {};
        }

    // =============================== \\


        /**
         * {
         *      [fieldID]: {
         *          [patientID]: {
         *              status: "uploading"/"waiting"/"processing"
         *              cache: [array of cached files]
         *          }
         *      }
         * }
         */
        handleUpdateState(fields) {
            for(var field in fields) {
                var thisField = fields[field];

                if(!this.state[field]) {
                    this.state[field] = thisField;
                } else {
                    for(var patient in thisField) {

                        var thisPatient = thisField[patient];
                        if(thisPatient === null) {
                            delete this.state[field][patient];
                        } else {
                            if(!this.state[field].hasOwnProperty(patient)) {
                                this.state[field][patient] = thisPatient;
                            } else {
                                for(var key in thisPatient) {
                                    this.state[field][patient][key] = thisPatient[key];
                                }
                            }
                        }
                    }
                }
            }
            this.emitChange();
        }

        getState() {
            return this.state;
        }

    // =============================== \\

        dehydrate() {
            return {
                state: this.state
            };
        }

        rehydrate(state) {
            this.state      = state.state;
        }
}

export default ResourceStore;
