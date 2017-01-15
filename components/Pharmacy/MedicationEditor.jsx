/**
 * forcept - components/Console/DosageEditor.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import pick from 'lodash/pick';

import { UpdateMedicationCacheAction, SaveMedicationAction, AddDosageAction } from '../../flux/Pharmacy/MedicationActions';
import BaseComponent, { grabContext } from '../Base';
import DosageAccordion from './DosageAccordion';
import HeadingScaffold from '../Scaffold/Heading';
import MessageScaffold from '../Scaffold/Message';
import { BuildDOMClass } from '../../utils/CSSClassHelper';

const __debug = debug("forcept:components:Console:DosageEditor");
const root = "components.pharmacy.dosageeditor";
const messages = defineMessages({
    [root + ".name"]: {
        id:  root + ".name",
        defaultMessage: "Medication name"
    }
});

if(process.env.BROWSER) {
    require('../../styles/Builder.less');
}

class DosageEditor extends BaseComponent {

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
        this.context.executeAction(UpdateMedicationCacheAction, { name: evt.target.value });
    }

    _save = (evt) => {
        this.context.executeAction(SaveMedicationAction, { id: this.props.medication.id || null });
    }

    _addDosage = (type) => {
        this.context.executeAction(AddDosageAction, { id: this.props.medication.id || null });
    }

    render() {

        var props = this.props,
            ctx = this.context,
            { medication } = props,
            { cache, status } = medication;

        var nameLabel = props.intl.formatMessage(messages[root + ".name"]);
        var messageDOM, AddNewFieldButtonDOM,
            DosageAccordionDOM, DosageAccordionDividerDOM;

        /// Enable some fields when ID is set.
        if(medication.id) {

            /// Add a new field
            AddNewFieldButtonDOM = (
                <button onClick={this._addDosage}
                    className={BuildDOMClass("ui labeled icon button" , { "disabled": status === 'saving' })}>
                    <i className="plus icon"></i>
                    Add a new medication dosage
                </button>
            );

            /// DosageAccordion
            DosageAccordionDOM = (
                <div className={"ui fully expanded basic segment" + (status === 'saving' ? " loading" : "")}>
                    <DosageAccordion medication={medication} dosages={cache.dosages} />
                </div>
            );

            /// DosageAccordion bottom divider
            DosageAccordionDividerDOM = (
                <div className="ui divider"></div>
            );

        }

        switch(status) {
            case "saved":
                messageDOM = (
                    <MessageScaffold
                        type="success"
                        text="Medication saved successfully." />
                );
                break;
        }

        return (
            <div className="ui basic expanded segment" id="Forcept-Builder">
                <HeadingScaffold
                    label={{
                        className: 'teal',
                        text: medication.id || 'Unsaved'
                    }}
                    text={cache.name.length === 0 ? "Untitled medication" : cache.name} />
                {messageDOM}
                <div className="ui divider"></div>
                    <form className={"ui form" + (status === 'saving' ? " loading" : "")}>
                        <div className="fields">
                            <div className="eight wide field">
                                <label>{nameLabel}</label>
                                <input type="text" defaultValue={cache.name} onChange={this._nameChange} placeholder={nameLabel} />
                            </div>
                        </div>
                    </form>
                <div className="ui divider"></div>
                    {DosageAccordionDOM}
                    {DosageAccordionDividerDOM}
                <div className="ui buttons">
                    {AddNewFieldButtonDOM}
                    <button
                        onClick={this._save}
                        className={
                            "ui right labeled positive icon button" +
                            ((!medication.isCacheModified || status === 'saving') ? ' disabled' : '') +
                            ((status === 'saving') ? ' loading' : '')}>
                        Save
                        <i className="save icon"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default injectIntl(DosageEditor);
