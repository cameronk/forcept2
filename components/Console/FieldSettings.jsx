/**
 * forcept - components/Console/FieldSettings.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

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

        var props = this.props;
        var settingsHeader = (
            <div className="ui small dividing header">
                <i className="setting icon"></i>
                <div className="content">
                    Settings
                </div>
            </div>
        );

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

            case "date":
                return (
                    <div className="DateSettings">
                        {settingsHeader}
                        <SettingCheckbox
                            id="DateSettings-broad"
                            label="Use broad date selector"
                            field={props._key}
                            setting="useBroadSelector" />
                    </div>
                );
                break;
            case "select":
            case "multiselect":
                let optionKeys = Object.keys(props.options || {});
                return (
                    <div className="FieldSettings">

                        {props.type === "select" ? [
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

                        <OptionList field={props._key} options={props.options || {}} />
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
                            options={{
                                "image/*": "image / *"
                            }} />
                    </div>
                );
                break;
        }

        return (
            <div>asdf</div>
        );
    }

}

export default injectIntl(FieldSettings);
