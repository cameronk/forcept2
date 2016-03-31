/**
 *
 *
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
import StageStore from '../Stage/StageStore';

const __debug = debug('forcept:flux:Visit:VisitActions');

/*
 *
 */
export function RedirectRootAction(context, payload, done) {

    var stages = context.getStore(StageStore).getStages();
        stages = keyBy(stages, 'id');

    var thisStage = stages[payload.params.stageID.split('-')[0]];
    if(thisStage && thisStage.isRoot) {
        __debug("Stage is root, redirecting");
        context.executeAction(navigateAction, {
            url: '/visits/' + thisStage.slug + '/new'
        }, () => {
            done();
        });
    } else {
        __debug("Stage is not root, skipping extra navigateAction");
        done();
    }

}

/*
 *
 */
export function GrabVisitAction(context, payload, done) {
    return context.service
        .read('VisitService')
        .params({
            where: {
                id: payload.id
            }
        }).end()
        .then(({data}) => {
            context.dispatch(Actions.VISIT_UPDATE_CACHE, data);
            return;
        });
}

/*
 * Update the stage cache via payload.
 */
export function UpdateCacheAction(context, payload, done) {
    // context.dispatch(Actions.VISIT_CACHE_MODIFIED);
    // context.dispatch(Actions.VISIT_UPDATE_CACHE, payload);
    done();
}

/**
 *
 */
export function SetCurrentTabAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_CURRENT_TAB, payload);
    done();
}


/**
 *
 */
export function CreatePatientAction(context, payload, done) {
    context.dispatch(Actions.APP_LOADING, true);
    context.service
        .create('PatientService')
        .end()
        .then(({data}) => {
            __debug("Patient created:");
            __debug(data);
            context.dispatch(Actions.APP_LOADING, false);
            context.dispatch(Actions.PATIENT_UPDATE, {
                [data.id]: data
            });
            context.dispatch(Actions.VISIT_SET_CURRENT_TAB, data.id);
            done();
        });
}
