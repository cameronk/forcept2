/**
 * forcept - components/Fields/Radio.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import $ from 'jquery';

import Label from './Label';
import MessageScaffold from '../Scaffold/Message';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

class RadioField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor() {
        super();
    }

    componentDidMount() {
        var { props } = this;
        if(!props.settings || !props.settings.buttons) {
            // $(`#RadioField-${props.fieldID} .ui.radio.checkbox`)
            //     .checkbox({
            //         onChange: (x) => {
            //             console.log(x);
            //         }
            //     });
        }
    }

    /**
     *
     */
    shouldComponentUpdate(newProps) {
        return newProps.value !== this.props.value;
    }

    /**
     *
     */
    _toggle = (val) => {
        return (evt) => {
            var { patientID, stageID, fieldID } = this.props;
            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: val
                    }
                }
            });
        };
    }

    /**
     *
     */
    _change = (val) => {
        var { patientID, stageID, fieldID } = this.props;
        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: val
                }
            }
        });
    }

    /**
     *
     */
    render() {
        var props = this.props,
            { field, value } = props,
            radioDOM, useButtons;

        if(value === "") {
            value = null;
        }

        /*
         * Ensure settings object is present...
         */
        if(!field.settings) {
            radioDOM = (
                <MessageScaffold
                    type="error"
                    header="An error occurred"
                    text="This field is missing a settings object." />
            );
        } else {

            /*
             * Ensure options object is present...
             */
            if(field.settings.hasOwnProperty('options')) {

                var options    = field.settings.options;
                var optionKeys = Object.keys(options);

                /*
                 * Ensure there's at least one option..
                 */
                if(optionKeys.length > 0) {

                    /*
                     * Either render radio input or buttons
                     */
                    if( (field.settings.hasOwnProperty('buttons') ? field.settings.buttons : false) ) {
                        radioDOM = (
                            <div className="basic fluid ui buttons">
                                {optionKeys.map((key) => {
                                    return (
                                        <button onClick={this._toggle(options[key].value)}
                                            className={BuildDOMClass({ "active": value !== null && value === options[key].value }, "ui button")}>
                                            {options[key].value}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        radioDOM = (
                            <div id={"RadioField-" + props.fieldID} className="grouped fields">
                                {optionKeys.map(key => {
                                    var thisID = `${props.fieldID}-${key}`;
                                    return (
                                        <div className="item">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id={thisID} name={props.fieldID} checked={value !== null && value === options[key].value} onChange={this._toggle(options[key].value)} />
                                                <label htmlFor={thisID}>{options[key].value}</label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                }
            }
        }

        return (
            <div className="field">
                <Label field={field} />
                {radioDOM}
            </div>
        );

    }
}

export default RadioField;
