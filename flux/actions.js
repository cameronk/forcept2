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

    /// Stages
    'STAGES_LOAD': null,
    'STAGES_LOADED': null,
    'STAGES_LOAD_ERROR': null,
    'STAGES_SET_OPTION_SHIFT_CONTEXT': null,
    'STAGES_UPDATE_CACHE': null,
    'STAGES_CLEAR_CACHE': null,
    'STAGES_CACHE_MODIFIED': null,
    'STAGES_SET_STATUS': null,

    /// Visit
    'VISIT_SET_CURRENT_TAB': null,

});
