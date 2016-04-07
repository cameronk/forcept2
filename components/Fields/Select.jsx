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

    _change = (evt) => {
        var { patientID, stageID, fieldID } = this.props;
        __debug(evt);
        // this.context.executeAction(UpdatePatientAction, {
        //     [patientID]: {
        //         [stageID]: {
        //             [fieldID]: evt.target.value
        //         }
        //     }
        // })
    }

    render() {
        var props = this.props,
            { field, value } = props,
            { settings } = field;

        var selectDOM, optionsDOM;

        optionsDOM = Object.keys(settings.options).map(optionKey => {
            var thisOption = settings.options[optionKey];
            return (
                <div className="item" data-value={thisOption.value}>
                    {thisOption.value}
                </div>
            );
        });

        selectDOM = (
            <div className="ui selection dropdown" id={"FieldDropdown-" + props.fieldID}>
                <input type="hidden" onChange={this._change} />
                <i className="dropdown icon"></i>
                <div className="default text">{field.name} goes here</div>
                <div className="menu">{optionsDOM}</div>
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
