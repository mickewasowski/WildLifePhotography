const {JWT_TOKEN_NAME, JWT_SECRET} = require('../constants');
const {verify} = require('../utils/jwtUtils');

exports.auth = function(req, res, next){
    let cookie = req.cookies[JWT_TOKEN_NAME];

    if (cookie) {
        verify(cookie, JWT_SECRET)
        .then(decoded => {

            req.user = decoded;

            res.locals.user = decoded;

            next();
        })
        .catch(err => {
            res.clearCookie(JWT_TOKEN_NAME);
            return res.status(401).redirect('user/login');
        });
    }else{
        next();
    }
};

exports.isAuth = function(req, res, next) {

    if (!req.user) {
        return res.status(401).redirect('/user/login');
    }

    next();
}

exports.isNotAuth = function(req, res, next){
    
    if (req.user) {
        return res.status(400).redirect('/');
    }

    next();
}