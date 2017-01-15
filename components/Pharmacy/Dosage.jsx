/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import LazyInput from 'lazy-input';

import { UpdateMedicationCacheAction, UpdateMedicationStockAction } from '../../flux/Pharmacy/MedicationActions';
import BaseComponent, { grabContext } from '../Base';
import { BuildDOMClass } from '../../utils/CSSClassHelper';

const __debug = debug('forcept:components:Pharmacy:Dosage');

if(process.env.BROWSER) {
    require('./Dosage.less');
}

class Dosage extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
        this.state = { stockChange: null, updatingStock: false };
    }

    _change = (prop) => {
        return (evt) => {
            this.context.executeAction(UpdateMedicationCacheAction, {
                dosages: {
                    [this.props._key]: {
                        [prop]: evt.target.value
                    }
                }
            });
        }
    }

    _updateStock = () => {
        __debug("Updating stock:");
        this.context.executeAction(UpdateMedicationStockAction, {
            medicationID: this.props.medication.id,
            dosageID: this.props._key,
            newStock: this.getNewStockAmount(),
        });
        this.setState({
            stockChange: null
        });
    }

    getNewStockAmount = () => ((this.props.dosage.available || 0) + (this.state.stockChange || 0));

    render() {

        var props     = this.props,
            { dosage } = props;

        return (
            <div className="ui stackable form grid">
                <div className="row StageField">
                    <div className="eight wide column">
                        <div className="field">
                            <label>Name:</label>
                            <input type="text"
                                placeholder="Enter a dosage name"
                                defaultValue={dosage.name}
                                onChange={this._change('name')} />
                        </div>
                    </div>
                    <div className="eight wide field DosageSettings">
                        <div className="ui small dividing header">
                            <i className="cubes icon"></i>
                            <div className="content">
                                Stock
                            </div>
                        </div>
                        <div className="ui mini horizontal statistic">
                            <div className="value">
                                {dosage.available || 0}
                            </div>
                            <div className="label">
                                currently in stock
                            </div>
                        </div>
                        {(() => {
                            if(this.state.stockChange && this.state.stockChange !== 0) {
                                return (
                                    <div className="ui mini horizontal statistic" style={{ marginLeft: 0, marginBottom: 15 }}>
                                        <div className="value">
                                            {this.getNewStockAmount()}
                                        </div>
                                        <div className="label">
                                            new stock after update
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                        <label>Re-stock</label>
                        <div className="field">
                            <div className="ui right labeled input">
                                <div className="ui basic label">change stock by</div>
                                <LazyInput type="number"
                                    className={BuildDOMClass({ disabled: this.state.updatingStock })}
                                    value={this.state.stockChange}
                                    onChange={(evt) => this.setState({ stockChange: parseInt(evt.target.value) })}
                                    min={-dosage.available}
                                    placeholder="Enter a number of units" />
                                <div className="ui basic label">unit(s)</div>
                            </div>
                            <div className={BuildDOMClass("ui small fluid primary button", { disabled: (!this.state.stockChange || this.state.updatingStock), loading: this.state.updatingStock })}
                                onClick={this._updateStock}>
                                Confirm this change
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default injectIntl(Dosage);
