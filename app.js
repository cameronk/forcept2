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
import ApplicationStore from './stores/ApplicationStore';
import RouteStore from './stores/RouteStore';
import TestStore from './stores/TestStore';

/// create new fluxible instance
const app = new Fluxible({
    component: Root
});

/// add fetchr plugin
app.plug(FetchrPlugin({
    xhrPath: '/api'
}));

/// register stores
app.registerStore(RouteStore);
app.registerStore(ApplicationStore);
app.registerStore(TestStore);

module.exports = app;
