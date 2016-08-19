/**
 * forcept - components/Fields/Text.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';

class Label extends BaseComponent {

    render() {
        var props = this.props,
            { field } = props,
            description = (field.hasOwnProperty('description') && field.description.length > 0) ? (
                <span className="muted"> - {field.description}</span>
            ) : null;

        return (
            <label>{field.name || "Untitled field"}{description}</label>
        );
    }
}

export default Label;
