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

class TeethScreenerField extends BaseComponent {

    static contextTypes = grabContext(['executeAction'])

    /**
     *
     */
    constructor() {
        super();
    }

    componentDidMount = () => {
        $("#FORCEPT-Field-TeethScreener .teeth > .ui.dropdown").dropdown();
    }

    /**
     *
     */
    _change = (evt) => {
        var { patientID, stageID, fieldID } = this.props;
        this.context.executeAction(UpdatePatientAction, {
            [patientID]: {
                [stageID]: {
                    [fieldID]: evt.target.value
                }
            }
        });
    }

    buildTeeth = ({ descending, pushLeft, upsideDown=false }) => {

        var arr, toothSpacing = 20;

        if(descending === true) {
            arr = rangeRight(1, 9);
        } else {
            arr = range(1, 9);
        }

        return (
            <div className="teeth">
                {arr.map((number, index) => {
                    let angle = (Math.PI * index) / (2 * 7);
                    let margin = pushLeft
                                    ? (toothSpacing * (8 - index) * Math.pow(Math.cos(angle), 2))
                                    : (toothSpacing * (1 + index) * Math.pow(Math.sin(angle), 2));

                    margin = upsideDown ? ((20 * 8) - margin) : margin;

                    __debug("#%s at %s (%s) has margin %s", number, index, angle, margin);

                    return (
                        <div className={"ui pointing dropdown tooth-" + number} style={{ marginTop: margin }} key={number}>
                            <div className="text">{number}</div>
                            <div className="menu">
                                <div className="item">Test</div>
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
                                descending: true,
                                pushLeft: true
                            })}
                            <span className="number">1</span>
                        </div>
                        <div className="quadrant quad-2">
                            {this.buildTeeth({
                                descending: false,
                                pushLeft: false
                            })}
                            <span className="number">2</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="quadrant quad-4">
                            {this.buildTeeth({
                                descending: true,
                                pushLeft: true,
                                upsideDown: true
                            })}
                            <span className="number">4</span>
                        </div>
                        <div className="quadrant quad-3">
                            {this.buildTeeth({
                                descending: false,
                                pushLeft: false,
                                upsideDown: true
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
