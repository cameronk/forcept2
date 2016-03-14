/**
 * forcept - components/Navigation/SideRail.jsx
 * @author Azuru Technology
 */

import React from 'react';
import BaseComponent from '../Base';

if(process.env.BROWSER) {
    require('semantic-ui/dist/components/menu.css');
    require('semantic-ui/dist/components/sidebar.css');
}

class SideRail extends BaseComponent {

    componentDidMount() {
        $("#SideRail")
            .sticky({
                context: $(".toc")
            });
    }

    render() {
        return (
            <div id="SideRail" className="ui vertical inverted sticky menu fixed top">
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

export default SideRail;
