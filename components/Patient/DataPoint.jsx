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
    static propTypes    = {

        /// Field properties
        field: React.PropTypes.shape({
            name: React.PropTypes.string,
            type: React.PropTypes.string.isRequired,
            settings: React.PropTypes.object
        }).isRequired,

        /// Field value
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ])

    }

    constructor() {
        super();
    }

    render() {

        var { props } = this,
            { field, value } = props;

        switch(field.type) {

            /*
             * Convert Select type (array of selected values)
             * into a list.
             */
            case "select":
                if(field.settings && field.settings.multiple) {
                    return (
                        <ul>
                            {value.map((item) => {
                                return (
                                    <li>{item}</li>
                                );
                            })}
                        </ul>
                    );
                } else {
                    return (
                        <div>{value.toString()}</div>
                    );
                }
                break;

            /*
             * Convert resource into embedded thingy.
             */
            case "file":
                return (
                    <div>
                        {value.map(({ type, id, ext }) => {
                            return (
                                <div className="ui fluid card">
                                    <div className="ui fluid image">
                                        <img src={["/resources/", id, ext].join("")} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
                break;

            /*
             * Otherwise, it's a string!
             */
            default:
                return (
                    <div>{value.toString()}</div>
                );
                break;
        }

    }

}

export default DataPoint;
