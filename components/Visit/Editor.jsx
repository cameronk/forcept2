/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import TextField from '../Fields/Text';
import { SetCurrentTabAction } from '../../flux/Visit/VisitActions';

const __debug = debug('forcept:components:Visit:Editor');

class Editor extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            { stage } = props,
            { fields } = stage;

        return (
            <div className="ui form">
                {Object.keys(fields).map(field => {

                    let thisField = fields[field];
                    let fieldDOM;

                    switch(thisField.type) {
                        case "text":
                            fieldDOM = (
                                <TextField field={thisField} />
                            );
                            break;
                    }

                    return fieldDOM;
                })}
            </div>
        );

    }

}

export default Editor;
