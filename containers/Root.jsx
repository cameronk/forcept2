/**
 * forcept - containers/root.js
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { provideContext } from 'fluxible-addons-react';

import Container from './Container';

class Root extends React.Component {
    render() {
        return (
            <IntlProvider locale="en">
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
