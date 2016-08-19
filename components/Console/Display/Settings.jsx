/**
 * forcept - components/Console/Display/Settings.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import { UpdateDisplayGroupCacheAction } from '../../../flux/Display/DisplayActions';
import OptionList from '../Setting/OptionList';
import SettingText      from '../Setting/Text';
import SettingCheckbox  from '../Setting/Checkbox';
import CascadingFieldSelector  from '../Setting/CascadingFieldSelector';
import SettingSelect    from '../Setting/Select';
import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Console:Display:Settings');

class DisplaySettings extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _change = (prop) => {
        return (evt) => {
            // this.context.executeAction(UpdateCacheAction, {
            //     fields: {
            //         [this.props._key]: {
            //             [prop]: evt.target.value
            //         }
            //     }
            // });
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
            case "pie chart":
                return (
                    <div>
                        {settingsHeader}
                        <CascadingFieldSelector
                            onChange={((value) => {
                                this.context.executeAction(UpdateDisplayGroupCacheAction, {
                                    displays: {
                                        [props.displayID]: {
                                            settings: {
                                                context: value
                                            }
                                        }
                                    }
                                });
                            })}
                            displayID={props.displayID}
                            context={settings.context || null}
                            stages={props.stages} />
                    </div>
                );
                break;
            case "radio":
                var settingsDOM = (
                    <div className="Controls">
                        {settingsHeader}
                        <SettingCheckbox
                            field={props._key}
                            id="RadioSettings-buttons"
                            label="Display buttons instead of radio inputs"
                            setting="buttons"
                            checked={settings.buttons || false} />
                    </div>
                );
                return (
                    <div className="DisplaySettings">
                        {settingsDOM}
                        <OptionList
                            field={props._key}
                            options={settings.options || {}} />
                    </div>
                );
                break;
			case "number":
                return (
                    <div className="NumberSettings">
                        {settingsHeader}
                        <SettingText
                            field={props._key}
                            id="NumberSettings-unit"
                            label="Unit of measurement"
                            placeholder="Example: meters, seconds"
                            setting="unit"
                            value={settings.unit || ""} />
                    </div>
                );
                break;
            case "date":
                return (
                    <div className="DateSettings">
                        {settingsHeader}
                        <SettingCheckbox
                            field={props._key}
                            id="DateSettings-broad"
                            label="Use broad date selector"
                            setting="useBroadSelector"
                            checked={settings.useBroadSelector || false} />
                        <SettingSelect
                            field={props._key}
                            label="Default view"
                            placeholder="Choose a default view"
                            setting="view"
                            options={{
                                "month": "Month",
                                "year": "Year",
                                "decade": "Decade"
                            }}
                            value={settings.view || ""} />
                    </div>
                );
                break;
            case "select":
                var settingsDOM = (
                    <div className="Controls">
                        {settingsHeader}
                        <SettingCheckbox
                            field={props._key}
                            id="DisplaySettings-multiple"
                            label="Allow multiple selections"
                            checked={settings.multiple || false}
                            setting="multiple"
                            imply={["searchable"]} />
                        <SettingCheckbox
                            field={props._key}
                            id="DisplaySettings-customizable"
                            label="Allow custom field data"
                            checked={settings.customizable || false}
                            setting="customizable"
                            imply={["searchable"]} />
                        <SettingCheckbox
                            field={props._key}
                            id="DisplaySettings-searchable"
                            label="Enable searching through options"
                            checked={settings.searchable || false}
                            disabled={settings.customizable || settings.multiple}
                            setting="searchable" />
                    </div>
                );
                return (
                    <div className="DisplaySettings">
                        {settingsDOM}
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
                    <div className="ui fluid red message">
                        <div className="header">
                            <i className="warning icon"></i>
                            Warning: unrecognized display type "{type}".
                        </div>
                    </div>
                );
                break;
        }
    }

}

export default injectIntl(DisplaySettings);
