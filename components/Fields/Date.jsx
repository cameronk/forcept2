/**
 * forcept - components/Fields/Date.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';

import Label from './Label';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

class DateField extends BaseComponent {

    static conDateTypes = grabContext(['executeAction'])

    /*
	 * Convert date from HTML standard format to Forcept slash format
	 * @return String
	 */
	dashesToSlashes = (date) => {
		date = date.split("-");
		var slashes = [date[1], date[2], date[0]].join("/");
		return slashes === "//" ? "" : slashes;
	}

	/*
	 * Convert Forcept slash formatted date back to native HTML dash format
	 * @return String
	 */
	slashesToDashes = (date) => {
		date = date.split("/");
		var dashes = [date[2], date[0], date[1]].join("-");
		return dashes === "--" ? "" : dashes;
	}

    /*
     *
     *
     */
    _change = (evt) => {
        this.context.executeAction(UpdatePatientAction, {
            [this.props.patientKey]: {
                [this.props.fieldKey]: this.dashesToSlashes(evt.target.value)
            }
        })
    }

    /*
     *
     *
     */
    render() {
        var props = this.props,
            { field, value } = props;

        var inputDOM;

        inputDOM = (
            <input type="date"
                autoComplete="off"
                placeholder={field.name + " goes here"}
                value={this.slashesToDashes(value)}
                onChange={this._change} />
        );

        return (
            <div className="field">
                <Label field={field} />
                {inputDOM}
            </div>
        );
    }
}

export default DateField;
