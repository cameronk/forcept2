/**
 *
 */

import debug from 'debug';

import Actions from '../actions';
import SearchStore from './SearchStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Search:SearchActions');

/*
 *
 */
export function UpdateSearchContextAction(context, ctx, done) {
    context.dispatch(Actions.SEARCH_SET_CONTEXT, ctx);
    done();
}

/*
 *
 */
export function UpdateSearchQueryAction(context, query, done) {
    context.dispatch(Actions.SEARCH_SET_QUERY, query);
    done();
}

/*
 *
 */
export function UpdateSearchStatusAction(context, status, done) {
    __debug("Updating search status => %s", status);
    context.dispatch(Actions.SEARCH_SET_STATUS, status);
    done();
}

/*
 *
 */
export function UpdateSearchResultsAction(context, results, done) {
    __debug("Updating search results => %s", results);
    context.dispatch(Actions.SEARCH_SET_RESULTS, results);
    done();
}
/*
 *
 */
export function UpdateSearchSelectedAction(context, selection, done) {
    __debug("Updating selected patients...");
    context.dispatch(Actions.SEARCH_SET_SELECTED, selection);
    done();
}

/** ==================== **/

export function ResetRelativesAction(context, payload, done) {
    context.dispatch(Actions.SEARCH_RESET_RELATIVES);
    done();
}

export function ClearQueryDataAction(context, payload, done) {
    context.dispatch(Actions.SEARCH_CLEAR_QUERY);
    done();
}

/*
 *
 */
export function DoSearchAction(context, payload, done) {

    __debug("Running DoSearchAction");

    context.executeAction(ResetRelativesAction, null, () => {
        context.executeAction(UpdateSearchStatusAction, "searching", () => {
            let searchStore = context.getStore(SearchStore);
            context.service
                .read('SearchService')
                .params({
                    context: searchStore.getContext(),
                    query: searchStore.getQuery()
                }).end()
                .then(({ data }) => {

                    var results;

                    if(Object.keys(data).length > 0) {
                        results = data;
                    } else {
                        results = null;
                    }

                    context.executeAction(UpdateSearchResultsAction, results, () => {
                        context.executeAction(UpdateSearchStatusAction, "searched", () => {
                            done();
                        });
                    });

                });
        });
    });

}
