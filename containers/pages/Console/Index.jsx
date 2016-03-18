/**
 * forcept - containers/pages/Console/Index.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../../flux/Auth/AuthStore';
import { LoginAction, CredentialChangeAction }  from '../../../flux/Auth/AuthActions';
import BaseComponent    from '../../../components/Base';

const messages = defineMessages({
});

class Index extends BaseComponent {

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
            <div className="ui stackable one column centered grid">
                <div className="three wide computer four wide tablet column">
                    <div className="ui center aligned raised attached blue segment">
                        Console
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(Index);
