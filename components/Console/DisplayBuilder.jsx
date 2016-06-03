/**
 * forcept - components/Console/DisplayBuilder.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import pick from 'lodash/pick';

import { UpdateDisplayGroupCacheAction, SaveDisplayGroupAction, /*UploadFieldsAction */ } from '../../flux/Display/DisplayActions';
import StageStore from '../../flux/Stage/StageStore';
import BaseComponent, { grabContext } from '../Base';
import FieldsAccordion from './FieldsAccordion';
import HeadingScaffold from '../Scaffold/Heading';
import MessageScaffold from '../Scaffold/Message';
import { BuildDOMClass } from '../../utils/CSSClassHelper';

const __debug = debug("forcept:components:Console:DisplayBuilder");
const root = "components.console.DisplayBuilder";
const messages = defineMessages({
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Display group name"
    }
});

if(process.env.BROWSER) {
    require('../../styles/Builder.less');
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
        $("#Forcept-DisplayBuilder .ui.dropdown")
            .dropdown();
        $("#Forcept-DisplayBuilder .ui.accordion")
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

    _addField = (type) => {
        return () => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [new Date().getTime()]: {
        				name: "",
        				type: type,
        				mutable: true,
        				settings: this.context.getStore(StageStore).getDefaultSettings(),
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
            { group } = props,
            { cache, status } = group;

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        var messageDOM, AddNewFieldButtonDOM, PresetControlsDOM,
            FieldsAccordionDOM, FieldsAccordionDividerDOM;


        __debug(group);
        __debug(cache);

        /// Enable some fields when ID is set.
        // if(stage.id) {
        //
        //     /// Add a new field
        //     AddNewFieldButtonDOM = (
        //         <button
        //             className={BuildDOMClass("ui labeled dropdown icon button" , { "disabled": status === 'saving' })}>
        //             <i className="plus icon"></i>
        //             Add a new field
        //             <div className="menu">
        //                 <div className="item" onClick={this._addField("text")}>Text field</div>
        //                 <div className="item" onClick={this._addField("textarea")}>Textarea field</div>
        //                 <div className="item" onClick={this._addField("number")}>Number field</div>
        //                 <div className="item" onClick={this._addField("date")}>Date field</div>
        //                 <div className="item" onClick={this._addField("radio")}>Radio/button field</div>
        //                 <div className="item" onClick={this._addField("select")}>Select field</div>
        //                 <div className="item" onClick={this._addField("file")}>File field</div>
        //                 <div className="item" onClick={this._addField("header")}>Group fields with a header</div>
        //                 <div className="item" onClick={this._addField("pharmacy")}>Pharmacy - show available medication</div>
        //             </div>
        //         </button>
        //     );
        //
        //     /// Upload/download configuration files
        //     PresetControlsDOM = (
        //         <div className="ui tiny right floated buttons">
        //             <label
        //                 htmlFor="DisplayBuilder-UploadConfig"
        //                 onClick={this._upload}
        //                 className={"ui labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
        //                 <i className="upload icon"></i>
        //                 Upload
        //             </label>
        //             <input type="file" id="DisplayBuilder-UploadConfig" style={{ display: 'none' }} onChange={this._uploadConfig} />
        //             <button
        //                 onClick={this._download}
        //                 className={"ui right labeled icon button" + (status === 'saving' ? ' disabled' : '')}>
        //                 <i className="download icon"></i>
        //                 Download
        //             </button>
        //         </div>
        //     );
        //
        //     /// FieldsAccordion
        //     FieldsAccordionDOM = (
        //         <div className={"ui fully expanded basic segment" + (status === 'saving' ? " loading" : "")}>
        //             <FieldsAccordion fields={cache.fields} />
        //         </div>
        //     );
        //
        //     /// FieldsAccordion bottom divider
        //     FieldsAccordionDividerDOM = (
        //         <div className="ui divider"></div>
        //     );
        //
        // }

        // switch(status) {
        //     case "saved":
        //         messageDOM = (
        //             <MessageScaffold
        //                 type="success"
        //                 text="Stage saved successfully." />
        //         );
        //         break;
        // }

        return (
            <div className="ui basic expanded segment" id="Forcept-DisplayBuilder">
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

                {FieldsAccordionDOM}
                {FieldsAccordionDividerDOM}

                <div className="ui buttons">
                    {AddNewFieldButtonDOM}
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

                {PresetControlsDOM}
            </div>
        );
    }
}

export default injectIntl(DisplayBuilder);
