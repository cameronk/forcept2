/**
 * forcept - containers/pages/Visit/Listr.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../../../components/Base';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import { SetCurrentTabAction, CreatePatientAction } from '../../../flux/Visit/VisitActions';

import AppStore   from '../../../flux/App/AppStore';
import StageStore from '../../../flux/Stage/StageStore';
import VisitStore from '../../../flux/Visit/VisitStore';
import PatientStore from '../../../flux/Patient/PatientStore';

const __debug = debug('forcept:containers:pages:Visit:List');

if(process.env.BROWSER) {
    // require('../../../styles/Visit.less');
}

class VisitList extends BaseComponent {

    static contextTypes = grabContext()

    render() {
        return (
            <div>List</div>
        );
    }

}


export default injectIntl(VisitList);
