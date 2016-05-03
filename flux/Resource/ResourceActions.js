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

/**
 *
 */
export function UpdateStateAction(context, payload, done) {
    context.dispatch(Actions.RESOURCES_UPDATE_STATE, payload);
    done();
}

/**
 *
 */
export function UploadResourcesAction(context, { fieldID, stageID, patientID }, done) {
    context.dispatch(Actions.RESOURCES_SET_UPLOAD_CONTEXT, fieldID);

    var resourceStore = context.getStore(ResourceStore);
    var cachedResources = resourceStore.getState();

    if(    cachedResources.hasOwnProperty(fieldID)
        && cachedResources[fieldID].hasOwnProperty(patientID)
        && cachedResources[fieldID][patientID].hasOwnProperty('cache')
        && cachedResources[fieldID][patientID].cache.length > 0) {

        var promises = [];

        (cachedResources[fieldID][patientID].cache).map(resource => {

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
             * Nullify upload state for this fieldID/patientID
             */
            context.dispatch(Actions.RESOURCES_UPDATE_STATE, {
                [fieldID]: {
                    [patientID]: null
                }
            })

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

    } else done();

}
