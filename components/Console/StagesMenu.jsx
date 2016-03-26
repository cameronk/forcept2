/**
 * forcept - components/Console/StagesMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import StageStore from '../../flux/Stage/StageStore';
import BaseComponent, { grabContext } from '../Base';
import NavLink from '../Navigation/NavLink';

const __debug = debug('forcept:components:Console:StagesMenu');

class StagesMenu extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {
        var props = this.props,
            { stages, location, isLoaded } = this.props;
        return (
            <div className="ui fluid secondary vertical pointing menu">
                {stages.map(thisStage => {
                    var isCurrent = thisStage.id == location;
                    return (
                        <NavLink
                            key={"console-open-stage-" + thisStage.id}
                            href={'/console/stages/' + thisStage.id}
                            className="item"
                            disabled={isCurrent || !isLoaded}>
                            {(isCurrent && props.isCacheModified) ? (
                                <div className="ui label">M</div>
                            ) : null}
                            {thisStage.name.length > 0 ? thisStage.name : "Untitled stage"}
                        </NavLink>
                    );
                })}
                <NavLink
                    href={'/console/stages'}
                    className={((0 == location) ? "active " : "") + " blue item"}
                    disabled={(0 == location || !isLoaded)}>
                    <i className="plus icon"></i>
                    Create a new stage
                </NavLink>
            </div>
        );
    }

}

StagesMenu = connectToStores(
    StagesMenu,
    [StageStore],
    function(context, props) {

        var location = 0;
        var stageStore = context.getStore(StageStore);
        var routeStore = context.getStore('RouteStore');

        var stages = stageStore.getStages();
        var params = routeStore.getCurrentRoute().params;

        if(params.stageID) {
            location = params.stageID;
        }

        return {
            location: location,
            error: stageStore.getError(),
            isCacheModified: stageStore.isCacheModified(),
            stages: stages,
            isLoaded: routeStore.isNavigateComplete()
        };
    }
)

export default injectIntl(StagesMenu);
