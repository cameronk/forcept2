/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import MessageScaffold from '../Scaffold/Message';
import PieChart from './Chart/Pie';

const __debug = debug('forcept:components:Display:Render');

class RenderDisplay extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {

        var { props } = this,
            { display } = props;

        if(display.data === null || Object.keys(display.data).length === 0) {
            return (
                <MessageScaffold
                    header="No data available."
                    text="Use the refresh button below to load some." />
            );
        } else {
            switch(display.type) {
                case "pie chart":
                    return (
                        <PieChart
                            settings={display.settings}
                            data={display.data} />
                    );
                    break;
                default:
                    return (
                        <MessageScaffold
                            type="error"
                            header="An error occurred."
                            text="Unrecognized display type." />
                    );
                    break;
            }
        }

    }

}

export default RenderDisplay;
