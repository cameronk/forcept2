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
import Quantity from './Quantity';

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
            { quantities } = props,
            accordionDOM;

        var quantityKeys = quantities ? Object.keys(quantities) : [];

        if(quantityKeys.length > 0) {
            accordionDOM = (
                <div className="ui fluid accordion">
                    {
                        flatten(
                            quantityKeys.map((key, i) => {
                                let thisQuantity = quantities[key];
                                return [
                                    (
                                        <div className="title" key={key + "-title"}>
                                            <div className="ui medium header">
                                                <i className="dropdown icon"></i>
                                                <div className="small ui right pointing label">
                                                    {key}
                                                </div>
                                                {" "}
                                                {thisQuantity.name && thisQuantity.name.length > 0 ? thisQuantity.name : `New quantity`}
                                            </div>
                                        </div>
                                    ),
                                    (
                                        <div className="content" key={key + "-content"}>
                                            <Quantity
                                                _key={key}
                                                quantity={thisQuantity} />
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
