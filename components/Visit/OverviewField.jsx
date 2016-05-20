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

            var { value } = props,
                valueDefined = (value && value.length > 0),
                iconClass = (valueDefined ? "green check mark" : "red close"),
                descriptionDOM, resourcesDOM;

            /*
             * Check if a value is defined.
             */
            if(valueDefined) {

                switch(props.type) {

                    /*
                     * Convert Select type (array of selected values)
                     * into a list.
                     */
                    case "select":
                        if(props.settings && props.settings.multiple) {
                            if(value.length > 0) {
                                descriptionDOM = (
                                    <ul>
                                        {value.map((item) => {
                                            return (
                                                <li>{item}</li>
                                            );
                                        })}
                                    </ul>
                                );
                            }
                        } else {
                            descriptionDOM = value.toString();
                        }
                        break;

                    /*
                     * Convert resource into embedded thingy.
                     */
                    case "file":
                        resourcesDOM = value.map(({ type, id, ext }) => {
                            return (
                                <div className="ui fluid card">
                                    <div className="ui fluid image">
                                        <img src={["/resources/", id, ext].join("")} />
                                    </div>
                                </div>
                            );
                        });
                        break;

                    /*
                     * Otherwise, it's a string!
                     */
                    default:
                        descriptionDOM = value.toString();
                        break;
                }

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
