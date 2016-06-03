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
import TestStore from './flux/Test/TestStore';

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
                    isAuthenticated: isAuthenticated
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

        var fieldTypes = {
            "text": {
                name: "Text",
                description: "",
                storageMethod: "text",
                defaultSettings: {}
            },
            "textarea": {
                name: "Textarea",
                description: "",
                storageMethod: "text",
                defaultSettings: {}
            },
            "number": {
                name: "Number",
                description: "",
                storageMethod: "text",
                defaultSettings: {}
            },
            "date": {
                name: "Date",
                description: "",
                storageMethod: "text",
                defaultSettings: {
                    useBroadSelector: false
                }
            },
            "radio": {
                name: "Radio",
                description: "Select a single option with a radio field or buttons",
                storageMethod: "text",
                defaultSettings: {}
            },
            "select": {
                name: "Select",
                description: "Select one or many options from a dropdown",
                storageMethod: "json",
                defaultSettings: {
                    options: {},
                    allowCustomData: false
                }
            },
            "file": {
                name: "File",
                description: "",
                storageMethod: "json",
                defaultSettings: {
                    accept: []
                }
            },
            "header": {
                name: "Header",
                description: "Group fields with a header",
                storageMethod: "none",
                defaultSettings: {}
            },
            "file": {
                name: "File",
                description: "",
                storageMethod: "json",
                defaultSettings: {}
            },
            "pharmacy": {
                name: "Pharmacy",
                description: "Show available medication",
                storageMethod: "json",
                defaultSettings: {}
            }
        };
        var displayTypes = {
            "chart": {
                name: "Chart",
                description: "Display data in a chart",
                defaultSettings: {}
            }
        };

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
app.registerStore(TestStore);

module.exports = app;
