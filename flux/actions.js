/**
 * forcept - flux/actions.js
 * @author Azuru Technology
 */

import keyMirror from 'keymirror';

export default keyMirror({

    /*
     * Application
     */

    /// Navigation
    'NAVIGATE_SUCCESS': null,

    /// Top-level application loading state
    'APP_LOADING': null,

    /// Top-level application status
    'APP_SET_STATUS': null,

    /// Set flash data for application
    'APP_FLASH': null,

    'APP_UPDATE_CONFIG': null,
    'APP_CONFIG_CHANGED': null,

    /** ============================= **/

    /*
     * Console
     */

    /// Console-wide status
    'CONSOLE_SET_STATUS': null,

    /** ============================= **/

    /*
     * Pharmacy
     */

    ///
    'PHARMACY_SET_STATUS': null,
    'PHARMACY_MEDS_CACHE_UPDATE': null,
    'PHARMACY_MEDS_CACHE_MODIFIED': null,
    'PHARMACY_MEDS_CACHE_CLEAR': null,
    'PHARMACY_MEDS_UPDATE': null,
    'PHARMACY_MEDS_LOADED': null,

    /** ============================= **/

    ///
    'PRESCRIPTION_SET_UPDATE': null,
    'PRESCRIPTION_SETS_CLEAR': null,
    'PRESCRIPTION_UPDATE_STATUS': null,

    /** ============================= **/

    /// Authentication
    'AUTH_LOGOUT': null,
    'AUTH_ERROR': null,
    'AUTH_SUCCESS': null,
    'AUTH_CREDENTIAL_CHANGE': null,

    /** ============================= **/

    /// Stages
    'STAGES_LOAD': null,
    'STAGES_LOADED': null,
    'STAGES_LOAD_ERROR': null,
    'STAGES_SET_OPTION_SHIFT_CONTEXT': null,
    'STAGES_SET_FIELD_SHIFT_CONTEXT': null,
    'STAGES_HARDSET_CACHE_FIELDS': null,
    'STAGES_UPDATE_CACHE': null,
    'STAGES_CLEAR_CACHE': null,
    'STAGES_CACHE_MODIFIED': null,
    'STAGES_SET_STATUS': null,

    /** ============================= **/

    /// Displays
    'DISPLAY_GROUP_UPDATE': null,
    'DISPLAY_GROUP_CACHE_CLEAR': null,
    'DISPLAY_GROUP_CACHE_UPDATE': null,
    'DISPLAY_GROUP_CACHE_MODIFIED': null,
    'DISPLAY_ADD_LOADING_CONTEXT': null,
    'DISPLAY_REMOVE_LOADING_CONTEXT': null,

    /** ============================= **/

    /// Visit
    'VISIT_SET_CURRENT_TAB': null,
    'VISIT_SET_DESTINATION': null,
    'VISIT_SET_RECENT_DATA': null,
    'VISIT_SET_MODIFIED': null,
    'VISIT_SET_SIDEBAR_VISIBILITY': null,
    'VISIT_UPDATE_VISIT': null,
    'VISIT_CLEAR': null,
    'VISIT_SET_STATUS': null,
    'VISIT_LIST_CLEAR': null,
    'VISIT_LIST_UPDATE': null,

    /** ============================= **/

    /// Patient
    'PATIENT_UPDATE': null,
    'PATIENT_CLEAR_ALL': null,

    /** ============================= **/

    ///
    'RESOURCES_UPDATE_STATE': null,
    'RESOURCES_UPDATE_CACHE': null,
    'RESOURCES_SET_UPLOAD_CONTEXT': null,
    'RESOURCES_SET_UPLOAD_PROGRESS': null,
    'RESOURCES_PROCESS_FIELD': null,

    /** ============================= **/

    ///
    'USERS_UPDATE': null,
    'USERS_UDPATE_NURSERY': null,

    /** ============================= **/

    /// Search
    'SEARCH_SET_CONTEXT': null,
    'SEARCH_SET_QUERY': null,
    'SEARCH_SET_STATUS': null,
    'SEARCH_SET_RESULTS': null,
    'SEARCH_SET_SELECTED': null,
    'SEARCH_RESET_RELATIVES': null,
    'SEARCH_CLEAR_QUERY': null,

});
