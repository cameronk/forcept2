/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import { UpdateCacheAction, RemoveFieldAction } from '../../../flux/Stage/StageActions';
import { SetFieldShiftContext } from '../../../flux/Console/StageBuilderActions';
import BaseComponent, { grabContext } from '../../Base';
import FieldSettings from './FieldSettings';

const __debug = debug('forcept:components:Console:Field');

class Field extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    /*
     *
     */
    shouldComponentUpdate = () => {
        return true;
    }

    componentDidMount() {
        $(".StageField .ui.dropdown")
            .dropdown({
                onChange: this._change()
            });
    }

    _change = (prop) => {
        return (evt) => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props._key]: Object.assign({
                        [prop]: evt.target.value
                    }, prop === "type" ? {
                        settings: null
                    } : {})
                }
            });
        }
    }

    _removeField = (evt) => {
        this.context.executeAction(RemoveFieldAction, {
            stageID: this.props.stageID,
            fieldID: this.props._key
        });
    }

    _moveField = (evt) => {
        __debug(this.props._key);
        this.context.executeAction(SetFieldShiftContext, {
            field: this.props._key
        });
    }

    render() {

        var props     = this.props,
            { field, stageID } = props,
            mutable   = (field.mutable === true),
            typeSelectDOM, removeButtonDOM;

        if(mutable) {
            removeButtonDOM = (
                <button
                    onClick={this._removeField}
                    className="ui tiny basic red labeled icon button">
                    <i className="remove icon"></i>
                    Remove this field
                </button>
            );
        }

        return (
            <div className="ui stackable form grid">
                <div className="row StageField">
                    <div className="six wide column">
                        <div className="field">
                            <label>Name:</label>
                            <input type="text" placeholder={"Enter a field name"} value={field.name} onChange={this._change('name')} />
                        </div>
                        <div className="field">
                            <label>Description:</label>
                            <textarea
                                placeholder={"Enter a field description (optional)"}
                                value={field.description}
                                onChange={this._change('description')}>
                            </textarea>
                        </div>
                        <button
                            onClick={this._moveField}
                            className="ui tiny basic green labeled icon button">
                            <i className="right chevron icon"></i>
                            Move this field
                        </button>
                        {removeButtonDOM}
                    </div>
                    <div className="ten wide field">
                        <div className="ui basic segment">
                            <FieldSettings
                                type={field.type}
                                settings={field.settings}
                                _key={props._key} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default injectIntl(Field);
