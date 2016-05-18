/**
* forcept - containers/pages/Console/Users.jsx
* @author Azuru Technology
*/

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import $ from 'jquery';
import debug from 'debug';

import BaseComponent    from '../../../components/Base';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import { LoadUsersAction, CreateUserAction, DeleteUserAction, UpdateNurseryAction } from '../../../flux/User/UserActions';
import UserStore from '../../../flux/User/UserStore';

const __debug = debug('forcept:containers:pages:Console:Users');
const messages = defineMessages({
    'pages.console.users.header': {
        id: 'pages.console.users.header',
        defaultMessage: 'Users'
    }
})

class Users extends BaseComponent {

    static contextTypes = {
        getStore:       PropTypes.func.isRequired,
        executeAction:  PropTypes.func.isRequired,
        getRequest:     PropTypes.func.isRequired
    }

    constructor() {
        super();
    }

    componentDidMount() {
        this.context.executeAction(LoadUsersAction);
    }

    /*
     *
     */
    _showAddUser = () => {

        /*
         * Bind onApprove to modal, then show it.
         */
        $("#Forcept-Modal-addUser")
            .modal({
                onApprove: () => {
                    var form = $("#Forcept-Modal-addUser .ui.form");
                    if(form.form('is valid')) {
                        this.context.executeAction(CreateUserAction, form.form('get values'));
                        return true;
                    } else {
                        form.form('validate form');
                        return false;
                    }
                }
            })
            .modal('show')
        ;

        /*
         * Set up form checking before submission.
         */
        $("#Forcept-Modal-addUser .ui.form")
            .form({
                inline: true,
                fields: {
                    username: 'empty',
                    password: ['empty', 'match[passwordRepeat]']
                }
            })
        ;
    }

    /**
    _showRemoveUser = (id) => {
        return (evt) => {
            var wait = 2;
            var button = $(`.button.FORCEPT-Action-removeUser[data-user-id='${id}']`);
                button.html('Yes, remove this user');
                button.on('click', () => {
                    this._submitRemoveUser(id);
                });
        };
    }
     *
     */

    /**
     *
     */
    _submitRemoveUser = (id) => {
        return (evt) => {
            this.context.executeAction(DeleteUserAction, {
                id: id
            });
        }
    }

    /**
     *
     */
    _submitAddUser = () => {
        $("#Forcept-Modal-addUser .ui.form").form('submit');
    }

    /*
     *
     */
    _update = (key) => {
        __debug("Bound _update for %s", key);
        return (evt) => {
            __debug("Updating nursery %s => %s", key, evt.target.value);
            this.context.executeAction(UpdateNurseryAction, {
                key: key,
                value: evt.target.value
            });
        };
    }

    render() {
        var { props } = this,
            { users } = props,
            userKeys = Object.keys(users);

        return (
            <div>
                <HeaderBar message={messages['pages.console.users.header']}></HeaderBar>
                {(() => {
                    if(userKeys.length > 0) {
                        return (
                            <div className="ui basic segment">
                                <table className="ui compact celled definition table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Username</th>
                                            <th>Password</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userKeys.map((id) => {
                                            let user = users[id];
                                            return (
                                                <tr>
                                                    <td className="collapsing">
                                                        {user.id}
                                                    </td>
                                                    <td>{user.username}</td>
                                                    <td>
                                                        <div className="ui button">
                                                            <i className="lock icon"></i>
                                                            Change password
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="small ui buttons">
                                                            <div className="ui red button FORCEPT-Action-removeUser" data-user-id={id} onClick={this._submitRemoveUser(id)}>
                                                                Remove user
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="full-width">
                                        <tr>
                                            <th></th>
                                            <th colSpan="3">
                                                <div onClick={this._showAddUser}
                                                     className="ui right floated small primary labeled icon button">
                                                    <i className="user icon"></i>
                                                    Add user
                                                </div>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        );
                    } else {
                        return (
                            <div className="ui loading segment"></div>
                        );
                    }
                })()}
                <div id="Forcept-Modal-addUser" className="small ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Create a new FORCEPT user
                    </div>
                    <div className="content">
                        <div className="ui form error">
                            <div className="field">
                                <label>Username</label>
                                <input type="text" name="username" placeholder="Type a username here" />
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input type="password" name="password" placeholder="Type a password here" />
                            </div>
                            <div className="field">
                                <label>Confirm password</label>
                                <input type="password" name="passwordRepeat" placeholder="Confirm the password here" />
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        <button className="ok ui button" onClick={this._submitAddUser}>
                            <i className="plus icon"></i>
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

Users = connectToStores(
    Users,
    [UserStore],
    (context, props) => {
        let userStore = context.getStore(UserStore);
        return {
            users: userStore.getUsers()
        };
    }
)

export default injectIntl(Users);
