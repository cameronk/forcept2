/**
 * forcept - flux/Resource/ResourceActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
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
export function UploadResourcesAction(context, fieldID, done) {
    context.dispatch(Actions.RESOURCES_SET_UPLOAD_CONTEXT, fieldID);

    var resourceStore = context.getStore(ResourceStore);
    var cachedResources = resourceStore.getCache();

    if(cachedResources.hasOwnProperty(fieldID)) {

        cachedResources[fieldID].map(resource => {

            var typeVSdata = resource.split(";");
            var type = typeVSdata[0].split(":")[1];
            var data = typeVSdata[1].split(",")[1];

            __debug("Saving %s -> %s", type, data.length);

            /*
             *
             */
            context.service
                .create('ResourceService')
                .body({
                    type: type,
                    data: data
                }).end()
                .then(resource => {
                    
                });

        });

    }

}
