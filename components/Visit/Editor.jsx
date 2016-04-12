/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import TextField from '../Fields/Text';
import DateField from '../Fields/Date';
import SelectField from '../Fields/Select';

const __debug = debug('forcept:components:Visit:Editor');

class Editor extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            { stage, visit, patient } = props,
            { fields } = stage,
            baseFieldProps = {
                stageID:    stage.id,
                patientID:  patient.id
            };

        __debug("Render editor for patient:");
        __debug(patient);

        return (
            <div className="ui form">
                {Object.keys(fields).map(fieldID => {

                    var thisField = fields[fieldID],
                        fieldDOM;

                    var thisFieldProps = {
                        key:    fieldID,
                        fieldID: fieldID,
                        field:  thisField,
                        value:  patient.hasOwnProperty(fieldID) && patient[fieldID] !== null ? patient[fieldID] : ""
                    };

                    switch(thisField.type) {
                        case "text":
                            fieldDOM = (
                                <TextField
                                    type="text"
                                    {...thisFieldProps}
                                    {...baseFieldProps} />
                            );
                            break;
                        case "textarea":
                            fieldDOM = (
                                <TextField
                                    type="textarea"
                                    {...thisFieldProps}
                                    {...baseFieldProps} />
                            );
                            break;
                        case "number":
                            fieldDOM = (
                                <TextField
                                    type="number"
                                    {...thisFieldProps}
                                    {...baseFieldProps} />
                            );
                            break;
                        case "date":
                            fieldDOM = (
                                <DateField
                                    {...thisFieldProps}
                                    {...baseFieldProps} />
                            );
                            break;
                        case "select":
                            fieldDOM = (
                                <SelectField
                                    {...thisFieldProps}
                                    {...baseFieldProps} />
                            );
                            break;
                    }

                    return fieldDOM;
                })}
            </div>
        );

    }

}

export default Editor;
