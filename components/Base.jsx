/**
 * forcept - components/Base.js
 * @author Azuru Technology
 */

import { Component, PropTypes } from 'react';

export function grabContext(types) {

    var using = {};
    var available = {
        getStore        : PropTypes.func.isRequired,
        executeAction   : PropTypes.func.isRequired,
        getRequest      : PropTypes.func.isRequired,
        isAuthenticated : PropTypes.func.isRequired,
        getUser         : PropTypes.func.isRequired,
    };

    if(types.length === 1 && types[0] === "*") {
        return available;
    }

    types.map((type) => {
        if(type in available) {
            using[type] = available[type];
        }
    });

    return using;
};

export default class BaseComponent extends Component {
    autobind(methods) {
        methods.map(method => {
            this[method] = this[method].bind(this);
        });
    }
}
