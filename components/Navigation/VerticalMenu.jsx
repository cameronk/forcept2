/**
 * forcept - components/Navigation/VerticalMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import StageStore from '../../flux/Stage/StageStore';
import routes from '../../flux/Route/Routes';
import BaseComponent, { grabContext } from '../Base';
import NavLink from './NavLink';

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
    },

    /* Console item extension */
    consoleItem: {
        id: "verticalmenu.user.consoleItem",
        defaultMessage: "Console"
    },
    consoleStageItem: {
        id: "verticalmenu.user.consoleStageItem",
        defaultMessage: "Stages"
    },
    consoleFieldDataItem: {
        id: "verticalmenu.user.consoleFieldDataItem",
        defaultMessage: "Field data"
    }

});

class VerticalMenu extends BaseComponent {

    static contextTypes = grabContext()

    render() {

        let { formatMessage } = this.props.intl;

        var props = this.props,
            ctx = this.context,
            isAuthenticated = ctx.isAuthenticated(),
            userItem, stagesItem;

        /// Show the user area if user is authenticated
        if(isAuthenticated) {

            var consoleLink,
                consoleHeirarchy;

            if(ctx.getUser("isAdmin") === true) {
                consoleLink = (
                    <NavLink href={"/console"} className="item">
                        <i className="lock icon"></i> {formatMessage(messages.consoleItem)}
                    </NavLink>
                );

                if(ctx.getStore('RouteStore').getCurrentRoute().namespace === "console") {
                    consoleHeirarchy = (
                        <div className="sub menu">
                            <NavLink href={"/console/field-data"} className="item">
                                <i className="database icon"></i> {formatMessage(messages.consoleFieldDataItem)}
                            </NavLink>
                            <NavLink href={"/console/stages"} className="item">
                                <i className="list icon"></i> {formatMessage(messages.consoleStageItem)}
                            </NavLink>
                        </div>
                    );
                }
            }

            userItem = (
                <div className="item">
                    <div className="header">{formatMessage(messages.userPronoun)} {"\u2014"} {ctx.getUser("username")}</div>
                    <div className="menu">
                        {consoleLink}
                        {consoleHeirarchy}
                        <a className="item"><i className="globe icon"></i> {formatMessage(messages.chooseLanguage)}</a>
                        <NavLink routeName={"logout"} className="item"><i className="sign out icon"></i> {formatMessage(messages.logout)}</NavLink>
                    </div>
                </div>
            );

            stagesItem = (
                <div className="item">
                    <div className="header">Stages</div>
                    <div className="menu">
                        {props.stages.map((stage) => {
                            return (
                                <div key={stage.id} className="item">{stage.name || "Untitled stage"}</div>
                            );
                        })}
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
                {stagesItem}
                {userItem}
            </div>
        );
    }
}

VerticalMenu = connectToStores(
    VerticalMenu,
    [StageStore],
    function(context, props) {
        return {
            stages: context.getStore(StageStore).getStages()
        }
    }
)

export default injectIntl(VerticalMenu);
