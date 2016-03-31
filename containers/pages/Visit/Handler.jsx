/**
 * forcept - containers/pages/Visit/Handler.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../../../components/Base';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import { SetCurrentTabAction, CreatePatientAction } from '../../../flux/Visit/VisitActions';

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

    render() {

        var props = this.props,
            { stage, visit, patients } = props,
            patientKeys = Object.keys(patients);

        var stageDOM = (
            <div className="ui attached loading segment"></div>
        );

        if(props.isNavigateComplete && !props.isLoading) {

            /**
             * Display the editor right off the bat
             */
            if(stage.isRoot) {
                stageDOM = (
                    <div>asdf</div>
                );
                /*
                    <Editor
                        patient={patients[visit.currentTab]}
                        visit={visit}
                        stage={stage} />*/
            }

            /**
             * Otherwise, allow the user to pick which visit to modify.
             */
            else {
                stageDOM = (
                    <div>
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
                            <a className={"item" + (visit.currentTab == patient ? " active disabled" : "")} onClick={this._setTab(patient)}>
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
                        <a className="green control item">
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
            visit: {
                currentTab: visitStore.getCurrentTab(),
                cache: visitStore.getCache()
            }
        };

    }
)

export default injectIntl(VisitHandler);
