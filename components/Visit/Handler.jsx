/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import Editor from './Editor';
import { SetCurrentTabAction } from '../../flux/Visit/VisitActions';

const __debug = debug('forcept:components:Visit:Handler');

class Handler extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _setTab = (tab) => {
        return (evt) => {
            __debug(SetCurrentTabAction);
            __debug(tab);
            this.context.executeAction(SetCurrentTabAction, tab);
        }
    }

    render() {

        var props = this.props,
            { patients, visit } = props;

        var handlerDOM;

        switch(visit.currentTab) {
            case null:
                handlerDOM = (
                    <div className="basic expanded ui segment">
                        <div className="fluid blue ui message">
                            No patients in this visit. Add some!
                        </div>
                    </div>
                );
                break;
            case "new":
                handlerDOM = (
                    <Editor
                        stage={props.stage} />
                );
                break;
            default:

                break;
        }

        return (
            <div className="row clear top">
                <div className="four wide computer five wide tablet column">
                    <div className="ui fluid secondary vertical pointing menu">
                        {Object.keys(patients).map(patient => {
                            return (
                                <span className="item">item</span>
                            );
                        })}
                        {props.stage.isRoot ? (
                            <span className={"item" + (visit.currentTab === "new" ? " active" : "")} onClick={this._setTab("new")}>
                                <i className="plus icon"></i>
                                Add a new patient
                            </span>
                        ) : null}
                    </div>
                </div>
                <div className="twelve wide computer eleven wide tablet column">
                    {handlerDOM}
                </div>
            </div>
        );
    }

}

export default Handler;
