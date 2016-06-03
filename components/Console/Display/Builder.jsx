/**
 * forcept - components/Console/Display/Builder.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import pick from 'lodash/pick';

import { CreateDisplayAction,
        UpdateDisplayGroupCacheAction,
        SaveDisplayGroupAction } from '../../../flux/Display/DisplayActions';
import StageStore from '../../../flux/Stage/StageStore';
import BaseComponent, { grabContext } from '../../Base';
import HeadingScaffold from '../../Scaffold/Heading';
import MessageScaffold from '../../Scaffold/Message';
import { BuildDOMClass } from '../../../utils/CSSClassHelper';
import DisplayAccordion from './Accordion';

const __debug = debug("forcept:components:Console:Display:Builder");
const root = "components.console.DisplayBuilder";
const messages = defineMessages({
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Display group name"
    }
});

if(process.env.BROWSER) {
    require('../../../styles/Builder.less');
}

class DisplayBuilder extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
        var { props } = this;

        this.componentDidUpdate();
    }

    componentDidUpdate() {
        $("#Forcept-Builder .ui.dropdown")
            .dropdown();
        $("#Forcept-Builder .ui.accordion")
            .accordion();
    }

    _nameChange = (evt) => {
        this.context.executeAction(UpdateDisplayGroupCacheAction, { name: evt.target.value });
    }

    _typeChange = (evt) => {
        this.context.executeAction(UpdateDisplayGroupCacheAction, { type: evt.target.value });
    }

    _save = (evt) => {
        this.context.executeAction(SaveDisplayGroupAction, { id: this.props.group.id || null });
    }

    _addDisplay = (type) => {
        return () => {
            this.context.executeAction(CreateDisplayAction, {
                groupID: this.props.group.id,
                name: "",
                type: type,
                settings: this.context.getDisplayTypes()[type].defaultSettings
            });
        }
    }
    render() {

        var props = this.props,
            ctx = this.context,
            { group } = props,
            { cache, status } = group,
            availableDisplays = this.context.getDisplayTypes(),
            availableDisplayKeys = Object.keys(availableDisplays);

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        var messageDOM, AddNewDisplayButtonDOM,
            DisplaysAccordionDOM, DisplaysAccordionDividerDOM;

        __debug(group);

        /// Enable some Displays when ID is set.
        if(group.id) {

            /// Add a new Display
            AddNewDisplayButtonDOM = (
                <button
                    className={BuildDOMClass("ui labeled dropdown icon button" , { "disabled": status === 'saving' })}>
                    <i className="plus icon"></i>
                    Add a new display
                    <div className="menu">
                        {availableDisplayKeys.map(key => {
                            let thisDisplay = availableDisplays[key];
                            return (
                                <div key={key} className="item" onClick={this._addDisplay(key)}>
                                    <i className={(thisDisplay.icon || "") + " icon"}></i>
                                    <div className="text">{thisDisplay.name || ""}</div>
                                    <div className="description">{thisDisplay.description || ""}</div>
                                </div>
                            );
                        })}
                    </div>
                </button>
            );

            /// DisplaysAccordion
            DisplaysAccordionDOM = (
                <div className={"ui fully expanded basic segment" + (status === 'saving' ? " loading" : "")}>
                    <DisplayAccordion displays={cache.displays} />
                </div>
            );

            /// DisplaysAccordion bottom divider
            DisplaysAccordionDividerDOM = (
                <div className="ui divider"></div>
            );

        }

        switch(status) {
            case "saved":
                messageDOM = (
                    <MessageScaffold
                        type="success"
                        text="Display group saved successfully." />
                );
                break;
        }

        return (
            <div className="ui basic expanded segment" id="Forcept-Builder">
                <HeadingScaffold
                    label={{
                        className: 'teal',
                        text: group.id || 'Unsaved'
                    }}
                    text={cache.name.length === 0 ? "Untitled display group" : cache.name} />
                {messageDOM}
                <div className="ui divider"></div>

                <form className={"ui form" + (status === 'saving' ? " loading" : "")}>
                    <div className="fields">
                        <div className="eight wide field">
                            <label>{nameLabel}</label>
                            <input type="text" value={cache.name} onChange={this._nameChange} placeholder={nameLabel} />
                        </div>
                    </div>
                </form>
                <div className="ui divider"></div>

                {DisplaysAccordionDOM}
                {DisplaysAccordionDividerDOM}

                <div className="ui buttons">
                    {AddNewDisplayButtonDOM}
                    <button
                        onClick={this._save}
                        className={
                            "ui right labeled positive icon button" +
                            ((!group.isCacheModified || status === 'saving') ? ' disabled' : '') +
                            ((status === 'saving') ? ' loading' : '')}>
                        Save
                        <i className="save icon"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default injectIntl(DisplayBuilder);
