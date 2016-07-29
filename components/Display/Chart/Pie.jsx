/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../../Base';

const __debug = debug('forcept:components:Display:Chart:Pie');

class PieChart extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var { props } = this,
            { settings } = props;

        return (<div></div>);

    }

}

export default PieChart;
