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
        var { patientID, stageID, fieldID } = this.props;
        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: evt.target.value
                }
            }
        })
    }

    render() {
        var props = this.props,
            { field, value } = props;

        var inputDOM;

        if(props.type !== "textarea") {
            inputDOM = (
                <input
                    type={props.type || "text"}
                    autoComplete="off"
                    placeholder={field.name + " goes here"}
                    value={value}
                    onChange={this._change} />
            );
        } else {
            inputDOM = (
                <textarea
                    autoComplete="off"
                    placeholder={field.name + " goes here"}
                    value={value}
                    onChange={this._change}>
                </textarea>
            )
        }

        return (
            <div className="field">
                <Label field={field} />
                {inputDOM}
            </div>
        );
        
    }
}

export default TextField;
