/**
 * forcept - components/Console/QuantitiesAccordion.jsx
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

const __debug = debug("forcept:components:Pharmacy:QuantitiesAccordion");
const root = "components.pharmacy.QuantitiesAccordion";
const messages = defineMessages({
    [root + ".errors.noFields.heading"]: {
        id: root + ".errors.noFields.heading",
        defaultMessage: "No medication quantities created (yet)."
    },
    [root + ".errors.noFields"]: {
        id: root + ".errors.noFields",
        defaultMessage: "Use the 'Add a new medication quantity' button below to get started."
    },
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Medication name"
    }
});

class QuantitiesAccordion extends BaseComponent {

    /*
     *
     */
    // shouldComponentUpdate(newProps) {
    //     return !isEqual(newProps, this.props);
    // }

    render() {
        var props = this.props,
            { fields } = props,
            accordionDOM;

        var fieldKeys = fields ? Object.keys(fields) : [];

        if(fieldKeys.length > 0) {
            accordionDOM = (
                <div className="ui fluid accordion">
                    {
                        flatten(
                            fieldKeys.map((key, i) => {
                                let thisField = fields[key];
                                return [
                                    (
                                        <div className="title" key={key + "-title"}>
                                            <div className="ui medium header">
                                                <i className="dropdown icon"></i>
                                                <div className="small ui right pointing label">
                                                    {(thisField.mutable === false) ? (
                                                            <i className="lock icon"></i>
                                                    ) : null}
                                                    {key}
                                                    <div className="detail">
                                                        {thisField.type}
                                                    </div>
                                                </div>
                                                {" "}
                                                {thisField.name && thisField.name.length > 0 ? thisField.name : `New ${thisField.type} field`}
                                            </div>
                                        </div>
                                    ),
                                    (
                                        <div className="content" key={key + "-content"}>
                                            <Field
                                                _key={key}
                                                field={thisField} />
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

export default injectIntl(QuantitiesAccordion);
