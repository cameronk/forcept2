/**
 * forcept - components/Scaffold/Message.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import { omit } from "lodash";

class MessageScaffold extends BaseComponent {

    render() {
        var props = this.props;
        return (
            <div className={["ui message", (props.type || "info"), (props.className || "")].join(" ")}
                {...omit(props, ["className", "type"])}>
                {props.text}
            </div>
        );
    }
}

export default MessageScaffold;
