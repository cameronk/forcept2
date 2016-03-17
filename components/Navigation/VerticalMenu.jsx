/**
 * forcept - components/Header/VerticalMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import routes from '../../flux/Route/Routes';
import BaseComponent, { grabContext } from '../Base';
import NavLink from './NavLink';
import { defineMessages, injectIntl } from 'react-intl';

if(process.env.BROWSER) {
    require('../../styles/VerticalMenu.less');
}

const messages = defineMessages({

    /* User item */
    userPronoun: {
        id: "verticalmenu.user.pronoun",
        defaultMessage: "You"
    },
    chooseLanguage: {
        id: "verticalmenu.user.chooselanguage",
        defaultMessage: "Choose language"
    },
    logout: {
        id: "verticalmenu.user.logout",
        defaultMessage: "Sign out"
    }

})

class VerticalMenu extends BaseComponent {
                    // <i className="notched circle loading icon"></i>

    static contextTypes = grabContext()

    render() {

        let { formatMessage } = this.props.intl;

        var ctx = this.context,
            isAuthenticated = ctx.isAuthenticated(),
            userItem;

        /// Show the user area if user is authenticated
        if(isAuthenticated) {
            userItem = (
                <div className="item">
                    <div className="header">{formatMessage(messages.userPronoun)} {"\u2014"} {ctx.getUser("username")}</div>
                    <div className="menu">
                        <a className="item"><i className="globe icon"></i> {formatMessage(messages.chooseLanguage)}</a>
                        <a className="item"><i className="settings icon"></i> Account Settings</a>
                        <NavLink routeName={"logout"} className="item"><i className="sign out icon"></i> {formatMessage(messages.logout)}</NavLink>
                    </div>
                </div>
            );
        }

        return (
            <div id={this.props.id} className={["ui large inverted vertical menu", this.props.className].join(" ")}>
                <span className="ui left corner label">
                    <i className={!isAuthenticated ? "sign in icon" : "sign out icon"}></i>
                </span>
                <div className="item logo">
                    <div className="ui large center aligned inverted statistic">
                        <div className="value">
                            <i className="heartbeat icon"></i>
                        </div>
                        <div className="label">
                            <h2>Forcept</h2>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="header">Data</div>
                    <div className="menu">
                        <div className="item">New visit</div>
                        <div className="item">Triage</div>
                    </div>
                </div>
                <div className="item">
                    <div className="header">Stages</div>
                    <div className="menu">
                        <div className="item">New visit</div>
                        <div className="item">Triage</div>
                    </div>
                </div>
                {userItem}
            </div>
        );
    }
}

export default injectIntl(VerticalMenu);
