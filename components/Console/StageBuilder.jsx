/**
 * forcept - components/Console/StageBuilder.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import { UpdateCacheAction } from '../../flux/Console/StageActions';
import StageStore from '../../flux/Console/StageStore';
import routes from '../../flux/Route/Routes';
import BaseComponent, { grabContext } from '../Base';
import HeadingScaffold from '../Scaffold/Heading';

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

class StageBuilder extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
        this.autobind([
            '_typeChange',
            '_nameChange'
        ]);
    }

    componentDidMount() {
        $("#StageBuilder .ui.dropdown")
            .dropdown();
    }

    _nameChange(evt) {
        this.context.executeAction(UpdateCacheAction, { name: evt.target.value });
    }

    _typeChange(evt) {
        this.context.executeAction(UpdateCacheAction, { type: evt.target.value });
    }

    render() {

        var props = this.props,
            ctx = this.context,
            { fields } = props,
            fieldKeys = Object.keys(fields);

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        return (
            <div>
                <HeadingScaffold text={"Create a new stage"} />
                <div className="ui divider"></div>
                    <form id="StageBuilder" className="ui form">
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
                    {fieldKeys.length > 0 ? fieldKeys.map((key, i) => {

                    }) : (
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
                    <button className="ui labeled icon button">
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
        __debug(context.getStore(StageStore).getCache());
        return context.getStore(StageStore).getCache();
    }
)

export default injectIntl(StageBuilder);
