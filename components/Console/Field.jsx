/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

import { UpdateCacheAction } from '../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../Base';
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
            .dropdown();
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
        this.context.executeAction(UpdateCacheAction, {
            fields: {
                [this.props._key]: null
            }
        });
    }

    render() {

        var props     = this.props,
            { field } = props,
            mutable   = (field.mutable === true),
            typeSelectDOM, removeButtonDOM;

        if(mutable) {

            typeSelectDOM = (
                <div className="field">
                    <label>Type:</label>
                    <select className="ui dropdown" value={field.type} onChange={this._change('type')}>
                        <optgroup label="Inputs">
                            <option value="text">Text input</option>
                            <option value="textarea">Textarea input</option>
                            <option value="number">Number input</option>
                            <option value="date">Date input</option>
                        </optgroup>
                        <optgroup label="Multiple-option fields">
                            <option value="select">Select input with options</option>
                            <option value="multiselect">Multi-select input with options</option>
                            <option value="file">File input</option>
                            <option value="yesno">Yes or no buttons</option>
                        </optgroup>
                        <optgroup label="Other">
                            <option value="header">Group fields with a header</option>
                            <option value="pharmacy">Pharmacy - show available medication</option>
                        </optgroup>
                    </select>
                </div>
            );

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
                        {typeSelectDOM}
                        <div className="field">
                            <label>Description:</label>
                            <textarea
                                placeholder={"Enter a field description (optional)"}
                                value={field.description}
                                onChange={this._change('description')}>
                            </textarea>
                        </div>
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
