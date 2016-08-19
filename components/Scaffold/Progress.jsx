/**
 * forcept - components/Scaffold/Progress.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';
import { omit } from "lodash";

/**
 *
 */
class ProgressScaffold extends BaseComponent {

    componentDidMount() {

        var { props } = this,
            node = $("#progress-" + props.id);

        node.progress({
            autoSuccess: false
        });

    }

    render() {
        var props = this.props;
        var classes = ["ui progress", (props.className || "")];
        return (
            <div id={"progress-" + props.id}
                data-percent={props.percent || null}
                className={classes.join(" ")}
                {...omit(props, ["className", "id"])}>
                <div className="bar"></div>
                {(() => {
                    if(props.label) {
                        return (
                            <div className="label">{props.label}</div>
                        );
                    }
                })()}
            </div>
        );
    }
}

export default ProgressScaffold;
