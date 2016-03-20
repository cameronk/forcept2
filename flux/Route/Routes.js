/**
 * forcept - flux/Route/Routes.js
 * @author Azuru Technology
 */

import debug from 'debug';
import { LogoutAction } from '../Auth/AuthActions';
import { defineMessages } from 'react-intl';

const __debug = debug('forcept:flux:Route:Routes');
const messages = defineMessages({
    aboutTitle: {
        id: "pages.about.title",
        defaultMessage: "About / Forcept"
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
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        auth: true,
        handler: getPage('About'),
        title: messages.aboutTitle,
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
        title: 'Console'
    },
    consoleStages: {
        path: '/console/stages',
        namespace: 'console',
        method: 'get',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Stages'),
        title: 'Console Stages'
    }
};
