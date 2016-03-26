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
        return (
            <div className="ui toggle checkbox">
                <input
                    id={this.props.id}
                    type="checkbox"
                    tabIndex="0"
                    className="hidden"
                    checked={this.props.checked}
                    onChange={this._toggle()}/>
                <label htmlFor={this.props.id}>{this.props.label || ""}</label>
            </div>
        );
    }

}

SettingCheckbox = connectToStores(
    SettingCheckbox,
    [StageStore],
    function(context, props) {
        var stageStore = context.getStore(StageStore);

        return {
            checked: stageStore.getCache().fields[props.field].settings[props.setting] || false
        };

    }
)

export default injectIntl(SettingCheckbox);
