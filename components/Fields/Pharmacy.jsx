/**
 * forcept - components/Fields/Pharmacy.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import BaseComponent, { grabContext } from '../Base';

import Label from './Label';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';
import MedicationStore from '../../flux/Pharmacy/MedicationStore';
import { LoadPrescriptionSetAction } from '../../flux/Pharmacy/MedicationActions';

class PharmacyField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor() {
        super();
    }

    componentDidMount = () => {
        this.componentDidUpdate(this.props);
    }

    componentDidUpdate = () => {
        var { props } = this;
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

        switch(props.status) {
            case "loading":
                pharmacyDOM = (
                    <div className="ui basic segment">
                        <div className="ui active loader"></div>
                    </div>
                );
                break;
            default:
                pharmacyDOM = (
                    <div className="ui basic segment">
                        <div className="ui blue labeled icon button" onClick={this.loadSet}>
                            <i className="refresh icon"></i>
                            Load prescription set
                        </div>
                    </div>
                );
                break;
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
    ["RouteStore", MedicationStore],
    function(context, props) {

        var routeStore = context.getStore('RouteStore');
        var medicationStore = context.getStore(MedicationStore);

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),

            ///
            medications: medicationStore.getMedications(),
            status: medicationStore.getStatus()
        };

    }
);


export default PharmacyField;
