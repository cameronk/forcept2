/**
 *
 *
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

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
            isDisabled  = (!props.query || props.query.length === 0 || isSearching);

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
                            if(props.results) {

                                var resultKeys = Object.keys(props.results),
                                    isImportDisabled = (props.selected.length === 0);

                                return (
                                    <div className="bottom attached ui segment">
                                        <table className="ui compact celled definition table">
                                            <thead>
                                                <tr>
                                                    <th className="center aligned">Import</th>
                                                    {fieldKeys.map(fieldID => {
                                                        let thisField = fields[fieldID];
                                                        return (
                                                            <th key={fieldID}>
                                                                {thisField.name || "Untitled field"}
                                                            </th>
                                                        );
                                                    })}
                                                    <th>Visits</th>
                                                    <th>In visit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultKeys.map(patientID => {

                                                    var thisPatient = props.results[patientID];
                                                    var patientIsInVisit = !(thisPatient.currentVisit === null || thisPatient.currentVisit === "checkout")
                                                    var disableThisPatient = (props.disablePatientsInVisits && patientIsInVisit);

                                                    return (
                                                        <tr className={BuildDOMClass({
                                                            /// Disable the row if the disablePatientsInVisits flag is true
                                                            ///   AND the patient flowlocation is NOT checkout
                                                            disabled: disableThisPatient,
                                                            positive: (props.selected.indexOf(patientID) !== -1)
                                                        })} key={patientID}>

                                                            <td className="center aligned collapsing">
                                                                {disableThisPatient ? (
                                                                    <i className="minus icon"></i>
                                                                ) : (
                                                                    <div className="ui fitted slider checkbox">
                                                                        <input type="checkbox" onChange={this._selectPatient(patientID)}/> <label></label>
                                                                    </div>
                                                                )}
                                                            </td>

                                                            {fieldKeys.map(fieldID => {

                                                                var thisField = fields[fieldID];

                                                                if(ValueDefined(thisField.type, thisPatient[fieldID])) {
                                                                    return (
                                                                        <td key={fieldID}>
                                                                            <DataPoint
                                                                                value={thisPatient[fieldID]}
                                                                                field={{
                                                                                    name:  thisField.name,
                                                                                    type:  thisField.type,
                                                                                    settings: thisField.settings
                                                                                }} />
                                                                        </td>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <td key={fieldID} className="center aligned">
                                                                            <i className="minus icon"></i>
                                                                        </td>
                                                                    );
                                                                }

                                                            })}

                                                            <td>{thisPatient.visits.length || 0}</td>
                                                            <td className={patientIsInVisit ? "" : "positive"}>
                                                                {patientIsInVisit ? "Yes" : "No" }
                                                            </td>

                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="full-width">
                                                <tr>
                                                    <th></th>
                                                    <th colSpan={fieldKeys.length + 3}>
                                                        <div onClick={this._doImport}
                                                            className={BuildDOMClass("ui right floated small primary labeled icon button", { disabled: isImportDisabled })}>
                                                            <i className="download icon"></i>
                                                            {props.intl.formatMessage(messages.importX, {
                                                                count: props.selected.length
                                                            })}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                );
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
