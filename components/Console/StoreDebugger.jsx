/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connectToStores } from 'fluxible-addons-react';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

import { UpdateCacheAction } from '../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../Base';
import FieldSettings from './FieldSettings';

const stores  = {
    AppStore:          ["getFlash"],
    VisitStore:        ["getStatus", "getVisit", "getList", "getRecentData", "isModified", "getCurrentTab", "getDestination"],
    SearchStore:       ["getStatus", "getQuery", "getContext", "getResults", "getSelected"],
    PatientStore:      ["getPatients"],
    MedicationStore:   ["getCache", "getMedications"],
    PrescriptionStore: ["getSets"]
}

const __debug = debug('forcept:components:Console:Field');

class StoreDebugger extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            propKeys = Object.keys(this.props);

        return (
            <div id="FORCEPT-StoreDebugger">
                {propKeys.map((loc) => {
                    return (
                        <div key={loc} className="ui segment">
                            <div className="small ui header">{loc}</div>
                            <pre>{JSON.stringify(props[loc], null, '  ')}</pre>
                        </div>
                    );
                })}
            </div>
        );
    }

}

StoreDebugger = connectToStores(
    StoreDebugger,
    Object.keys(stores),
    function (context, props) {
        var data = {};
        for(var store in stores) {
            stores[store].map(getter => {
                data[`${store}::${getter}()`] = (context.getStore(store))[getter]();
            });
        }
        return data;
    }
)

export default StoreDebugger;
