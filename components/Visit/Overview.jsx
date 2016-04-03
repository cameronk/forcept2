/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import upperFirst from 'lodash/upperFirst';
import without from 'lodash/without';

import OverviewField from './OverviewField';
import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Visit:Overview');

class Overview extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            { stage, visit, patient } = props,
            { fields } = stage;

        var iterableFields = Object.keys(fields);
        var headerDOM;

        if(stage.isRoot) {
            iterableFields = without(iterableFields, 'firstName', 'lastName');
            headerDOM = (
                <div className="top attached ui header">
                    <i className="treatment icon"></i>
                    <div className="content">
                        <div className="ui sub header">{patient.fullName || "Unnamed patient"}</div>
                    </div>
                </div>
            );
        } else {
            headerDOM = (
                <div className="top attached ui header">
                    <div className="content">
                        <div className="ui sub header">{stage.name || "Untitled stage"}</div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {headerDOM}
                <div className="bottom attached teal ui segment">
                    <div className="ui very relaxed list">
                        {iterableFields.map(field => {
                            var thisField = fields[field];
                            return (
                                <OverviewField
                                    key={field}
                                    type={thisField.type}
                                    name={thisField.name}
                                    value={patient[field] || ""} />
                            );
                        })}
                    </div>
                </div>
            </div>
        );

    }

}

export default Overview;
