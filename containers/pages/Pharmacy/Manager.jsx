/**
 * forcept - containers/pages/Pharmacy/Manager.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from "debug";

import StageStore from '../../../flux/Stage/StageStore';
import ConsoleStore from '../../../flux/Console/ConsoleStore';
import DisplayStore from '../../../flux/Display/DisplayStore';
import MedicationStore from '../../../flux/Pharmacy/MedicationStore';

import HeaderBar  from '../../../components/Meta/HeaderBar';
import MessageScaffold from '../../../components/Scaffold/Message';
import BaseComponent, { grabContext } from '../../../components/Base';
import SideMenu from '../../../components/Console/SideMenu';
import MedicationEditor from '../../../components/Pharmacy/MedicationEditor';

import { LoadDisplayGroupsAction } from '../../../flux/Display/DisplayActions';

const __debug = debug("forcept:containers:pages:Console:PharmacyManager");
const messages = defineMessages({
    "pages.pharmacy.manager.heading": {
        id: "pages.pharmacy.manager.heading",
        defaultMessage: "Medications"
    }
});


class PharmacyManager extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {

        var props = this.props,
            ctx   = this.context,
            managerDOM;

        if(props.error) {
            managerDOM = (
                <MessageScaffold
                    type="error"
                    text={props.error.toString()} />
            );
        } else if(!props.isNavigateComplete) {
            managerDOM = (
                <div className="ui active loader"></div>
            );
        } else {
            managerDOM = (
                <MedicationEditor medication={props.currentMedication} />
            );
        }

        return (
            <div className="ui stackable centered grid">
                <div className="row clear bottom">
                    <div className="sixteen wide column">
                        <HeaderBar message={messages["pages.pharmacy.manager.heading"]} />
                    </div>
                </div>
                <div className="row clear top">
                    <div className="four wide computer five wide tablet column">
                        <SideMenu
                            iterable={props.medications}
                            isNavigateComplete={props.isNavigateComplete}
                            location={props.currentMedication.id || 0}
                            basePath="/pharmacy/manage"
                            context="medication"
                            isCacheModified={false} />
                    </div>
                    <div className="twelve wide computer eleven wide tablet right spaced column">
                        {managerDOM}
                    </div>
                </div>
            </div>
        );
    }
}

PharmacyManager = connectToStores(
    PharmacyManager,
    ["RouteStore",  MedicationStore],
    function(context, props) {

        var routeStore = context.getStore('RouteStore');
        var medicationStore = context.getStore(MedicationStore);

        return {
            /// Meta
            isNavigateComplete: routeStore.isNavigateComplete(),

            ///
            medications: medicationStore.getMedications(),

            ///
            currentMedication: {
                id: routeStore.getCurrentRoute().params.medicationID || null,
                cache: medicationStore.getCache(),
                isCacheModified: medicationStore.isCacheModified(),
                status: medicationStore.getStatus()
            }
        };
    }
);

export default injectIntl(PharmacyManager);
