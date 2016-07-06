/**
 *
 *
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';

const __debug = debug('forcept:components:Visit:Importer');

class Importer extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    componentDidMount = () => {
        // this.context.executeA
        $("#FORCEPT-Dropdown-ImporterContext").dropdown();
    }

    render() {

        var props = this.props,
            { isLoading } = props;

        return (
            <div id="FORCEPT-Visit-Importer">
                <div className="large top attached ui header">
                    <i className="search icon"></i>
                    <div className="content">Import a patient</div>
                </div>
                <div className="bottom attached ui segment">
                    <div className="ui action right action left icon input">
                        <i className="search icon"></i>
                        <input type="text" placeholder="Search..." />
                        <select className="ui compact selection dropdown" id="FORCEPT-Dropdown-ImporterContext">
                            <option value="name">by Name</option>
                        </select>
                        <div type="submit" className="ui button">Search</div>
                    </div>
                </div>
            </div>
        );

    }

}

export default Importer;
