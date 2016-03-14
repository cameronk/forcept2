/**
 * forcept - components/Navigation/SideBar.jsx
 * @author Azuru Technology
 */

import React from 'react';
import BaseComponent from '../Base';

if(process.env.BROWSER) {
    require('semantic-ui/dist/components/menu.css');
    require('semantic-ui/dist/components/sidebar.css');
}

class SideBar extends BaseComponent {

    componentDidMount() {
        $("#SideBar")
            .sticky({
                context: $(".toc")
            });
    }

    render() {
        return (
            <div id="SideBar" className="ui vertical inverted sidebar menu left overlay">
                <div className="item">
                    <div className="header">Stages</div>
                    <div className="menu">
                        <div className="item">New visit</div>
                        <div className="item">Triage</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SideBar;
