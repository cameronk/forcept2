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
import { SetOverviewModeAction } from '../../flux/Visit/VisitActions';
import MessageScaffold from '../Scaffold/Message';
import OverviewField from './OverviewField';
import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Visit:Overview');

if(process.env.BROWSER) {
    require('../../styles/VisitOverview.less');
}

class Overview extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    constructor() {
        super();
        this.state = {
            visible: true,
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
        var { props } = this;
        this.context.executeAction(SetOverviewModeAction, {
            [props.stage.id]: (props.mode === "checklist" ? "compact" : "checklist")
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
        }

        var hasAValue = false;

        return (
            <div className="relaxed divided ui list">
                {iterableFields.map(field => {
                    var thisField = fields[field];
                    var thisValue = patient[field] || "";
                    if(props.mode === "checklist" || !this.isEmpty(thisValue)) {
                        hasAValue = true;
                        return (
                            <OverviewField
                                key={field}
                                type={thisField.type}
                                settings={thisField.settings || null}
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
        );

    }

}

export default Overview;
