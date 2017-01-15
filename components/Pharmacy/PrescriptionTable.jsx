/**
 * forcept - components/Pharmacy/PrescriptionTable.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import $ from 'jquery';

import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { PrescribeAction, UpdatePrescriptionAction, RemovePrescriptionAction } from '../../flux/Prescription/PrescriptionActions';

if(process.env.BROWSER) {
    require('../../styles/PrescriptionTable.less');
}

/*
 *
 */
class MutableNumber extends BaseComponent {

    static propTypes = {
        onSave: PropTypes.func.isRequired,
        completed: PropTypes.bool.isRequired
    }

    constructor() {
        super();
        this.state = { value: null, editing: false };
    }

    _change = (evt) => {
        this.setState({ value: evt.target.value });
    }

    _edit = (value) => (() => {
        if(value === true) {
            this.setState({ editing: true, value: this.props.value });
        } else {
            this.setState({ editing: false, value: null });
        }
    })

    _save = () => {
        this.props.onSave(this.state.value);
        this._edit(false)();
    }

    render() {
        if(this.props.completed) {
            return (
                <td className="collapsing">
                    {this.props.value}
                </td>
            );
        } else {
            if(this.state.editing) {
                return (
                    <td className="collapsing">
                        <div className="ui mini action input">
                            <input type="number" value={this.state.value} onChange={this._change} />
                            <button className="ui mini button" onClick={this._save}>Done</button>
                        </div>
                    </td>
                );
            } else {
                return (
                    <td className="collapsing click-to-edit" onClick={this._edit(true)}>
                        {this.props.value} &nbsp;
                        <span className="notify">click to edit</span>
                    </td>
                )
            }
        }
    }
}

class StatusDropdown extends BaseComponent {

    static propTypes = {
        onConfirm: PropTypes.func.isRequired
    }

    constructor() {
        super();
        this.state = { editing: false };
    }

    _confirm = () => {
        this.props.onConfirm();
        this._edit(false)();
    }

    _edit = (value) => (() => {
        this.setState({ editing: value });
    })

    render() {
        if(!this.props.completed) {
            if(this.state.editing) {
                return (
                    <td width="25%">
                        <div className="two mini ui buttons">
                            <div className="ui button" onClick={this._edit(false)}>
                                Cancel
                            </div>
                            <div className="ui positive button" onClick={this._confirm}>
                                Give {this.props.amount} {this.props.name}
                            </div>
                        </div>
                    </td>
                );
            } else {
                return (
                    <td className="collapsing click-to-edit" onClick={this._edit(true)}>
                        Not yet given &nbsp;
                        <span className="notify">click to update</span>
                    </td>
                );
            }
        } else {
            return (
                <td className="collapsing">
                    Delivered
                </td>
            );
        }
    }

}


/*
 *
 */
