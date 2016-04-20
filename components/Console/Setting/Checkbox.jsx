/**
 * forcept - components/Console/Setting/Checkbox.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import $ from 'jquery';

import StageStore from '../../../flux/Stage/StageStore';
import { UpdateCacheAction } from '../../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Console:Setting:Checkbox');

class SettingCheckbox extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _toggle = () => {
        return (evt) => {
            var { props } = this,
                value = !props.checked,
                inversions = {},
                implications = {};

            if(props.hasOwnProperty('invert') && value === true) {
                props.invert.map(setting => {
                    inversions[setting] = false;
                });
            }

            if(props.hasOwnProperty('imply') && value === true) {
                props.imply.map(setting => {
                    implications[setting] = true;
                });
            }

            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: Object.assign({
                            [this.props.setting]: value
                        }, inversions, implications)
                    }
                }
            });
        };
    };

    render() {
        var props = this.props,
            { id } = props;

        return (
            <div className="ui toggle checkbox">
                <input
                    id={id + "-" + props.field}
                    type="checkbox"
                    tabIndex="0"
                    className="hidden"
                    checked={props.checked}
                    disabled={props.disabled || false}
                    onChange={this._toggle()}/>
                <label htmlFor={id + "-" + props.field}>{props.label || ""}</label>
            </div>
        );
    }

}

export default injectIntl(SettingCheckbox);
