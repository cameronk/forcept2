/**
 * forcept - components/Console/Field.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import { BuildDOMClass } from '../../../utils/CSSClassHelper';
import StageStore from '../../../flux/Stage/StageStore';
import { UpdateCacheAction } from '../../../flux/Stage/StageActions';
import { SetOptionShiftContext } from '../../../flux/Console/StageBuilderActions';
import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Console:Setting:OptionList');

class OptionList extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount = () => {
        $("#FORCEPT-OptionsContainer .ui.dropdown").dropdown();
    }

    _setShiftContext = (option) => {
        return (evt) => {
            this.context.executeAction(SetOptionShiftContext, {
                field: this.props.field,
                option: option
            });
        }
    };

    _shift = (option) => {
        return (evt) => {

            __debug("Shifting option.");

            /// Get options.
            var shiftCtx = this.props.optionShiftContext;
                __debug("Context: field %s, option %s", shiftCtx.field, shiftCtx.option);
            var cache    = this.context.getStore(StageStore).getCache();
                __debug("Cache:");
                __debug(cache);
            var options  = cache.fields[shiftCtx.field].settings.options;
            // [shiftCtx.option]

            var newOptions = {};

            for(var k in options) {

                /*
                 * If this key is the one that was initially
                 * clicked, swap it for option passed to _shift
                 */
                if(k === shiftCtx.option) {
                    newOptions[option] = options[option];
                }

                else if(k === option) {
                    newOptions[shiftCtx.option] = options[shiftCtx.option];
                }

                else {
                    newOptions[k] = options[k];
                }

            }

            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: {
                            options: newOptions
                        }
                    }
                }
            });

            this.context.executeAction(SetOptionShiftContext, false);
        };
    };

    _updateOption = (key) => {
        return (evt) => {

            /// If no key provided, create an option with a default value.
            var val = key ? evt.target.value : '';
                key = key || new Date().getTime();

            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: {
                            options: {
                                [key]: {
                                    value: val
                                }
                            }
                        }
                    }
                }
            });
        };
    }

    _updateOptionColor = (key) => {
        return (evt) => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: {
                            options: {
                                [key]: {
                                    color: evt.target.value
                                }
                            }
                        }
                    }
                }
            });
        };
    }

    _deleteOption = (key) => {
        return (evt) => {
            this.context.executeAction(UpdateCacheAction, {
                fields: {
                    [this.props.field]: {
                        settings: {
                            options: {
                                [key]: null
                            }
                        }
                    }
                }
            });
        };
    };

    /*
     *
     */
    render() {

        var { props } = this,
            optionKeys = Object.keys(props.options),
            shifting = (props.optionShiftContext && props.optionShiftContext.field === props.field),
            optionsDOM, colorDOM;

        if(optionKeys.length > 0) {
            if(shifting) {
                optionsDOM = optionKeys.map((option, index) => {
                    let thisOption = props.options[option];
                    let disabled = option !== props.optionShiftContext.option;
                    return (
                        <div className="ui small right left action input" key={option}>
                            <button className="ui icon button"
                                onClick={this._shift(option)}>
                                <i className={(disabled ? "right chevron" : "sidebar") + " button icon"}></i>
                            </button>
                            <input type="text"
                                placeholder="Type an option value here"
                                value={thisOption.value}
                                disabled={disabled} />
                            <button className="ui red icon button" disabled={true}>
                                <i className="close icon"></i>
                            </button>
                        </div>
                    );
                });
            } else {
                optionsDOM = optionKeys.map((option, index) => {
                    let thisOption = props.options[option];
                    return (
                        <div className="ui small right left action input" key={option}>
                            <button className="ui icon button"
                                onClick={this._setShiftContext(option)}>
                                <i className="sidebar icon"></i>
                            </button>
                            <input type="text"
                                placeholder="Type an option value here"
                                value={thisOption.value}
                                onChange={this._updateOption(option)} />
                            {(() => {
                                if(props.colors) {
                                    // return (
                                    //     <div className="ui compact selection dropdown">
                                    //         <div className="text"><em>Pick a color</em></div>
                                    //         <i className="dropdown icon"></i>
                                    //         <div className="menu">
                                    //             <div className={BuildDOMClass("item", { "active selected": thisOption.color && thisOption.color === "DB2828" || false })} onClick={this._updateOptionColor(option, "DB2828")}>
                                    //                 <span className="ui mini red circular label"></span> Red
                                    //             </div>
                                    //         </div>
                                    //     </div>
                                    // )

                                    var color = thisOption.color || "";

                                    return (
                                        <select className="ui compact selection dropdown" value={color} onChange={this._updateOptionColor(option)}>
                                            <option value="">Pick a color</option>
                                            <option value="DB2828">Red</option>
                                        </select>
                                    )
                                }
                            })()}
                            <button className="ui red icon button" onClick={this._deleteOption(option)}>
                                <i className="close icon"></i>
                            </button>
                        </div>
                    );
                });
            }
        } else {
            optionsDOM = (
                <div className="ui blue message">
                    <div className="header">
                        No options defined.
                    </div>
                </div>
            );
        }

        return (
            <div id="FORCEPT-OptionsContainer">
                <div className="ui small dividing header">
                    Options ({optionKeys.length || 0})
                </div>
                {optionsDOM}
                <div className={"ui labeled icon button" + (shifting ? " disabled" : "")} disabled={shifting} onClick={this._updateOption()}>
                    <i className="plus icon"></i>
                    Add an option
                </div>
            </div>
        );

    }

}

/*
 * Get option shift context here
 * so we don't have to pass it through
 * like ten components
 */
OptionList = connectToStores(
    OptionList,
    [StageStore],
    function(context, props) {
        return {
            optionShiftContext: context.getStore(StageStore).getOptionShiftContext()
        };
    }
)

export default injectIntl(OptionList);
