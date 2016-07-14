/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import upperFirst from 'lodash/upperFirst';

import BaseComponent, { grabContext } from '../Base';
import DataPoint from '../Patient/DataPoint';

const __debug = debug('forcept:components:Visit:OverviewField');

class OverviewField extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps) {
        return true;
        // return this.props.value !== nextProps.value;
    }

    render() {

        var { props } = this;

        /*
         * We ignore value if this is a non-value-bearing field (i.e. header)
         */
        if(props.type === "header") {

            return (
                <div className="item grey">
                    <h5 className="right">{props.name || "Untitled header"}</h5>
                </div>
            );

        } else {

            switch(props.type) {

                /*
                 * Convert resource into embedded thingy.
                 */
                case "file":
                    resourcesDOM = <DataPoint field={props} />
                    break;

                /*
                 * Otherwise, it's a string!
                 */
                default:
                    descriptionDOM = <DataPoint field={props} />
                    break;

            }

            return (
                <div className="item">
                    <i className={iconClass + " icon"}></i>
                    <div className="content">
                        <span className="header">{upperFirst(props.name || "Untitled field")}</span>
                        <div className="description">{descriptionDOM}</div>
                    </div>
                    {resourcesDOM}
                </div>
            );

        }

    }

}

export default OverviewField;
