/**
 * forcept - components/Fields/Select.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';
import $ from 'jquery';
import difference from 'lodash/difference';

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
        var { props } = this;
        $("#FieldDropdown-" + props.fieldID)
            .dropdown({
                allowAdditions: (props.field.settings.customizable || false),
                onChange: this._change("change"),
                // onRemove: this._change("remove"),
            });
        this.componentDidUpdate();
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
    _change = (type) => {
        return (value) => {
            __debug("change" + type);
            var { patientID, stageID, fieldID } = this.props;

            var bump = (val) => {
                __debug("Bumping: " + val);
                this.context.executeAction(UpdatePatientAction, {
                    [patientID]: {
                        [stageID]: {
                            [fieldID]: val
                        }
                    }
                })
            };

            /*
             * Does this field allow multiple entries?
             */
            if(this.props.field.settings.multiple) {
                value = value.split(",");

                if(type === "remove") {
                    bump($(`#FieldDropdown-${fieldID}`).dropdown('get value'));
                } else {
                    __debug(value);
                    __debug(this.props.value);
                    __debug(difference(value, this.props.value));

                    /*
                     * Check to see if we have new values.
                     */
                    if(difference(value, this.props.value).length > 0) {
                        bump(value);
                    }

                }

            } else {

                /*
                 * _change() fires when using Semantic's 'set selected',
                 * so we get cascading updates during tab changes.
                 * Check to make sure the value of _change differs from
                 * the value passed to the field to prevent this.
                 */
                if(value !== this.props.value) {
                    bump();
                }

            }
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
                        "multiple": settings.multiple,
                        "selection dropdown": true,
                    })}>
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
