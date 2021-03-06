/**
 * forcept - components/Console/StoreDebugger.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connectToStores } from 'fluxible-addons-react';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

import { UpdateCacheAction } from '../../flux/Stage/StageActions';
import BaseComponent, { grabContext } from '../Base';

const stores  = {
    AppStore:          ["getFlash", "getPageTitle", "getConfig"],
    VisitStore:        ["getStatus", "getVisit", "getList", "getRecentData", "isModified", "getCurrentTab", "getDestination"],
    SearchStore:       ["getStatus", "getQuery", "getContext", "getResults", "getSelected"],
    StageStore:        ["getCache", "getStages", "getFieldShiftContext"],
    PatientStore:      ["getPatients"],
    MedicationStore:   ["getCache", "getMedications"],
    PrescriptionStore: ["getSets"]
}

const __debug = debug('forcept:components:Console:StoreDebugger');

class StoreDebugger extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var props = this.props,
            propKeys = Object.keys(this.props);

        if(process.env.BROWSER && process.env.NODE_ENV && process.env.NODE_ENV === "development") {
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
        } else return null;
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
