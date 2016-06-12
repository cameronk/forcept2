/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import { UpdateMedicationCacheAction } from '../../flux/Pharmacy/MedicationActions';
import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Pharmacy:Quantity');

class Quantity extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    _change = (prop) => {
        return (evt) => {
            this.context.executeAction(UpdateMedicationCacheAction, {
                quantities: {
                    [this.props._key]: {
                        [prop]: evt.target.value
                    }
                }
            });
        }
    }

    render() {

        var props     = this.props,
            { quantity } = props;


        return (
            <div className="ui stackable form grid">
                <div className="row StageField">
                    <div className="eight wide column">
                        <div className="field">
                            <label>Name:</label>
                            <input type="text"
                                placeholder="Enter a quantity name"
                                value={quantity.name}
                                onChange={this._change('name')} />
                        </div>
                    </div>
                    <div className="eight wide field">
                        <div className="field">
                            <label>Available:</label>
                            <input type="number"
                                placeholder="How much of this quantity is available?"
                                value={quantity.available}
                                onChange={this._change('available')} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default injectIntl(Quantity);
