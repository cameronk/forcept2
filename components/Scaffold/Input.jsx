/**
 * forcept - components/Scaffold/Input.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import ButtonScaffold from './Button';

class InputScaffold extends BaseComponent {

    render() {
        var thisInput = Object.assign({}, this.props),
            input, icon;

        switch(thisInput.type) {
            case "button":
                return <ButtonScaffold {...thisInput} />
                break;
            default:

                /// Add default placeholder
                if(!thisInput.hasOwnProperty("placeholder")) {
                    thisInput.placeholder = `Type your ${thisInput.name} here`;
                }

                /// Grab icon data manually
                if(thisInput.hasOwnProperty("icon")) {
                    icon = thisInput.icon;
                    delete thisInput.icon;
                }

                switch(thisInput.type) {
                    default:
                        input = (
                            <input {...thisInput} />
                        );
                        break;
                }

                break;
        }


        // TODO clean up this logic
        return (
            <div className={["ui input", (icon && icon.pos ? icon.pos : (icon ? "left" : "")), (icon ? "icon" : "")].join(" ")}>
                {(icon && icon.pos !== "right") ? (
                    <i className={icon.name + " icon"} />
                ) : null}
                {input}
                {(icon && icon.pos === "right") ? (
                    <i className={icon.name + " icon"} />
                ) : null}
            </div>
        );
    }
}

export default InputScaffold;
