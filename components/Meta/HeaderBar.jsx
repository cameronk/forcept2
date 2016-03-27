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
                {this.props.message ? (
                    <div className="ui huge dividing header">
                        {formatMessage(this.props.message)}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default injectIntl(HeaderBar);
