/**
 * forcept - containers/pages/Visit/Handler.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../../../components/Base';
import MessageScaffold from '../../../components/Scaffold/Message';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import Overview   from '../../../components/Visit/Overview';
import { SetCurrentTabAction,
    CreatePatientAction,
    SaveVisitAction } from '../../../flux/Visit/VisitActions';

import AppStore   from '../../../flux/App/AppStore';
import StageStore from '../../../flux/Stage/StageStore';
import VisitStore from '../../../flux/Visit/VisitStore';
import PatientStore from '../../../flux/Patient/PatientStore';

const __debug = debug('forcept:containers:pages:Visit:Stage');
const messages = defineMessages({
    'pages.stages.stage.heading': {
        id: 'pages.stages.stage.heading',
        defaultMessage: '{name}'
    }
});

if(process.env.BROWSER) {
    require('../../../styles/Visit.less');
}

class VisitHandler extends BaseComponent {

    static contextTypes = grabContext()

    _setTab = (tab) => {
        return (evt) => {
            this.context.executeAction(SetCurrentTabAction, tab);
        }
    }

    _createPatient = (evt) => {
        this.context.executeAction(CreatePatientAction);
    }

    _saveVisit = (evt) => {
        this.context.executeAction(SaveVisitAction, {
            id: this.props.visit.id || null,
            patients: this.props.patients,
            stage: this.props.stage
        });
    }

    render() {

        var props = this.props,
            { stage, visit, patients } = props,
            patientKeys = Object.keys(patients);

        var stageDOM = (
            <div className="ui bottom attached segment">
                <div className="ui basic loading segment"></div>
            </div>
        );

        if(props.isNavigateComplete && !props.isLoading) {

            if(patientKeys.length === 0) {
                stageDOM = (
                    <div className="ui bottom attached segment">
                        <MessageScaffold
                            icon="add user"
                            header="No patients in this visit"
                            text={stage.isRoot ? "Add some with the controls above." : "An error may have occurred."} />
                    </div>
                );
            }

            else if(!props.tab) {
                stageDOM = (
                    <div className="ui bottom attached segment">
                        <MessageScaffold
                            icon="flag"
                            header="Choose a tab to modify a patient." />
                    </div>
                );
            }

            else if(!patients.hasOwnProperty(props.tab)) {
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

            else {
                var thisPatient = patients[props.tab];
                stageDOM = (
                    <div className="ui bottom attached segment">
                        <div className="ui stackable grid">
                            <div className="row clear top">
                                <div className="four wide computer five wide tablet column">
                                    <Overview
                                        patient={thisPatient}
                                        stage={stage} />
                                </div>
                                <div className="twelve wide computer eleven wide tablet column">
                                    <Editor
                                        patient={thisPatient}
                                        visit={visit}
                                        stage={stage} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div>
                <h1 className="ui top attached header">
                    <i className="hospital icon"></i>
                    <div className="content">
                        {props.intl.formatMessage(messages['pages.stages.stage.heading'], {
                            name: props.isNavigateComplete ? stage.name : "Loading..."
                        })}
                    </div>
                </h1>
                <Horizon>
                    {patientKeys.map(patient => {
                        var thisPatient = patients[patient];
                        return (
                            <a className={"item" + (props.tab == patient ? " active" : "")} onClick={this._setTab(patient)}>
                                {thisPatient.fullName.length > 0 ? thisPatient.fullName : "Unnamed patient"}
                                <span className="ui teal label">
                                    {thisPatient.id}
                                </span>
                            </a>
                        );
                    })}
                    {stage.isRoot ? (
                        <a className="control item" onClick={this._createPatient}>
                            <i className="plus icon"></i>
                            Add a new patient
                        </a>
                    ) : null}
                    {patientKeys.length > 0 ? (
                        <a className="green control item" onClick={this._saveVisit}>
                            <i className="save icon"></i>
                            Save visit
                        </a>
                    ) : null}
                </Horizon>
                {stageDOM}
            </div>
        );
    }

}

VisitHandler = connectToStores(
    VisitHandler,
    [VisitStore, PatientStore],
    function(context, props) {

        let routeStore = context.getStore('RouteStore');
        let appStore   = context.getStore(AppStore);
        let stageStore = context.getStore(StageStore);
        let visitStore = context.getStore(VisitStore);
        let patientStore = context.getStore(PatientStore);

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),
            isLoading: appStore.isLoading(),

            /// Stage
            stage: stageStore.getCache(),

            /// Patients
            patients: patientStore.getPatients(),

            /// Visit
            visit: visitStore.getVisit(),
            tab: visitStore.getCurrentTab(),
        };

    }
)

export default injectIntl(VisitHandler);
