/**
 * forcept - flux/Route/Routes.js
 * @author Azuru Technology
 */

import debug from 'debug';
import { LogoutAction } from '../Auth/AuthActions';
import { LoadStagesAction } from '../Stage/StageActions';
import { ClearVisitListAction } from '../Visit/VisitActions';
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

    /*
     * Authentication
     */
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
        title: "pages.login.title"
    },

    /*
     * Console
     */
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
        title: messages['pages.console.stages.title']
    },
    consoleUsers: {
        path: '/console/users',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Users'),
        title: messages['pages.console.stages.title']
    },
    consoleStagesStage: {
        path: '/console/stages/:stageID',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Stages'),
        title: messages["pages.console.stages.stage.title"]
    },
    consoleDisplays: {
        path: '/console/displays',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Displays'),
        title: null
    },
    consoleDisplaysGroup: {
        path: '/console/displays/:groupID',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Displays'),
        title: null
    },


    /*
     * Visits
     */
    visitStage: {
        path: '/visits/:stageID',
        namespace: 'visit',
        method: 'get',
        auth: true,
        handler: getPage('Visit/List'),
        action: ClearVisitListAction,
        title: messages["pages.console.stages.stage.title"]
    },

    visitStageHandle: {
       path: '/visits/:stageID/:visitID',
       namespace: 'visit',
       method: 'get',
       auth: true,
       handler: getPage('Visit/Handler'),
       title: messages["pages.console.stages.stage.title"]
   },

   /*
    * Displays
    */
    displayGroup: {
        path: '/displays/:groupID',
        namespace: 'display',
        method: 'get',
        auth: true,
        handler: getPage('Display/Group'),
        title: null
    },


};
