/**
 * forcept - components/Scaffold/Button.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';

class ButtonScaffold extends BaseComponent {

    render() {
        var props = this.props;
        return (
            <button className={"ui button " + (props.className || "")}>
                {props.text}
            </button>
        );
    }
}

export default ButtonScaffold;
