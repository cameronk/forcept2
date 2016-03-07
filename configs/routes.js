/**
 * forcept - configs/routes.js
 * @author Azuru Technology
 */

export default {
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'Home',
        handler: require('../containers/pages/Home'),
    },
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        handler: require('../containers/pages/About'),
        title: 'About',
    }
};
