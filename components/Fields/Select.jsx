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
                onChange: this._change,
                onRemove: this._remove
            });
        this.componentDidUpdate();
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

        __debug("[%s] => shouldComponentUpdate: %s (%s => %s)", this.props.fieldID, update, this.props.value, newProps.value);

        return update;

    }

    /**
     * If a value was passed to the select field, change selected value.
     * Otherwise, clear the dropdown.
     */
    componentDidUpdate() {
        var { props } = this;

        __debug("[%s] - componentDidUpdate", props.fieldID);
        __debug("|==> current value: %s", $("#FieldDropdown-" + props.fieldID).dropdown('get value').toString());
        __debug("|==> new     value: %s", props.value.toString());

        /*
         * Only run update if the passed value differs from
         * the current value of the dropdown.
         */
        if(props.value.toString() !== $("#FieldDropdown-" + props.fieldID).dropdown('get value')) {
            if(props.hasOwnProperty('value') && props.value.length > 0) {
                __debug("[%s] |==> updating selected to: %s", props.fieldID, props.value.toString());
                $("#FieldDropdown-" + props.fieldID)
                    .dropdown('set exactly', props.value);
            } else {
                $("#FieldDropdown-" + props.fieldID)
                    .dropdown('clear');
            }
        }
    }

    /**
     *
     */
    _change = (value) => {
        var { patientID, stageID, fieldID } = this.props;

        __debug("[%s] onChange()", fieldID);
        __debug("| [%s] => [%s]", this.props.value.toString(), value.toString());

        /*
         * _change() fires when using Semantic's 'set selected',
         * so we get cascading updates during tab changes.
         * Check to make sure the value of _change differs from
         * the value passed to the field to prevent this.
         */
        if(value.toString() !== this.props.value.toString()) {

            var selected = value.split(",");

            if(selected.length >= this.props.value.length) {
                __debug("| => Values were added, changed, or reordered.");
                __debug("|==> Value: [%s] (%s)", fieldID, value.toString(), typeof value);

                var bump = (val) => {
                    __debug("|==> Bumping: %s (%s)", fieldID, val.toString(), typeof val);
                    this.context.executeAction(UpdatePatientAction, {
                        [patientID]: {
                            [stageID]: {
                                [fieldID]: val
                            }
                        }
                    });
                };

                /*
                 * value            => string representing selected options (comma-separated)
                 * this.props.value => array representing options stored with patient
                 */
                if(value.length > 0) {
                    bump(selected);
                }

                /*
                 * Empty string value -> bump an empty array.
                 */
                else {
                    bump([]);
                }
            } else {
                __debug("| => Values were removed.");
            }

        } else {
            __debug("| => values are identical, skipping handler.");
        }
    }

    /**
     *
     */
    _remove = (value) => {
        __debug("Removed value %s", value);
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
