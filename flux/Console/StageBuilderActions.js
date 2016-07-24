/**
 * forcept - flux/Console/StageBuilderActions
 * @author Azuru Technology
 */

import Actions from '../actions';
import StageStore from '../Stage/StageStore';
import debug from 'debug';

const __debug = debug('forcept:flux:Console:StageBuilderActions');

/*
 * Set the current option shift context.
 */
export function SetOptionShiftContext(context, payload, done) {
    context.dispatch(Actions.STAGES_SET_OPTION_SHIFT_CONTEXT, payload);
    done();
}

/*
 *
 */
export function SetFieldShiftContext(context, payload, done) {
    __debug("Setting field shift context to %s.", payload);
    context.dispatch(Actions.STAGES_SET_FIELD_SHIFT_CONTEXT, payload);
    done();
}

/*
 *
 */
export function ShiftFieldPositionAction(context, { after }, done) {

    var stageStore = context.getStore(StageStore),
        fieldBeingMoved = stageStore.getFieldShiftContext().field,
        cache = stageStore.getCache(),
        { fields } = cache,
        fieldKeys = Object.keys(fields);

    /// Remove fieldBeingMoved from fieldKeys temporarily
    let removalIndex = fieldKeys.indexOf(fieldBeingMoved);
    fieldKeys.splice(removalIndex, 1);

    /// Now find the insertion index and splice in the shifting field key.
    let insertionIndex = fieldKeys.indexOf(after);
    fieldKeys.splice(insertionIndex, 0, fieldBeingMoved);

    /// Gather items into object based on array order we just created.
    var newFields = {};

    for(var i = 0; i < fieldKeys.length; i++) {
        let thisKey = fieldKeys[i];
        newFields[thisKey] = fields[thisKey];
    }

    /// Hard overwrite the fields in our cache.
    context.dispatch(Actions.STAGES_HARDSET_CACHE_FIELDS, newFields);

    done();

}
