/**
 * forcept - containers/pages/Auth/Login.js
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
// import ReactMixin from 'react-mixin';
// import LinkedStateMixin from 'react-addons-linked-state-mixin';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../../flux/Auth/AuthStore';
import { LoginAction, CredentialChangeAction }  from '../../../flux/Auth/AuthActions';
import BaseComponent    from '../../../components/Base';
import FormScaffold     from '../../../components/Scaffold/Form';

const messages = defineMessages({
    loginHeading: {
        id: 'pages.home.heading',
        defaultMessage: 'Sign in to Forcept'
    },
    "errors.auth.credentialMismatch": {
        id: "errors.auth.credentialMismatch",
        description: "User credentials not found in DB",
        defaultMessage: "Unable to locate matching credentials."
    }
});

class Login extends BaseComponent {

    static contextTypes = {
        getStore:       PropTypes.func.isRequired,
        executeAction:  PropTypes.func.isRequired,
        getRequest:     PropTypes.func.isRequired
    }

    constructor() {
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
        return (evt) => {
            console.log("Submit!");
            this.context.executeAction(LoginAction);
        };
    }

    render() {
        var props = this.props;
        
        return (
            <div className="ui stackable one column centered grid">
                <div className="five wide computer seven wide tablet column">
                    <div className="ui raised segment">
                        <FormScaffold
                            heading={{
                                text: props.intl.formatMessage(messages.loginHeading)
                            }}
                            error={props.error ? props.intl.formatMessage(messages[props.error.body.identifier]) : null}
                            fields={{
                                Username: {
                                    label: "Username",
                                    input: {
                                        type: "text",
                                        name: "username",
                                        value: props.username,
                                        onChange: this._inputChange("username"),
                                        icon: {
                                            name: "user"
                                        }
                                    }
                                },
                                Password: {
                                    label: "Password",
                                    input: {
                                        type: "password",
                                        name: "password",
                                        value: props.password,
                                        onChange: this._inputChange("password"),
                                        icon: {
                                            name: "lock"
                                        }
                                    }
                                },
                                Button: {
                                    input: {
                                        type: "button",
                                        className: "fluid primary",
                                        text: "Log in",
                                        onClick: this._submit()
                                    }
                                }
                            }} />
                    </div>
                </div>
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
