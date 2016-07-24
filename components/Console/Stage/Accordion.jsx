/**
 * forcept - components/Console/Accordion.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import flatten from 'lodash/flatten';

import StageStore from '../../../flux/Stage/StageStore';
import { ShiftFieldPositionAction } from '../../../flux/Console/StageBuilderActions';
import BaseComponent, { grabContext } from '../../Base';
import Field from './Field';

const __debug = debug("forcept:components:Console:Accordion");
const root = "components.console.Accordion";
const messages = defineMessages({
    [root + ".errors.noFields.heading"]: {
        id: root + ".errors.noFields.heading",
        defaultMessage: "No fields created (yet)."
    },
    [root + ".errors.noFields"]: {
        id: root + ".errors.noFields",
        defaultMessage: "Use the 'Add a new field' button below to get started."
    },
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Stage name"
    }
});

class Accordion extends BaseComponent {

    /*
     *
     */
    _moveFieldTo = (key) => {
        return (evt) => {
            context.executeAction(ShiftFieldPositionAction, {
                after: key
            });
        };
    }

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
                                    ),
                                    (() => {
                                        if(props.fieldShiftContext && props.fieldShiftContext.hasOwnProperty("field")) {
                                            return (
                                                <div className="ui divider" onClick={this._moveFieldTo(key)} key={key + "-divider"}></div>
                                            );
                                        } else return null;
                                    })()
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

Accordion = connectToStores(
    Accordion,
    [StageStore],
    function(context, props) {
        return {
            fieldShiftContext: context.getStore(StageStore).getFieldShiftContext()
        };
    }
)

export default injectIntl(Accordion);
