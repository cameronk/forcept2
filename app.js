/**
 * forcept - app.js
 * @author Azuru Technology
 */

/// Packages
import Fluxible from 'fluxible';
import FetchrPlugin from 'fluxible-plugin-fetchr';

/// Containers
import Root from './containers/Root';

/// Stores
import AppStore from './flux/App/AppStore';
import AuthStore from './flux/Auth/AuthStore';
import RouteStore from './flux/Route/RouteStore';
import StageStore from './flux/Stage/StageStore';
import VisitStore from './flux/Visit/VisitStore';
import PatientStore from './flux/Patient/PatientStore';
import ResourceStore from './flux/Resource/ResourceStore';
import UserStore from './flux/User/UserStore';
import DisplayStore from './flux/Display/DisplayStore';
import ConsoleStore from './flux/Console/ConsoleStore';
import MedicationStore from './flux/Pharmacy/MedicationStore';
import PrescriptionStore from './flux/Prescription/PrescriptionStore';
import SearchStore from './flux/Search/SearchStore';

///
import Manifest from './flux/manifest.js';

/// create new fluxible instance
const app = new Fluxible({
    component: Root
});

/// add fetchr plugin
app.plug(FetchrPlugin({
    xhrPath: '/api'
}));

/**
 * Add getRequest() method to all contexts.
 * NOTICE: any additional methods MUST be
 * propogated through components EXPLICITLY
 * defined in propTypes AND in the provideContext
 * method defined in containers/Root.
 */
app.plug({
    name: 'RequestPlugin',

     /**
     * Called after context creation to dynamically create a context plugin
     * @method plugContext
     * @param {Object} options Options passed into createContext
     * @param {Object} context FluxibleContext instance
     * @param {Object} app Fluxible instance
     */
    plugContext: function (options, context, app) {

        // `options` is the same as what is passed into `Fluxible.createContext(options)`
        var req     = options.req || {};
        var user    = options.user || {};
        var isAuthenticated = options.isAuthenticated || false;
        var configuration = options.configuration || {};

        var defineFor = function(context) {
            context.getRequest = function() {
                return req;
            };
            context.getUser = function(param) {
                if(!param) return user;
                if(!user.hasOwnProperty(param)) return null;
                return user[param];
            }
            context.isAuthenticated = function() {
                return isAuthenticated;
            }
            context.getConfiguration = function(param) {
                if(!param) return configuration;
                if(!configuration.hasOwnProperty(param)) return null;
                return configuration[param];
            }
        };

        // Returns a context plugin
        return {
            /**
             * Method called to allow modification of the component context
             * @method plugComponentContext
             * @param {Object} componentContext Options passed into createContext
             * @param {Object} context FluxibleContext instance
             * @param {Object} app Fluxible instance
             */
            plugComponentContext: function (componentContext, context, app) {
                defineFor(componentContext);
            },
            plugActionContext: function (actionContext, context, app) {
                defineFor(actionContext);
            },
            plugStoreContext: function (storeContext, context, app) {
                defineFor(storeContext);
            },

            /**
             * Allows context plugin settings to be persisted between server and client. Called on server
             * to send data down to the client
             * @method dehydrate
             */
            dehydrate: function () {
                return {
                    req: req,
                    user: user,
                    isAuthenticated: isAuthenticated,
                    configuration: configuration
                };
            },

            /**
             * Called on client to rehydrate the context plugin settings
             * @method rehydrate
             * @param {Object} state Object to rehydrate state
             */
            rehydrate: function (state) {
                req = state.req;
                user = state.user;
                isAuthenticated = state.isAuthenticated;
                configuration = state.configuration;
            }
        };
    },

    /**
     * Allows dehydration of application plugin settings
     * @method dehydrate
     */
    dehydrate: function () { return {}; },

    /**
     * Allows rehydration of application plugin settings
     * @method rehydrate
     * @param {Object} state Object to rehydrate state
     */
    rehydrate: function (state) {}

});

/**
 * NOTICE: any additional methods MUST be
 * propogated through components EXPLICITLY
 * defined in propTypes AND in the provideContext
 * method defined in containers/Root.
 */
app.plug({
    name: 'ModulePlugin',

     /**
     * Called after context creation to dynamically create a context plugin
     * @method plugContext
     * @param {Object} options Options passed into createContext
     * @param {Object} context FluxibleContext instance
     * @param {Object} app Fluxible instance
     */
    plugContext: function (options, context, app) {

        var fieldTypes   = Manifest.Fields;
        var displayTypes = Manifest.Displays;

        var defineFor = function(ctx) {
            ctx.getFieldTypes = () => fieldTypes;
            ctx.getDisplayTypes = () => displayTypes;
        };

        // Returns a context plugin
        return {
            /**
             * Method called to allow modification of the component context
             * @method plugComponentContext
             * @param {Object} componentContext Options passed into createContext
             * @param {Object} context FluxibleContext instance
             * @param {Object} app Fluxible instance
             */
            plugComponentContext: function (componentContext, context, app) {
                defineFor(componentContext);
            },
            plugActionContext: function (actionContext, context, app) {
                defineFor(actionContext);
            },
            plugStoreContext: function (storeContext, context, app) {
                defineFor(storeContext);
            },

            /**
             * Allows context plugin settings to be persisted between server and client. Called on server
             * to send data down to the client
             * @method dehydrate
             */
            dehydrate: function () {
                return {
                    // fieldTypes: fieldTypes
                };
            },

            /**
             * Called on client to rehydrate the context plugin settings
             * @method rehydrate
             * @param {Object} state Object to rehydrate state
             */
            rehydrate: function (state) {
                // fieldTypes = state.fieldTypes;
            }
        };
    },

    /**
     * Allows dehydration of application plugin settings
     * @method dehydrate
     */
    dehydrate: function () { return {}; },

    /**
     * Allows rehydration of application plugin settings
     * @method rehydrate
     * @param {Object} state Object to rehydrate state
     */
    rehydrate: function (state) {}

});

/// register stores
app.registerStore(RouteStore);
app.registerStore(AppStore);
app.registerStore(AuthStore);
app.registerStore(StageStore);
app.registerStore(VisitStore);
app.registerStore(PatientStore);
app.registerStore(ResourceStore);
app.registerStore(DisplayStore);
app.registerStore(ConsoleStore);
app.registerStore(UserStore);
app.registerStore(MedicationStore);
app.registerStore(PrescriptionStore);
app.registerStore(SearchStore);

module.exports = app;
