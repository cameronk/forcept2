/**
 * forcept - flux/Route/Routes.js
 * @author Azuru Technology
 */

import debug from 'debug';
import { LogoutAction } from '../Auth/AuthActions';
// import { LoadStagesAction } from '../Console/StageActions';
import { defineMessages } from 'react-intl';

const __debug = debug('forcept:flux:Route:Routes');
const messages = defineMessages({
    "pages.console.title": {
        id: "pages.console.title",
        defaultMessage: "Console / Forcept"
    },
    "pages.console.stages.title": {
        id: "pages.console.stages.title",
        defaultMessage: "Stages / Console / Forcept"
    },
    "pages.console.stages.stage.title": {
        id: "pages.console.stages.stage.title",
        defaultMessage: "{name} / Stages / Console / Forcept"
    }
});

/*
 * Require a page.
 */
function getPage(page) {
    __debug("Grabbing page '%s'", page);
    return require('../../containers/pages/' + page);
};

export default {
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'Home',
        auth: true,
        handler: getPage('Home')
    },

    /** Auth **/
    logout: {
        path: '/auth/logout',
        method: 'get',
        page: 'logout',
        auth: true,
        handler: getPage('Auth/Logout'),
        action: LogoutAction
    },
    login: {
        path: '/auth/login',
        method: 'get',
        page: 'login',
        antiAuth: true,
        handler: getPage('Auth/Login'),
        // title: 'Login | Forcept',

        title: "pages.login.title"
    },

    /** Admin **/
    console: {
        path: '/console',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Index'),
        title: messages["pages.console.title"]
    },
    consoleStages: {
        path: '/console/stages',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Stages'),
        title: messages["pages.console.stages.title"]
    },
    consoleStagesStage: {
        path: '/console/stages/:id',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Stages'),
        title: messages["pages.console.stages.stage.title"]
    }
};
