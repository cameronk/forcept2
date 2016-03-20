/**
 * forcept - components/Navigation/TopBar.jsx
 * @author Azuru Technology
 */

import React from 'react';
import BaseComponent from '../Base';

class TopBar extends BaseComponent {

    componentDidMount() {
        this.autobind([
            '_handleShowSidebar'
        ]);
    }

    _handleShowSidebar() {
        $("#SideBar")
            .sidebar({
                context: $("#Container")
            })
            .sidebar('show');
    }

    render() {
        return (
            <div id="TopBar" className="ui fixed inverted main menu">
                <div className="ui container">
                    <a onClick={this._handleShowSidebar} className="launch icon item">
                        <i className="content icon"></i>
                    </a>
                </div>
            </div>
        );
    }
}

export default TopBar;
