/**
 * forcept - components/Fields/Text.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';

import Label from './Label';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

class TextField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    _change = (evt) => {
        this.context.executeAction(UpdatePatientAction, {
            [this.props.patientKey]: {
                [this.props.fieldKey]: evt.target.value
            }
        })
    }

    render() {
        var props = this.props,
            { field, value } = props;

        return (
            <div className="field">
                <Label field={field} />
                <input
                    type="text"
                    autoComplete="off"
                    placeholder={field.name + " goes here"}
                    value={value}
                    onChange={this._change} />
            </div>
        );
    }
}

export default TextField;
