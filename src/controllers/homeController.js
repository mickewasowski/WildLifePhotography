const router = require('express').Router();

const home =  (req, res) => {
    res.render('index');
};


router.get('/', home);



module.exports = router;