/**
 * forcept - components/Fields/Date.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';

import Label from './Label';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

const __debug = debug('forcept:components:Fields:Date');

class DateField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

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
        var { patientID, stageID, fieldID } = this.props;

        __debug("Current val: %s", this.props.value);
        __debug("New val    : %s", evt.target.value);

        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: this.dashesToSlashes(evt.target.value)
                }
            }
        });

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
                defaultValue={this.slashesToDashes(value)}
                placeholder={field.name + " goes here"}
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
