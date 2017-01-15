/**
 * forcept - components/Fields/Select.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';
import $ from 'jquery';
import difference from 'lodash/difference';
import pull from 'lodash/pull';

import { BuildDOMClass } from '../../utils/CSSClassHelper';
import Label from './Label';
import MessageScaffold from '../Scaffold/Message';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

const __debug = debug('forcept:components:Fields:Select');

class SelectField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    componentDidMount() {
        var { props } = this,
            { settings } = props.field,
            container = $(`#FieldDropdown-${this.props.fieldID}`);

        var options = {
            allowAdditions: (settings.customizable || false),
            forceSelection: false,
            onChange: this._change2
        };

        __debug("Setting up field %s with options %j", props.fieldID, Object.keys(options));

        container.dropdown(options);

        /// First-time setup complete, update dropdown values as normal.
        this.componentDidUpdate(props);
    }

    /**
     *
     * value: comma-separated value for the ENTIRE dropdown
     */
    _change2 = (value, text, $choice) => {

        var { patientID, stageID, fieldID } = this.props;

        var current = this.props.value,
            updated = value.split(','),
            diff = difference(updated, current);

        /**
         * If the last option was removed, value.length == 0
         * so we set updated to an empty array.
         */
        if(value.length === 0) {
            updated = [];
        }

        __debug("!!!!!!!!!!!!!!!! Caught change2 for %s", this.props.fieldID);
        __debug("Value: ", value);
        __debug("Length: ", value.length);
        __debug("Choice: ", $choice);
        __debug("Current: ", current);
        __debug("Updated: ", updated);
        __debug("Difference: ", diff);

        // if($choice && value !== "") {
            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: updated
                    }
                }
            });
        // }

    }

    /**
     * Update component if the patient tab is changed,
     * in order to populate the new patients' value for the dropdown.
     */
    shouldComponentUpdate(newProps) {
        return this.props.patientID !== newProps.patientID;
        // return true;
    }

    /**
     * If a value was passed to the select field, change selected value.
     * Otherwise, clear the dropdown.
     */
    componentDidUpdate() {
        var { props } = this,
            container = $(`#FieldDropdown-${this.props.fieldID}`);

        __debug("componentDidUpdate -> ", props.value);

        if(props.value.length > 0) {
            container.dropdown('set exactly', props.value);
        } else {
            container.dropdown('clear');
        }
    }

    render() {
        var props = this.props,
            { field, fieldID, value } = props,
            { settings } = field;

        var selectDOM, optionsDOM;

        /*
         * Ensure this field has a defined options property.
         */
        if(!settings || !settings.hasOwnProperty("options")) {
            return (
                <div>
                    <MessageScaffold
                        type="active error"
                        icon="warning"
                        header="An error occurred."
                        text={`'${field.name}' has no defined options`} />
                </div>
            );
        }

        /*
         *
         */
        else {
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

            var key = `FieldDropdown-${this.props.fieldID}`;

            selectDOM = (
                <div key={key}
                    id={key}
                    className={BuildDOMClass("ui", {
                        "search": settings.searchable,
                        "multiple": settings.multiple
                    }, "selection dropdown")}>
                        <i className="dropdown icon"></i>
                        <input type="hidden" name="gender" />
                        <div className="default text">Select an option for {field.name || "untitled field"}</div>
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
}

export default SelectField;
