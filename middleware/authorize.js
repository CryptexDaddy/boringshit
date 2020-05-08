const { allowed_groups } = require('../configs/config');
const mongo_sanitize = require('mongo-sanitize');
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() || ['/user/login', '/user/signup'].includes(req.originalUrl)) {
        return next();
    } else {
        req.flash('error', `You must be logged in to access the ${req.originalUrl} page.`)
        return res.redirect('/user/login');
    }
}

function isAuthorized(req, res, next) {
    if (req.isAuthenticated() && allowed_groups.includes(req.user.group)) {
        return next();
    } else {
        return res.redirect('/');
    }
}

function isAuthorized_bool(req, res, next) {
    if (req.isAuthenticated() && allowed_groups.includes(req.user.group))
        req.app.locals.authorized = true;
    else req.app.locals.authorized = false;
    return next();
}

function sanitize_body(req, res, next) {
    req.body = mongo_sanitize(req.body);
    next();
}
module.exports.isAuthorized_bool = isAuthorized_bool;
module.exports.sanitize_body = sanitize_body;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isAuthorized = isAuthorized;