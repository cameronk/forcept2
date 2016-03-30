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
        [Actions.APP_SET_LOADING_MODE]: 'handleSetLoadingMode',
        [Actions.APP_SET_LOADING_CONTAINER]: 'handleSetLoadingMode'
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
        this.loadingMode = "default";
        this.loadingContainer = "#Handler";
        this.req   = {};
        this.route = {};
    }

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

    /*
     * Set the current loading mode.
     */
    handleSetLoadingMode(mode) {
        if(["default", "container"].indexOf(mode) > -1) {
            this.loadingMode = mode;
            this.emitChange();
        }
    }

    /*
     * Get the current loading mode.
     */
    getLoadingMode() {
        return this.loadingMode;
    }

    /*
     * Set the loading container.
     */
    setLoadingContainer(container) {
        this.loadingContainer = container;
    }

    /*
     * get the loading container
     */
    getLoadingContainer() {
        return this.loadingContainer;
    }

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

    /*
     * H20
     */
    dehydrate() {
        return {
            pageTitle: this.pageTitle,
            loadingMode: this.loadingMode
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
        this.loadingMode = state.loadingMode;
    }
}

export default AppStore;
