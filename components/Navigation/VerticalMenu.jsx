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
    consoleDisplaysItem: {
        id: "verticalmenu.user.consoleDisplaysItem",
        defaultMessage: "Displays"
    },
    consoleFieldDataItem: {
        id: "verticalmenu.user.consoleFieldDataItem",
        defaultMessage: "Field data"
    },
    consoleUsersItem: {
        id: "verticalmenu.user.consoleUsersItem",
        defaultMessage: "Users"
    }

});

class VerticalMenu extends BaseComponent {

    static contextTypes = grabContext()

    render() {

        var props = this.props,
            ctx = this.context,
            { formatMessage } = this.props.intl,
            isAuthenticated = ctx.isAuthenticated(),
            stageKeys = Object.keys(props.stages),
            stagesItem, userItem;

        /*
         * Show the user area if user is authenticated
         */
        if(isAuthenticated) {

            stagesItem = (
                <div className="item">
                    <div className="header">Stages</div>
                    <div className="menu">
                        {stageKeys.map((stageID) => {
                            let thisStage = props.stages[stageID];
                            return (
                                <NavLink
                                    href={"/visits/" + thisStage.slug}
                                    key={thisStage.id}
                                    className="item">
                                    {thisStage.name || "Untitled stage"}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            );

            // ctx.getUser("isAdmin") === true && ctx.getStore('RouteStore').getCurrentRoute().namespace === "console"

            userItem = (
                <div className="item">
                    <div className="header">Administration</div>
                    <div className="menu">
                        {(() => {
                            if(ctx.getUser("isAdmin") === true) {
                                return (
                                    <div>
                                        <NavLink className="item" href="/console">
                                            <i className="chevron down icon"></i>
                                            {formatMessage(messages.consoleItem)}
                                        </NavLink>
                                        <div className="sub menu">
                                            <NavLink href="/console/stages" className="item">
                                                <i className="database icon"></i>
                                                {formatMessage(messages.consoleStageItem)}
                                            </NavLink>
                                            <NavLink href="/console/displays" className="item">
                                                <i className="list icon"></i>
                                                {formatMessage(messages.consoleDisplaysItem)}
                                            </NavLink>
                                            <NavLink href="/console/users" className="item">
                                                <i className="users icon"></i>
                                                {formatMessage(messages.consoleUsersItem)}
                                            </NavLink>
                                            <NavLink href="/console/field-data" className="item">
                                                <i className="list icon"></i>
                                                {formatMessage(messages.consoleFieldDataItem)}
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                        <a key="chooseLanguage" className="item">
                            <i className="globe icon"></i>
                            {formatMessage(messages.chooseLanguage)}
                        </a>
                        <NavLink key="logout" routeName="logout" className="item">
                            <i className="sign out icon"></i>
                            {formatMessage(messages.logout)}
                        </NavLink>
                    </div>
                </div>
            );

        }

        return (
            <div id={props.id} className={["ui large inverted vertical menu", props.className].join(" ")}>
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
                {stagesItem}
                {userItem}
                <ul id="debug"></ul>
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
