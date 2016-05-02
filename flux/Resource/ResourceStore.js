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
        [Actions.RESOURCES_UPDATE_CACHE]: 'handleUpdateCache',
        [Actions.RESOURCES_SET_UPLOAD_CONTEXT]: 'handleSetUploadContext',
        [Actions.RESOURCES_SET_UPLOAD_PROGRESS]: 'handleSetUploadProgress',
        [Actions.RESOURCES_PROCESS_FIELD]: 'handleProcessField',
    }

    // =============================== \\

        constructor(dispatcher) {
            super(dispatcher);
            this.setInitialState();
        }

        setInitialState() {
            this.processingFields = [];
            this.uploadContext = null;
            this.uploadProgress = 0;

            this.handleClearCache();
        }

    // =============================== \\

        handleProcessField(fields) {
            __debug(fields);
            for(var field in fields) {
                /// true -> add field
                if(fields[field] === true) {
                    this.processingFields.push(field);
                    this.emitChange();
                }

                /// false -> remove field
                else {
                    var index = this.processingFields.indexOf(field);
                    while(index > -1) {
                        this.processingFields.splice(index, 1);
                        index = this.processingFields.indexOf(field);
                    }
                    this.emitChange();
                }
            }
        }

        getProcessingFields() {
            return this.processingFields;
        }

    // =============================== \\

        handleUpdateCache(data) {
            __debug("Updating ResourceStore cache.");
            __debug(data);
            for(var field in data) {
                var resources = data[field];
                if(resources === null) {
                    delete this.cache[field];
                } else {
                    this.cache[field] = data[field];
                }
            }

            this.emitChange();
        }

        getCache() {
            return this.cache;
        }

        handleClearCache() {
            this.cache  = {};
            this.emitChange();
        }

    // =============================== \\

        handleSetUploadContext(context) {
            __debug(context);
            if(this.uploadContext !== context) {
                this.uploadContext = context;
                this.emitChange();
            }
        }

        getUploadContext() {
            return this.uploadContext;
        }

    // =============================== \\

        handleSetUploadProgress(progress) {
            if(this.uploadProgress !== progress) {
                this.uploadProgress = progress;
                this.emitChange();
            }
        }

        getUploadProgress() {
            return this.uploadProgress;
        }

    // =============================== \\

        dehydrate() {
            return {
                processingFields: this.processingFields,
                cache       : this.cache,
            };
        }

        rehydrate(state) {
            this.processingFields = state.processingFields;
            this.cache      = state.cache;
        }
}

export default ResourceStore;
