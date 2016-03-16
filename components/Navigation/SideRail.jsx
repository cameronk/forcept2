/**
 * forcept - components/Navigation/SideRail.jsx
 * @author Azuru Technology
 */

import React from 'react';
import BaseComponent from '../Base';
import VerticalMenu from './VerticalMenu';

class SideRail extends BaseComponent {

    componentDidMount() {
        $("#SideRail")
            .sticky({
                context: $(".toc")
            });
    }

    render() {
        return (
            <VerticalMenu id="SideRail" className="sticky fixed top" />
        );
    }
}

export default SideRail;
