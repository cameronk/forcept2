/**
 * forcept - flux/actions.js
 * @author Azuru Technology
 */

import keyMirror from 'keymirror';

export default keyMirror({

    'TEST_ACTION': null,

    /// Application
    'APP_LOADING': null,
    'APP_FLASH': null,

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
    'VISIT_SET_DESTINATION': null,
    'VISIT_SET_RECENT_DATA': null,
    'VISIT_SET_MODIFIED': null,
    'VISIT_UPDATE_VISIT': null,
    'VISIT_CLEAR': null,

    /// Patient
    'PATIENT_UPDATE': null,
    'PATIENT_CLEAR_ALL': null,

    /// Test
    'TEST_PUSH_MODEL': null,
    'TEST_UPDATE_MODEL': null,
});
