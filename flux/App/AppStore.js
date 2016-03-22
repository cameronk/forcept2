/**
 * forcept - stores/AppStore.js
 * @author Azuru Technology
 */

import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from '../Route/RouteStore';

class AppStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.pageTitle = {
            id: "meta.titles.loading",
            defaultMessage: "Loading..."
        };
        this.req   = {};
        this.route = {};
    }
    handlePageTitle(currentRoute) {
        this.dispatcher.waitFor(RouteStore, () => {
            this.route = currentRoute;
            if (currentRoute && currentRoute.title) {
                this.pageTitle = currentRoute.title;
                this.emitChange();
            }
        });
    }
    isAuthenticated() {
        return (this.req.hasOwnProperty('isAuthenticated') && this.req.isAuthenticated);
    }
    getPageTitle() {
        return this.pageTitle;
    }
    dehydrate() {
        return {
            pageTitle: this.pageTitle
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
    }
}

AppStore.storeName = 'AppStore';
AppStore.handlers = {
    'NAVIGATE_SUCCESS': 'handlePageTitle'
};

export default AppStore;
