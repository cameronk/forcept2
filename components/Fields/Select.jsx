/**
 * forcept - components/Fields/Select.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';
import $ from 'jquery';

import Label from './Label';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

const __debug = debug('forcept:components:Fields:Select');

class SelectField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    componentDidMount() {
        var { props } = this;
        $("#FieldDropdown-" + props.fieldID)
            .dropdown({
                allowAdditions: (props.field.settings.customizable || false),
                onChange: this._change
            });
    }

    /**
     * Update component if value changed.
     */
    shouldComponentUpdate(newProps) {
        return newProps.value !== this.props.value;
    }

    /**
     * If a value was passed to the select field, change selected value.
     * Otherwise, clear the dropdown.
     */
    componentDidUpdate() {
        var { props } = this;
        if(props.hasOwnProperty('value') && props.value.length > 0) {
            $("#FieldDropdown-" + this.props.fieldID)
                .dropdown('set selected', this.props.value);
        } else {
            $("#FieldDropdown-" + this.props.fieldID)
                .dropdown('clear');
        }
    }

    /**
     *
     */
    _change = (value) => {
        var { patientID, stageID, fieldID } = this.props;

        /*
         * _change() fires when using Semantic's 'set selected',
         * so we get cascading updates during tab changes.
         * Check to make sure the value of _change differs from
         * the value passed to the field to prevent this.
         */
        if(value !== this.props.value) {
            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: value
                    }
                }
            })
        }
    }

    render() {
        var props = this.props,
            { field, fieldID, value } = props,
            { settings } = field;

        var selectDOM, optionsDOM;

        optionsDOM = Object.keys(settings.options).map(optionKey => {
            var thisOption = settings.options[optionKey];
            return (
                <div
                    className={"item" + (thisOption.value === props.value ? " active" : "")}
                    key={fieldID + "-" + optionKey}
                    data-value={thisOption.value}>
                    {thisOption.value}
                </div>
            );
        });

        selectDOM = (
            <div
                id={"FieldDropdown-" + fieldID}
                className={[
                    "ui",
                    (settings.searchable || settings.customizable ? "search" : null),
                    "selection dropdown"
                ].join(" ")}>
                    <i className="dropdown icon"></i>
                    <input type="hidden" name="gender" />
                    <div className="default text">Select an option for {field.name.toLowerCase()}</div>
                    <div className="menu">
                        {optionsDOM}
                    </div>
            </div>
        );

        return (
            <div className="field">
                <Label field={field} />
                {selectDOM}
            </div>
        );

    }
}

export default SelectField;