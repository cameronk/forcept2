/**
 * forcept - components/Console/StageBuilder.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import flatten from 'lodash/flatten';

import { UpdateCacheAction } from '../../flux/Console/StageActions';
import StageStore from '../../flux/Console/StageStore';
import routes from '../../flux/Route/Routes';
import BaseComponent, { grabContext } from '../Base';
import HeadingScaffold from '../Scaffold/Heading';
import Field from './Field';

const __debug = debug("forcept:components:Console:StageBuilder");
const root = "components.console.stagebuilder";
const messages = defineMessages({
    [root + ".errors.noFields.heading"]: {
        id: root + ".errors.noFields.heading",
        defaultMessage: "No fields created (yet)."
    },
    [root + ".errors.noFields"]: {
        id: root + ".errors.noFields",
        defaultMessage: "Use the 'Add a new field' button below to get started."
    },
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
        this.autobind([
            '_typeChange',
            '_nameChange',
            '_addField',
        ]);
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

    _nameChange(evt) {
        this.context.executeAction(UpdateCacheAction, { name: evt.target.value });
    }

    _typeChange(evt) {
        this.context.executeAction(UpdateCacheAction, { type: evt.target.value });
    }

    _addField(evt) {
        this.context.executeAction(UpdateCacheAction, {
            fields: {
                [new Date().getTime()]: {
    				name: "",
    				type: "text",
    				mutable: true,
    				settings: {},
    			}
            }
        });
    }

    render() {

        var props = this.props,
            ctx = this.context,
            { fields } = props,
            fieldKeys = Object.keys(fields);

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        return (
            <div className="ui basic expanded segment" id="StageBuilder">
                <HeadingScaffold text={props.name.length === 0 ? "Untitled stage" : ("Stage: " + props.name)} />
                <div className="ui divider"></div>

                <form className="ui form">
                    <div className="fields">
                        <div className="eight wide field">
                            <label>{nameLabel}</label>
                            <input type="text" value={props.name} onChange={this._nameChange} placeholder={nameLabel} />
                        </div>
                        <div className="eight wide field">
                            <label>Type</label>
                            <select className="ui dropdown" value={props.type} onChange={this._typeChange}>
                                <option value="">Type</option>
                                <option value="basic">Basic</option>
                                <option value="pharmacy">Pharmacy</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="ui divider"></div>

                {fieldKeys.length > 0 ? (
                    <div className="ui fluid accordion">
                        {
                            flatten(
                                fieldKeys.map((key, i) => {
                                    let thisField = fields[key];
                                    return [
                                        (<div className="title">
                                            <div className="ui medium header">
                                                <i className="dropdown icon"></i>
                                                {thisField.name.length > 0 ? thisField.name : "Untitled field"}
                                                {" "}
                                                <div className="tiny ui teal label">
                                                    {key}
                                                </div>
                                            </div>
                                        </div>),
                                        (<div className="content">
                                            <Field
                                                {...thisField}
                                                key={key}
                                                _key={key} />
                                        </div>)
                                    ];
                                })
                            )
                        }
                    </div>
                ) : (
                    <div className="ui error message">
                        <div className="header">
                            {props.intl.formatMessage(messages["components.console.stagebuilder.errors.noFields.heading"])}
                        </div>
                        <p>
                            {props.intl.formatMessage(messages["components.console.stagebuilder.errors.noFields"])}
                        </p>
                    </div>
                )}
                <div className="ui divider"></div>

                <div className="ui buttons">
                    <button onClick={this._addField} className="ui labeled icon button">
                        <i className="plus icon"></i>
                        Add a new field
                    </button>
                    <button className="ui right labeled icon positive button">
                        Save
                        <i className="save icon"></i>
                    </button>
                </div>
            </div>
        );
    }
}

StageBuilder = connectToStores(
    StageBuilder,
    [StageStore],
    function(context, props) {
        return Object.assign(context.getStore(StageStore).getCache(), {
            isLoading: context.getStore('RouteStore').isNavigateComplete()
        });
    }
)

export default injectIntl(StageBuilder);
