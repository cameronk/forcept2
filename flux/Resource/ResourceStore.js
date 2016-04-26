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
    }

    // =============================== \\

        constructor(dispatcher) {
            super(dispatcher);
            this.setInitialState();
        }

        setInitialState() {
            this.uploadContext = null;
            this.uploadProgress = 0;

            this.handleClearCache();
            this.handleClearResources();
        }

    // =============================== \\

        handleUpdateResources(data) {

        }

        getResources() {
            return this.resources;
        }

        handleClearResources() {
            this.resources = {};
            this.emitChange();
        }

    // =============================== \\

        handleUpdateCache(data) {
            __debug("Updating ResourceStore cache.");
            __debug(data);
            for(var field in data) {
                this.cache[field] = data[field];
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
                resources   : this.resources,
                cache       : this.cache,
            };
        }

        rehydrate(state) {
            this.resources  = state.resources;
            this.cache      = state.cache;
        }
}

export default ResourceStore;
