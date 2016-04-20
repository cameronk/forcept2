/**
 * forcept - components/Fields/Date.jsx
 * @author Azuru Technology
 *
 * https://www.npmjs.com/package/react-date-picker
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';
import DatePicker from 'react-date-picker';

import Label from './Label';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

const __debug = debug('forcept:components:Fields:Date');

if(process.env.BROWSER) {
    require('react-date-picker/index.css');
    require('../../styles/DatePicker.less');
}

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
    _change = (date, moment) => {
        var { patientID, stageID, fieldID } = this.props;

        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: date
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

        return (
            <div className="field">
                <Label field={field} />
                <DatePicker
                    date={value}
                    onChange={this._change} />
            </div>
        );
    }
}

export default DateField;
