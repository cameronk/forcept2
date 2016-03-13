/**
 * forcept - components/Nav.js
 * @author Azuru Technology
 */

import React from 'react';
import { provideContext } from 'fluxible-addons-react';

import BaseComponent, { grabContext } from './Base';
import NavLink from './NavLink';

class Nav extends BaseComponent {

    static contextTypes = grabContext(['*']);

    render() {
        const selected = this.props.currentRoute;
        const links = this.props.links;
        const isAuthenticated = this.context.isAuthenticated();

        const linkHTML = Object.keys(links).map((name) => {

            var className = '';
            var link = links[name];

            /// If we're not authenticated and this link is protected,
            /// don't render a NavLink element.
            if(link.auth && !isAuthenticated) return;
            if(link.antiAuth && isAuthenticated) return;

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
            </ul>
        );
    }
}

export default Nav;
