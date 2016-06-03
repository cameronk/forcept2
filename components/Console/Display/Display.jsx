/**
 * forcept - components/Console/Display.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

import { UpdateDisplayGroupCacheAction } from '../../../flux/Display/DisplayActions';
import BaseComponent, { grabContext } from '../../Base';
import DisplaySettings from './Settings';

const __debug = debug('forcept:components:Console:Display:Display');

class Display extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    /*
     *
     */
    shouldComponentUpdate = () => {
        return true;
    }

    componentDidMount() {
        $(".StageField .ui.dropdown")
            .dropdown({
                onChange: this._change()
            });
    }

    _change = (prop) => {
        return (evt) => {
            this.context.executeAction(UpdateDisplayGroupCacheAction, {
                displays: {
                    [this.props._key]: {
                        [prop]: evt.target.value
                    }
                }
            });
        }
    }

    _removeField = (evt) => {
        // this.context.executeAction(UpdateCacheAction, {
        //     fields: {
        //         [this.props._key]: null
        //     }
        // });
    }

    render() {

        var props     = this.props,
            { display } = props,
            typeSelectDOM, removeButtonDOM;

            removeButtonDOM = (
                <button
                    onClick={this._removeField}
                    className="ui tiny basic red labeled icon button">
                    <i className="remove icon"></i>
                    Remove this field
                </button>
            );



        return (
            <div className="ui stackable form grid">
                <div className="row StageField">
                    <div className="six wide column">
                        <div className="field">
                            <label>Name:</label>
                            <input type="text" placeholder={"Enter a display name"} value={display.name} onChange={this._change('name')} />
                        </div>
                        <div className="field">
                            <label>Description:</label>
                            <textarea
                                placeholder={"Enter a display description (optional)"}
                                value={display.description}
                                onChange={this._change('description')}>
                            </textarea>
                        </div>
                        {removeButtonDOM}
                    </div>
                    <div className="ten wide field">
                        <div className="ui basic segment">
                            <DisplaySettings
                                type={display.type}
                                settings={display.settings}
                                _key={props._key} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default injectIntl(Display);
