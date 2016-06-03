/**
 * forcept - components/Console/StageBuilder.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import pick from 'lodash/pick';

import { UpdateCacheAction, SaveStageAction, UploadFieldsAction } from '../../flux/Stage/StageActions';
import StageStore from '../../flux/Stage/StageStore';
import BaseComponent, { grabContext } from '../Base';
import FieldsAccordion from './FieldsAccordion';
import HeadingScaffold from '../Scaffold/Heading';
import MessageScaffold from '../Scaffold/Message';
import { BuildDOMClass } from '../../utils/CSSClassHelper';

const __debug = debug("forcept:components:Console:StageBuilder");
const root = "components.console.stagebuilder";
const messages = defineMessages({
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Stage name"
    }
});

if(process.env.BROWSER) {
    require('../../styles/Builder.less');
}

class StageBuilder extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        $("#Forcept-Builder .ui.dropdown")
            .dropdown();
        $("#Forcept-Builder .ui.accordion")
            .accordion();
    }

    _nameChange = (evt) => {
        this.context.executeAction(UpdateCacheAction, { name: evt.target.value });
    }

    _typeChange = (evt) => {
        this.context.executeAction(UpdateCacheAction, { type: evt.target.value });
    }

    _save = (evt) => {
        this.context.executeAction(SaveStageAction, { id: this.props.stage.id || null });
    }

    _addField = (type) => {
        return () => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [new Date().getTime()]: {
        				name: "",
        				type: type,
        				mutable: true,
        				settings: this.context.getFieldTypes()[type].defaultSettings
        			}
                }
            });
        }
    }

    _uploadConfig = (evt) => {
		var reader = new FileReader();
		var file = evt.target.files[0];

		reader.onload = function(upload) {

			var fields = JSON.parse(
                atob(upload.target.result.split(",")[1])
            );

			if(fields) {
                this.context.executeAction(UploadFieldsAction, {
                    fields: fields
                });
			}

		}.bind(this);

		reader.readAsDataURL(file);
    }

    render() {

        var props = this.props,
            ctx = this.context,
            { stage } = props,
            { cache, status } = stage,
            availableFields = this.context.getFieldTypes(),
            availableFieldKeys = Object.keys(availableFields);

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        var messageDOM, AddNewFieldButtonDOM, PresetControlsDOM,
            FieldsAccordionDOM, FieldsAccordionDividerDOM;

        /// Enable some fields when ID is set.
        if(stage.id) {

            /// Add a new field
            AddNewFieldButtonDOM = (
                <button
                    className={BuildDOMClass("ui labeled dropdown icon button" , { "disabled": status === 'saving' })}>
                    <i className="plus icon"></i>
                    Add a new field
                    <div className="menu">
                        {availableFieldKeys.map(key => {
                            let thisField = availableFields[key];
                            return (
                                <div className="item" onClick={this._addField(key)}>
                                    <div className="text">{thisField.name || ""}</div>
                                    <div className="description">{thisField.description || ""}</div>
                                </div>
                            );
                        })}
                    </div>
                </button>
            );

            /// Upload/download configuration files
            PresetControlsDOM = (
                <div className="ui tiny right floated buttons">
                    <label
                        htmlFor="StageBuilder-UploadConfig"
                        onClick={this._upload}
                        className={"ui labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
                        <i className="upload icon"></i>
                        Upload
                    </label>
                    <input type="file" id="StageBuilder-UploadConfig" style={{ display: 'none' }} onChange={this._uploadConfig} />
                    <button
                        onClick={this._download}
                        className={"ui right labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
                        <i className="download icon"></i>
                        Download
                    </button>
                </div>
            );

            /// FieldsAccordion
            FieldsAccordionDOM = (
                <div className={"ui fully expanded basic segment" + (status === 'saving' ? " loading" : "")}>
                    <FieldsAccordion fields={cache.fields} />
                </div>
            );

            /// FieldsAccordion bottom divider
            FieldsAccordionDividerDOM = (
                <div className="ui divider"></div>
            );

        }

        switch(status) {
            case "saved":
                messageDOM = (
                    <MessageScaffold
                        type="success"
                        text="Stage saved successfully." />
                );
                break;
        }

        return (
            <div className="ui basic expanded segment" id="Forcept-Builder">
                <HeadingScaffold
                    label={{
                        className: 'teal',
                        text: stage.id || 'Unsaved'
                    }}
                    text={cache.name.length === 0 ? "Untitled stage" : cache.name} />
                {messageDOM}
                <div className="ui divider"></div>
                <form className={"ui form" + (status === 'saving' ? " loading" : "")}>
                    <div className="fields">
                        <div className="eight wide field">
                            <label>{nameLabel}</label>
                            <input type="text" value={cache.name} onChange={this._nameChange} placeholder={nameLabel} />
                        </div>
                        <div className="eight wide field">
                            <label>Type</label>
                            <select className="ui dropdown" value={cache.type} onChange={this._typeChange}>
                                <option value="">Type</option>
                                <option value="basic">Basic</option>
                                <option value="pharmacy">Pharmacy</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="ui divider"></div>

                {FieldsAccordionDOM}
                {FieldsAccordionDividerDOM}

                <div className="ui buttons">
                    {AddNewFieldButtonDOM}
                    <button
                        onClick={this._save}
                        className={
                            "ui right labeled positive icon button" +
                            ((!stage.isCacheModified || status === 'saving') ? ' disabled' : '') +
                            ((status === 'saving') ? ' loading' : '')}>
                        Save
                        <i className="save icon"></i>
                    </button>
                </div>

                {PresetControlsDOM}
            </div>
        );
    }
}

export default injectIntl(StageBuilder);
