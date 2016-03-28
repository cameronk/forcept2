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
import StageStore from '../../../flux/Stage/StageStore';
import VisitStore from '../../../flux/Visit/VisitStore';

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
            { stage, isNavigateComplete } = props;

        var stageDOM;

        if(isNavigateComplete) {

            if(stage.isRoot) {
                stageDOM = (
                    <Handler
                        stage={props.stage}
                        visit={props.visit}
                        patients={{}} />
                );
            } else {
                stageDOM = (
                    <div>
                    </div>
                );
            }

        } else {
            stageDOM = (
                <div className="ui basic loading segment"></div>
            );
        }

        return (
            <div className="ui stackable grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar
                            message={messages['pages.stages.stage.heading']}
                            format={{
                                name: isNavigateComplete ? stage.name : "Loading..."
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
    [StageStore, VisitStore],
    function(context, props) {

        let routeStore = context.getStore('RouteStore');
        let stageStore = context.getStore(StageStore);
        let visitStore = context.getStore(VisitStore);

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),

            /// Stage
            stage: stageStore.getCache(),

            /// Visit
            visit: {
                currentTab: visitStore.getCurrentTab()
            }
        };
    }
)

export default Stage;
