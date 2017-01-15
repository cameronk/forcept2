/**
 * forcept - components/Console/DosageAccordion.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';

// import StageStore from '../../flux/Stage/StageStore';
import BaseComponent, { grabContext } from '../Base';
// import Field from './Field';
import Dosage from './Dosage';

const __debug = debug("forcept:components:Pharmacy:DosageAccordion");
const root = "components.pharmacy.DosageAccordion";
const messages = defineMessages({
    [root + ".errors.noFields.heading"]: {
        id: root + ".errors.noFields.heading",
        defaultMessage: "No medication dosages created (yet)."
    },
    [root + ".errors.noFields"]: {
        id: root + ".errors.noFields",
        defaultMessage: "Use the 'Add a new medication dosage' button below to get started."
    },
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Medication name"
    }
});

class DosageAccordion extends BaseComponent {

    /*
     *
     */
    // shouldComponentUpdate(newProps) {
    //     return !isEqual(newProps, this.props);
    // }

    render() {
        var props = this.props,
            { dosages } = props,
            accordionDOM;

        var dosageKeys = dosages ? Object.keys(dosages) : [];

        if(dosageKeys.length > 0) {
            accordionDOM = (
                <div className="ui fluid accordion">
                    {
                        flatten(
                            dosageKeys.map((key, i) => {
                                let thisDosage = dosages[key];
                                return [
                                    (
                                        <div className="title" key={key + "-title"}>
                                            <div className="ui medium header">
                                                <i className="dropdown icon"></i>
                                                <div className="small ui right pointing label">
                                                    {key}
                                                </div>
                                                {" "}
                                                {thisDosage.name && thisDosage.name.length > 0 ? thisDosage.name : `New dosage`}
                                            </div>
                                        </div>
                                    ),
                                    (
                                        <div className="content" key={key + "-content"}>
                                            <Dosage
                                                _key={key}
                                                medication={this.props.medication}
                                                dosage={thisDosage} />
                                        </div>
                                    )
                                ];
                            })
                        )
                    }
                </div>
            );
        } else {
            accordionDOM = (
                <div className="ui error message">
                    <div className="header">
                        {props.intl.formatMessage(messages[root + ".errors.noFields.heading"])}
                    </div>
                    <p>
                        {props.intl.formatMessage(messages[root + ".errors.noFields"])}
                    </p>
                </div>
            );
        }

        return accordionDOM;
    }
}

export default injectIntl(DosageAccordion);
