/**
 * forcept - stores/AppStore.js
 * @author Azuru Technology
 */

import debug from 'debug';

import Actions from '../actions';
import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from '../Route/RouteStore';

const __debug = debug('forcept:flux:App:AppStore');

class AppStore extends BaseStore {

    static storeName = 'AppStore'
    static handlers  = {
        [Actions.NAVIGATE_SUCCESS]: 'handlePageTitle',
        [Actions.APP_LOADING]: 'handleLoading',
        [Actions.APP_FLASH]: 'handleFlash',
        [Actions.APP_SET_STATUS]: 'setStatus',

        [Actions.APP_UPDATE_CONFIG]: 'updateConfig',
        [Actions.APP_CONFIG_CHANGED]: 'setConfigChanged'
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        /// Default state
        this.pageTitle = null;
        this.loading = false;
        this.flash   = null;
        this.req   = {};
        this.route = {};
        this.status = null;

        this.config = {};
        this.configChanged = false;
    }

    // =============================== \\

    /*
     *
     */
    isLoading() {
        return this.loading;
    }

    /*
     *
     */
    handleLoading(status) {
        if(this.loading !== status)  {
            this.loading = status;
            this.emitChange();
        }
    }

    // =============================== \\

    /*
     *
     */
    getFlash() {
        return this.flash;
    }

    /*
     *
     */
    handleFlash(flash) {
        if(flash === null) {
            if(this.flash !== flash) {
                this.flash = flash;
                this.emitChange();
            }
        } else {
            if(typeof flash === "object") {
                this.flash = flash;
                this.emitChange();
            }
        }
    }

    // =============================== \\

    /*
     * Update current page title.
     */
    handlePageTitle(currentRoute) {
        this.dispatcher.waitFor(RouteStore, () => {

            this.route = currentRoute;

            if (currentRoute && currentRoute.title) {
                this.pageTitle = currentRoute.title;
            } else {
                this.pageTitle = null;
            }

            this.emitChange();

        });
    }

    /*
     * Get current page title.
     */
    getPageTitle() {
        return this.pageTitle;
    }

    // =============================== \\

    getStatus = () => this.status;

    setStatus = (status) => {
        if(this.status !== status) {
            this.status = status;
            this.emitChange();
        }
    }

    // =============================== \\

    getConfig = () => this.config;

    updateConfig = (config) => {
        for(var k in config) {
            this.config[k] = config[k];
        }
        this.emitChange();
    }

    setConfigChanged = (status) => {
        this.configChanged = status;
        this.emitChange();
    }

    hasConfigChanged = () => this.configChanged;

    // =============================== \\

    /*
     * H20
     */
    dehydrate() {
        return {
            pageTitle: this.pageTitle,
            loading: this.loading,
            flash: this.flash,
            status: this.status,

            config: this.config,
            configChanged: this.configChanged
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
        this.loading = state.loading;
        this.flash = state.flash;
        this.status = state.status;

        this.config = state.config;
        this.configChanged = state.configChanged;
    }
}

export default AppStore;
