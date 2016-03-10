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
    },
    login: {
        path: '/login',
        method: 'get',
        page: 'login',
        handler: require('../containers/pages/Login'),
        title: 'Login | Forcept'
    }
};
