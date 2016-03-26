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
        [Actions.STAGES_LOADED]: 'handleStagesLoaded',
        [Actions.STAGES_UPDATE_CACHE]: 'handleUpdateCache',
        [Actions.STAGES_LOAD_ERROR]: 'handleStageLoadError',
        [Actions.STAGES_SET_OPTION_SHIFT_CONTEXT]: 'handleSetOptionShiftContext',
        [Actions.STAGES_CLEAR_CACHE]: 'handleClearCache',
        [Actions.STAGES_CACHE_MODIFIED]: 'handleCacheWasModified',
        [Actions.STAGES_SET_STATUS]: 'handleSetStatus'
    }

    /**
     * Constructor / setup
     */
    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        this.error  = false;
        this.optionShiftContext = false;
        this.stages = [];
        this.handleClearCache();
    }

    handleSetOptionShiftContext(ctx) {
        this.optionShiftContext = ctx;
        this.emitChange();
    }

    getOptionShiftContext() {
        return this.optionShiftContext;
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

    handleStageLoadError(err) {
        this.error = err;
        this.emitChange();
    }

    getError() {
        return this.error;
    }

    /**
     * Get default settings for a field type.
     * @return Object
     */
    getDefaultSettings(type) {
        switch(type) {
            case "date":
                return {
                    useBroadSelector: false
                };
                break;
            case "select":
                return {
                    options: {},
                    allowCustomData: false
                };
                break;
            case "multiselect":
                return {
                    options: {}
                };
                break;
            case "file":
                return {
                    accept: []
                };
                break;
            default:
                return {};
                break;
        }
    }

    /*
     * The cache was modified.
     */
    handleCacheWasModified() {
        __debug("cache was modified");
        this.cacheModified = true;
        this.emitChange();
    }

    /*
     * Update cache data
     */
    handleUpdateCache(data) {
        __debug("Updating cache.");

        for(var k in data) {
            __debug(" | %s", k);

            /// If this is a field, loop through its properties.
            if(k === "fields") {

                for(var f in data.fields) {

                    let thisField = data.fields[f];
                    let fieldAlreadyExists = this.cache.fields.hasOwnProperty(f);
                    __debug(" |==> #%s", f);

                    if(thisField === null && fieldAlreadyExists) {
                        delete this.cache.fields[f];
                    } else {

                        /// Add the field if it's not cached already.
                        if(!fieldAlreadyExists) {
                            this.cache.fields[f] = thisField;
                        }

                        /// Otherwise, add properties individually
                        else {

                            /// Check field properties (name, type, description, settings, etc.)
                            for(var prop in thisField) {

                                /// Loop through settings if we've already stored them
                                if(prop === "settings" && this.cache.fields[f].hasOwnProperty('settings')) {

                                    __debug(" |--|==> %s", prop);

                                    /// If the passed settings are null, reset settings object
                                    if(thisField['settings'] === null) {

                                        __debug(" |--|--|==> overwriting settings with new object");

                                        var type;

                                        /// Make sure we have a type available
                                        if(this.cache.fields[f]['type']) {
                                            type = this.cache.fields[f]['type'];
                                        } else if(thisField['type']) {
                                            type = thisField['type'];
                                        }

                                        /// Get default settings for this field type
                                        this.cache.fields[f]['settings'] = type ? this.getDefaultSettings(type) : {};

                                    }

                                    /// Loop through settings (options, allowCustomData, etc.)
                                    for(var setting in thisField['settings']) {

                                        /// Loop through options if we need to apply them individually.
                                        if(setting === "options" && this.cache.fields[f]['settings'].hasOwnProperty('options')) {

                                            var theseOptions = thisField['settings']['options'];
                                            var theseKeys    = Object.keys(theseOptions);
                                            __debug(" |--|--|==> %s", setting);

                                            if(theseKeys.length > 0) {
                                                if(theseKeys.length > 1) {
                                                    /// Multiple options set (probably in a new order).
                                                    this.cache.fields[f]['settings']['options'] = theseOptions;
                                                    __debug(" |--|--|--|==> options overwritten");
                                                } else {
                                                    var singleOptionKey = theseKeys[0];
                                                    var thisOption = theseOptions[singleOptionKey];

                                                    if(thisOption === null) {
                                                        __debug(" |--|--|--|==> #%s removed", singleOptionKey);
                                                        delete this.cache.fields[f]['settings']['options'][singleOptionKey];
                                                    } else {
                                                        __debug(" |--|--|--|==> #%s = '%s'", singleOptionKey, thisOption.value || '');
                                                        this.cache.fields[f]['settings']['options'][singleOptionKey] = thisOption;
                                                    }
                                                }
                                            }

                                            /*for(var option in theseOptions) {

                                                var thisOption = theseOptions[option];

                                                /// null = delete
                                                if(thisOption === null) {
                                                    __debug(" |--|--|--|==> #%s removed", option);
                                                    delete this.cache.fields[f]['settings']['options'][option];
                                                } else {
                                                    __debug(" |--|--|--|==> #%s = '%s'", option, thisOption.value || '');
                                                    this.cache.fields[f]['settings']['options'][option] = thisOption;
                                                }

                                            }*/

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

                }

            } else if(this.cache.hasOwnProperty(k)) {
                __debug(" |==> '%s'", data[k]);
                this.cache[k] = data[k];
            }
        }

        __debug("New cache:");
        __debug(this.cache);

        this.emitChange();
    }

    /*
     * Reset cache back to empty values.
     */
    handleClearCache() {
        __debug("Clearing cache.");
        this.error  = false;
        this.status = null;
        this.cacheModified = false;
        this.cache  = {
            name: "",
            type: "basic",
            fields: {}
        };
        this.emitChange();
    }

    handleSetStatus(status) {
        this.status = status;
        this.emitChange();
    }

    getStatus() {
        return this.status;
    }

    /*
     * Get current cache data.
     */
    getCache() {
        return this.cache;
    }

    isCacheModified() {
        return this.cacheModified;
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
            error:  this.error,
            status: this.status,
            stages: this.stages,
            cache:  this.cache,
            cacheModified: this.cacheModified
        };
    }
    rehydrate(state) {
        this.error  = state.error;
        this.status = state.status;
        this.stages = state.stages;
        this.cache  = state.cache;
        this.cacheModified = state.cacheModified;
    }
}

export default StageStore;
