/**
 * forcept - components/Console/Setting/Text.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import $ from 'jquery';
import LazyInput from 'lazy-input';

import StageStore from '../../../flux/Stage/StageStore';
import { UpdateCacheAction } from '../../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Console:Setting:Text');

class SettingText extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _change = (evt) => {
        this.context.executeAction(UpdateCacheAction, {
            fields: {
                [this.props.field]: {
                    settings: {
                        [this.props.setting]: evt.target.value
                    }
                }
            }
        });
    }

    render() {
        var props = this.props,
            { id } = props;

        return (
            <div className="field">
                <label>{props.label || ""}</label>
                <LazyInput
                    placeholder={props.placeholder}
                    id={id + "-" + props.field}
                    type="text"
                    value={props.value}
                    onChange={this._change} />
            </div>
        );
    }

}

export default injectIntl(SettingText);
