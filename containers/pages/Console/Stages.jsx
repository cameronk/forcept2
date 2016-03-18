/**
 * forcept - containers/pages/Console/Stages.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../../flux/Auth/AuthStore';
import { LoginAction, CredentialChangeAction }  from '../../../flux/Auth/AuthActions';
import BaseComponent    from '../../../components/Base';
import HeaderBar        from '../../../components/Meta/HeaderBar';

const messages = defineMessages({
});

class Stages extends BaseComponent {

    static contextTypes = {
        getStore:       PropTypes.func.isRequired,
        executeAction:  PropTypes.func.isRequired,
        getRequest:     PropTypes.func.isRequired
    }

    constructor() {
        super();
    }

    render() {
        var props = this.props;

        return (
            <div className="ui stackable centered grid">
                <div className="row">
                    <div className="sixteen wide column">
                        <HeaderBar />
                    </div>
                </div>
                <div className="row">
                    <div className="three wide computer four wide tablet column">
                        <div className="ui vertical fluid tabular menu">
                            <a className="active item">Test</a>
                            <a className="item">Test</a>
                            <a className="item">Test</a>
                            <a className="item">Test</a>
                            <a className="item">Test</a>
                        </div>
                    </div>
                    <div className="thirteen wide computer twelve wide tablet column">
                        asdf
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(Stages);
