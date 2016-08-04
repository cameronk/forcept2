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
                    <title>FORCEPT</title>

                    {/** Viewport configuration **/}
                    <meta name="viewport" content="width=device-width, user-scalable=no" />

                    {/** Favicon links **/}
                    <link rel="apple-touch-icon" sizes="180x180" href="/public/favicon/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" href="/public/favicon/favicon-32x32.png" sizes="32x32" />
                    <link rel="icon" type="image/png" href="/public/favicon/favicon-16x16.png" sizes="16x16" />
                    <link rel="manifest" href="/public/favicon/manifest.json" />
                    <link rel="mask-icon" href="/public/favicon/safari-pinned-tab.svg" color="#5bbad5" />
                    <link rel="shortcut icon" href="/public/favicon/favicon.ico" />
                    <meta name="msapplication-config" content="/public/favicon/browserconfig.xml" />
                    <meta name="theme-color" content="#ffffff" />

                    {/** Link to asset in production **/}
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
