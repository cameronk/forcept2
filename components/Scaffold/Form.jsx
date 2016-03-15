/**
 * forcept - components/Scaffold/Form.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import InputScaffold from './Input';
import HeadingScaffold from './Heading';

class FormScaffold extends BaseComponent {

    render() {
        var { fields, heading } = this.props;
        return (
            <div className={["ui form", this.props.className || ""].join(" ")}>
                {heading ? (
                    <div>
                        <HeadingScaffold {...heading} />
                        <div className="ui divider"></div>
                    </div>
                ) : null}
                {Object.keys(fields).map((field, index) => {

                    var thisField = fields[field],
                        children;

                    if(typeof thisField !== "object") {
                        /// Manual override
                        children = thisField;
                    } else if(thisField.hasOwnProperty("children")) {
                        /// Loop through children and update child
                        children = Object.keys(thisField.children).map((input, inputIndex) => {
                            return <InputScaffold {...thisField.children[input]} />
                        });
                    } else if(thisField.hasOwnProperty("input")) {
                        /// Single child field
                        children = <InputScaffold {...thisField.input} />
                    }
                    return (
                        <div className="field">
                            {fields[field].label ? (
                                <label>{fields[field].label}</label>
                            ) : null}
                            {children}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default FormScaffold;
