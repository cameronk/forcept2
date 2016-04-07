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

const __debug = debug('forcept:components:Fields:Date');

class SelectField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    componentDidMount() {
        $("#FieldDropdown-" + this.props.fieldID)
            .dropdown();
    }

    _change = () => {
        return evt => {
            var { patientID, stageID, fieldID } = this.props;
            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: evt.target.value
                    }
                }
            })
        }
    }

    render() {
        var props = this.props,
            { field, value } = props,
            { settings } = field;

        var selectDOM, optionsDOM;

        optionsDOM = Object.keys(settings.options).map(optionKey => {
            var thisOption = settings.options[optionKey];
            return (
                <option value={thisOption.value}>
                    {thisOption.value}
                </option>
            );
        });

        selectDOM = (
            <select
                className={["ui", (settings.searchable ? "search" : null), "selection dropdown"].join(" ")}
                id={"FieldDropdown-" + props.fieldID}
                onChange={this._change()}>
                    <option value="">Choose an option for {field.name.toLowerCase()}</option>
                    {optionsDOM}
            </select>
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
