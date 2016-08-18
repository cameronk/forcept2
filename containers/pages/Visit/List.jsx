/**
 * forcept - containers/pages/Visit/Listr.jsx
 * @author Azuru Technology
 */

/// Modules
import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import chunk from 'lodash/chunk';

/// Components
import BaseComponent, { grabContext } from '../../../components/Base';
import NavLink    from '../../../components/Navigation/NavLink';
import Horizon    from '../../../components/Meta/Horizon';
import HeaderBar  from '../../../components/Meta/HeaderBar';
import Editor     from '../../../components/Visit/Editor';
import MessageScaffold from '../../../components/Scaffold/Message';
import PhotoScaffold   from '../../../components/Scaffold/Photo';
import { SetCurrentTabAction, ReadVisitsAtStageAction,
        ClearVisitListAction, CreatePatientAction } from '../../../flux/Visit/VisitActions';

/// Stores
import AppStore   from '../../../flux/App/AppStore';
import StageStore from '../../../flux/Stage/StageStore';
import VisitStore from '../../../flux/Visit/VisitStore';
import RouteStore from '../../../flux/Route/RouteStore';
import PatientStore from '../../../flux/Patient/PatientStore';

/// Messages
import VisitMessages from '../../../lang/Visit';
import PatientMessages from '../../../lang/Patient';

/// Constants
const __debug = debug('forcept:containers:pages:Visit:List');
const messages = defineMessages({
    stageHeader: {
        id: 'pages.visit.list.stageHeader',
        defaultMessage: `{count, plural,
            one {# visit}
            other {# visits}
        }`
    },
    visitHeader: {
        id: 'pages.visit.list.visitHeader',
        defaultMessage: `{count, plural,
            one {# patient}
            other {# patients}
        }`
    },
    handleVisit: {
        id: 'pages.visit.list.handleVisit',
        defaultMessage: 'Handle visit'
    },
    emptyList: {
        id: 'pages.visit.list.empty',
        defaultMessage: 'No visits currently at this stage.'
    }
});

if(process.env.BROWSER) {
    require('../../../styles/FlexGrouper.less');
}

class VisitList extends BaseComponent {

    static contextTypes = grabContext()

    render() {

        var { props } = this,
            { list, stage } = props,
            { formatMessage } = props.intl;

        var horizonDOM, listDOM;

        /*
         * Show horizon controls bsaed on whether or not this
         * is the root stage.
         */
        if(stage.isRoot) {
            horizonDOM = (
                <Horizon>
                    <NavLink
                        href={"/visits/" + props.stageSlug + "/new"}
                        className="control item">
                        <i className="plus icon"></i>
                        {formatMessage(VisitMessages.createNew)}
                    </NavLink>
                </Horizon>
            );
        }

        /*
         *
         */
        if(!props.isNavigateComplete || list === null) {
            listDOM = (
                <div className="ui basic bottom attached segment">
                    <div className="ui basic loading segment"></div>
                </div>
            );
        }

        /*
         *
         */
        else {

            /*
             * Show the list if we've populated it with items;
             * otherwise, show a loading message.
             */
            if(list.length > 0) {
                listDOM = list.map(visit => {
                    var visitLink = "/visits/" + props.stageSlug + "/" + visit.id;
                    return (
                        <div className="flex container">
                            <div className="huge ui top attached header">
                                <div className="basic large right pointing ui teal label">
                                    ID <div className="detail">{visit.id}</div>
                                </div>
                                {props.intl.formatMessage(messages['visitHeader'], {
                                    count: visit.patients.length
                                })}
                            </div>
                            <div className="ui bottom attached segment">
                                <div className="ui stackable cards">
                                    {visit.patients.map(patient => {

                                        var photoDOM;
                                        if(patient.photo !== null
                                         && Array.isArray(patient.photo)
                                         && patient.photo.length > 0) {
                                            let photo = patient.photo[0];
                                            photoDOM = (
                                                <div className="image">
                                                    <PhotoScaffold
                                                        id={`FORCEPT-visit-${visit.id}-patient-${patient.id}-${photo.id}`}
                                                        src={["/resources/", photo.id, photo.ext].join("")} />
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="teal card" key={patient.id}>
                                                <div className="content">
                                                    <div className="header">
                                                        {patient.fullName || formatMessage(PatientMessages.untitled)}
                                                    </div>
                                                    <div className="meta">
                                                        age {patient.birthday ? props.intl.formatRelative(patient.birthday, { style: 'numeric', units: 'year' }) : "unknown"}
                                                    </div>
                                                </div>
                                                {photoDOM}
                                                <div className="extra content">
                                                    <div>last updated  &nbsp; &rarr; {props.intl.formatRelative(patient.updatedAt)}</div>
                                                    <div>first visited  &nbsp; &nbsp; &rarr; {props.intl.formatRelative(patient.createdAt)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="card">
                                        <div className="content">
                                            <div className="header">
                                                <div className="tiny right floated basic ui teal label">
                                                    ID <div className="detail">{visit.id}</div>
                                                </div>
                                                <i className="yellow star icon"></i>
                                                {" "}
                                                {props.intl.formatMessage(messages['visitHeader'], {
                                                    count: visit.patients.length
                                                })}
                                            </div>
                                        </div>
                                        <div className="extra content">
                                            <div>updated &nbsp; &rarr; {props.intl.formatRelative(visit.updatedAt)}</div>
                                            <div>created &nbsp; &rarr; {props.intl.formatRelative(visit.createdAt)}</div>
                                        </div>
                                        <NavLink
                                            href={visitLink}
                                            className="ui bottom attached button">
                                            <i className="level up icon"></i>
                                            {formatMessage(messages.handleVisit)}
                                        </NavLink>
                                    </div>

                                </div> {/** == end .ui.stackable.cards == **/}
                            </div>
                        </div>
                    );
                });
            }

            /*
             * No visits at this point in time (list.length === 0)
             */
            else {

                listDOM = (
                    <div className="basic ui segment">
                        <MessageScaffold
                            type="info"
                            header={formatMessage(messages.emptyList)}
                            icon="" />
                    </div>
                );

            }

        }



        return (
            <div id="FORCEPT-FlexGrouper">
                <h1 className="ui top attached header">
                    <i className="hospital icon"></i>
                    <div className="content">
                        {stage.name}
                        {" "} &mdash; {" "}
                        {Array.isArray(list)
                            ? formatMessage(messages.stageHeader, { count: list.length })
                            : (<i className="fitted notched circle loading icon"></i>)}
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
    [StageStore, VisitStore, "RouteStore"],
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
            list:  visitStore.getList(),
            isNavigateComplete: routeStore.isNavigateComplete()
        };
    }
);

export default injectIntl(VisitList);
