/**
 * forcept - components/Console/FieldSettings.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import { UpdateCacheAction } from '../../flux/Console/StageActions';
import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Console:FieldSettings');

class FieldSettings extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _change = (prop) => {
        return (evt) => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props._key]: {
                        [prop]: evt.target.value
                    }
                }
            });
        }
    };

    _updateOption = (key) => {
        return (evt) => {

            /// If no key provided, create an option with a default value.
            var val = key ? evt.target.value : '';
                key = key || new Date().getTime();

            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props._key]: {
                        settings: {
                            options: {
                                [key]: {
                                    value: val
                                }
                            }
                        }
                    }
                }
            });
        };
    }

    _deleteOption = (key) => {
        return (evt) => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props._key]: {
                        settings: {
                            options: {
                                [key]: null
                            }
                        }
                    }
                }
            });
        };
    };

    render() {
        var props = this.props;

        switch(props.type) {
            case "text":
			case "textarea":
			case "number":
			case "yesno":
			case "header":
			case "pharmacy":
                return (
                    <div className="ui blue message">
                        <div className="header">
                            No configuration is required for {props.type} fields.
                        </div>
                    </div>
                )
                break;
            case "select":
            case "multiselect":
                __debug("Options:");
                __debug(props.options);
                let optionKeys = Object.keys(props.options || {});
                return (
                    <div className="FieldSettings">
                        <div className="ui dividing header">
                            <i className="settings icon"></i>
                            <div className="content">
                                Settings
                            </div>
                        </div>
                        {optionKeys.length > 0 ? optionKeys.map((option, index) => {
                            let thisOption = props.options[option];
                            return (
                                <div className="ui small labeled right left action input" key={option + "-" + index}>
                                    <button className="ui icon button">
                                        <i className="sidebar icon"></i>
                                    </button>
                                    <input type="text"
                                        placeholder="Type an option value here"
                                        value={thisOption.value}
                                        onChange={this._updateOption(option)} />
                                    <button className="ui red icon button" onClick={this._deleteOption(option)}>
                                        <i className="close icon"></i>
                                    </button>
                                </div>
                            )
                        }) : (
                            <div className="ui blue message">
                                <div className="header">
                                    No options defined.
                                </div>
                            </div>
                        )}
                        <div className="ui divider"></div>
                        <div className="ui labeled icon button" onClick={this._updateOption()}>
                            <i className="plus icon"></i>
                            Add an option
                        </div>
                    </div>
                )
                break;
        }

        return (
            <div>asdf</div>
        );
    }

}

export default injectIntl(FieldSettings);
