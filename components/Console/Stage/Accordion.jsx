/**
 * forcept - components/Console/Accordion.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import flatten from 'lodash/flatten';

import { BuildDOMClass } from '../../../utils/CSSClassHelper';
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
    _moveFieldTo = (index) => {
        return (evt) => {
            context.executeAction(ShiftFieldPositionAction, {
                index: index
            });
        };
    }

    render() {
        var props = this.props,
            { fields } = props,
            accordionDOM;

        var fieldKeys = fields ? Object.keys(fields) : [],
            isShifting = props.fieldShiftContext && props.fieldShiftContext.hasOwnProperty("field");

        if(fieldKeys.length > 0) {
            accordionDOM = (
                <div className="ui fluid accordion">
                    {
                        flatten(
                            fieldKeys.map((key, i) => {
                                let thisField = fields[key];
                                return [
                                    (() => {
                                        if(isShifting && i === 0) {
                                            return (
                                                <div className="ui horizontal divider" onClick={this._moveFieldTo(i)} key={key + "-divider-top"}>
                                                    <a href="javascript:void(0);">Move "{fields[props.fieldShiftContext.field].name}" to front</a>
                                                </div>
                                            );
                                        } else return null;
                                    })(),
                                    (
                                        <div className={BuildDOMClass({ title: !isShifting })} key={key + "-title"}>
                                            <div className="ui medium header">
                                                {!isShifting ? (
                                                    <i className="dropdown icon"></i>
                                                ) : null}
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
                                    (() => {
                                        if(!isShifting) {
                                            return (
                                                <div className="content" key={key + "-content"}>
                                                    <Field _key={key}
                                                        stageID={this.props.stageID}
                                                        field={thisField} />
                                                </div>
                                            );
                                        } else return null;
                                    })(),
                                    (() => {
                                        if(isShifting) {
                                            return (
                                                <div className="ui horizontal divider" onClick={this._moveFieldTo(i + 1)} key={key + "-divider"}>
                                                    <a href="javascript:void(0);">Move "{fields[props.fieldShiftContext.field].name}" here</a>
                                                </div>
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
