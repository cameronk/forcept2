/**
 * forcept - components/Fields/Pharmacy.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import BaseComponent, { grabContext } from '../Base';

import Label from './Label';
import PrescriptionTable from '../Pharmacy/PrescriptionTable';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';
import { LoadPrescriptionSetAction } from '../../flux/Pharmacy/MedicationActions';
import MedicationStore from '../../flux/Pharmacy/MedicationStore';
import PrescriptionStore from '../../flux/Pharmacy/PrescriptionStore';

class PharmacyField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor() {
        super();
    }

    componentDidMount = () => {
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

    loadSet = () => {
        var { visitID, patientID } = this.props;
        this.context.executeAction(LoadPrescriptionSetAction, {
            visit: visitID,
            patient: patientID
        });
    }

    /**
     *
     */
    render() {

        var props = this.props,
            { field, value } = props,
            pharmacyDOM;

        if(!props.set) {
            pharmacyDOM = (
                <div onClick={this.loadSet}
                    className={BuildDOMClass("ui blue labeled icon button", { loading: props.status === "loading" })}>
                    <i className="refresh icon"></i>
                    Load prescription set
                </div>
            );
        } else {
            pharmacyDOM = (
                <PrescriptionTable
                    set={props.set}
                    medications={props.medications} />
            );
        }

        return (
            <div className="field">
                <Label field={field} />
                {pharmacyDOM}
            </div>
        )
    }
}


PharmacyField = connectToStores(
    PharmacyField,
    ["RouteStore", MedicationStore, PrescriptionStore],
    function(context, props) {

        var routeStore = context.getStore('RouteStore');
        var medicationStore = context.getStore(MedicationStore);
        var prescriptionStore = context.getStore(PrescriptionStore);

        var sets = prescriptionStore.getSets();

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),

            ///
            medications: medicationStore.getMedications(),
            status: medicationStore.getStatus(),
            set: sets.hasOwnProperty(props.patientID) ? sets[props.patientID] : null
        };

    }
);


export default PharmacyField;
