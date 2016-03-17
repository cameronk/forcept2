/**
 * forcept - containers/pages/Auth/Logout.js
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../../flux/Auth/AuthStore';
import { LoginAction, CredentialChangeAction }  from '../../../flux/Auth/AuthActions';
import BaseComponent    from '../../../components/Base';
import BuildError       from '../../../utils/BuildError';
import FormScaffold     from '../../../components/Scaffold/Form';

const messages = defineMessages({
    logoutMessage: {
        id: 'pages.logout.message',
        defaultMessage: 'One moment, signing out...'
    },
});

class Logout extends BaseComponent {

    static contextTypes = {
        getStore:       PropTypes.func.isRequired,
        executeAction:  PropTypes.func.isRequired,
        getRequest:     PropTypes.func.isRequired
    }

    constructor() {
        super();
    }

    render() {
        var props = this.props;

        return (
            <div className="ui stackable one column centered grid">
                <div className="three wide computer four wide tablet column">
                    <div className="ui center aligned raised attached blue segment">
                        <i className="huge notched circle loading icon"></i>
                    </div>
                    <div className="ui center aligned bottom attached header">
                        {this.props.intl.formatMessage(messages.logoutMessage)}
                    </div>
                </div>
            </div>
        );
    }
}

Logout = connectToStores(Logout, [AuthStore], (context, props) => {
    var authStore = context.getStore(AuthStore);
    return {
        error   : authStore.getError(),
        username: authStore.getUsername(),
        password: authStore.getPassword(),
    };
});

export default injectIntl(Logout);
