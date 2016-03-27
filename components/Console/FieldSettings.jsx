/**
 * forcept - components/Console/FieldSettings.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

import { UpdateCacheAction } from '../../flux/Stage/StageActions';
import OptionList from './OptionList';
import SettingCheckbox from './SettingCheckbox';
import SettingSelect from './SettingSelect';
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

    render() {

        var props = this.props,
            { type, settings } = props,
            settingsHeader = (
                <div className="ui small dividing header">
                    <i className="setting icon"></i>
                    <div className="content">
                        Settings
                    </div>
                </div>
            );

        switch(type) {
            case "text":
			case "textarea":
			case "number":
			case "yesno":
			case "header":
			case "pharmacy":
                return (
                    <div className="ui fluid blue message">
                        <div className="header">
                            No configuration is required for {type} fields.
                        </div>
                    </div>
                );
                break;
            case "date":
                return (
                    <div className="DateSettings">
                        {settingsHeader}
                        <SettingCheckbox
                            id="DateSettings-broad"
                            label="Use broad date selector"
                            field={props._key}
                            setting="useBroadSelector"
                            checked={settings.useBroadSelector || false} />
                    </div>
                );
                break;
            case "select":
            case "multiselect":
                return (
                    <div className="FieldSettings">
                        {type === "select" ? [
                            settingsHeader,
                            (
                                <SettingCheckbox
                                    id="FieldSettings-custom"
                                    label="Allow custom field data"
                                    field={props._key}
                                    setting="allowCustomData" />
                            ),
                            (
                                <div className="ui hidden divider"></div>
                            )
                        ]: null}
                        <OptionList
                            field={props._key}
                            options={settings.options || {}} />
                    </div>
                );
                break;
            case "file":
                return (
                    <div className="FileSettings">
                        {settingsHeader}
                        <SettingSelect
                            label="Acceptable filetypes"
                            placeholder="Choose acceptable filetypes"
                            multiple={true}
                            field={props._key}
                            setting="accept"
                            options={{ "image/*": "image / *" }}
                            value={settings.accept || ""} />
                    </div>
                );
                break;
            default:
                return (
                    <div className="ui fluid error message">
                        <div className="header">
                            <i className="warning icon"></i>
                            Warning: unrecognized field type.
                        </div>
                    </div>
                );
                break;
        }
    }

}

export default injectIntl(FieldSettings);
