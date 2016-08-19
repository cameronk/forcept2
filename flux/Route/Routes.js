/**
 * forcept - flux/Route/Routes.js
 * @author Azuru Technology
 */

import debug from 'debug';
import { defineMessages } from 'react-intl';

import { LogoutAction } from '../Auth/AuthActions';
import { LoadStagesAction } from '../Stage/StageActions';
import { LoadVisitListAction } from '../Visit/VisitActions';
import { LoadMedicationPageActions } from '../Pharmacy/MedicationActions';

const __debug = debug('forcept:flux:Route:Routes');
const messages = defineMessages({

    /// Authentication
    loginTitle: {
        id: "pages.login.title",
        defaultMessage: "Login"
    },
    logoutTitle: {
        id: "pages.logout.title",
        defaultMessage: "Logout"
    },

    /// Console
    consoleTitle: {
        id: "pages.console.title",
        defaultMessage: "Console"
    },

    /// Stages
    consoleStagesTitle: {
        id: "pages.console.stages.title",
        defaultMessage: "Stages / Console"
    },
    consoleStagesStateTitle: {
        id: "pages.console.stages.stage.title",
        defaultMessage: "{name} / Stages / Console"
    },

    /// Users
    consoleUsersTitle: {
        id: "pages.console.users.title",
        defaultMessage: "Users / Console"
    },

    /// Displays
    consoleDisplaysTitle: {
        id: "pages.console.displays.title",
        defaultMessage: "Displays / Console"
    },
    consoleDisplaysGroupTitle: {
        id: "pages.console.displays.group.title",
        defaultMessage: "{group} / Displays / Console"
    },

    /// Data management
    consoleDataManagementTitle: {
        id: "pages.console.dataManagement.title",
        defaultMessage: "Data management / Console"
    },

    /// Visits
    visitsAtStageTitle: {
        id: "pages.visits.stage.title",
        defaultMessage: "Visits"
    },
    handleVisitsAtStageTitle: {
        id: "pages.visits.stage.handle.title",
        defaultMessage: "Handle visit / Visits"
    },
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
    login: {
        path: '/auth/login',
        method: 'get',
        page: 'login',
        antiAuth: true,
        handler: getPage('Auth/Login'),
        title: messages.loginTitle
    },
    logout: {
        path: '/auth/logout',
        method: 'get',
        page: 'logout',
        auth: true,
        handler: getPage('Auth/Logout'),
        action: LogoutAction,
        title: messages.logoutTitle
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
        title: messages.consoleTitle
    },
    consoleStages: {
        path: '/console/stages',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Stages'),
        title: messages.consoleStagesTitle
    },
    consoleStagesStage: {
        path: '/console/stages/:stageID',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Stages'),
        title: messages.consoleStagesStageTitle
    },
    consoleUsers: {
        path: '/console/users',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Users'),
        title: messages.consoleUsersTitle
    },
    consoleDisplays: {
        path: '/console/displays',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Displays'),
        title: messages.consoleDisplaysTitle
    },
    consoleDisplaysGroup: {
        path: '/console/displays/:groupID',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/Displays'),
        title: messages.consoleDisplaysGroupTitle
    },
    consoleDataManagement: {
        path: '/console/data-management',
        namespace: 'console',
        method: 'get',
        auth: true,
        admin: true,
        handler: getPage('Console/DataManagement'),
        title: messages.consoleDataManagementTitle
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
        action: LoadVisitListAction,
        title: messages.visitsAtStageTitle
    },
    visitStageHandle: {
       path: '/visits/:stageID/:visitID',
       namespace: 'visit',
       method: 'get',
       auth: true,
       handler: getPage('Visit/Handler'),
       title: messages.handleVisitsAtStageTitle
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

    /*
     * Pharmacy
     */
    pharmacyManage: {
        path: '/pharmacy/manage',
        namespace: 'display',
        method: 'get',
        auth: true,
        handler: getPage('Pharmacy/Manager'),
        title: null,
        action: LoadMedicationPageActions
    },
    pharmacyManageMedication: {
        path: '/pharmacy/manage/:medicationID',
        namespace: 'display',
        method: 'get',
        auth: true,
        handler: getPage('Pharmacy/Manager'),
        title: null,
        action: LoadMedicationPageActions
    }
};
