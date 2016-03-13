/**
 * forcept - containers/root.js
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { provideContext } from 'fluxible-addons-react';

import Container from './Container';

if(process.env.BROWSER) {
    require('bootstrap/scss/bootstrap-flex');
}

class Root extends React.Component {
    render() {
        return (
            <IntlProvider locale="en" messages={{ "pages.home.welcome": "Test" }}>
                <Container />
            </IntlProvider>
        );
    }
}

export default provideContext(Root, {
    getRequest: PropTypes.func.isRequired,
    getUser   : PropTypes.func.isRequired,
    isAuthenticated: PropTypes.func.isRequired,
});
