/**
 * forcept - components/Console/SideMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';

import BaseComponent, { grabContext } from '../Base';
import NavLink from '../Navigation/NavLink';

const __debug = debug('forcept:components:Console:SideMenu');

class SideMenu extends BaseComponent {

    static contextTypes = grabContext()

    constructor() {
        super();
    }

    render() {
        var props = this.props,
            { iterable, location, isNavigateComplete, basePath, context } = this.props;

        var iterableKeys = Object.keys(iterable);

        return (
            <div className="ui fluid secondary vertical pointing menu">
                {iterableKeys.map(iterableID => {

                    var thisIterable = iterable[iterableID];
                    var isCurrent = thisIterable.id == location;

                    return (
                        <NavLink
                            key={thisIterable.id}
                            href={basePath + '/' + thisIterable.id}
                            className="item"
                            disabled={isCurrent || !isNavigateComplete}>
                            {(isCurrent && props.isCacheModified) ? (
                                <div className="ui label">M</div>
                            ) : null}
                            {thisIterable.name.length > 0 ? thisIterable.name : "Untitled " + context}
                        </NavLink>
                    );
                })}
                <NavLink
                    href={basePath}
                    className={((0 == location) ? "active " : "") + " blue item"}
                    disabled={(0 == location || !isNavigateComplete)}>
                    <i className="plus icon"></i>
                    Create a new {context}
                </NavLink>
            </div>
        );
    }

}

export default injectIntl(SideMenu);
