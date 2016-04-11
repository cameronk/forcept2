/**
 * forcept - components/Meta/Horizon
 * @author Azuru Technology
 */

import React from 'react';
import debug from 'debug';
import $ from 'jquery';

import BaseComponent from '../Base';

const __debug = debug('forcept:components:Meta:Horizon');

if(process.env.BROWSER) {
    require('../../styles/Horizon.less');
}

class Horizon extends BaseComponent {

    constructor(props) {
        super(props);
    }

    /**
     *
     */
    componentDidMount() {
        this.componentDidUpdate();
    }

    /**
     *
     */
    componentDidUpdate() {
        // var elem = document.getElementById("Horizon");
        // if(elem.offsetWidth < elem.scrollWidth) {
        //
        // }
    }

    render() {
        return (
            <div id="Horizon" className="attached ui stackable menu">
                {this.props.children}
            </div>
        );

    }

}

export default Horizon;
