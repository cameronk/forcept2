import Actions from '../configs/actions';

export default function TestAction(actionContext, payload, done) {
    actionContext.service
        .read('TestService')
        .end(function(err, data, meta) {
            actionContext.dispatch(Actions.TEST_ACTION, data);
        });
}
