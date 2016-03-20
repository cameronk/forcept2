/**
 * forcept - components/Meta/HeaderBar.jsx
 * @author Azuru Technology
 */

import React from 'react';
import routes from '../../flux/Route/Routes';
import BaseComponent, { grabContext } from '../Base';
import { defineMessages, injectIntl } from 'react-intl';

if(process.env.BROWSER) {
    require('../../styles/HeaderBar.less');
}

class HeaderBar extends BaseComponent {

    static contextTypes = grabContext()

    render() {

        let { formatMessage } = this.props.intl;

        var ctx = this.context;

        return (
            <div id="HeaderBar">
                <div className="ui huge dividing header">
                    Heading
                </div>
            </div>
        );
    }
}

export default injectIntl(HeaderBar);
