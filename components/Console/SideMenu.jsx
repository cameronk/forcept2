/**
 * forcept - components/Console/SideMenu.jsx
 * @author Azuru Technology
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import debug from 'debug';
import sortBy from 'lodash/sortBy';

import BaseComponent, { grabContext } from '../Base';
import NavLink from '../Navigation/NavLink';

const __debug = debug('forcept:components:Console:SideMenu');

class SideMenu extends BaseComponent {

    static contextTypes = grabContext()
    static propTypes = {
        collapse: React.PropTypes.number,
        orderBy: React.PropTypes.array
    }

    constructor() {
        super();
        this.state = {
            expanded: false
        };
    }

    render() {
        var props = this.props,
            { iterable, location, isNavigateComplete, basePath, context } = props;

        // Reorder the iterable if necessary.
        if(props.orderBy) {
            iterable = sortBy(iterable, props.orderBy);
        }

        __debug(iterable);

        // Now get the keys and count the total number of options.
        var iterableKeys = Object.keys(iterable),
            totalAvailableKeys = iterableKeys.length;

        // Collapse if necessary
        if(props.collapse && !this.state.expanded) {
            iterableKeys = iterableKeys.slice(0, props.collapse);
        }

        return (
            <div className="ui fluid secondary vertical pointing menu">
                {iterableKeys.map((iterableID, index) => {

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
                            <span className="ui basic label">
                                {index + 1}
                            </span>
                            {thisIterable.name.length > 0 ? thisIterable.name : "Untitled " + context}
                        </NavLink>
                    );
                })}
                {(() => {
                    if(props.collapse && iterableKeys.length <= totalAvailableKeys) {
                        if(!this.state.expanded) {
                            return (
                                <a onClick={() => this.setState({ expanded: true })}
                                    className={"item"}
                                    disabled={!isNavigateComplete}>
                                    <i className="expand icon"></i>
                                    ...see {totalAvailableKeys - props.collapse} more
                                </a>
                            );
                        } else {
                            return (
                                <a onClick={() => this.setState({ expanded: false })}
                                    className={"item"}
                                    disabled={!isNavigateComplete}>
                                    <i className="compress icon"></i>
                                    ...hide {totalAvailableKeys - props.collapse}
                                </a>
                            );
                        }
                    }
                })()}
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
