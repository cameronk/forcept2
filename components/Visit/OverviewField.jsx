/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import upperFirst from 'lodash/upperFirst';

import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Visit:OverviewField');

class OverviewField extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.value !== nextProps.value;
    }

    render() {

        var { props } = this,
            { value } = props,
            iconClass = ((value && value.length > 0) ? "green check mark" : "red close"),
            valueDOM;

        switch(props.type) {
            case "select":
                if(props.settings && props.settings.multiple) {
                    valueDOM = (
                        <ul>
                            {value.split(',').map((item) => {
                                return (
                                    <li>{item}</li>
                                );
                            })}
                        </ul>
                    );
                } else {
                    valueDOM = value.toString();
                }
                break;
            case "header":
                return (
                    <div className="item grey">
                        <h5 className="right">{props.name || "Untitled header"}</h5>
                    </div>
                );
                break;
            case "file":
                valueDOM = "File";
                break;
            default:
                valueDOM = value.toString();
                break;
        }

        return (
            <div className="item">
                <i className={iconClass + " icon"}></i>
                <div className="content">
                    <span className="header">{upperFirst(props.name || "Untitled field")}</span>
                    <div className="description">{valueDOM}</div>
                </div>
            </div>
        );

    }

}

export default OverviewField;
