/**
 *
 *
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import chunk from 'lodash/chunk';

import BaseComponent, { grabContext } from '../Base';
import MessageScaffold from '../Scaffold/Message';
import DataPoint from './DataPoint';
import ValueDefined from '../../utils/ValueDefined';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdateSearchContextAction, UpdateSearchQueryAction, ClearSearchStoreAction,
    UpdateSearchStatusAction, UpdateSearchSelectedAction, DoSearchAction } from '../../flux/Search/SearchActions';
import SearchStore from '../../flux/Search/SearchStore';
import StageStore from '../../flux/Stage/StageStore';

const __debug = debug('forcept:components:Patient:Searcher');
const messages = defineMessages({
    importX: {
        id: "components.patient.searcher.importx",
        defaultMessage: `Import {count, plural,
            one {# patient}
            other {# patients}
        }`
    }
});

class Searcher extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount = () => {
        $("#FORCEPT-Dropdown-SearcherContext").dropdown();
    }

    _changeQuery = (evt) => {
        this.context.executeAction(UpdateSearchQueryAction, evt.target.value);
    }

    _doSearch = () => {
        this.context.executeAction(DoSearchAction);
    }

    _doImport = () => {

        var { selected, results } = this.props,
            imported = {};

        selected.map(patientID => {
            if(results.hasOwnProperty(patientID)) {
                imported[patientID] = results[patientID];
            }
        });

        this.props.onImport(imported);

    }

    _selectPatient = (patientID) => {
        return (evt) => {
            this.context.executeAction(UpdateSearchSelectedAction, {
                [patientID]: (evt.target.checked ? "add" : "del")
            });
        }
    }

    render() {

        var props = this.props,
            { stages } = props,
            exclude    = props.exclude || [],
            fields     = stages[Object.keys(stages)[0]].fields,
            fieldKeys  = Object.keys(fields),
            { status } = props,
            isSearching = status === "searching",
            isDisabled  = (!props.query || props.query.length === 0 || isSearching),
            isImportDisabled = (props.selected && props.selected.length === 0)

        /// Override status if passed in props
        if(props.loading) {
            status = "loading";
        }

        return (
            <div id="FORCEPT-Patient-Searcher">
                <div className="large top attached ui header">
                    <i className="search icon"></i>
                    <div className="content">Import a patient</div>
                </div>
                <div className={BuildDOMClass("attached ui segment")}>
                    <div className={BuildDOMClass("ui action right action left icon input", { "disabled loading": isSearching })}>
                        <i className="search icon"></i>
                        <input type="text"
                            className={BuildDOMClass({ disabled: isSearching })}
                            placeholder="Search..." value={props.query} onChange={this._changeQuery} />
                        <select className={BuildDOMClass("ui compact selection dropdown", { disabled: isSearching })}
                            id="FORCEPT-Dropdown-SearcherContext">
                            <option value="name">by Name</option>
                        </select>
                        <div type="submit" onClick={this._doSearch} className={BuildDOMClass("ui button", { disabled: isDisabled })} disabled={isDisabled}>Search</div>
                    </div>
                </div>
                {(() => {
                    switch(status) {
                        case "loading":
                        case "searching":
                            return (
                                <div className="ui basic bottom attached segment">
                                    <div className="ui basic loading segment"></div>
                                </div>
                            );
                            break;
                        case "searched":

                            __debug("Showing search results");
                            if(props.results) {

                                var resultKeys = Object.keys(props.results);

                                return (
                                    <div className="attached ui segment">
                                        {chunk(resultKeys, 3).map(patients => {
                                            return (
                                                <div className="ui three cards">
                                                    {patients.map(patientID => {

                                                        var thisPatient = props.results[patientID];
                                                        var patientIsInVisit = !(thisPatient.currentVisit === null || thisPatient.currentVisit === "checkout")
                                                        var disableThisPatient = (props.disablePatientsInVisits && patientIsInVisit);
                                                        var isSelected = (props.selected.indexOf(patientID) !== -1);

                                                        return (
                                                            <div key={patientID} className={BuildDOMClass("card", { teal: isSelected })}>
                                                                <div className="content">
                                                                    <div className="header">
                                                                        {thisPatient.firstName || ""} {thisPatient.lastName || ""}
                                                                    </div>
                                                                </div>
                                                                <div className="content">
                                                                    <h4 className="ui sub header">
                                                                        {thisPatient.visits.length || 0} prior visits
                                                                    </h4>
                                                                    <div className="description">
                                                                        <div className="ui list">
                                                                            {fieldKeys.map(fieldID => {

                                                                                var thisField = fields[fieldID];

                                                                                if(ValueDefined(thisField.type, thisPatient[fieldID])) {
                                                                                    return (
                                                                                        <div className="item">
                                                                                            <div className="header">{thisField.name}</div>
                                                                                            <div className="content">
                                                                                                <DataPoint
                                                                                                    value={thisPatient[fieldID]}
                                                                                                    field={{
                                                                                                        name:  thisField.name,
                                                                                                        type:  thisField.type,
                                                                                                        settings: thisField.settings
                                                                                                    }} />
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                }

                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="extra content">
                                                                    {disableThisPatient ? (
                                                                        <span>This patient <strong>cannot</strong> be imported</span>
                                                                    ) : [
                                                                        (
                                                                            <div className="right floated ui large fitted checkbox">
                                                                                <input type="checkbox" onChange={this._selectPatient(patientID)}/> <label></label>
                                                                            </div>
                                                                        ),
                                                                        (
                                                                            <span>{isSelected ? "This patient will be imported" : "Check the box to import this patient"}</span>
                                                                        )
                                                                    ]}
                                                                </div>
                                                            </div>
                                                        );

                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )

                            } else {
                                return (
                                    <div className="bottom attached ui segment">
                                        <MessageScaffold
                                            text="No results found." />
                                    </div>
                                );
                            }
                            break;
                    }
                })()}
                <div className="bottom attached ui segment">
                    <div onClick={this._doImport}
                        className={BuildDOMClass("ui small primary labeled icon button", { disabled: isImportDisabled })}>
                        <i className="download icon"></i>
                        {props.intl.formatMessage(messages.importX, {
                            count: props.selected.length
                        })}
                    </div>
                </div>
            </div>
        );

    }

}


Searcher = connectToStores(
    Searcher,
    [SearchStore],
    function(context, props) {

        let searchStore = context.getStore(SearchStore);
        let stageStore  = context.getStore(StageStore);

        return {
            context: searchStore.getContext(),
            query: searchStore.getQuery(),
            status: searchStore.getStatus(),
            results: searchStore.getResults(),
            selected: searchStore.getSelected(),
            stages: stageStore.getStages()
        };
    }
);

export default injectIntl(Searcher);
