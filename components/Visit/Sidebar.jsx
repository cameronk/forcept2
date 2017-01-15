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

if(process.env.BROWSER) {
    require('../../styles/Sidebar.less');
}

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
                <div className="large dividing ui header">
                    <i className="browser icon"></i>
                    <div className="content">
                        Patient data
                        {(() => {
                            if(thisPatient.hasOwnProperty(stagesBeneath[0])) {
                                let patient = thisPatient[stagesBeneath[0]];
                                return (
                                    <div className="sub header">{patient.fullName || "Unnamed patient"}</div>
                                );
                            }
                        })()}
                    </div>
                </div>
                {stagesBeneath.map((stageBeneathID, index) => {
                    return (
                        <div>
                            <div className="ui small header" style={{ marginBottom: 0, paddingBottom: 0 }}>
                                {stages[stageBeneathID].name || "Untitled stage"}
                            </div>
                            <Overview key={stageBeneathID}
                                mode={"checklist"}
                                isLast={(index === (stagesBeneath.length - 1))}
                                patient={thisPatient.hasOwnProperty(stageBeneathID) ? thisPatient[stageBeneathID] : {}}
                                stage={stages[stageBeneathID]} />
                        </div>
                    );
                })}
            </div>
        );

    }

}

export default Sidebar;
