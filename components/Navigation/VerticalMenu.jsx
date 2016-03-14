/**
 * forcept - components/Header/VerticalMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import routes from '../../flux/Route/Routes';
import BaseComponent from '../Base';

if(process.env.BROWSER) {
    require('semantic-ui/dist/components/menu.css');
    require('semantic-ui/dist/components/sidebar.css');
    require('semantic-ui/dist/components/dropdown.css');
}

class VerticalMenu extends BaseComponent {
    render() {
        return (
            <div id={this.props.id} className={["ui large inverted vertical menu", this.props.className].join(" ")}>
                <div className="item">
                    <div className="header">Forcept</div>
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
                <div className="item">
                    <div className="header">You</div>
                    <div className="inverted menu">
                        <a className="item"><i className="edit icon"></i> Edit Profile</a>
                        <a className="item"><i className="globe icon"></i> Choose Language</a>
                        <a className="item"><i className="settings icon"></i> Account Settings</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default VerticalMenu;
