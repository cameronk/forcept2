/**
 * forcept - stores/AppStore.js
 * @author Azuru Technology
 */

import Actions from '../actions';
import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from '../Route/RouteStore';

class AppStore extends BaseStore {

    static storeName = 'AppStore'
    static handlers  = {
        [Actions.NAVIGATE_SUCCESS]: 'handlePageTitle',
        [Actions.APP_LOADING]: 'handleLoading',
        [Actions.APP_FLASH]: 'handleFlash',
        [Actions.APP_SET_STATUS]: 'setStatus'
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.setInitialState();
    }

    setInitialState() {
        /// Default state
        this.pageTitle = {
            id: "meta.titles.loading",
            defaultMessage: "Loading..."
        };
        this.loading = false;
        this.flash   = null;
        this.req   = {};
        this.route = {};
        this.status = null;
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
                this.emitChange();
            }
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

    /*
     * H20
     */
    dehydrate() {
        return {
            pageTitle: this.pageTitle,
            loading: this.loading,
            flash: this.flash,
            status: this.status
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
        this.loading = state.loading;
        this.flash = state.flash;
        this.status = state.status;
    }
}

export default AppStore;
