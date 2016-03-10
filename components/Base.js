/**
 * forcept - components/Base.js
 * @author Azuru Technology
 */

import { Component } from 'react';

export default class BaseComponent extends Component {
    autobind() {
        let proto = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(proto).map((method) => {
            this[method] = this[method].bind(this);
        });
    }
}
