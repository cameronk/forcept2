/**
 * forcept - containers/Container.js
 * @author Azuru Technology
 */

/*globals document*/

import React from 'react';
import { injectIntl } from 'react-intl';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';

import AppStore from '../flux/App/AppStore';
import Header from '../components/Header/Header';

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
            <div className="p-a-0">
                <Header />
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
