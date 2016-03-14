/**
 * forcept - components/Navigation/SideBar.jsx
 * @author Azuru Technology
 */

import React from 'react';
import BaseComponent from '../Base';
import VerticalMenu from './VerticalMenu';

class SideBar extends BaseComponent {

    componentDidMount() {
        $("#SideBar")
            .sticky({
                context: $(".toc")
            });
    }

    render() {
        return (
            <VerticalMenu id="SideBar" className="sidebar left overlay" />
        );
    }
}

export default SideBar;
