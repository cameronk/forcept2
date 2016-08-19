/**
 * forcept - components/Console/Display/Accordion.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';

import StageStore from '../../../flux/Stage/StageStore';
import BaseComponent, { grabContext } from '../../Base';
import Display from './Display';

const __debug = debug("forcept:components:Console:Display:Accordion");
const root = "components.console.Display.Accordion";
const messages = defineMessages({
    [root + ".errors.noDisplays.heading"]: {
        id: root + ".errors.noDisplays.heading",
        defaultMessage: "No displays created."
    },
    [root + ".errors.noDisplays"]: {
        id: root + ".errors.noDisplays",
        defaultMessage: "Use the 'Add a new display' button below to get started."
    },
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Display name"
    }
});

class DisplayAccordion extends BaseComponent {

    static contextTypes = grabContext()

    render() {
        var props = this.props,
            { displays } = props,
            availableDisplays = this.context.getDisplayTypes(),
            accordionDOM;

        var displayKeys = displays ? Object.keys(displays) : [];

        if(displayKeys.length > 0) {
            accordionDOM = (
                <div className="ui fluid accordion">
                    {
                        flatten(
                            displayKeys.map((key, i) => {
                                let thisDisplay = displays[key];
                                return [
                                    (
                                        <div className="title" key={key + "-title"}>
                                            <div className="ui medium header">
                                                <i className="dropdown icon"></i>
                                                <div className="small ui right pointing label">
                                                    {(availableDisplays[thisDisplay.type].icon) ? (
                                                        <i className={availableDisplays[thisDisplay.type].icon + " icon"}></i>
                                                    ) : null}
                                                    {key}
                                                    <div className="detail">
                                                        {thisDisplay.type}
                                                    </div>
                                                </div>
                                                {" "}
                                                {thisDisplay.name && thisDisplay.name.length > 0 ? thisDisplay.name : `New ${thisDisplay.type} display`}
                                            </div>
                                        </div>
                                    ),
                                    (
                                        <div className="content" key={key + "-content"}>
                                            <Display
                                                _key={key}
                                                stages={props.stages}
                                                display={thisDisplay} />
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
                        {props.intl.formatMessage(messages[root + ".errors.noDisplays.heading"])}
                    </div>
                    <p>
                        {props.intl.formatMessage(messages[root + ".errors.noDisplays"])}
                    </p>
                </div>
            );
        }

        return accordionDOM;
    }
}

export default injectIntl(DisplayAccordion);
