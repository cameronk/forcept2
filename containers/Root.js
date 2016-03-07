/**
 * forcept - containers/root.js
 * @author Azuru Technology
 */

import React from 'react';
import { IntlProvider } from 'react-intl';
import { provideContext } from 'fluxible-addons-react';

import Application from './Application';

class Root extends React.Component {
    render() {
        return (
            <IntlProvider locale="en">
                <Application />
            </IntlProvider>
        );
    }
}

export default provideContext(Root);
