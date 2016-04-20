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

import { BuildDOMClass } from '../../utils/CSSClassHelper';
import MessageScaffold from '../Scaffold/Message';
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

    _toggleChecklist = (evt) => {
        this.setState({
            checklist: !this.state.checklist
        });
    }

    isEmpty = (field) => {
        switch(typeof field) {
            case "string":
            case "array":
                return field.length === 0;
                break;
            case "object":
                return Object.keys(field).length === 0;
                break;
            default:
                return true;
                break;
        }
    }

    render() {
        var props = this.props,
            { stage, visit, patient } = props,
            { fields } = stage;

        var iterableFields = Object.keys(fields);
        var headerDOM;

        __debug("render() overview for %s", stage.name);

        if(!patient) {
            return (
                <div className="ui segment">
                    <MessageScaffold
                        type="error"
                        header="An error occurred."
                        text="Missing patient information." />
                </div>
            );
        }

        if(stage.isRoot) {
            iterableFields = without(iterableFields, 'firstName', 'lastName');
            headerDOM = (
                <div className="top attached ui segment" onClick={this._toggleVisibility}>
                    <span className="tiny teal ui ribbon label">{patient.id}</span>
                    <strong>{patient.fullName || "Unnamed patient"}</strong>
                    <i className={"large right fitted chevron icon" + (this.state.visible ? " clockwise rotated" : "")}></i>
                </div>
            );
        } else {
            headerDOM = (
                <div className="top attached ui header" onClick={this._toggleVisibility}>
                    <div className="content">{stage.name || "Untitled stage"}</div>
                    <i className={"large right fitted chevron icon" + (this.state.visible ? " clockwise rotated" : "")}></i>
                </div>
            );
        }

        var hasAValue = false;

        return (
            <div className={"VisitOverview" + (!this.state.visible ? " collapsed" : "")}>
                {headerDOM}
                <div className="ListContainer middle attached fully expanded ui segment">
                    <div className="very relaxed divided ui list">
                        {iterableFields.map(field => {
                            var thisField = fields[field];
                            var thisValue = patient[field] || "";
                            if(this.state.checklist === true || !this.isEmpty(thisValue)) {
                                hasAValue = true;
                                return (
                                    <OverviewField
                                        key={field}
                                        type={thisField.type}
                                        name={thisField.name}
                                        value={thisValue} />
                                );
                            }
                        })}
                        {() => {
                            if(!hasAValue) {
                                return (
                                    <div className="item">
                                        <i className="red remove circle icon"></i>
                                        <div className="content">
                                            <span className="header">No data available.</span>
                                        </div>
                                    </div>
                                )
                            }
                        }()}
                    </div>
                </div>
                <div className={BuildDOMClass({ "bottom": props.isLast === true }, "attached secondary ui segment Forcept-OverviewSettings")}>
                    <div className="ui dropdown">
                        <i className="setting icon"></i>
                        <div className="menu">
                            <div className="header">Settings</div>
                            <div className="item" onClick={this._toggleChecklist}>
                                {this.state.checklist ? [
                                    (<i key="icon" className="ui hide icon"></i>),
                                    (<span key="msg">Use compact mode</span>)
                                ] : [
                                    (<i key="icon" className="ui unhide icon"></i>),
                                    (<span key="msg">Use checklist mode</span>)
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
