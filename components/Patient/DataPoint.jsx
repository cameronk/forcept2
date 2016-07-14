/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import upperFirst from 'lodash/upperFirst';

import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Visit:DataPoint');

class DataPoint extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps) {
        return true;
        // return this.props.value !== nextProps.value;
    }

    render() {

        var { props } = this,
            { value } = props,
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
                            return (
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
                        return value.toString();
                    }
                    break;

                /*
                 * Convert resource into embedded thingy.
                 */
                case "file":
                    return value.map(({ type, id, ext }) => {
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
                    return value.toString();
                    break;
            }

        }


    }

}

export default DataPoint;
