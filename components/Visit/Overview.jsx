/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import upperFirst from 'lodash/upperFirst';
import without from 'lodash/without';
import $ from 'jquery';

import OverviewField from './OverviewField';
import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Visit:Overview');

if(process.env.BROWSER) {
    require('../../styles/VisitOverview.less');
}

class Overview extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
        this.state = {
            visible: true,
            checklist: true
        };
    }

    componentDidMount() {
        $(".VisitOverview .ui.dropdown").dropdown();
    }

    _toggleVisibility = (evt) => {
        this.setState({
            visible: !this.state.visible
        });
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
                <div className="top attached ui segment" onClick={this._toggleVisibility}>
                    <span className="teal ui ribbon label">{patient.id}</span>
                    <span>{patient.fullName || "Unnamed patient"}</span>
                    <i className={"large right fitted chevron icon" + (this.state.visible ? " clockwise rotated" : "")}></i>
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
            <div className={"VisitOverview" + (!this.state.visible ? " collapsed" : "")}>
                {headerDOM}
                <div className="ListContainer middle attached fully expanded ui segment">
                    <div className="very relaxed divided ui list">
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
                <div className="bottom attached ui segment">
                    <div className="ui dropdown">
                        <i className="large setting icon"></i>
                        <div className="menu">
                            <div className="header">Settings</div>
                            <div className="item">
                                {this.state.checklist ? [
                                    (<i className="ui hide icon"></i>),
                                    (<span>Use compact mode</span>)
                                ] : [
                                    (<i className="ui unhide icon"></i>),
                                    (<span>Use checklist mode</span>)
                                ]}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

}

export default Overview;
