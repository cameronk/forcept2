/**
 * forcept - containers/pages/Visit/Handler.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import dropRightWhile from 'lodash/dropRightWhile';

import BaseComponent, { grabContext } from '../../../components/Base';
import { BuildDOMClass } from '../../../utils/CSSClassHelper';
import MessageScaffold   from '../../../components/Scaffold/Message';
import NavLink    from '../../../components/Navigation/NavLink';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import Overview   from '../../../components/Visit/Overview';
import Searcher   from '../../../components/Patient/Searcher';
import Sidebar   from '../../../components/Visit/Sidebar';
import { SetCurrentTabAction, SetSidebarVisibilityAction,
    CreatePatientAction, ImportPatientsAction,
    SaveVisitAction, MoveVisitAction,
    SetDestinationAction } from '../../../flux/Visit/VisitActions';

import AppStore   from '../../../flux/App/AppStore';
import StageStore from '../../../flux/Stage/StageStore';
import VisitStore from '../../../flux/Visit/VisitStore';
import PatientStore from '../../../flux/Patient/PatientStore';
import ResourceStore from '../../../flux/Resource/ResourceStore';

///
import BasicMessages from '../../../lang/Basic';
import StageMessages from '../../../lang/Stage';

const __debug = debug('forcept:containers:pages:Visit:Handler');
const root = 'pages.visit.handler.';
const messages = defineMessages({
    ///
    saveVisit: {
        id: root + 'saveVisit',
        defaultMessage: 'Save visit'
    },

    ///
    createPatient: {
        id: root + 'createPatient',
        defaultMessage: 'Create a new patient'
    },
    creatingPatient: {
        id: root + 'creatingPatient',
        defaultMessage: 'Creating a new patient...'
    },
    importPatient: {
        id: root + 'importPatient',
        defaultMessage: 'Search for a patient'
    },
    noPatients: {
        id: root + 'noPatients',
        defaultMessage: 'No patients in this visit.'
    },
    addPatients: {
        id: root + 'addPatients',
        defaultMessage: 'Add some with the controls above.'
    },
    choosePatient: {
        id: root + 'choosePatient',
        defaultMessage: 'Choose a tab to view and update patient information.'
    },

    /// errors
    missingStageID: {
        id: root + 'errors.missingStageID',
        defaultMessage: 'FORCEPT is missing a stage ID.'
    },
    missingPatient: {
        id: root + 'errors.missingPatient',
        defaultMessage: 'FORCEPT is missing patient ID #{patient}'
    },

    /// move visit
    chooseDestination: {
        id: root + 'chooseDestination',
        defaultMessage: 'Choose a destination'
    },
    moveVisit: {
        id: root + 'moveVisit',
        defaultMessage: 'Move visit'
    },
    followVisit: {
        id: root + 'followVisit',
        defaultMessage: 'Follow this visit to {stage}'
    },
    moveCompletionHeader: {
        id: root + 'moveCompletionHeader',
        defaultMessage: 'Visit moved successfully.'
    },
    checkoutComplete: {
        id: root + 'checkoutComplete',
        defaultMessage: 'Check-out complete.'
    }
});

if(process.env.BROWSER) {
    require('../../../styles/VisitHandler.less');
}

class VisitHandler extends BaseComponent {

    static contextTypes = grabContext()

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        var moveStage = $("#FORCEPT-Dropdown-MoveStage");
        if(moveStage.length) {
            moveStage.dropdown({
                preserveHTML: false,
                onChange: (val) => {
                    this.context.executeAction(SetDestinationAction, {
                        stageID: val
                    });
                }
            });
        }
    }

    _setTab = (tab) => {
        return (evt) => {
            this.context.executeAction(SetCurrentTabAction, tab);
        }
    }

    _createPatient = () => {
        this.context.executeAction(CreatePatientAction, {
            stageID: this.props.stageID
        });
    }

    _saveVisit = () => {
        var props = this.props;
        this.context.executeAction(SaveVisitAction, {
            id: props.visit.hasOwnProperty('id') ? props.visit.id : null,
            patients: props.patients,
            stage: props.stages[props.stageID]
        });
    }

    _moveVisit = () => {
        var props = this.props;
        this.context.executeAction(MoveVisitAction, {
            id: props.visit.hasOwnProperty('id') ? props.visit.id : null,
            destination: props.destination
        });
    }

    _importPatients = (patients) => {
        var { stages, stageID } = this.props;

        if(stageID === Object.keys(stages)[0]) {
            this.context.executeAction(ImportPatientsAction, {
                rootStageID: stageID,
                patients: patients
            });
        }
    }

    /*
     *
     */
    _toggleSidebarVisibility = (state) => {
        return (evt) => {
            this.context.executeAction(SetSidebarVisibilityAction, state);
        }
    }

    render() {

        var props = this.props,
            { stages, stageID, visit, patients, tab } = props,
            { formatMessage } = props.intl,
            stageKeys   = Object.keys(stages),
            patientKeys = Object.keys(patients);

        var rootStageID = stageKeys[0];

        /*
         * If the current navigateAction is incomplete...
         */
        if(!props.isNavigateComplete) {
            return (
                <div className="ui segment">
                    <div className="basic ui loading segment"></div>
                </div>
            );
        }

        /*
         * Make sure stageID is set
         */
        if(!stageID || !stages.hasOwnProperty(stageID)) {
            return (
                <div className="ui segment">
                    <MessageScaffold
                        type="error"
                        icon="warning"
                        header={formatMessage(BasicMessages.errorOccurred)}
                        text={formatMessage(messages.missingStageID)} />
                </div>
            );
        }

        var thisStage = stages[stageID],
            stagesBeneath = dropRightWhile(stageKeys, key => key != stageID),
            stageDOM, overviewDOM,
            blockFurtherRendering = false;


        /*************************************
         * Build stageDOM (editor container) *
         *************************************/

        var isLoading = false;

        /*
         * Certain visit page statuses should hinder further rendering. Add those here.
         */
        switch(props.status) {

            /// FORCEPT is creating a new patient
            case "creating":

                blockFurtherRendering = true;
                isLoading = true;

                stageDOM = (
                    <div className="ui bottom attached segment">
                        <MessageScaffold
                            icon="notched circle loading"
                            header={formatMessage(messages.creatingPatient)} />
                    </div>
                );
                break;

        }

        var isSaving     = props.status === "saving",
            isMoving     = props.status === "moving",
            isImporting  = props.status === "importing",
            isWorking    = (isLoading || isSaving || isMoving || isImporting);

        /*
         * Is a visit/patient action executing?
         */
        if(!blockFurtherRendering) {

            /*
             *
             */
            if(props.recentData !== null && visit.id === null) {

                var stageLinkDOM;

                if(props.recentData.stage !== "checkout") {
                    var stageRecentlyMovedTo = stages[props.recentData.stage];
                    stageLinkDOM = (
                        <NavLink className="tiny green ui labeled icon button"
                            href={"/visits/" + stageRecentlyMovedTo.slug + "/" + props.recentData.visit}>
                            <i className="right chevron icon"></i>
                            {formatMessage(messages.followVisit, {
                                stage: stageRecentlyMovedTo.name || formatMessage(Stagemessages.untitled)
                            })}
                        </NavLink>
                    );
                } else {
                    stageLinkDOM = (
                        <div className="sub header">
                            {formatMessage(messages.checkoutComplete)}
                        </div>
                    );
                }

                stageDOM = (
                    <div className="ui bottom attached segment">
                        <div className="large ui header">
                            <i className="circular check mark icon"></i>
                            <div className="content">
                                <div>{formatMessage(messages.moveCompletionHeader)}</div>
                                {stageLinkDOM}
                            </div>
                        </div>
                    </div>
                );
            }

            /**
             * If tab is set, and tab === "import"
             */
            else if(tab && tab === "import") {
                stageDOM = (
                    <Searcher
                        loading={isWorking}
                        disablePatientsInVisits={true}
                        onImport={this._importPatients} />
                );
            }

            /*
             * No patients in this visit.
             */
            else if(patientKeys.length === 0) {
                if(thisStage.isRoot) {
                    stageDOM = (
                        <div className="ui bottom attached segment">
                            <MessageScaffold
                                icon="add user"
                                header={formatMessage(messages.noPatients)}
                                text={formatMessage(messages.addPatients)} />
                        </div>
                    );
                } else {
                    stageDOM = (
                        <div className="ui bottom attached segment">
                            <MessageScaffold
                                icon="delete"
                                header={formatMessage(BasicMessages.errorOccurred)}
                                text={formatMessage(messages.noPatients)} />
                        </div>
                    );
                }
            }

            /*
             * Tab not selected.
             */
            else if(!tab) {
                stageDOM = (
                    <div className="ui bottom attached segment">
                        <MessageScaffold
                            icon="flag"
                            header={formatMessage(messages.choosePatient)} />
                    </div>
                );
            }

            /*
             * Missing the patient stored in visit.tab
             */
            else if(!patients.hasOwnProperty(tab)) {
                stageDOM = (
                    <div className="ui bottom attached segment">
                        <MessageScaffold
                            type="error"
                            icon="warning"
                            header={formatMessage(BasicMessages.errorOccurred)}
                            text={formatMessage(messages.missingPatient, {
                                patient: tab
                            })} />
                    </div>
                );
            }

            /*
             * Looks like we're good to go...
             */
            else {

                var thisPatient = patients[tab];

                overviewDOM = (
                    <Sidebar
                        stages={stages}
                        stagesBeneath={stagesBeneath}
                        thisPatient={thisPatient} />
                );

                stageDOM = (
                    <div className={BuildDOMClass("ui bottom attached", {
                        loading: isWorking
                    }, "segment")}>
                        {(() => {
                            if(props.flash) {
                                return (
                                    <MessageScaffold {...props.flash} />
                                );
                            }
                        })()}
                        <Editor
                            patient={Object.assign({}, thisPatient[stageID], {
                                id: thisPatient[rootStageID].id
                            })}
                            visit={visit}
                            stage={thisStage}
                            resourcesState={props.resourcesState} />
                    </div>
                );

            }

        }

        var currentIndex = null;

        /****************************************
         * Build menuDOM (destination selector) *
         ****************************************/

        var menuDOM = stageKeys.map((thisMenuStageID, index) => {

            var thisMenuStage = stages[thisMenuStageID],
                isCurrent = stageID === thisMenuStageID,
                style = {};

            if(isCurrent) currentIndex = index;

            if(thisMenuStage.order < thisStage.order) {
                style.opacity = 1;
            } else {
                if(!isCurrent && currentIndex !== null) {
                    style.opacity = ((stageKeys.length - index) / (stageKeys.length - currentIndex - 1));
                }
            }

            // __debug("index %s: %j (ci: %s)", index, style, currentIndex);

            return (
                <div key={thisMenuStageID}
                    data-value={thisMenuStageID}
                    className={BuildDOMClass("item", { disabled: isCurrent })}>
                    <div className={BuildDOMClass("empty circular ui", {
                        green:  isCurrent && thisMenuStage.order === thisStage.order,
                        blue:  !isCurrent && thisMenuStage.order > thisStage.order,
                        olive: !isCurrent && thisMenuStage.order < thisStage.order,
                    }, "label")} style={style}></div>
                    {index + 1} &mdash; {thisMenuStage.name}
                </div>
            );
        });

        /******************************************
         * Build sidebar (patient info + buttons) *
         ******************************************/

        var disabledButtons = {
            save:           (!props.isModified || isWorking),
            destination:    (visit.id === null || isWorking || props.isModified),
            move:           (props.destination === null || isWorking || props.isModified)
        };

        var sidebarDOM;

        if(props.sidebarVisibility === true) {
            sidebarDOM = (
                <div className="sidebar">
                    <div className="sidebar-toggle" onClick={this._toggleSidebarVisibility(false)}>
                        <i className="right chevron icon"></i>
                    </div>
                    <div className="patient">{overviewDOM}</div>
                    <div className="controls">
                        <div className="fluid vertical ui buttons">

                            {/*
                              * Save button
                              */}
                            <div key="save"
                                className={BuildDOMClass("ui labeled icon button", {
                                    loading: isSaving,
                                    disabled: disabledButtons.save
                                })}
                                disabled={disabledButtons.save}
                                onClick={props.isModified ? this._saveVisit : null}>
                                <i className="save icon"></i>
                                {formatMessage(messages.saveVisit)}
                            </div>

                            {/*
                              * Destination dropdown
                              */}
                            <div key="destination"
                                id="FORCEPT-Dropdown-MoveStage"
                                className={BuildDOMClass("ui floating dropdown labeled icon button", {
                                    disabled: disabledButtons.destination
                                })}
                                disabled={disabledButtons.destination}>
                                <i className="location arrow icon"></i>
                                <span className="text">{formatMessage(messages.chooseDestination)}</span>
                                <div className="menu">
                                    {menuDOM}
                                    <div data-value="checkout" className="item">
                                        <i className="fitted checkmark box icon"></i>
                                        {formatMessage(StageMessages.checkOut)}
                                    </div>
                                </div>
                            </div>

                            {/*
                              * Move button
                              */}
                            <div key="move"
                                className={BuildDOMClass("ui labeled icon button", {
                                    loading: isMoving,
                                    disabled: disabledButtons.move
                                })}
                                disabled={disabledButtons.move}
                                onClick={this._moveVisit}>
                                <i className="level up icon"></i>
                                {formatMessage(messages.moveVisit)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            sidebarDOM = (
                <div className="sidebar-toggle floating" onClick={this._toggleSidebarVisibility(true)}>
                    <i className="left chevron icon"></i>
                </div>
            );
        }

        /******************************************
         * Build Horizon (patient tabs + buttons) *
         ******************************************/

        var horizonControlsDOM;

        if(thisStage.isRoot) {
            horizonControlsDOM = [
                <a key="create"
                    className="control item"
                    onClick={this._createPatient}>
                    <i className="fitted plus icon"></i>
                    <span className="forcept responsive desktop only">
                        {formatMessage(BasicMessages.create)}
                    </span>
                    <span className="forcept responsive mobile only">
                        {formatMessage(messages.createPatient)}
                    </span>
                </a>,
                <a key="import"
                    className={BuildDOMClass("control item", { active: tab === "import" })}
                    onClick={this._setTab("import")}>
                    <i className="fitted search icon"></i>
                    <span className="forcept responsive desktop only">
                        {formatMessage(BasicMessages.search)}
                    </span>
                    <span className="forcept responsive mobile only">
                        {formatMessage(messages.importPatient)}
                    </span>
                </a>
            ];
        }

        var horizonDOM = (
            <Horizon>
                {patientKeys.map(patientID => {
                    var thisPatient = patients[patientID][rootStageID],
                        fullName = thisPatient.hasOwnProperty('fullName')
                                && thisPatient.fullName.length > 0
                                    ? thisPatient.fullName
                                    : "Unnamed patient";
                    return (
                        <a key={patientID}
                            className={BuildDOMClass("item", {
                                "teal active": props.tab == patientID
                            })}
                            onClick={this._setTab(patientID)}>
                            <span className="teal ui label">
                                {thisPatient.id}
                            </span>
                            {fullName}
                        </a>
                    );
                })}
                {horizonControlsDOM}
            </Horizon>
        );

        /*******************************
         * Render FORCEPT-VisitHandler *
         *******************************/
        return (
            <div id="FORCEPT-VisitHandler">
                <div className={BuildDOMClass("primary", { sidebarVisible: (props.sidebarVisibility === true) })}>
                    <div className="basic top attached huge ui header">
                        <i className="hospital icon"></i>
                        <div className="content">
                            {props.isNavigateComplete ? thisStage.name : (<i className="notched loading icon"></i>)}
                        </div>
                    </div>
                    {horizonDOM}
                    {stageDOM}
                </div>
                {sidebarDOM}
            </div>
        );

    }

}

VisitHandler = connectToStores(
    VisitHandler,
    [VisitStore, PatientStore, ResourceStore],
    function(context, props) {

        let routeStore = context.getStore('RouteStore');
        let appStore   = context.getStore(AppStore);
        let stageStore = context.getStore(StageStore);
        let visitStore = context.getStore(VisitStore);
        let patientStore = context.getStore(PatientStore);
        let resourceStore = context.getStore(ResourceStore);

        let params = routeStore.getCurrentRoute().params;

        return {

            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),
            status: visitStore.getStatus(),
            sidebarVisibility: visitStore.getSidebarVisibility(),
            flash: appStore.getFlash(),

            /// All stages
            stages: stageStore.getStages(),
            stageID: params.stageID ? params.stageID.split("-")[0] : null,

            /// Patients
            patients: patientStore.getPatients(),

            /// Visit
            visit: visitStore.getVisit(),
            isModified: visitStore.isModified(),
            destination: visitStore.getDestination(),
            recentData: visitStore.getRecentData(),
            tab: visitStore.getCurrentTab(),

            resourcesState: resourceStore.getState()
        };

    }
)

export default injectIntl(VisitHandler);
