/**
 * forcept - containers/pages/Home.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AppStore from '../../flux/App/AppStore';

class Home extends React.Component {
    render() {
        return (
            <div className="ui basic segment">
                <h1 className="ui header">
                    Welcome to FORCEPT.
                    <div className="sub header">
                        Use the controls in the sidebar to get started.
                    </div>
                </h1>
                <h4 className="ui header">
                    FORCEPT v2.0.0. Contact ckelley@azurutechnology.com for information or assistance.
                    <div className="sub header">
                        Copyright &copy; Azuru Technology LLC 2016. All rights reserved.
                    </div>
                </h4>
            </div>
        );
    }
}

export default injectIntl(Home);
