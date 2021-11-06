const router = require('express').Router();
const userService = require('../services/userService');

const {isAuth, isNotAuth} = require('../middlewares/authMiddleware');

const {JWT_TOKEN_NAME} = require('../constants');
const {errorHandlerUponCreateOrUpdate} = require('../middlewares/errorHandler');

const getRegister = (req,res) => {
    res.render('user/register');
}

const postRegister = async (req,res) => {

    try {
        let {firstName, lastName, email, password, repeatPassword} = req.body;
        
        await userService.register(firstName, lastName, email, password, repeatPassword);

        let user = await userService.login(email, password);  

        let token = await userService.createToken(user);

        res.cookie(JWT_TOKEN_NAME, token, {
            httpOnly: true,
        });

        res.redirect('/');

    } catch (error) {
        console.log(error);
        //let message = errorHandlerUponCreateOrUpdate(error);

        res.status(400).render('user/register', { error: error.message });
    }

}


const getLogin = (req,res) => {
    res.render('user/login');
}

const postLogin = async (req, res) => {

    try {
        let {email, password} = req.body;

        let user = await userService.login(email, password);  

        let token = await userService.createToken(user);

        res.cookie(JWT_TOKEN_NAME, token, {
            httpOnly: true,
        });

        res.redirect('/');

    }catch (error) {
        console.log(error);

        res.status(400).render('user/login', { error: error.message });
    }

}

const getLogout = (req, res) => {
    res.clearCookie(JWT_TOKEN_NAME);

    res.redirect('/');
};

router.get('/register', isNotAuth, getRegister);
router.post('/register', isNotAuth, postRegister);

router.get('/login', isNotAuth, getLogin);
router.post('/login', isNotAuth, postLogin);

router.get('/logout', isAuth, getLogout);

module.exports = router;