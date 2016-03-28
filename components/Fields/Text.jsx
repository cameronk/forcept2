/**
 * forcept - components/Fields/Text.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';

import Label from './Label';

class TextField extends BaseComponent {

    render() {
        var props = this.props,
            { field } = props;

        return (
            <div className="field">
                <Label field={field} />
                <input
                    type="text"
                    autoComplete="off"
                    placeholder={field.name + " goes here"} />

            </div>
        );
    }
}

export default TextField;
