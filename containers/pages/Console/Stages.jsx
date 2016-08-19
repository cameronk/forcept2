/**
 * forcept - containers/pages/Console/Stages.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from "debug";

import StageStore from '../../../flux/Stage/StageStore';
import ConsoleStore from '../../../flux/Console/ConsoleStore';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import StageBuilder    from '../../../components/Console/Stage/Builder';
import SideMenu      from '../../../components/Console/SideMenu';
import MessageScaffold from '../../../components/Scaffold/Message';
import BaseComponent, { grabContext } from '../../../components/Base';

const __debug = debug("forcept:containers:pages:Console:Stages");
const messages = defineMessages({
    "pages.console.stages.heading": {
        id: "pages.console.stages.heading",
        defaultMessage: "Stages"
    },
    "pages.console.stages.errors.badLocation.heading": {
        id: "pages.console.stages.errors.badLocation.heading",
        defaultMessage: "Something odd happened."
    },
    "pages.console.stages.errors.badLocation": {
        id: "pages.console.stages.errors.badLocation",
        defaultMessage: "Please try clicking one of the links at your left."
    }
});

/**
 * Controller view for console/Stages
 *
 * Prop heirarchy:
 * ==================
 * Stages
 *  - isNavigateComplete
 *  - stages
 *  - currentStage ===============> StageBuilder
 *      - id =====================> StageBuilder
 *      - cache ==================> StageBuilder
 *          - [.fields] ===========[StageBuilder]=====> FieldsAccordion
 *              - [.field] ========[StageBuilder]======[FieldsAccordion]======> Field
 *                  - [.type] =====[StageBuilder]======[FieldsAccordion]=======[Field]======> FieldSettings
 *                  - [.settings] =[StageBuilder]======[FieldsAccordion]=======[Field]======> FieldSettings
 *      - optionShiftContext =====> StageBuilder
 *      - isCacheModified ========> StageBuilder
 *      - status =================> StageBuilder
 *      - error ==================> StageBuilder
 */
class Stages extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            ctx   = this.context,

            /*
             * Default stage dom shows error message.
             */
            stageDOM = (
                <div className="ui error message">
                    <div className="header">
                        {props.intl.formatMessage(messages["pages.console.stages.errors.badLocation.heading"])}
                    </div>
                    <p>{props.intl.formatMessage(messages["pages.console.stages.errors.badLocation"])}</p>
                </div>
            );

        if(props.error) {
            stageDOM = (
                <MessageScaffold
                    type="error"
                    text={props.error.toString()} />
            );
        } else if(!props.isNavigateComplete) {
            stageDOM = (
                <div className="ui active loader"></div>
            );
        } else {
            stageDOM = (
                <StageBuilder stage={props.currentStage} />
            );
        }

        /*
         * Location = 0 -> "Create a new stage"
         */
        return (
            <div className="ui stackable grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar message={messages["pages.console.stages.heading"]} />
                    </div>
                </div>
                <div className="row clear top">
                    <div className="four wide computer five wide tablet column">
                        <SideMenu
                            iterable={props.stages}
                            isNavigateComplete={props.isNavigateComplete}
                            location={props.currentStage.id || 0}
                            basePath="/console/stages"
                            context="stage"
                            isCacheModified={props.currentStage.isCacheModified} />
                    </div>
                    <div className="twelve wide computer eleven wide tablet right spaced column">
                        {stageDOM}
                    </div>
                </div>
            </div>
        );
    }
}

Stages = connectToStores(
    Stages,
    [ConsoleStore, StageStore],
    function(context, props) {

        var routeStore = context.getStore('RouteStore');
        var stageStore = context.getStore(StageStore);
        var consoleStore = context.getStore(ConsoleStore);

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),

            /// All stages
            stages: stageStore.getStages(),

            /// Current stage
            currentStage: {
                id: routeStore.getCurrentRoute().params.stageID || null,
                cache: stageStore.getCache(),
                isCacheModified: stageStore.isCacheModified(),
                status: consoleStore.getStatus(),
                error:  stageStore.getError(),
            }
        };
    }
);

export default injectIntl(Stages);
