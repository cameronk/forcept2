/**
 * forcept - components/Fields/Pharmacy.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';

import Label from './Label';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

class PharmacyField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor() {
        super();
    }

    /**
     *
     */
    shouldComponentUpdate(newProps) {
        // return newProps.value !== this.props.value;
    }

    /**
     *
     */
    _change = (evt) => {
        // var { patientID, stageID, fieldID } = this.props;
        // this.conPharmacy.executeAction(UpdatePatientAction, {
        //     [patientID]: {
        //         [stageID]: {
        //             [fieldID]: evt.target.value
        //         }
        //     }
        // });
    }

    /**
     *
     */
    render() {
        var props = this.props,
            { field, value } = props;
    }
}

export default PharmacyField;
