/**
 * forcept - components/Console/Setting/Checkbox.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import $ from 'jquery';

import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Console:Setting:Checkbox');

class CascadingFieldSelector extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
        var elem = $(`#${this.getID()}`);
        __debug(elem);
        elem.dropdown({
            onChange: this.props.onChange || (() => { })
        });
        if(this.props.context) {
            elem.dropdown("set selected", [ this.props.context ]);
        }
    }


    getID = (() => "FORCEPT-Dropdown-DataComparisonFieldSelector-" + this.props.displayID);

    render() {
        var props = this.props,
            { stages } = props,
            stageKeys = Object.keys(stages),
            availableFields = this.context.getFieldTypes();

        return (
            <div id={this.getID()}
                className="ui floating labeled icon dropdown button">
                <span className="text">Compare data from...</span>
                <i className="dropdown icon"></i>
                <div className="menu">
                    {stageKeys.map(stageID => {
                        var thisStage = stages[stageID];
                        return (
                            <div className="item">
                                <i className="dropdown icon"></i>
                                {thisStage.name || "Untitled stage"}
                                <div className="menu">
                                    {Object.keys(thisStage.fields).map(fieldID => {
                                        var thisField = thisStage.fields[fieldID];
                                        if(availableFields.hasOwnProperty(thisField.type)
                                            && availableFields[thisField.type].storageMethod !== "none") {
                                            return (
                                                <div className="item" data-value={`${stageID}.${fieldID}`}>
                                                    <span className="description">{thisField.type}</span>
                                                    <span className="text">{thisField.name || "Untitled field"}</span>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

}

export default injectIntl(CascadingFieldSelector);
