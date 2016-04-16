/**
 * forcept - components/Scaffold/Message.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import { omit } from "lodash";

/**
 * Properties:
 * - type
 * - icon
 * - header
 * - text
 */
class MessageScaffold extends BaseComponent {

    render() {
        var props = this.props;
        var classes = ["ui message", (props.icon ? "icon" : null), (props.type || "info"), (props.className || "")];
        return (
            <div
                className={classes.join(" ")}
                {...omit(props, ["className", "type", "icon"])}>
                {props.icon ? (
                    <i className={props.icon + " icon"}></i>
                ) : null}
                <div className="content">
                    {props.header ? (
                        <div className="header">
                            {props.header}
                        </div>
                    ) : null}
                    {props.text ? (
                        <p>{props.text}</p>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default MessageScaffold;
