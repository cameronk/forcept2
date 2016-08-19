/**
 * forcept - components/Fields/Text.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent, { grabContext } from '../Base';
import debug from 'debug';
import range from 'lodash/range';
import rangeRight from 'lodash/rangeRight';

import Label from './Label';
import { BuildDOMClass } from '../../utils/CSSClassHelper';
import { UpdatePatientAction } from '../../flux/Patient/PatientActions';

const __debug = debug('forcept:components:Fields:TeethScreener');

if(process.env.BROWSER) {
    require('../../styles/fields/TeethScreener.less');
}

/*
 *
 *
 * { [quadrant]: { tooth: ["option"], tooth2: ["option1", "option2"] }}
 */
class TeethScreenerField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor(props) {
        super(props);

        var { settings } = props.field;
        this.colorMap = {};

        if(settings.hasOwnProperty("options")) {
            for(var optionKey in settings.options) {

                let thisOption = settings.options[optionKey];
                if(thisOption.hasOwnProperty("color") && thisOption.color && thisOption.color.length > 0) {
                    this.colorMap[thisOption.value] = thisOption.color;
                }

            }
        }
    }

    /**
     *
     */
    componentDidMount = () => {
        $("#FORCEPT-Field-TeethScreener .teeth > .ui.dropdown").dropdown({
            action: "nothing"
        });
    }

    /**
     *
     */
    _change = (quadrant, number, option, state) => {
        return (evt) => {

            var { patientID, stageID, fieldID, field, value } = this.props;
            var allowMultiple = (field.settings.multiple || false);

            __debug("#%s-%s -> %s = %s", quadrant, number, option, state);
            __debug(typeof value);

            /*
             * Create the quadrant if necessary.
             */
            if(!value.hasOwnProperty(quadrant)) {
                value[quadrant] = {};
            }

            /*
             * Create the number if necessary.
             */
            if(!value[quadrant].hasOwnProperty(number)) {
                value[quadrant][number] = [];
            }


            /*
             * State === 1 ---> check the option
             */
            if(state === 1) {

                /*
                 * If we don't allow  multiple selections, clear the array
                 * before pushing.
                 */
                if(!allowMultiple && value[quadrant][number].length !== 0) {
                    value[quadrant][number] = [ option ];
                }

                /*
                 * Only push the value if it doesn't yet exist
                 */
                else if(value[quadrant][number].indexOf(option) === -1) {
                    value[quadrant][number].push(option);
                }

            }

            /*
             * State === 0 ---> uncheck the option
             */
            else if(state === 0) {

                var optIndex = value[quadrant][number].indexOf(option);

                /*
                 * Only remove the value if it already exists
                 */
                if(optIndex !== -1) {
                    value[quadrant][number].splice(optIndex, 1);
                }

                /*
                 * Check if our array is empty now and remove the quadrant if so.
                 */
                if(value[quadrant][number].length === 0) {
                    delete value[quadrant][number];
                }

                /*
                 * Check if our quadrant is empty now that we've removed a number.
                 */
                if(Object.keys(value[quadrant]).length === 0) {
                    delete value[quadrant];
                }

            }

            __debug("Value before push: %j", value);

            this.context.executeAction(UpdatePatientAction, {
                [patientID]: {
                    [stageID]: {
                        [fieldID]: value
                    }
                }
            });

        }
    }

    /**
     *
     */
    isToothAvailable = (quadrant, number) => {

        var { value } = this.props;

        if(!value.hasOwnProperty(quadrant)) return false;
        if(!value[quadrant].hasOwnProperty(number)) return false;

        return true;
    }

    /**
     *
     */
    doesToothHaveSelections = (quadrant, number) => {

        var { value } = this.props;

        if(this.isToothAvailable(quadrant, number)) {
            return value[quadrant][number].length > 0;
        } else return false;

    }

    /**
     *
     */
    isOptionSelected = (quadrant, number, option) => {

        var { value } = this.props;

        if(this.isToothAvailable(quadrant, number)) {
            return value[quadrant][number].indexOf(option) !== -1;
        } else return false;

    }

    /**
     *
     */
    buildOptions = (quadrant, number) => {

        var { settings } = this.props.field,
            allowMultiple = settings.hasOwnProperty("multiple") ? settings.multiple : false;

        if(settings.hasOwnProperty("options")) {
            return Object.keys(settings.options).map((optionKey, index) => {

                var thisOption = settings.options[optionKey];
                var isSelected = this.isOptionSelected(quadrant, number, thisOption.value);

                if(thisOption.value && thisOption.value.length > 0) {
                    return (
                        <div className="item" key={index} onClick={this._change(quadrant, number, thisOption.value, isSelected ? 0 : 1)}>
                            {(() => {
                                if(allowMultiple) {
                                    if(isSelected) {
                                        return (
                                            <i className="checkmark box icon"></i>
                                        );
                                    } else {
                                        return (
                                            <i className="square outline icon"></i>
                                        )
                                    }
                                } else {
                                    if(isSelected) {
                                        return (
                                            <i className="selected radio icon"></i>
                                        );
                                    } else {
                                        return (
                                            <i className="radio icon"></i>
                                        )
                                    }
                                }
                            })()}
                            {thisOption.value}
                        </div>
                    );
                };
            });
        } else {
            return (
                <div className="item">
                    <em>No options defined.</em>
                </div>
            );
        }
    }

    /*
     *
     */
    buildTeeth = ({ quadrant }) => {

        var { value } = this.props,
            arr = range(1, 9),
            toothSpacing = 20,
            isLeft     = quadrant == 1 || quadrant == 4,
            isRight    = quadrant == 2 || quadrant == 3,
            upsideDown = quadrant == 3 || quadrant == 4;

        return (
            <div className={BuildDOMClass("teeth", { left: isLeft, right: isRight })}>
                {arr.map((number, index) => {

                    let angle = (Math.PI * index) / (2 * 7);
                    let isSelected = this.doesToothHaveSelections(quadrant, number);

                    let margin = toothSpacing * (1 + index) * Math.pow(Math.sin(angle), 2);
                        margin = upsideDown ? ((20 * 8) - margin) : margin;

                    var backgroundColor = false;

                    if(isSelected) {
                        var i = 0, theseSelections = value[quadrant][number];
                        while(backgroundColor === false && i < theseSelections.length) {
                            let thisSelection = theseSelections[i];
                            backgroundColor = this.colorMap.hasOwnProperty(thisSelection) ? "#" + this.colorMap[thisSelection] : false;
                            i++;
                        }
                    }

                    return (
                        <div className={BuildDOMClass("ui floating dropdown tooth-" + number)}
                            data-selected={isSelected}
                            style={{
                                marginTop: margin,
                                backgroundColor: backgroundColor
                            }} key={number}>
                            {number}
                            <div className="menu">
                                <div className="header">
                                    <i className="tag icon"></i>
                                    {quadrant}-{number}
                                </div>
                                <div className="divider"></div>
                                {this.buildOptions(quadrant, number)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );

    }

    /**
     *
     */
    render() {

        var props = this.props,
            { field, value } = props;

        return (
            <div className="field" id="FORCEPT-Field-TeethScreener">
                <Label field={field} />
                <div className="quadrants">
                    <div className="row">
                        <div className="quadrant quad-1">
                            {this.buildTeeth({
                                quadrant: 1
                            })}
                            <span className="number">1</span>
                        </div>
                        <div className="quadrant quad-2">
                            {this.buildTeeth({
                                quadrant: 2
                            })}
                            <span className="number">2</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="quadrant quad-4">
                            {this.buildTeeth({
                                quadrant: 3
                            })}
                            <span className="number">4</span>
                        </div>
                        <div className="quadrant quad-3">
                            {this.buildTeeth({
                                quadrant: 4
                            })}
                            <span className="number">3</span>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default TeethScreenerField;
