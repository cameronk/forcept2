import Actions from '../configs/actions';

export default function TestAction(actionContext, payload, done) {
    actionContext.dispatch(Actions.TEST_ACTION, "lol");
}
