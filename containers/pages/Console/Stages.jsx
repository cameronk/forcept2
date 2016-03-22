/**
 * forcept - containers/pages/Console/Stages.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from "debug";

// import { SetLoadingModeAction } from '../../../flux/App/AppActions';
import StageStore from '../../../flux/Console/StageStore';
import RouteStore from '../../../flux/Route/RouteStore';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import NavLink    from '../../../components/Navigation/NavLink';
import BaseComponent, { grabContext } from '../../../components/Base';
import StageBuilder from '../../../components/Console/StageBuilder';

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

class Stages extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentWillMount() {
        // this.context.executeAction(Actions.APP_SET_LOADING_MODE, "container");
    }

    render() {

        var props = this.props;
        var { stages, location, isLoading } = props;
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

        __debug("Render stages @ location %s", location);


        /*
         * Location = 0 -> "Create a new stage"
         */
        if(location == 0) {
            stageDOM = <StageBuilder />
        } else {

        }

        return (
            <div className="ui stackable centered grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar message={messages["pages.console.stages.heading"]} />
                    </div>
                </div>
                <div className="row clear top">
                    <div className="three wide computer four wide tablet column">
                        <div className="ui fluid secondary vertical pointing menu">
                            {stages.map(thisStage => {
                                var isCurrent = thisStage.id == location;
                                return (
                                    <NavLink
                                        key={"console-open-stage-" + thisStage.id}
                                        href={'/console/stages/' + thisStage.id}
                                        className={(isCurrent ? "active " : "") + "item"}
                                        disabled={isCurrent || isLoading}>
                                        {thisStage.name}
                                    </NavLink>
                                );
                            })}
                            <NavLink
                                href={'/console/stages'}
                                className={((0 == location) ? "active " : "") + " blue item"}
                                disabled={(0 == location)}>
                                <i className="plus icon"></i>
                                Create a new stage
                            </NavLink>
                        </div>
                    </div>
                    <div className="thirteen wide computer twelve wide tablet top right spaced column">
                        {stageDOM}
                    </div>
                </div>
            </div>
        );
    }
}

Stages = connectToStores(
    Stages,
    [StageStore],
    function(context, props) {

        var location = 0;
        var stageStore = context.getStore(StageStore);
        var routeStore = context.getStore('RouteStore');

        var stages = stageStore.getStages();
        var params = routeStore.getCurrentRoute().params;

        if(params.id) {
            location = params.id;
        }

        return {
            location: location,
            stages: stages
        };
    }
)

export default injectIntl(Stages);
