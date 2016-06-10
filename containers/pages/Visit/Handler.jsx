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
import { SetCurrentTabAction,
    CreatePatientAction,
    SaveVisitAction, MoveVisitAction,
    SetDestinationAction } from '../../../flux/Visit/VisitActions';

import AppStore   from '../../../flux/App/AppStore';
import StageStore from '../../../flux/Stage/StageStore';
import VisitStore from '../../../flux/Visit/VisitStore';
import PatientStore from '../../../flux/Patient/PatientStore';
import ResourceStore from '../../../flux/Resource/ResourceStore';

const __debug = debug('forcept:containers:pages:Visit:Handler');
const messages = defineMessages({
    'pages.stages.stage.heading': {
        id: 'pages.stages.stage.heading',
        defaultMessage: '{name}'
    },
    'pages.visit.handler.moveStage.nthStage': {
        id: 'pages.visit.handler.moveStage.nthStage',
        defaultMessage: `{
            order,
            selectordinal,
            one {#st}
            two {#nd}
            few {#rd}
            other {#th}
        }`
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

    render() {

        var props = this.props,
            { stages, stageID, visit, patients, tab } = props,
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
        if(props.isNavigateComplete) {

            /*
             * Make sure stageID is set
             */
            if(!stageID || !stages.hasOwnProperty(stageID)) {
                return (
                    <div className="ui segment">
                        <MessageScaffold
                            type="error"
                            icon="warning"
                            header="An error occurred."
                            text="Forcept is missing a stage ID." />
                    </div>
                );
            } else {

                var stageDOM;
                var thisStage   = stages[stageID];
                var stagesBeneath = dropRightWhile(stageKeys, key => key != stageID);

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
                                <NavLink href={"/visits/" + stageRecentlyMovedTo.slug + "/" + props.recentData.visit}>Follow it to {stageRecentlyMovedTo.name}</NavLink>
                            );
                        } else {
                            stageLink = "Check-out complete."
                        }

                        stageDOM = (
                            <div className="ui bottom attached segment">
                                <MessageScaffold
                                    type="success"
                                    icon="check mark"
                                    header="Visit moved!"
                                    text={stageLink} />
                            </div>
                        );
                    }

                    /*
                     * No patients in this visit.
                     */
                    else if(patientKeys.length === 0) {
                        stageDOM = (
                            <div className="ui bottom attached segment">
                                <MessageScaffold
                                    icon="add user"
                                    header="No patients in this visit"
                                    text={thisStage.isRoot ? "Add some with the controls above." : "An error may have occurred."} />
                            </div>
                        );
                    }

                    /*
                     * Tab not selected.
                     */
                    else if(!tab) {
                        stageDOM = (
                            <div className="ui bottom attached segment">
                                <MessageScaffold
                                    icon="flag"
                                    header="Choose a tab to modify a patient." />
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
                                    header="An error occurred."
                                    text="The selected patient seems to be missing." />
                            </div>
                        );
                    }

                    /*
                     * Looks like we're good to go...
                     */
                    else {

                        var thisPatient = patients[tab];

                        stageDOM = (
                            <div className="ui bottom attached segment">
                                <div className="ui stackable grid">
                                    <div className="row">
                                        <div className="four wide computer five wide tablet expanded column">
                                            {(() => {
                                                if(props.flash) {
                                                    return (
                                                        <MessageScaffold {...props.flash} />
                                                    );
                                                }
                                            })()}
                                            {stagesBeneath.map((stageBeneathID, index) => {
                                                return (
                                                    <Overview
                                                        key={stageBeneathID}
                                                        mode={props.overviewModes[stageBeneathID] || "checklist"}
                                                        isLast={(index === (stagesBeneath.length - 1))}
                                                        patient={thisPatient.hasOwnProperty(stageBeneathID) ? thisPatient[stageBeneathID] : {}}
                                                        stage={stages[stageBeneathID]} />
                                                );
                                            })}
                                        </div>
                                        <div className="twelve wide computer eleven wide tablet column">
                                            <Editor
                                                patient={Object.assign({}, thisPatient[stageID], { id: thisPatient[rootStageID].id })}
                                                visit={visit}
                                                stage={thisStage}
                                                resourcesState={props.resourcesState} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                        // resource={props.resource}

                    }

                } /// end !props.isLoading

                var currentIndex = null;

                /**
                 * Destination selection menu builder.
                 */
                var menuDOM = stageKeys.map((thisMenuStageID, index) => {

                    var thisMenuStage = stages[thisMenuStageID];
                    var isCurrent = stageID === thisMenuStageID;
                    var style;

                    if(isCurrent) currentIndex = index;

                    if(thisMenuStage.order < thisStage.order) {
                        style = {
                            opacity: 1
                        };
                    } else {
                        if(!isCurrent && currentIndex !== null) {
                            style = {
                                opacity: (stageKeys.length - index) / (stageKeys.length - currentIndex - 1)
                            };
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
                        <div className="FORCEPT-FlexHeader fully expanded ui basic top attached segment">
                            <div className="large ui header">
                                <i className="hospital icon"></i>
                                <div className="content">
                                    {props.intl.formatMessage(messages['pages.stages.stage.heading'], {
                                        name: props.isNavigateComplete ? thisStage.name : "Loading..."
                                    })}
                                </div>
                            </div>
                            <div className="aside">
                                <div className="basic ui buttons">

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
                                        Save visit
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
                                        <span className="text">Choose a destination</span>
                                        <div className="menu">
                                            {menuDOM}
                                            <div data-value={"checkout"} className="item">
                                                <i className="fitted checkmark box icon"></i>
                                                Checkout
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
                                        Move visit
                                    </div>
                                </div>
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
                            {thisStage.isRoot ? (
                                <a className="control item" onClick={this._createPatient}>
                                    <i className="fitted plus icon"></i>
                                    <span className="forcept responsive mobile only">Create a new patient</span>
                                </a>
                            ) : null}
                        </Horizon>
                        {stageDOM}
                    </div>
                );

            } /// end stageID check

        } /// end props.isNavigateComplete

        /*
         * Page load incomplete - render only loading container
         */
        else {
            return (
                <div className="ui segment">
                    <div className="basic ui loading segment"></div>
                </div>
            );
        }

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

            resourcesState: resourceStore.getState(),

            // resource: {
            //     cache: resourceStore.getCache(),
            //     processing: resourceStore.getProcessingFields(),
            //     upload: {
            //         context: resourceStore.getUploadContext(),
            //         progress: resourceStore.getUploadProgress(),
            //     }
            // }

        };

    }
)

export default injectIntl(VisitHandler);
