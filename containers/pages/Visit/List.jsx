/**
 * forcept - containers/pages/Visit/Listr.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../../../components/Base';
import NavLink    from '../../../components/Navigation/NavLink';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import MessageScaffold from '../../../components/Scaffold/Message';
import { SetCurrentTabAction, ReadVisitsAtStageAction,
        ClearVisitListAction, CreatePatientAction } from '../../../flux/Visit/VisitActions';

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

    componentDidMount() {
        this.fetch();
    }

    componentDidUpdate(lastProps) {
        if(this.props.stageID !== lastProps.stageID) {
            this.context.executeAction(ClearVisitListAction);
            this.fetch();
        }
    }

    fetch() {
        this.context.executeAction(ReadVisitsAtStageAction, {
            stageID: this.props.stageID
        });
    }

    render() {

        var { props } = this,
            { list, stage } = props;

        var horizonDOM, listDOM;

        /*
         * Show horizon controls bsaed on whether or not this
         * is the root stage.
         */
        if(stage.isRoot) {
            horizonDOM = (
                <Horizon>
                    <NavLink
                        href={props.stageSlug + "/new"}
                        className="item">
                        <i className="plus icon"></i>
                        Create a new visit
                    </NavLink>
                </Horizon>
            )
        }

        /*
         * Show the list if we've populated it with items;
         * otherwise, show a loading message.
         */
        if(list.length > 0) {

        } else {
            listDOM = (
                <div className="ui basic bottom attached segment">
                    <MessageScaffold
                        type="info"
                        icon="loading notched spinner"
                        text="Fetching visits, one moment..." />
                </div>
            )
        }

        return (
            <div>
                <h1 className="ui top attached header">
                    <i className="hospital icon"></i>
                    <div className="content">
                        {stage.name}
                    </div>
                </h1>
                {horizonDOM}
                {listDOM}
            </div>
        );
    }

}

VisitList = connectToStores(
    VisitList,
    [StageStore, VisitStore],
    (context, props) => {

        let routeStore = context.getStore('RouteStore');
        let stageStore = context.getStore(StageStore);
        let visitStore = context.getStore(VisitStore);

        let params = routeStore.getCurrentRoute().params;

        let stageID = null,
            stageSlug = null,
            stage = null;

        if(params.stageID) {
            stageSlug = params.stageID;
            stageID = params.stageID.split("-")[0];
            stage = stageStore.getStages()[stageID];
        }

        return {
            stageSlug: stageSlug,
            stageID: stageID,
            stage: stage,
            list:  visitStore.getList()
        };
    }
);

export default injectIntl(VisitList);
