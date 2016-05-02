/**
 * forcept - flux/Resource/ResourceActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';

import Actions from '../actions';
import { UpdatePatientAction } from '../Patient/PatientActions';
import ResourceStore from './ResourceStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Resource:ResourceActions');

/*
 * Update the Resource cache via payload.
 */
export function UpdateCacheAction(context, payload, done) {
    context.dispatch(Actions.RESOURCES_UPDATE_CACHE, payload);
    done();
}

/**
 *
 */
export function ProcessResourcesAction(context, payload, done) {
    context.dispatch(Actions.RESOURCES_PROCESS_FIELD, payload);
}

/**
 *
 */
export function UploadResourcesAction(context, { fieldID, stageID, patientID }, done) {
    context.dispatch(Actions.RESOURCES_SET_UPLOAD_CONTEXT, fieldID);

    var resourceStore = context.getStore(ResourceStore);
    var cachedResources = resourceStore.getCache();

    if(cachedResources.hasOwnProperty(fieldID)) {

        var promises = [];

        cachedResources[fieldID].map(resource => {

            var typeVSdata = resource.split(";");
            var type = typeVSdata[0].split(":")[1];
            var data = typeVSdata[1].split(",")[1];

            __debug("Saving %s (length: %s)", type, data.length);

            /*
             *
             */
            promises.push(
                context.service
                    .create('ResourceService')
                    .body({
                        type: type,
                        data: data
                    }).end()
                    .then(resp => resp.data)
            );

        });

        Promise.all(promises).then(resources => {
            __debug("Saved %s resource(s)", resources.length);

            /*
             * Nullify upload context
             */
            context.dispatch(Actions.RESOURCES_SET_UPLOAD_CONTEXT, null);

            /*
             * Delete the resources we just uploaded from the cache.
             */
            context.executeAction(UpdateCacheAction, {
                [fieldID]: null
            }, () => {

                /*
                 * Update patient with the resource objects returned from ResourceService
                 */
                context.executeAction(UpdatePatientAction, {
                    [patientID]: {
                        [stageID]: {
                            [fieldID]: resources
                        }
                    }
                }, () => {
                    done();
                });

            });

        });

    } else done();

}
