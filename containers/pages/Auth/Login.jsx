/**
 * forcept - containers/pages/Auth/Login.js
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
        return (evt) => {
            var data = {
                [field]: evt.target.value
            };
            this.context.executeAction(CredentialChangeAction, data);
        };
    }
    _submit() {
        return (evt) => {
            /// Prevent page from reloading
            evt.preventDefault();
            evt.stopPropagation();

            if(this.props.username.length !== 0 && this.props.password.length !== 0) {
                this.context.executeAction(LoginAction);
            }
        };
    }

    render() {
        var props = this.props;

        return (
            <div className="ui top spaced stackable one column grid">
                <div className="five wide computer seven wide tablet column">
                    <div className="ui raised segment">
                        <FormScaffold
                            onSubmit={this._submit()}
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
                                        submit: true,
                                        className: "fluid primary",
                                        text: "Log in",
                                        disabled: props.username.length === 0 || props.password.length === 0
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
