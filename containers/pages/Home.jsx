/**
 * forcept - containers/pages/Home.js
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AppStore from '../../flux/App/AppStore';

const messages = defineMessages({
    welcome: {
        id: 'pages.home.welcome',
        defaultMessage: 'Welcome to the site!!! {count, number, percent}'
    }
});

class Home extends React.Component {
    render() {
        return (
            <div>
                <h2>Home {this.props.isAuthenticated ? "lol" : "asdf"}</h2>
                <p>
                    {this.props.intl.formatMessage(messages.welcome, {
                        count: this.props.hasOwnProperty("testCount") ? this.props.testCount : 0
                    })}
                </p>
            </div>
        );
    }
}

Home = connectToStores(Home, [], (context, props) => {
    var appStore  = context.getStore(AppStore);
    return {
        isAuthenticated: appStore.isAuthenticated()
    }
});

export default injectIntl(Home);
