/**
 * forcept - components/Pharmacy/PrescriptionTable.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';

import { BuildDOMClass } from '../../utils/CSSClassHelper';

class PrescriptionTable extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor() {
        super();
    }

    componentDidMount = () => {
        $("#FORCEPT-Dropdown-MedicationSelector").dropdown({
            action: 'none'
        });
    }


    render() {
        var { props } = this;

        var prescriptionKeys = Object.keys(props.set.prescriptions);
        var medicationKeys   = Object.keys(props.medications);

        if(medicationKeys.length === 0) {
            return (
                <div>An error occurred</div>
            );
        } else {

            return (
                <table className="ui stacking table">
                    <thead>
                        <tr>
                            <th>Drug</th>
                            <th>Dosage</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            if(prescriptionKeys.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan="4" className="center aligned">
                                            <em>No medications prescribed.</em>
                                        </td>
                                    </tr>
                                );
                            }
                        })()}
                    </tbody>
                    <tfoot className="full-width">
                        <tr>
                            <th colSpan="4">
                                <div id="FORCEPT-Dropdown-MedicationSelector"
                                    className="ui small primary dropdown labeled icon button">
                                    <span className="text">Prescribe a medication</span>
                                    <i className="plus icon"></i>
                                    <div className="menu">
                                        {medicationKeys.map(id => {
                                            var thisMedication = props.medications[id];
                                            return (
                                                <div className="item" key={id}>
                                                    <i className="dropdown icon"></i>
                                                    {thisMedication.name || "Unnamed medication"}
                                                    <div className="menu">
                                                        {Object.keys(thisMedication.quantities).map(quID => {
                                                            let thisQuantity = thisMedication.quantities[quID];
                                                            return (
                                                                <div className="item">
                                                                    <span className="description">{thisQuantity.available} avail.</span>
                                                                    <span className="text">{thisQuantity.name || "Untitled quantity"}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            );
        }
    }
}


export default PrescriptionTable;
