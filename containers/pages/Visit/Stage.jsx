/**
 * forcept - containers/pages/Visit/Stage.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../../../components/Base';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Handler    from '../../../components/Visit/Handler';

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

class Stage extends BaseComponent {

    static contextTypes = grabContext()

    render() {

        var props = this.props,
            { stage } = props;

        var stageDOM;

        if(props.isNavigateComplete && !props.isLoading) {

            if(stage.isRoot) {
                stageDOM = (
                    <Handler
                        stage={stage}
                        patients={props.patients}
                        visit={props.currentVisit} />
                );
            } else {
                stageDOM = (
                    <div>
                    </div>
                );
            }

        } else {
            stageDOM = (
                <div className="row">
                    <div className="sixteen wide column">
                        <div className="ui basic loading segment"></div>
                    </div>
                </div>
            );
        }

        return (
            <div className="ui stackable grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar
                            message={messages['pages.stages.stage.heading']}
                            format={{
                                name: props.isNavigateComplete ? stage.name : "Loading..."
                            }} />
                    </div>
                </div>
                {stageDOM}
            </div>
        );
    }

}

Stage = connectToStores(
    Stage,
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
            currentVisit: {
                currentTab: visitStore.getCurrentTab(),
                cache: visitStore.getCache()
            }
        };

    }
)

export default Stage;
