/**
 * forcept - components/Scaffold/Button.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import { omit } from "lodash";

class ButtonScaffold extends BaseComponent {

    render() {
        var props = this.props;
        return (
            <button
                type={props.submit === true ? "submit" : "button"}
                className={("ui button " + (props.className || "")).trim()}
                {...omit(props, ["className", "type"])}>
                {props.text}
            </button>
        );
    }
}

export default ButtonScaffold;
