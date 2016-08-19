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
import DisplayStore from '../../../flux/Display/DisplayStore';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import MessageScaffold from '../../../components/Scaffold/Message';
import BaseComponent, { grabContext } from '../../../components/Base';
import SideMenu from '../../../components/Console/SideMenu';
import DisplayBuilder from '../../../components/Console/Display/Builder';

import { LoadDisplayGroupsAction } from '../../../flux/Display/DisplayActions';

const __debug = debug("forcept:containers:pages:Console:Displays");
const messages = defineMessages({
    "pages.console.displays.heading": {
        id: "pages.console.displays.heading",
        defaultMessage: "Displays"
    }
});


class Displays extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {

        var props = this.props,
            ctx   = this.context,
            displayDOM;

        if(props.error) {
            displayDOM = (
                <MessageScaffold
                    type="error"
                    text={props.error.toString()} />
            );
        } else if(!props.isNavigateComplete || props.groups === null) {
            displayDOM = (
                <div className="ui active loader"></div>
            );
        } else {
            displayDOM = (
                <DisplayBuilder
                    stages={props.stages}
                    group={props.currentGroup} />
            );
        }

        return (
            <div className="ui stackable grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar message={messages["pages.console.displays.heading"]} />
                    </div>
                </div>
                <div className="row clear top">
                    <div className="four wide computer five wide tablet column">
                        <SideMenu
                            location={props.currentGroup.id || 0}
                            isNavigateComplete={props.isNavigateComplete}
                            basePath="/console/displays"
                            context="display group"
                            iterable={props.groups || {}} />
                    </div>
                    <div className="twelve wide computer eleven wide tablet right spaced column">
                        {displayDOM}
                    </div>
                </div>
            </div>
        );
    }
}

Displays = connectToStores(
    Displays,
    ["RouteStore", ConsoleStore, DisplayStore],
    function(context, props) {

        var routeStore = context.getStore('RouteStore');
        var stageStore = context.getStore(StageStore);
        var displayStore = context.getStore(DisplayStore);
        var consoleStore = context.getStore(ConsoleStore);

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),

            /// All stages
            stages: stageStore.getStages(),

            ///
            groups: displayStore.getGroups(),

            /// Current group
            currentGroup: {
                id: routeStore.getCurrentRoute().params.groupID || null,
                cache: displayStore.getGroupCache(),
                status: consoleStore.getStatus(),
                isCacheModified: displayStore.isCacheModified()
            }
        };
    }
);

export default injectIntl(Displays);
