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

        var { props } = this;
        var { value } = props;

        var iconClass = ((value && value.length > 0) ? "green check mark" : "red close");
        var valueDOM;

        switch(props.type) {
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
                    <span className="header">{upperFirst(props.name)}</span>
                    <div className="description">{valueDOM}</div>
                </div>
            </div>
        );

    }

}

export default OverviewField;
