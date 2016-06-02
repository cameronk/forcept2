/**
 *
 */

import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Display:DisplayGroupService');

export function LoadDisplayGroupsAction(context, payload, done) {
    context.service
        .read('DisplayGroupService')
        .params({}).end()
        .then(({ data }) => {
            context.dispatch(Actions.DISPLAY_GROUP_UPDATE, data);
        });
}
