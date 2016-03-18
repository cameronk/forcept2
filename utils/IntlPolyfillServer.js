/**
 * forcept - utils/IntlPolyfillServer.js
 * @author Azuru Technology
 */

import { locales } from '../storage/config';
import areIntlLocalesSupported from 'intl-locales-supported';

if(!locales) {
    console.log("Forcept not yet configured. Please try 'npm run configure'");
    process.exit(1);
}

if(!global.Intl || !areIntlLocalesSupported(locales)) {
    require("intl");
}
