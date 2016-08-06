/**
 * forcept - containers/Container.js
 * @author Azuru Technology
 */

/*globals document*/

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import debug from 'debug';

import AppStore from '../flux/App/AppStore';
import VerticalMenu from '../components/Navigation/VerticalMenu';
import StoreDebugger from '../components/Console/StoreDebugger';

const __debug = debug('forcept:containers:Container')

if(process.env.BROWSER) {
    require('semantic-ui/dist/semantic.css');
    require('../styles/Global.less');
    require('../styles/Container.less');
}

class Container extends React.Component {

    /*
     *
     */
    componentDidMount = () => {
        this.updateTitle(this.props.pageTitle);
    }

    /*
     *
     */
    componentDidUpdate(prevProps, prevState) {

        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }

        this.updateTitle(newProps.pageTitle);
    }

    /*
     * Update the page title.
     */
    updateTitle = (pageTitle) => {
        if(pageTitle !== null && typeof pageTitle === "object") {
            document.title = this.props.intl.formatMessage(pageTitle) + " - FORCEPT";
        } else {
            document.title = "FORCEPT";
        }
    }

    /*
     *
     */
    _handleShowSidebar = () => {
        $("#Container").toggleClass("sidebar");
    }

    /*
     *
     */
    render() {

        const { currentNavigateError,
                currentRoute,
                isNavigateComplete } = this.props;

        const Handler = currentRoute && currentRoute.handler;
        let content;

        // TODO add real handlers for these things
        if(currentNavigateError) {
            content = "An error occurred.";
        } else if(!Handler) {
            content = "Handler not found";
        } else {
            const params = currentRoute.params || {};
            content = <Handler {...params} />
        }

        /// #Container is now like <body>
        return (
            <div id="Container">

                {/** CSS hides these for large screen sizes **/}
                <div id="TopBar" className="ui fixed inverted main menu">
                    <div className="ui container">
                        <a onClick={this._handleShowSidebar} className="launch icon item">
                            <i className="content icon"></i>
                        </a>
                    </div>
                </div>

                {/** CSS displays SideRail on large screen sizes **/}
                <VerticalMenu id="Rail" />
                <div id="Handler">
                    {content}
                </div>
                <StoreDebugger />

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
            pageTitle: appStore.getPageTitle()
        }
    }
)));
