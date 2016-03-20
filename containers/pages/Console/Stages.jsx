/**
 * forcept - containers/pages/Console/Stages.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import StageStore from '../../../flux/Console/StageStore';
import HeaderBar from '../../../components/Meta/HeaderBar';
import { LoginAction, CredentialChangeAction }  from '../../../flux/Auth/AuthActions';
import BaseComponent, { grabContext }           from '../../../components/Base';

const messages = defineMessages({
    "pages.console.stages.heading": {
        id: "pages.console.stages.heading",
        defaultMessage: "Stages"
    }
});

class Stages extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {
        var props = this.props,
            ctx   = this.context;

        var stage;

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
                            <a className="active item">Test</a>
                            <a className="item">Test</a>
                            <a className="item">Test</a>
                            <a className="item">Test</a>
                            <a className="item">Test</a>
                        </div>
                    </div>
                    <div className="thirteen wide computer twelve wide tablet column">
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
        }
    }
)

export default injectIntl(Stages);
