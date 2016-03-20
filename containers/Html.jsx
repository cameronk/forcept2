/**
 * forcept - containers/Html.js
 * @author Azuru Technology
 */

import React from 'react';
import ApplicationStore from '../flux/App/AppStore';

class Html extends React.Component {
    render() {
        return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <title></title>
                    <meta name="viewport" content="width=device-width, user-scalable=no" />
                    {process.env.NODE_ENV === "production" ? (
                        <link rel="stylesheet" type="text/css" href={'/public/' + this.props.assets.css} />
                    ) : undefined}
                </head>
                <body>
                    <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                    <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                    <script src={'/public/' + this.props.assets.js}></script>
                </body>
            </html>
        );
    }
}

export default Html;
