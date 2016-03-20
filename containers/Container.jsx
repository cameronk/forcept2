/**
 * forcept - containers/Container.js
 * @author Azuru Technology
 */

/*globals document*/

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';

import AppStore from '../flux/App/AppStore';
import SideBar from '../components/Navigation/SideBar';
import TopBar from '../components/Navigation/TopBar';
import SideRail from '../components/Navigation/SideRail';

if(process.env.BROWSER) {
    require('../semantic/dist/semantic.css');
    require('../styles/Container.less');
}

class Container extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }

        document.title = "lol"; //this.props.intl.formatMessage(newProps.pageTitle);
    }

    render() {
        const { currentNavigateError, currentRoute, isNavigateComplete } = this.props;
        const Handler = currentRoute && currentRoute.handler;
        let content;

        // TODO add real handlers for these things
        if(currentNavigateError) {
            content = "An error occurred.";
        } else if(!Handler) {
            content = "Handler not found";
        } else if(!isNavigateComplete) {
            content = "Loading";
        } else {
            const params = currentRoute.params || {};
            content = <Handler {...params} />
        }

        /// #Container is now like <body>
        return (
            <div id="Container">
                <SideBar />
                <TopBar />
                <div className="pusher">
                    <div className="full height">
                        <div className="toc">
                            <SideRail />
                        </div>
                        <div id="Handler">
                            {content}
                        </div>
                    </div>
                </div>
                <ul id="debug"></ul>
            </div>
        );
    }
}

export default injectIntl(handleHistory(connectToStores(
    Container,
    [AppStore],
    function (context, props) {
        var appStore = context.getStore(AppStore);
        return {
            pageTitle: {
                    id: "pages.about.title",
                    defaultMessage: "About / Forcept"
                }
        };
    }
)));
