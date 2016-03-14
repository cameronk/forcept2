/**
 * forcept - flux/Route/RouteStore.js
 * @author Azuru Technology
 *
 * https://github.com/yahoo/fluxible/blob/master/packages/fluxible-router/lib/RouteStore.js
 */

import { RouteStore } from 'fluxible-router';
import routes from './Routes';

export default RouteStore.withStaticRoutes(routes);
