/**
* forcept - containers/pages/Console/DataManagement.jsx
* @author Azuru Technology
*/

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import AppStore from '../../../flux/App/AppStore';
import BaseComponent, { grabContext }    from '../../../components/Base';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import { BuildDOMClass } from '../../../utils/CSSClassHelper';
import { UpdateConfigAction, SaveConfigAction } from '../../../flux/App/AppActions';

const __debug = debug('forcept:containers:pages:Console:DataManagement');

const messages = defineMessages({
    heading: {
        id: "pages.console.dataManagement.heading",
        defaultMessage: "Data management"
    }
});

class DataManagement extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    getValue = (key) => {
        if(this.props.configuration.hasOwnProperty(key))
            return this.props.configuration[key];
        else return this.context.getConfiguration(key);
    }

    updateValue = (key, value) => {
        return (evt) => {
            this.context.executeAction(UpdateConfigAction, {
                [key]: value
            });
        };
    }
    updateInputValue = (key) => {
        return (evt) => {
            this.context.executeAction(UpdateConfigAction, {
                [key]: evt.target.value
            });
        }
    }

    saveChanges = () => {
        this.context.executeAction(SaveConfigAction, {
            current: this.context.getConfiguration(),
            changes: this.props.configuration
        });
    }

    render() {

        var { props } = this;

        var isDumpingEnabled = this.getValue("dumping.isEnabled");

        return (
            <div>
                <HeaderBar message={messages.heading} />
                <div className="stackable ui celled grid">

                    {/** Data dump **/}
                    <div className="row">
                        <div className="right aligned five wide computer six wide tablet column">
                            <h4 className="ui header">
                                Data dumping
                                <div className="sub header">Send off FORCEPT data automagically</div>
                            </h4>
                        </div>
                        <div className="eleven wide computer ten wide tablet column">
                            <div className="ui form">
                                <div className="field">
                                    <div className="ui left labeled button">
                                        <a className="ui basic right pointing label">
                                            {isDumpingEnabled ? "On" : "Off"}
                                        </a>
                                        <div onClick={this.updateValue("dumping.isEnabled", !isDumpingEnabled)}
                                            className={BuildDOMClass("ui button", {
                                                negative: isDumpingEnabled,
                                                positive: !isDumpingEnabled
                                            })}>
                                            Turn {isDumpingEnabled ? "off" : "on"}
                                        </div>
                                    </div>
                                </div>
                                <div className={BuildDOMClass("field", { disabled: !isDumpingEnabled })}>
                                    <div className="ui right labeled input">
                                        <div className="ui basic label">Send data to:</div>
                                        <input type="email" value={this.getValue("dumping.deliverTo")}
                                            onChange={this.updateInputValue("dumping.deliverTo")}
                                            disabled={!isDumpingEnabled}
                                            name="email" placeholder="Enter an email address here" />
                                        <div className="ui basic label">daily</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** Controls **/}
                    <div className="row">
                        <div className="right aligned column">
                            <div className="ui positive labeled icon button"
                                onClick={this.saveChanges}>
                                <i className="save icon"></i>
                                Save changes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DataManagement = connectToStores(
    DataManagement,
    ["AppStore"],
    (context, props) => {
        return {
            configuration: context.getStore("AppStore").getConfig()
        };
    }
)

export default injectIntl(DataManagement);
