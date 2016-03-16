/**
 * forcept - components/Base.js
 * @author Azuru Technology
 */

import React, { Component, PropTypes } from 'react';

/*
 * This must be exported separately because
 * we can't call it for static types inside
 * a react class that hasn't been instantiated.
 */
export function grabContext(types) {

    var using = {};
    var available = {
        getStore        : PropTypes.func.isRequired,
        executeAction   : PropTypes.func.isRequired,
        getRequest      : PropTypes.func.isRequired,
        isAuthenticated : PropTypes.func.isRequired,
        getUser         : PropTypes.func.isRequired,
    };

    if(!types || types.length === 0 || (types.length === 1 && types[0] === "*")) {
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

    /*
     * Autobind specified methods
     */
    autobind(methods) {
        methods.map(method => {
            this[method] = this[method].bind(this);
        });
    }

}
