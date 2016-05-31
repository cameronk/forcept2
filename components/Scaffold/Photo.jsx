/**
 * forcept - components/Scaffold/Photo.jsx
 * @author Azuru Technology
 */

import React, { PropTypes } from 'react';
import BaseComponent from '../Base';

class PhotoScaffold extends BaseComponent {

    /*
    componentDidMount() {
        var container = document.getElementById(this.props.id);

        var image = new Image();
            image.addEventListener("load", () => {
                container.appendChild(image);
            });
            image.addEventListener("error", () => {
                var error = document.createElement("DIV");
                    error.innerHtml = "Failed to load image.";
                container.appendChild(error);
            });
            image.src = this.props.src;
    }
    */

    render() {
            // <div id={props.id}></div>
        var props = this.props;
        return (
            <img src={props.src} id={props.id} />
        );
    }
}

export default PhotoScaffold;
