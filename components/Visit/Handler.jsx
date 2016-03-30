/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import Editor from './Editor';
import { SetCurrentTabAction, CreatePatientAction } from '../../flux/Visit/VisitActions';

const __debug = debug('forcept:components:Visit:Handler');

class Handler extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _setTab = (tab) => {
        return (evt) => {
            this.context.executeAction(SetCurrentTabAction, tab);
        }
    }

    _createPatient = (evt) => {
        this.context.executeAction(CreatePatientAction);
    }

    render() {

        var props = this.props,
            { patients, visit } = props,
            patientKeys = Object.keys(patients);

        var handlerDOM;

        switch(visit.currentTab) {
            case null:
                handlerDOM = (
                    <div className="basic expanded ui segment">
                        <div className="fluid blue ui message">
                            No patients in this visit. Add some!
                        </div>
                    </div>
                );
                break;
            default:
                __debug("Building editor for tab: %s", visit.currentTab);
                __debug(patients);

                handlerDOM = (
                    <Editor
                        patient={patients[visit.currentTab]}
                        visit={props.visit}
                        stage={props.stage} />
                );
                break;

        }

        return (
            <div className="row clear top">
                <div className="four wide computer five wide tablet column">
                    <div className="ui fluid secondary vertical pointing menu">
                        {patientKeys.map(patient => {
                            var thisPatient = patients[patient];
                            return (
                                <a className={"item" + (visit.currentTab == patient ? " active disabled" : "")} onClick={this._setTab(patient)}>
                                    {thisPatient.fullName.length > 0 ? thisPatient.fullName : "Unnamed patient"}
                                    <span className="ui teal label">
                                        {thisPatient.id}
                                    </span>
                                </a>
                            );
                        })}
                        <span className="item divider"></span>
                        {props.stage.isRoot ? (
                            <a className="item" onClick={this._createPatient}>
                                <i className="plus icon"></i>
                                Add a new patient
                            </a>
                        ) : null}
                        {patientKeys.length > 0 ? (
                            <a className="green item">
                                <i className="save icon"></i>
                                Save visit
                            </a>
                        ) : null}
                    </div>
                </div>
                <div className="twelve wide computer eleven wide tablet column">
                    {handlerDOM}
                </div>
            </div>
        );
    }

}

export default Handler;
