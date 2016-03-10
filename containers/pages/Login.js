/**
 * forcept - containers/pages/Login.js
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import { defineMessages, injectIntl } from 'react-intl';

import { LoginAction } from '../../actions/AuthActions';
import BaseComponent   from '../../components/Base';

const messages = defineMessages({
    loginHeading: {
        id: 'pages.home.heading',
        defaultMessage: 'Login'
    }
});

class Login extends BaseComponent {

    static contextTypes = {
        getStore:      PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired
    }

    constructor() {
        super();
        this.autobind();
        this.state = {
            username: "",
            password: ""
        };
    }

    _submit() {
        this.context.executeAction(LoginAction, this.state);
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <h2>{this.props.intl.formatMessage(messages.loginHeading)}</h2>
                <form id="login" method="POST">
                    <input type="text" name="username" placeholder="Username" valueLink={this.linkState('username')} />
                    <input type="password" name="password" placeholder="Password" valueLink={this.linkState('password')} />
                    <button type="button" onClick={this._submit}>Submit</button>
                </form>
            </div>
        );
    }
}

/// Add LinkedState mixin.
ReactMixin(Login.prototype, LinkedStateMixin);

export default injectIntl(Login);
