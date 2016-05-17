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
import SideBar from '../components/Navigation/SideBar';
import TopBar from '../components/Navigation/TopBar';
import SideRail from '../components/Navigation/SideRail';

const __debug = debug('forcept:containers:Container')

if(process.env.BROWSER) {
    require('../semantic/dist/semantic.css');
    require('../styles/Global.less');
    require('../styles/Container.less');
}

class Container extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }

        console.log(newProps.pageTitle);

        document.title = this.props.intl.formatMessage(newProps.pageTitle); //this.props.intl.formatMessage(newProps.pageTitle);
    }

    render() {

        const { currentNavigateError,
                currentRoute,
                isNavigateComplete } = this.props;

        const Handler = currentRoute && currentRoute.handler;
        let content, loading;

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
                <SideBar />
                <TopBar />

                {/** Add .pusher so semantic can fiddle with sidebar **/}
                <div className="pusher">

                    <div className="full height">

                        {/** CSS displays SideRail on large screen sizes **/}
                        <div className="toc">
                            <SideRail />
                        </div>
                        <div id="Handler">
                            {loading}
                            {content}
                        </div>

                    </div>

                </div>

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
