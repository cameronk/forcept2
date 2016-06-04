/**
 * forcept - containers/pages/Display/Group.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import chunk from 'lodash/chunk';

import BaseComponent, { grabContext } from '../../../components/Base';
import NavLink    from '../../../components/Navigation/NavLink';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import MessageScaffold from '../../../components/Scaffold/Message';
import RenderDisplay from '../../../components/Display/Render';

import { RefreshDisplayAction } from '../../../flux/Display/DisplayActions';
import AppStore   from '../../../flux/App/AppStore';
import StageStore from '../../../flux/Stage/StageStore';
import DisplayStore from '../../../flux/Display/DisplayStore';
import RouteStore from '../../../flux/Route/RouteStore';

const __debug = debug('forcept:containers:pages:Display:Group');
const messages = defineMessages({
});

if(process.env.BROWSER) {
    require('../../../styles/FlexGrouper.less');
}

class DisplayGroup extends BaseComponent {

    static contextTypes = grabContext()

    componentDidMount() {
        this.fetch();
    }

    componentDidUpdate(lastProps) {

        /// Fetch new data when the navigation promise completes.
        /// (is this the correct implementation?)
        if(this.props.isNavigateComplete !== lastProps.isNavigateComplete
            && this.props.isNavigateComplete === true) {
            this.fetch();
        }
    }

    fetch() {
        // this.context.executeAction(ReadVisitsAtStageAction, {
        //     stageID: this.props.stageID
        // });
    }

    refresh = (display) => {
        this.context.executeAction(RefreshDisplayAction, {
            display: display
        });
    }

    render() {

        var { props } = this;

        /*
         * Don't get props.group / props.group.displays until after
         * isNavigateComplete returns true.
         */
        if(!props.isNavigateComplete) {

            return (
                <div className="ui basic bottom attached segment">
                    <div className="ui basic loading segment"></div>
                </div>
            );

        } else {

            var { group } = props,
                displays = group.displays,
                displayKeys = Object.keys(displays),
                availableDisplays = this.context.getDisplayTypes();

            var groupDOM;

            /*
             * Show the list if we've populated it with items;
             * otherwise, show a loading message.
             */
            if(displayKeys.length > 0) {
                groupDOM = (
                    <div className="FORCEPT-Visit-Listing">
                        <div className="huge ui top attached header">
                            <div className="basic large right pointing ui teal label">
                                Display ID
                            </div>
                        </div>
                        <div className="ui bottom attached segment">
                            <div className="ui stackable cards">
                                {displayKeys.map(displayID => {
                                    let thisDisplay = displays[displayID];
                                    if(availableDisplays.hasOwnProperty(thisDisplay.type)) {
                                        return (
                                            <div className="card">
                                                <div className="content">
                                                    <div className="header">
                                                        {thisDisplay.name || "Untitled display"}
                                                    </div>
                                                </div>
                                                <div className="content">
                                                    <RenderDisplay display={thisDisplay} />
                                                </div>
                                                <div className="bottom attached ui button" onClick={this.refresh(thisDisplay)}>
                                                    <i className="refresh icon"></i>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div> {/** == end .ui.stackable.cards == **/}
                        </div>
                    </div>
                );
            }

            /*
             * No displays at this point in time (list.length === 0)
             */
            else {

                groupDOM = (
                    <div className="basic ui segment">
                        <MessageScaffold
                            type="info"
                            header="No displays configured in this group." />
                    </div>
                );

            }

            return (
                <div id="FORCEPT-FlexGrouper">
                    <h1 className="ui top attached header">
                        <i className="hospital icon"></i>
                        <div className="content">
                            {group.name || "Untitled display group"}
                        </div>
                    </h1>
                    {groupDOM}
                </div>
            );

        }

    }

}

DisplayGroup = connectToStores(
    DisplayGroup,
    [DisplayStore, "RouteStore"],
    (context, props) => {

        let routeStore = context.getStore('RouteStore');
        let displayStore = context.getStore(DisplayStore);
        let params = routeStore.getCurrentRoute().params;

        let groupID = null,
            groupSlug = null,
            group = null;

        if(params.groupID) {
            groupSlug = params.groupID;
            groupID = params.groupID.split("-")[0];
            group = displayStore.getGroupCache();
        }

        return {
            groupSlug: groupSlug,
            groupID: groupID,
            group: group,
            isNavigateComplete: routeStore.isNavigateComplete()
        };
    }
);

export default injectIntl(DisplayGroup);
