/**
 * forcept - components/Console/Setting/Checkbox.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import $ from 'jquery';

// import StageStore from '../../../flux/Stage/StageStore';
// import { UpdateCacheAction } from '../../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Console:Setting:Checkbox');

class CascadingFieldSelector extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {
        var props = this.props,
            { stages } = props,
            stageKeys = Object.keys(stages),
            availableFields = this.context.getFieldTypes();

        return (
            <div className="ui floating labeled icon dropdown button">
                <span className="text">Compare data from...</span>
                <i className="dropdown icon"></i>
                <div className="menu">
                    {stageKeys.map(stageID => {
                        var thisStage = stages[stageID];
                        return (
                            <div className="item">
                                <i className="dropdown icon"></i>
                                {thisStage.name || "Untitled stage"}
                                <div className="menu">
                                    {Object.keys(thisStage.fields).map(fieldID => {
                                        var thisField = thisStage.fields[fieldID];
                                        if(availableFields.hasOwnProperty(thisField.type)
                                            && availableFields[thisField.type].storageMethod !== "none") {
                                            return (
                                                <div className="item">
                                                    <div className="text">{thisField.name || "Untitled field"}</div>
                                                    <div className="description">{thisField.type}</div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

}

export default injectIntl(CascadingFieldSelector);
