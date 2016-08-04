/**
 * forcept - components/Scaffold/Message.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import debug from 'debug';
import { injectIntl } from 'react-intl';
import BaseComponent, { grabContext } from '../Base';
import { omit } from 'lodash';

const __debug = debug('forcept:components:Scaffold:Message');

/**
 * Properties:
 * - type
 * - icon
 * - header
 * - text
 */
class MessageScaffold extends BaseComponent {

    static contextTypes = grabContext()
    static propTypes = {

        ///
        className:  React.PropTypes.string,
        type:       React.PropTypes.string,
        icon:       React.PropTypes.string,

        /// Text
        header: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.shape({
                message: React.PropTypes.object,
                data: React.PropTypes.object
            })
        ]),
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.shape({
                message: React.PropTypes.object,
                data: React.PropTypes.object
            })
        ])

    }

    render() {

        var props = this.props,
            classes = ["ui message", (props.icon ? "icon" : null), (props.type || "info"), (props.className || "")],
            { formatMessage } = props.intl,
            headerDOM, textDOM;

        if(props.header) {
            switch(typeof props.header) {
                case "string":
                    headerDOM = (
                        <div className="header">
                            {props.header}
                        </div>
                    );
                    break;
                case "object":
                    headerDOM = (
                        <div className="header">
                            {formatMessage(props.header.message, props.header.data || {})}
                        </div>
                    );
                    break;
            }
        }

        if(props.text) {
            switch(typeof props.Text) {
                case "string":
                    textDOM = props.text;
                    break;
                case "object":
                    textDOM = formatMessage(props.text.message, props.text.data || {});
                    break;
            }
        }

        return (
            <div
                className={classes.join(" ")}
                {...omit(props, ["className", "type", "icon"])}>
                {props.icon ? (
                    <i className={props.icon + " icon"}></i>
                ) : null}
                <div className="content">
                    {headerDOM}
                    {textDOM}
                </div>
            </div>
        );
    }
}

export default injectIntl(MessageScaffold);
