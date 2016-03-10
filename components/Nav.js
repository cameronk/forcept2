/**
 * forcept - components/Nav.js
 * @author Azuru Technology
 */

import React from 'react';
import { NavLink } from 'fluxible-router';
import { provideContext } from 'fluxible-addons-react';

import TestAction from '../actions/TestAction';

class Nav extends React.Component {

    static contextTypes = {
        getStore:      React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func.isRequired
    }

    handleTestClick() {
        this.context.executeAction(TestAction);
    }

    render() {
        const selected = this.props.currentRoute;
        const links = this.props.links;

        const linkHTML = Object.keys(links).map((name) => {
            var className = '';
            var link = links[name];

            if (selected && selected.name === name) {
                className = 'pure-menu-selected';
            }

            return (
                <li className={className} key={link.path}>
                    <NavLink routeName={link.page} activeStyle={{backgroundColor: '#eee'}}>{link.title}</NavLink>
                </li>
            );
        });

        return (
            <ul className="pure-menu pure-menu-open pure-menu-horizontal">
                {linkHTML}
                <li onClick={this.handleTestClick.bind(this)}>Test</li>
            </ul>
        );
    }
}

export default Nav;
