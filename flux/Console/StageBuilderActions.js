/**
 * forcept - flux/Console/StageBuilderActions
 * @author Azuru Technology
 */

/*
 * Set the current option shift context.
 */
export function SetOptionShiftContext(context, payload, done) {
    context.dispatch(Actions.STAGES_SET_OPTION_SHIFT_CONTEXT, payload);
}
