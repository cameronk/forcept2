/**
* forcept - containers/pages/Console/Index.jsx
* @author Azuru Technology
*/

import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';

import AuthStore        from '../../../flux/Auth/AuthStore';
import PatientStore     from '../../../flux/Patient/PatientStore';
import StageStore       from '../../../flux/Stage/StageStore';
import VisitStore       from '../../../flux/Visit/VisitStore';
import ResourceStore    from '../../../flux/Resource/ResourceStore';
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

    componentDidMount() {
        $("#Horizon .ui.dropdown").dropdown();
    }

    render() {
        var props = this.props;

        return (
            <div className="ui basic segment">
                <h1 className="ui header">
                    Welcome to the FORCEPT console.
                    <div className="sub header">
                        Use the links in the sidebar to edit stages, users, and more.
                    </div>
                </h1>
                <h4 className="ui header">
                    FORCEPT v2.0.0. Contact ckelley@azurutechnology.com for information or assistance.
                    <div className="sub header">
                        Copyright &copy; Azuru Technology LLC 2016. All rights reserved.
                    </div>
                </h4>
            </div>
        );
    }
}
export default injectIntl(Index);
