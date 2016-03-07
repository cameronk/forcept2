/**
 * forcept - containers/Application.js
 * @author Azuru Technology
 */

/*globals document*/

import React from 'react';
import { injectIntl } from 'react-intl';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';

import Nav from '../components/Nav';
import ApplicationStore from '../stores/ApplicationStore';
import pages from '../configs/routes';

class Application extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }

        console.log("componentDidUpdate");
        console.log(this);

        document.title = newProps.pageTitle;
    }

    render() {

        /// Get Handler, the React component representing the container
        var Handler = this.props.currentRoute.handler;

        return (
            <div>
                <Nav currentRoute={this.props.currentRoute} links={pages} />
                <Handler />
            </div>
        );
    }
}

export default injectIntl(handleHistory(connectToStores(
    Application,
    [ApplicationStore],
    function (context, props) {
        var appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle()
        };
    }
)));
