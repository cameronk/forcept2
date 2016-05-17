/**
 *
 */

import debug from 'debug';
import Actions from '../actions';
import keyBy from 'lodash/keyBy';
import UserStore from './UserStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:User:UserActions');

/**
 *
 */
export function LoadUsersAction(context, payload, done) {
    context.service
        .read('UserService')
        .params({})
        .end().then(({data}) => {
            context.dispatch(Actions.USERS_UPDATE, keyBy(data, user => user.id));
            done();
        });
}


/**
 *
 */
export function CreateUserAction(context, payload, done) {
    context.service
        .create('UserService')
        .params({}).body({
            username: payload.username,
            password: payload.password
        })
        .end().then(({data}) => {
            context.dispatch(Actions.USERS_UPDATE, { [data.id] : data });
            done();
        });
}

/**
 *
 */
export function UpdateNurseryAction(context, payload, done) {
    context.dispatch(Actions.USERS_NURSERY_UPDATE, {
        key: payload.key,
        value: payload.value
    });
}
