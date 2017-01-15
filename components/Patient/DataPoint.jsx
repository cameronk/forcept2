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

if(process.env.BROWSER) {
    require('../../styles/DataPoint.less');
}

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
            { field, value } = props,
            dataDOM;

        switch(field.type) {

            /*
             * Convert Select type (array of selected values)
             * into a list.
             */
            case "select":
                if(field.settings && field.settings.multiple) {
                    dataDOM = (
                        <ul style={{ paddingLeft: 14, paddingTop: 3, margin: 0 }}>
                            {value.map((item) => {
                                return (
                                    <li>{item}</li>
                                );
                            })}
                        </ul>
                    );
                } else {
                    dataDOM = value.toString();
                }
                break;

            /*
             * Convert resource into embedded thingy.
             */
            case "file":
                dataDOM = value.map(({ type, id, ext }) => {
                    return (
                        <div className="ui fluid card" style={{ marginTop: 5 }}>
                            <div className="ui fluid image">
                                <img src={["/resources/", id, ext].join("")} />
                            </div>
                        </div>
                    );
                });
                break;

            case "teeth-screener":

                var treatments = {};

                for(var quadrant in value) {
                    for(var number in value[quadrant]) {
                        value[quadrant][number].map(treatment => {

                            var tag = `${quadrant}-${number}`;

                            if(treatments.hasOwnProperty(treatment)) {
                                treatments[treatment].push(tag);
                            } else {
                                treatments[treatment] = [ tag ];
                            }

                        })
                    }
                }

                dataDOM = Object.keys(treatments).map(treatment => {
                    return [
                        (
                            <h5 key="header">{treatment}</h5>
                        ),
                        (
                            <ul key="list">
                                {treatments[treatment].map((location, index) => {
                                    return (
                                        <li key={index}>{location}</li>
                                    );
                                })}
                            </ul>
                        )
                    ];
                });
                break;

            /*
             * Otherwise, it's a string!
             */
            default:
                dataDOM = value.toString();
                break;
        }

        return (
            <div className="FORCEPT-DataPoint" data-field={field.type}>{dataDOM}</div>
        );

    }

}

export default DataPoint;
