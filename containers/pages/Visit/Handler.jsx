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
import { SetCurrentTabAction,
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
    importPatient: {
        id: root + 'importPatient',
        defaultMessage: 'Import a patient'
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

    render() {

        var props = this.props,
            { stages, stageID, visit, patients, tab } = props,
            { formatMessage } = props.intl,
            stageKeys   = Object.keys(stages),
            patientKeys = Object.keys(patients);

        var rootStageID = stageKeys[0];

        __debug("render() visit handler");
        // __debug(" | current tab = %s", tab);
        // __debug(" | visit = ", visit);
        // __debug(" | stageID = %s", stageID);
        // __debug(" | stages  = ", Object.keys(stages));
        // __debug(" | patients = ", patients);
        // __debug(" | recent destination = ", props.recentData);

        /*
         * If the current navigateAction is complete...
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
            stageDOM, overviewDOM;

        __debug("Stages beneath:", stagesBeneath);

        /*
         * Is a visit/patient action executing?
         */
        if(props.isLoading) {
            stageDOM = (
                <div className="ui bottom attached segment">
                    <div className="ui basic loading segment"></div>
                </div>
            );
        }

        /*
         * Stage ID is set, check other variables before rendering.
         */
        else {

            /*
             *
             */
            if(props.recentData !== null && visit.id === null) {

                var stageLink;
                if(props.recentData.stage !== "checkout") {
                    var stageRecentlyMovedTo = stages[props.recentData.stage];
                    stageLink = (
                        <NavLink className="tiny green ui labeled icon button"
                            href={"/visits/" + stageRecentlyMovedTo.slug + "/" + props.recentData.visit}>
                            <i className="right chevron icon"></i>
                            {formatMessage(messages.followVisit, {
                                stage: stageRecentlyMovedTo.name || formatMessage(Stagemessages.untitled)
                            })}
                        </NavLink>
                    );
                } else {
                    stageLink = (
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
                                {stageLink}
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
                    <div className="ui bottom attached segment">
                        {(() => {
                            if(props.flash) {
                                return (
                                    <MessageScaffold {...props.flash} />
                                );
                            }
                        })()}
                        <Editor
                            patient={Object.assign({}, thisPatient[stageID], { id: thisPatient[rootStageID].id })}
                            visit={visit}
                            stage={thisStage}
                            resourcesState={props.resourcesState} />
                    </div>
                );

            }

        } /// end !props.isLoading

        var currentIndex = null;

        /**
         * Destination selection menu builder.
         */
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


        /**
         * ---
         * #FORCEPT-VisitHandler
         * ---
         */
        return (
            <div id="FORCEPT-VisitHandler">
                <div className="primary">
                    <div className="basic top attached huge ui header">
                        <i className="hospital icon"></i>
                        <div className="content">
                            {props.isNavigateComplete ? thisStage.name : (<i className="notched loading icon"></i>)}
                        </div>
                    </div>
                    <Horizon>
                        {patientKeys.map(patientID => {
                            var thisPatient = patients[patientID][rootStageID];
                            var fullName = thisPatient.hasOwnProperty('fullName') && thisPatient.fullName.length > 0 ? thisPatient.fullName : "Unnamed patient";
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
                        {(() => {
                            if(thisStage.isRoot) {
                                return [
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
                                        className="control item"
                                        onClick={this._setTab("import")}>
                                        <i className="fitted download icon"></i>
                                        <span className="forcept responsive desktop only">
                                            {formatMessage(BasicMessages.import)}
                                        </span>
                                        <span className="forcept responsive mobile only">
                                            {formatMessage(messages.importPatient)}
                                        </span>
                                    </a>
                                ];
                            }
                        })()}
                    </Horizon>
                    {stageDOM}
                </div>
                <div className="sidebar">
                    <div className="patient">{overviewDOM}</div>
                    <div className="controls">
                        <div className="fluid vertical ui buttons">
                            {/*
                              * Save button
                              */}
                            <div key="save"
                                className={BuildDOMClass("ui labeled icon button", {
                                    disabled: !props.isModified || props.isLoading
                                })}
                                disabled={!props.isModified}
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
                                    disabled: visit.id === null || props.isLoading
                                })}
                                disabled={visit.id === null}>
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
                                    disabled: props.destination === null || props.isLoading
                                })}
                                disabled={props.destination === null}
                                onClick={this._moveVisit}>
                                <i className="level up icon"></i>
                                {formatMessage(messages.moveVisit)}
                            </div>
                        </div>
                    </div>
                </div>
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
            isLoading: appStore.isLoading(),
            flash: appStore.getFlash(),

            /// All stages
            stages: stageStore.getStages(),
            stageID: params.stageID ? params.stageID.split("-")[0] : null,

            /// Patients
            patients: patientStore.getPatients(),

            /// Visit
            visit: visitStore.getVisit(),
            overviewModes: visitStore.getOverviewModes(),
            isModified: visitStore.isModified(),
            destination: visitStore.getDestination(),
            recentData: visitStore.getRecentData(),
            tab: visitStore.getCurrentTab(),

            resourcesState: resourceStore.getState()
        };

    }
)

export default injectIntl(VisitHandler);
