/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import upperFirst from 'lodash/upperFirst';

import BaseComponent, { grabContext } from '../Base';
import ValueDefined from '../../utils/ValueDefined';
import DataPoint from '../Patient/DataPoint';

const __debug = debug('forcept:components:Visit:OverviewField');

class OverviewField extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var { props } = this,
            { field, value } = props,
            valueDefined = ValueDefined(field.type, value),
            iconClass = (valueDefined ? "green check mark" : "red close"),
            descriptionDOM, resourcesDOM;

        __debug("Value %s %s for %s", value, (valueDefined ? "is defined" : "is not defined"), field.name);

        /*
         * We ignore value if this is a non-value-bearing field (i.e. header)
         */
        if(field.type === "header") {

            return (
                <div className="item grey">
                    <h5 className="right">{field.name || "Untitled header"}</h5>
                </div>
            );

        } else {

            if(valueDefined) {

                switch(field.type) {

                    /*
                     * Convert resource into embedded thingy.
                     */
                    case "file":
                        resourcesDOM = (
                            <DataPoint field={field} value={value} />
                        );
                        break;

                    /*
                     * Otherwise, it's a string!
                     */
                    default:
                        descriptionDOM = (
                            <DataPoint field={field} value={value} />
                        );
                        break;

                }

            }

            return (
                <div className="item">
                    <i className={iconClass + " icon"}></i>
                    <div className="content">
                        <span className="header">{upperFirst(field.name || "Untitled field")}</span>
                        <div className="description">{descriptionDOM}</div>
                    </div>
                    {resourcesDOM}
                </div>
            );

        }

    }

}

export default OverviewField;
