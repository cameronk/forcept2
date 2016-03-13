/**
 * forcept - containers/Container.js
 * @author Azuru Technology
 */

/*globals document*/

import React from 'react';
import { injectIntl } from 'react-intl';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';

import Nav from '../components/Nav';
import AppStore from '../flux/App/AppStore';
import routes from '../flux/Route/Routes';

class Container extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }

        document.title = newProps.pageTitle;
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

        return (
            <div>
                <Nav currentRoute={this.props.currentRoute} links={routes} />
                {content}
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
        };
    }
)));
