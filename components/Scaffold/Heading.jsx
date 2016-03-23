/**
 * forcept - components/Scaffold/Heading.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';

class HeadingScaffold extends BaseComponent {

    render() {
        var props = this.props;
        return (
            <div className={"ui large header " + (props.className || "")}>
                {props.label ? (
                    <div className={"ui label " + (props.label.className || "")}>
                        {props.label.text}
                    </div>
                ) : null}
                {props.text}
            </div>
        );
    }
}

export default HeadingScaffold;
