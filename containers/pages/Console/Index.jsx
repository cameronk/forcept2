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
import Horizon  from '../../../components/Meta/Horizon';

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
            <div>
                <h1 className="ui top attached header">
                    <i className="hospital icon"></i>
                    <div className="content">
                        Test
                    </div>
                </h1>
                <Horizon>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item active">
                    Section 2
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                    <a className="item">
                    Section 1
                    </a>
                </Horizon>
                <div className="ui attached segment">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                </div>
            </div>
        );
    }
}

export default injectIntl(Index);
