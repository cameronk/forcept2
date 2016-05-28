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
            key = this.getKey(),
            container = $(`#${key}`);

        var options = {
            allowAdditions: (settings.customizable || false),
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

        __debug("!!!!!!!!!!!!!!!! Caught change2");
        __debug("Current: ", current)
        __debug("Updated: ", updated);
        __debug("Difference: ", diff);


        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: updated
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

        return this.props.patientID !== newProps.patientID;

    }

    /**
     * If a value was passed to the select field, change selected value.
     * Otherwise, clear the dropdown.
     */
    componentDidUpdate() {
        var { props } = this,
            container = $(`#${this.getKey()}`);
        //
        // var currentValue = container.dropdown('get value').split(',');
        //
        // if(difference(currentValue, this.props.value).length > 0) {
        //     container.dropdown('set exactly', )
        // }

        // __debug(currentValue);

        // if(props.value && props.value.length > 0) {
        //     __debug("[%s] setting exactly %s selected value(s)", props.fieldID, props.value.length);
        //
        //     /// We need to set the DIFFERENCE between the current value
        //     /// and the passed value
            // container.dropdown('set value', props.value.join());
        //              .dropdown('refresh');
        // } else {
        //     __debug("[%s] clearing dropdown", props.fieldID);
        //     container
        //         .dropdown('restore default text');
        // }
    }

    getKey = () => `FieldDropdown-${this.props.fieldID}-${this.props.patientID}`

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

            var key = this.getKey();

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
