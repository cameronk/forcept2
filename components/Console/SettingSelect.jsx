/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import $ from 'jquery';

import StageStore from '../../flux/Stage/StageStore';
import { UpdateCacheAction } from '../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Console:SettingSelect');

class SettingSelect extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
        $(".ui.dropdown")
            .dropdown();
    }

    _change = () => {
        return (evt) => {
            var value = "";

            if(this.props.multiple) {
                var options = evt.target.options;
        		    value = [];

        		for(var i = 0; i < options.length; i++) {
        			if(options[i].selected) {
        				value.push(options[i].value);
        			}
        		}

            } else {
                value = evt.target.value;
            }

            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: {
                            [this.props.setting]: value
                        }
                    }
                }
            });
        };
    };

    render() {
        var props = this.props,
            { value, options, placeholder } = props,
            optionKeys = Object.keys(options || {});

        return (
            <div className="field">
                <label>{props.label || ""}</label>
                <select multiple={props.multiple} className="ui dropdown" value={value} onChange={this._change()}>
                    {placeholder ? (
                        <option value="">{placeholder}</option>
                    ) : null}
                    {optionKeys.map((key) => {
                        return (
                            <option key={key} value={key}>{options[key]}</option>
                        );
                    })}
                </select>
            </div>
        );
    }

}

export default injectIntl(SettingSelect);
