/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import Overview from './Overview';

const __debug = debug('forcept:components:Visit:Sidebar');

class Sidebar extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            { stagesBeneath, thisPatient, stages } = props;

        return (
            <div id="FORCEPT-Visit-Sidebar">
                {(() => {
                    if(thisPatient.hasOwnProperty(stagesBeneath[0])) {
                        let patient = thisPatient[stagesBeneath[0]];
                        return (
                            <div>{patient.fullName || "Unnamed patient"}</div>
                        );
                    }
                })()}
                {stagesBeneath.map((stageBeneathID, index) => {
                    return (
                        <Overview key={stageBeneathID}
                            mode={"checklist"}
                            isLast={(index === (stagesBeneath.length - 1))}
                            patient={thisPatient.hasOwnProperty(stageBeneathID) ? thisPatient[stageBeneathID] : {}}
                            stage={stages[stageBeneathID]} />
                    );
                })}
            </div>
        );

    }

}

export default Sidebar;
