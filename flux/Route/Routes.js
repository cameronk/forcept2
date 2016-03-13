/**
 * forcept - flux/Route/Routes.js
 * @author Azuru Technology
 */

import debug from 'debug';
import { LogoutAction } from '../Auth/AuthActions';
import { defineMessages } from 'react-intl';

const messages = defineMessages({

});

const __debug = debug('forcept:flux:Route:Routes');

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
        handler: getPage('Home'),
    },
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        auth: true,
        handler: getPage('About'),
        title: 'About',
    },
    logout: {
        path: '/auth/logout',
        method: 'get',
        page: 'logout',
        auth: true,
        action: LogoutAction
    },
    login: {
        path: '/auth/login',
        method: 'get',
        page: 'login',
        antiAuth: true,
        handler: getPage('Login'),
        title: 'Login | Forcept'
    }
};
