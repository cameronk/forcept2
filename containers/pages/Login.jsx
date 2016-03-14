/**
 * forcept - containers/pages/Login.js
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
// import ReactMixin from 'react-mixin';
// import LinkedStateMixin from 'react-addons-linked-state-mixin';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../flux/Auth/AuthStore';
import { LoginAction, CredentialChangeAction }  from '../../flux/Auth/AuthActions';
import BaseComponent    from '../../components/Base';

const messages = defineMessages({
    loginHeading: {
        id: 'pages.home.heading',
        defaultMessage: 'Login'
    }
});

class Login extends BaseComponent {

    static contextTypes = {
        getStore:       PropTypes.func.isRequired,
        executeAction:  PropTypes.func.isRequired,
        getRequest:     PropTypes.func.isRequired
    }

    constructor() {
        console.log("Login component constructor");
        super();
        this.autobind([
            '_submit',
            '_inputChange'
        ]);
    }

    _inputChange(field) {
        return function(evt) {
            var data = {
                [field]: evt.target.value
            };
            this.context.executeAction(CredentialChangeAction, data);
        }.bind(this);
    }
    _submit() {
        this.context.executeAction(LoginAction);
    }

    render() {
        return (
            <div>
                <h2>{this.props.intl.formatMessage(messages.loginHeading)}</h2>
                {this.props.error ? (
                    <h4>Error occurred</h4>
                ) : ""}
                <input type="text" name="username" placeholder="Username" value={this.props.username} onChange={this._inputChange("username")} />
                <input type="password" name="password" placeholder="Password" value={this.props.password} onChange={this._inputChange("password")} />
                <button type="button" onClick={this._submit}>Submit</button>
            </div>
        );
    }
}

Login = connectToStores(Login, [AuthStore], (context, props) => {
    var authStore = context.getStore(AuthStore);
    return {
        error   : authStore.getError(),
        username: authStore.getUsername(),
        password: authStore.getPassword(),
    };
});

export default injectIntl(Login);
