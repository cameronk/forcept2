/**
 * forcept - containers/pages/Console/Stages.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from "debug";

import StageStore from '../../../flux/Stage/StageStore';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import StageBuilder    from '../../../components/Console/StageBuilder';
import StagesMenu      from '../../../components/Console/StagesMenu';
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
        } else if(!props.isLoaded) {
            stageDOM = (
                <div className="ui active loader"></div>
            );
        } else {
            stageDOM = (
                <StageBuilder />
            );
        }

        /*
         * Location = 0 -> "Create a new stage"
         */
        return (
            <div className="ui stackable centered grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar message={messages["pages.console.stages.heading"]} />
                    </div>
                </div>
                <div className="row clear top">
                    <div className="three wide computer four wide tablet column">
                        <StagesMenu />
                    </div>
                    <div className="thirteen wide computer twelve wide tablet right spaced column">
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
        return {
            isLoaded: context.getStore('RouteStore').isNavigateComplete()
        };
    }
);

export default injectIntl(Stages);
