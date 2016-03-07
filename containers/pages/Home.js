import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import TestStore from '../../stores/TestStore';

const messages = defineMessages({
    welcome: {
        id: 'pages.home.welcome',
        defaultMessage: 'Welcome to the site!!! {count}'
    }
});

class Home extends React.Component {
    render() {
        return (
            <div>
                <h2>Home</h2>
                <p>{this.props.intl.formatMessage(messages.welcome, { count: this.props.hasOwnProperty("testCount") ? this.props.testCount : 0})}</p>
            </div>
        );
    }
}

Home = connectToStores(Home, [TestStore], (context, props) => {
    var testStore = context.getStore(TestStore);
    return {
        testCount: testStore.getArr().length
    }
});

export default injectIntl(Home);
