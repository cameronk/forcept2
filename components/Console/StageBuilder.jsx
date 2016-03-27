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

const __debug = debug("forcept:components:Console:StageBuilder");
const root = "components.console.stagebuilder";
const messages = defineMessages({
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Stage name"
    }
});

if(process.env.BROWSER) {
    require('../../styles/StageBuilder.less');
}

class StageBuilder extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
        $("#StageBuilder .ui.dropdown")
            .dropdown();
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        $("#StageBuilder .ui.accordion")
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

    _addField = (evt) => {
        this.context.executeAction(UpdateCacheAction, {
            fields: {
                [new Date().getTime()]: {
    				name: "",
    				type: "text",
    				mutable: true,
    				settings: this.context.getStore(StageStore).getDefaultSettings(),
    			}
            }
        });
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
            { cache, status } = stage;

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        var message;

        switch(status) {
            case "saved":
                message = (
                    <MessageScaffold
                        type="success"
                        text="Stage saved successfully." />
                );
                break;
        }

        return (
            <div className="ui basic expanded segment" id="StageBuilder">
                <HeadingScaffold
                    label={{
                        className: 'teal',
                        text: stage.id || 'Unsaved'
                    }}
                    text={cache.name.length === 0 ? "Untitled stage" : cache.name} />
                {message}
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
                <div className={"ui fully expanded basic segment" + (status === 'saving' ? " loading" : "")}>
                    <FieldsAccordion fields={cache.fields} />
                </div>
                <div className="ui divider"></div>

                <div className="ui buttons">
                    <button
                        onClick={this._addField}
                        className={"ui labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
                        <i className="plus icon"></i>
                        Add a new field
                    </button>
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

                {/** Upload/download configuration files **/}
                <div className="ui tiny right floated buttons">
                    <label
                        htmlFor="StageBuilder-UploadConfig"
                        onClick={this._upload}
                        className={"ui labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
                        <i className="upload icon"></i>
                        Upload
                    </label>
                    <button
                        onClick={this._download}
                        className={"ui right labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
                        <i className="download icon"></i>
                        Download
                    </button>
                </div>
                <input type="file" id="StageBuilder-UploadConfig" style={{ display: 'none' }} onChange={this._uploadConfig} />

            </div>
        );
    }
}

export default injectIntl(StageBuilder);
