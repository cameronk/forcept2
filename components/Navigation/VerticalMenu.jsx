/**
 * forcept - components/Navigation/VerticalMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AppStore from '../../flux/App/AppStore';
import StageStore from '../../flux/Stage/StageStore';
import DisplayStore from '../../flux/Display/DisplayStore';
import routes from '../../flux/Route/Routes';
import BaseComponent, { grabContext } from '../Base';
import MessageScaffold from '../../components/Scaffold/Message';
import NavLink from './NavLink';

import StageMessages from '../../lang/Stage';
import DisplayMessages from '../../lang/Display';
import PharmacyMessages from '../../lang/Pharmacy';

if(process.env.BROWSER) {
    require('../../styles/VerticalMenu.less');
}

const messages = defineMessages({

    /// User
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

    /// Console items
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
    },
    consoleDataManagementItem: {
        id: "verticalmenu.user.consoleDataManagementItem",
        defaultMessage: "Data management"
    },


    /// Displays
    noDisplayGroupsAvailable: {
        id: "verticalmenu.displays.noneavailable",
        defaultMessage: "No display groups available"
    },

    /// Pharmacy
    pharmacyManageMedications: {
        id: "verticalmenu.pharmacy.manageMedications",
        defaultMessage: "Manage medications"
    }
});

class VerticalMenu extends BaseComponent {

    static contextTypes = grabContext()

    componentDidMount = () => {
        this.componentDidUpdate();
    }

    componentDidUpdate = () => {
        $(".FORCEPT-Navigation-Link").click(() => {
            var container = document.getElementById("Container");
            if(container.classList.contains("sidebar")) {
                container.classList.remove("sidebar");
            }
        });
    }

    render() {

        var props = this.props,
            ctx = this.context,
            { formatMessage } = props.intl,
            isAuthenticated = ctx.isAuthenticated(),
            stageKeys = Object.keys(props.stages),
            groupKeys = Object.keys(props.groups),
            restartWarningItem,
            stagesItem, groupsItem, pharmacyItem, userItem;

        if(props.hasConfigChanged) {
            restartWarningItem = (
                <div className="item">
                    <MessageScaffold
                        type="warning"
                        header="Heads up!"
                        text="Some configuration values have changed and will not be reflected until FORCEPT is restarted."
                        />
                </div>
            );
        }

        /*
         * Show the user area if user is authenticated
         */
        if(isAuthenticated) {

            stagesItem = (
                <div className="item">
                    <div className="header">{formatMessage(StageMessages.pluralNoun)}</div>
                    <div className="menu">
                        {stageKeys.map((stageID) => {
                            let thisStage = props.stages[stageID];
                            return (
                                <NavLink
                                    href={"/visits/" + thisStage.slug}
                                    key={thisStage.id}
                                    className="FORCEPT-Navigation-Link item">
                                    {thisStage.name || formatMessage(StageMessages.untitled)}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            );

            /*
            groupsItem = (
                <div className="item">
                    <div className="header">{formatMessage(DisplayMessages.pluralNoun)}</div>
                    <div className="menu">
                        {(() => {
                            if(groupKeys.length > 0) {
                                return groupKeys.map((groupID) => {
                                    let thisGroup = props.groups[groupID];
                                    return (
                                        <NavLink
                                            href={"/displays/" + thisGroup.slug}
                                            key={thisGroup.id}
                                            className="FORCEPT-Navigation-Link item">
                                            {thisGroup.name || formatMessage(DisplayMessages.untitledGroup)}
                                        </NavLink>
                                    );
                                });
                            } else {
                                return (
                                    <div className="item">
                                        <em>{formatMessage(messages.noDisplayGroupsAvailable)}.</em>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </div>
            );*/


            if(ctx.getUser("isAdmin")) {
                pharmacyItem = (
                    <div className="item">
                        <div className="header">{formatMessage(PharmacyMessages.noun)}</div>
                        <div className="menu">
                            <NavLink className="FORCEPT-Navigation-Link item" href="/pharmacy/manage">
                                <i className="treatment icon"></i>
                                {formatMessage(messages.pharmacyManageMedications)}
                            </NavLink>
                        </div>
                    </div>
                );
            }

            // ctx.getUser("isAdmin") === true && ctx.getStore('RouteStore').getCurrentRoute().namespace === "console"

            userItem = (
                <div className="item">
                    <div className="header">{formatMessage(messages.userPronoun)} &mdash; {ctx.getUser('username')}</div>
                    <div className="menu">
                        {(() => {
                            if(ctx.getUser("isAdmin") === true) {
                                return (
                                    <div>
                                        <NavLink className="FORCEPT-Navigation-Link item" href="/console">
                                            <i className="chevron down icon"></i>
                                            {formatMessage(messages.consoleItem)}
                                        </NavLink>
                                        <div className="sub menu">
                                            <NavLink href="/console/stages" className="FORCEPT-Navigation-Link item">
                                                <i className="database icon"></i>
                                                {formatMessage(messages.consoleStageItem)}
                                            </NavLink>
                                            {/*<NavLink href="/console/displays" className="FORCEPT-Navigation-Link item">
                                                <i className="list icon"></i>
                                                {formatMessage(messages.consoleDisplaysItem)}
                                            </NavLink>*/}
                                            <NavLink href="/console/users" className="FORCEPT-Navigation-Link item">
                                                <i className="users icon"></i>
                                                {formatMessage(messages.consoleUsersItem)}
                                            </NavLink>
                                            {/*<NavLink href="/console/field-data" className="FORCEPT-Navigation-Link item">
                                                <i className="list icon"></i>
                                                {formatMessage(messages.consoleFieldDataItem)}
                                            </NavLink>*/}
                                            <NavLink href="/console/data-management" className="FORCEPT-Navigation-Link item">
                                                <i className="tasks icon"></i>
                                                {formatMessage(messages.consoleDataManagementItem)}
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                        {/*<a key="chooseLanguage" className="FORCEPT-Navigation-Link item">
                            <i className="globe icon"></i>
                            {formatMessage(messages.chooseLanguage)}
                        </a>*/}
                        <NavLink key="logout" routeName="logout" className="FORCEPT-Navigation-Link item">
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
                            <i className="heartbeat icon" onClick={() => {
                                $("#FORCEPT-StoreDebugger").toggleClass("visible");
                            }}></i>
                        </div>
                        <div className="label">
                            <h2>FORCEPT</h2>
                        </div>
                    </div>
                </div>
                {restartWarningItem}
                {stagesItem}
                {groupsItem}
                {pharmacyItem}
                {userItem}
                <ul id="debug"></ul>
            </div>
        );
    }
}

VerticalMenu = connectToStores(
    VerticalMenu,
    [StageStore, AppStore],
    function(context, props) {
        return {
            hasConfigChanged: context.getStore(AppStore).hasConfigChanged(),
            stages: context.getStore(StageStore).getStages(),
            groups: context.getStore(DisplayStore).getGroups()
        }
    }
)

export default injectIntl(VerticalMenu);