class PrescriptionTable extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    static propTypes = {

    }

    /**
     *
     */
    constructor() {
        super();
        this.state = {
            queuedMedication: null,
            help: false
        };
        this.previousState = {};
    }

    componentDidMount = () => {
        $("#FORCEPT-Dropdown-MedicationSelector")
            .dropdown({
                action: 'none'
            })
        ;
        $("#FORCEPT-Modal-QueuedMedication")
            .modal({
                detachable: false
            })
        ;
    }

    componentWillUpdate = () => {
        this.previousSetState = this.props.set;
    }

    prescribe = (medID, quID) => {
        var { set } = this.props;
        return () => {
            this.context.executeAction(PrescribeAction, {
                setID: set.id,
                medicationID: medID,
                dosageID: quID,
                patientID: set.patient
            });
            $("#FORCEPT-Modal-QueuedMedication")
                .modal('hide')
            ;
            this.setState({
                queuedMedication: null
            });
        };
    }

    updatePrescription = (prescription, data) => {
        context.executeAction(UpdatePrescriptionAction, {
            patientID: this.props.set.patient,
            prescriptionID: prescription.id,
            data: data
        });
    }

    removePrescription = (prescription, data) => {
        context.executeAction(RemovePrescriptionAction, {
            patientID: this.props.set.patient,
            prescriptionID: prescription.id
        });
    }

    queueMedication = (medication) => (evt) => {
        this.setState({
            queuedMedication: medication
        }, () => {
            $("#FORCEPT-Modal-QueuedMedication")
                .modal('show')
            ;
        });
    }

    render() {
        var { props } = this,
            prescriptions,
            iconColumnWidth = 30;

        if(props.set.hasOwnProperty('prescriptions')) {
            prescriptions = props.set.prescriptions;
        } else {
            prescriptions = {};
        }

        var prescriptionKeys  = Object.keys(prescriptions),
            medicationKeys    = Object.keys(props.medications);

        if(medicationKeys.length === 0) {
            return (
                <div>An error occurred</div>
            );
        } else {

            return (
                <div>
                    <div id="FORCEPT-Modal-QueuedMedication" className="ui small modal">
                        {(() => {
                            if(this.state.queuedMedication) {
                                var thisMedication = this.state.queuedMedication;
                                return [
                                    (
                                        <div key="header" className="header">Prescribe this patient {thisMedication.name}</div>
                                    ),
                                    (
                                        <div key="content" className="content">
                                            <div className="ui middle aligned divided list">
                                                {Object.keys(thisMedication.dosages).map(quID => {
                                                    let thisDosage = thisMedication.dosages[quID];
                                                    return (
                                                        <div key={quID} className="item">
                                                            <div className="right floated content">
                                                              <div className="ui button" onClick={this.prescribe(thisMedication.id, thisDosage.id)}>Prescribe</div>
                                                            </div>
                                                            <div className="content">
                                                                <div className="header">{thisDosage.name || "Untitled dosage"}</div>
                                                                <div className="description">{thisDosage.available} in stock</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ),
                                    (
                                        <div key="actions" className="actions">
                                            <div className="ui cancel button">Cancel</div>
                                        </div>
                                    )
                                ];
                            }
                        })()}
                    </div>
                    {(() => {
                        if(this.state.help) {
                            return (
                                <div className="ui message">
                                    <div className="header">
                                        Help with prescriptions
                                    </div>
                                    <div className="ui divider"></div>
                                    <div>
                                        <p></p>
                                        <p>
                                            <strong>How a prescription set works</strong><br/>
                                            The <em>prescription set</em> (shown below) allows you to prescribe medications to this patient.
                                        </p>
                                        <p>
                                            <strong>Sets are per patient, per visit</strong><br/>
                                            Prescription sets are <em>per patient, per visit</em>. Prescriptions can be added, modified, and given to each patient in a visit based on their unique needs. If the patient returns in the future for another visit, they will receive a new prescription set, to which new medications can be prescribed as needed.
                                        </p>
                                        <p>
                                            <strong>What does it mean to mark a prescription as "given"?</strong><br/>
                                            When you mark a prescription as <strong>"given"</strong>, it means that the medication has <em>physically moved</em> from your clinic's possesion into the patients' possesion. This action will subsequently update the amount of that medication in stock. In addition, once a prescription is given, you cannot modify the amount. If you need to give the patient more of a certain medication after the prescription is marked "given", simply use the <strong>+ Prescribe a medication</strong> dropdown and prescribe the medication again.
                                        </p>
                                        <p>
                                            <strong>How do I save a prescription set?</strong><br/>
                                            Whenever you make changes to a prescription, they're saved automatically.
                                        </p>
                                        <p>
                                            <strong>There's so many medications - I can't find the one I need!</strong><br/>
                                            Looking for a specific medication? Use the handy search field available under "Prescribe a medication" to narrow your selection.
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    }())}
                    <table className="ui selectable stacking table">
                        <thead>
                            <tr>
                                <th>Drug</th>
                                <th>Dosage</th>
                                <th>Amount</th>
                                <th></th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                if(prescriptionKeys.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan="6" className="center aligned">
                                                <em>No medications prescribed.</em>
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    return prescriptionKeys.map(prescriptionID => {
                                        var thisPrescription = props.set.prescriptions[prescriptionID];
                                        var thisMedication   = props.medications[thisPrescription.medicationID];

                                        // var propHasChanged = (prop) => {
                                        //     return !(this.props.previousSetState.prescriptions.hasOwnProperty(prescriptionID))
                                        // }
                                        // className={BuildDOMClass({  })}

                                        return (
                                            <tr key={prescriptionID} className={BuildDOMClass({
                                                positive: thisPrescription.completed,
                                                disabled: props.status === "prescribing"
                                            })}>
                                                <td className="collapsing">{thisMedication.name}</td>
                                                <td className="collapsing">{thisMedication.dosages[thisPrescription.dosageID].name}</td>
                                                <MutableNumber completed={thisPrescription.completed}
                                                    value={thisPrescription.amount}
                                                    onSave={value => this.updatePrescription(thisPrescription, { amount: value })} />
                                                <td></td>
                                                <StatusDropdown completed={thisPrescription.completed}
                                                    name={thisMedication.name}
                                                    amount={thisPrescription.amount}
                                                    onConfirm={() => this.updatePrescription(thisPrescription, { completed: true })} />
                                                <td className="collapsing">
                                                    {(() => {
                                                        if(!thisPrescription.completed) {
                                                            return (
                                                                <div className="mini basic negative ui icon button" onClick={() => this.removePrescription(thisPrescription)}>
                                                                    <i className="red remove icon"></i>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </td>
                                            </tr>
                                        );
                                    });
                                }
                            })()}
                        </tbody>
                        <tfoot className="full-width">
                            <tr>
                                <th colSpan="6">
                                    <div className="ui right floated small icon button" onClick={() => this.setState({ help: !this.state.help })}>
                                        <i className="question mark icon"></i> {!this.state.help || "Close help"}
                                    </div>
                                    <div id="FORCEPT-Dropdown-MedicationSelector"
                                        className="ui small primary floated dropdown labeled icon button">
                                        <span className="text">Prescribe a medication</span>
                                        <i className="plus icon"></i>
                                        <div className="menu">
                                            <div className="ui icon search input">
                                                <i className="search icon"></i>
                                                <input type="text" placeholder="Search medications..." />
                                            </div>
                                            <div className="divider"></div>
                                            <div className="header">
                                                <i className="list icon"></i>
                                                Medications
                                            </div>
                                            {medicationKeys.map(id => {
                                                var thisMedication  = props.medications[id];

                                                if(Object.keys(thisMedication.dosages).length > 0) {
                                                    return (
                                                        <div className="item" key={id} onClick={this.queueMedication(thisMedication)}>
                                                            {thisMedication.name || "Unnamed medication"}
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="item disabled" key={id}>
                                                            <span className="description">none avail.</span>
                                                            <span className="text">{thisMedication.name || "Unnamed medication"}</span>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                    {(() => {
                                        switch(props.status) {
                                            case "prescribing":
                                                return (
                                                    <div className="ui active inline loader"></div>
                                                );
                                                break;
                                        }
                                    })()}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        }
    }
}


export default PrescriptionTable;
