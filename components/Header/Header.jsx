/**
 * forcept - components/Header/Header.jsx
 * @author Azuru Technology
 */

import React from 'react';
import routes from '../../flux/Route/Routes';
import BaseComponent from '../Base';
import Nav from './Nav';

if(process.env.BROWSER) {
}

class Header extends BaseComponent {
    render() {
        return (
            <div id="Header" className="bg-primary p-a-0">
                <Nav currentRoute={this.props.currentRoute} links={routes} />
            </div>
        );
    }
}

export default Header;
