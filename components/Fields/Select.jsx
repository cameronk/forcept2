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
            container = $("#FieldDropdown-" + props.fieldID);

        var options = {
            allowAdditions: (settings.customizable || false),
            action:         this._change,
            onRemove:       this._remove
        };

        __debug("Setting up field %s with options %j", props.fieldID, Object.keys(options));

        container.dropdown(options);

        /// First-time setup complete, update dropdown values as normal.
        this.componentDidUpdate(props);
    }

    /**
     *
     */
    _remove = (value, text, $choice) => {
        var { props } = this;
        __debug("[%s] Removing value => %s", props.fieldID, value);

        var selected = $("#FieldDropdown-" + props.fieldID).dropdown('get value').split(",");

        __debug(selected);
        
        /*
         * If this value is actually no longer selected...
         */
        if(selected.indexOf(value) === -1) {
            __debug("Actually removing this value.");
            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: selected
                    }
                }
            });
        }
    }

    /**
     *
     */
    _change = (text, value) => {

        var { props }    = this,
            { settings } = props.field,
            { patientID, stageID, fieldID } = props,
            newValue = [];

        /*
         * If we allow multiple selections, push the value
         * onto the end of the previously passed array.
         */
        if(settings.multiple && Array.isArray(props.value)) {
            newValue = [].concat(props.value);
        }

        newValue.push(value);

        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: newValue
                }
            }
        });

    }

    /**
     * Update component if value changed.
     */
    shouldComponentUpdate(newProps) {

        /*
         * difference() compares arrays in order of values
         * thus we reverse the comparison and check for any differences
         * (accounts for deletion and addition of values)
         */
        let update = (
              difference(newProps.value, this.props.value).length
            + difference(this.props.value, newProps.value).length
        ) > 0;

        __debug("[%s] => shouldComponentUpdate: %s (%j => %j)", this.props.fieldID, update, this.props.value, newProps.value);

        return update;

    }

    /**
     * If a value was passed to the select field, change selected value.
     * Otherwise, clear the dropdown.
     */
    componentDidUpdate() {
        var { props } = this;

        var container = $("#FieldDropdown-" + props.fieldID);

        if(props.value && props.value.length > 0) {
            __debug("[%s] setting exactly %s selected value(s)", props.fieldID, props.value.length);

            /// We need to set the DIFFERENCE between the current value
            /// and the passed value
            container.dropdown('set exactly', props.value)
                     .dropdown('refresh');
        } else {
            __debug("[%s] clearing dropdown", props.fieldID);
            container
                .dropdown('restore default text');
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

            selectDOM = (
                <div
                    id={"FieldDropdown-" + fieldID}
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
