/**
* forcept - containers/pages/Console/Index.jsx
* @author Azuru Technology
*/

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../../flux/Auth/AuthStore';
import PatientStore     from '../../../flux/Patient/PatientStore';
import StageStore       from '../../../flux/Stage/StageStore';
import VisitStore       from '../../../flux/Visit/VisitStore';
import TestStore        from '../../../flux/Test/TestStore';
import ResourceStore    from '../../../flux/Resource/ResourceStore';
import { LoginAction, CredentialChangeAction }  from '../../../flux/Auth/AuthActions';
import { PushModelAction, UpdateModelAction }  from '../../../flux/Test/TestActions';
import BaseComponent    from '../../../components/Base';
import Horizon  from '../../../components/Meta/Horizon';

const messages = defineMessages({
});

class Index extends BaseComponent {

    static contextTypes = {
        getStore:       PropTypes.func.isRequired,
        executeAction:  PropTypes.func.isRequired,
        getRequest:     PropTypes.func.isRequired
    }

    constructor() {
        super();
    }

    componentDidMount() {
        $("#Horizon .ui.dropdown").dropdown();
    }

    _updateTestModel = (evt) => {
        this.context.executeAction(UpdateModelAction, {
            'name': 'test'
        });
    }

    _importTestModel = (evt) => {
        this.context.executeAction(PushModelAction);
    }

    render() {
        var props = this.props;

        return (
            <div>
                <h1>ResourceStore::getState()</h1>
                <pre>{JSON.stringify(props.resourceState, null, '  ')}</pre>
                <div className="ui divider"></div>
                <div className="ui divider"></div>
                <h1>VisitStore::getVisit()</h1>
                <pre>{JSON.stringify(props.visit, null, '  ')}</pre>
                <div className="ui divider"></div>
                <h1>PatientStore::getPatients()</h1>
                <pre>{JSON.stringify(props.patients, null, '  ')}</pre>
                <div className="ui divider"></div>
                <h1>StageStore::getStages()</h1>
                <pre>{JSON.stringify(props.stages, null, '  ')}</pre>
                <div className="ui divider"></div>
                <h1>StageStore::getCache()</h1>
                <pre>{JSON.stringify(props.stageCache, null, '  ')}</pre>
                <div className="ui divider"></div>
            </div>
        );
    }
}

Index = connectToStores(
    Index,
    [ResourceStore, PatientStore, TestStore],
    (context, props) => {
        let resourceStore = context.getStore(ResourceStore);
        return {
            resourceState: resourceStore.getState(),
            patients: context.getStore(PatientStore).getPatients(),
            stages: context.getStore(StageStore).getStages(),
            stageCache: context.getStore(StageStore).getCache(),
            visit: context.getStore(VisitStore).getVisit()
        };
    }
)

export default injectIntl(Index);
