/**
 * forcept - flux/actions.js
 * @author Azuru Technology
 */

import keyMirror from 'keymirror';

export default keyMirror({

    'TEST_ACTION': null,

    /// Application
    'APP_SET_LOADING_MODE': null,
    'APP_SET_LOADING_CONTAINER': null,

    /// Authentication
    'AUTH_LOGOUT': null,
    'AUTH_ERROR': null,
    'AUTH_SUCCESS': null,
    'AUTH_CREDENTIAL_CHANGE': null,

    /// Console

        /// Stages
        'CONSOLE_STAGES_LOAD': null,
        'CONSOLE_STAGES_LOADED': null,
        'CONSOLE_STAGES_LOAD_ERROR': null,

        'CONSOLE_STAGES_UPDATE_CACHE': null,
        'CONSOLE_STAGES_CLEAR_CACHE': null,
        'CONSOLE_STAGES_CACHE_MODIFIED': null,

        'CONSOLE_STAGES_SET_STATUS': null,

});
