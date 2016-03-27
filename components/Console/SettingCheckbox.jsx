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

const __debug = debug('forcept:components:Console:SettingCheckbox');

class SettingCheckbox extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _toggle = () => {
        return (evt) => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: {
                            [this.props.setting]: !this.props.checked
                        }
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
                    id={id}
                    type="checkbox"
                    tabIndex="0"
                    className="hidden"
                    checked={props.checked}
                    onChange={this._toggle()}/>
                <label htmlFor={props.id}>{props.label || ""}</label>
            </div>
        );
    }

}

export default injectIntl(SettingCheckbox);
