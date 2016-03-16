/**
 * forcept - components/Scaffold/Form.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import InputScaffold from './Input';
import HeadingScaffold from './Heading';
import MessageScaffold from './Message';


/*
 * Create a new FormScaffold.
 *
 * @props
 *  - heading:
 *  - error:
 *  - fields:
 */
class FormScaffold extends BaseComponent {

    render() {
        var { onSubmit, fields, heading, error } = this.props;
        return (
            <form
                className={["ui form", this.props.className || null, error ? "error" : null].join(" ").trim()}
                onSubmit={onSubmit || function() {}}>
                {heading ? (
                    <div>
                        <HeadingScaffold {...heading} />
                        <div className="ui divider"></div>
                    </div>
                ) : null}
                {error ? (
                    <MessageScaffold type="error" text={error} />
                ) : null}
                {fields ? Object.keys(fields).map((field, index) => {

                    var thisField = fields[field],
                        children;

                    if(typeof thisField !== "object") {
                        /// Manual override
                        children = thisField;
                    } else if(thisField.hasOwnProperty("children")) {
                        /// Loop through children and update child
                        children = Object.keys(thisField.children).map((input, inputIndex) => {
                            return <InputScaffold {...thisField.children[input]} key={[index, field, inputIndex].join("-")}/>
                        });
                    } else if(thisField.hasOwnProperty("input")) {
                        /// Single child field
                        children = <InputScaffold {...thisField.input} />
                    }
                    return (
                        <div className="field" key={index + "-" + field}>
                            {fields[field].label ? (
                                <label>{fields[field].label}</label>
                            ) : null}
                            {children}
                        </div>
                    );
                }) : null}
            </form>
        );
    }
}

export default FormScaffold;
