/**
 * forcept - flux/Console/StageStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Console:StageStore');

class StageStore extends BaseStore {

    static storeName = 'StageStore'
    static handlers = {
        [Actions.CONSOLE_STAGES_LOADED]: 'handleStagesLoaded',
        [Actions.CONSOLE_STAGES_UPDATE_CACHE]: 'handleUpdateCache',
        [Actions.CONSOLE_STAGES_CLEAR_CACHE]: 'handleClearCache'
    }

    /**
     * Constructor / setup
     */
    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.stages = [];
        this.handleClearCache();
    }

    /**
     * Event handlers
     */
    handleStagesLoaded(stages) {
        if(stages !== null) {
            this.stages = stages;
        }
        this.emitChange();
    }

    /*
     * Update cache data
     */
    handleUpdateCache(data) {
        __debug("Updating cache.");

        this.cacheModified = true;

        for(var k in data) {
            __debug(" | %s", k);

            /// If this is a field, loop through its properties.
            if(k === "fields") {

                for(var f in data.fields) {

                    let thisField = data.fields[f];

                    __debug(" |==> #%s", f);

                    /// Add the field if it's not cached already.
                    if(!this.cache.fields.hasOwnProperty(f)) {
                        this.cache.fields[f] = thisField;
                    }

                    /// Otherwise, add properties individually
                    else {

                        /// Check field properties (name, type, description, settings, etc.)
                        for(var prop in thisField) {

                            /// Loop through settings if we've already stored them
                            if(prop === "settings" && this.cache.fields[f].hasOwnProperty('settings')) {
                                __debug(" |--|==> %s", prop);

                                /// Loop through settings (options, allowCustomData, etc.)
                                for(var setting in thisField['settings']) {

                                    /// Loop through options if we need to apply them individually.
                                    if(setting === "options" && this.cache.fields[f]['settings'].hasOwnProperty('options')) {

                                        var theseOptions = thisField['settings']['options'];

                                        __debug(" |--|--|==> %s", setting);

                                        for(var option in theseOptions) {

                                            var thisOption = theseOptions[option];

                                            /// null = delete
                                            if(thisOption === null) {
                                                __debug(" |--|--|--|==> #%s removed", option);
                                                delete this.cache.fields[f]['settings']['options'][option];
                                            } else {
                                                __debug(" |--|--|--|==> #%s = '%s'", option, thisOption.value || '');
                                                this.cache.fields[f]['settings']['options'][option] = thisOption;
                                            }

                                        }

                                    }

                                    /// Otherwise, apply settings / options..
                                    else {
                                        __debug(" |--|--|==> %s = '%s'", setting, thisField['settings'][setting]);
                                        this.cache.fields[f]['settings'][setting] = thisField['settings'][setting];
                                    }

                                }

                            }

                            /// Otherwise, apply property / settings object.
                            else {
                                __debug(" |--|==> %s = '%s'", prop, thisField[prop]);
                                this.cache.fields[f][prop] = thisField[prop];
                            }

                        }

                    }

                }

            } else if(this.cache.hasOwnProperty(k)) {
                __debug(" |==> '%s'", data[k]);
                this.cache[k] = data[k];
            }
        }
        this.emitChange();
    }

    /*
     * Reset cache back to empty values.
     */
    handleClearCache() {
        this.cacheModified = false;
        this.cache  = {
            name: "",
            type: "basic",
            fields: {}
        };
        this.emitChange();
    }

    /*
     * Get current cache data.
     */
    getCache() {
        return this.cache;
    }

    /**
     * Getters
     */
    getStages() {
        return this.stages;
    }

    hasLoadedStages() {
        return Object.keys(this.stages).length > 0;
    }

    /**
     * H20
     */
    dehydrate() {
        return {
            stages: this.stages,
            cache:  this.cache,
            cacheModified: this.cacheModified
        };
    }
    rehydrate(state) {
        this.stages = state.stages;
        this.cache  = state.cache;
        this.cacheModified = state.cacheModified;
    }
}

export default StageStore;
