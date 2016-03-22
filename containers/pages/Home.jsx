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
            </div>
        );
    }
}

export default injectIntl(Home);
