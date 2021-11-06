const router = require('express').Router();

const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

router.use(homeController);
router.use('/user', userController);
router.use('/post', postController);



router.use('*', (req, res) => {
   res.status(404).render('404');
});

// router.use('/YOUR_ROUTE', YOUR_CONTROLLER_NAME);

// router.use('*', (req, res) => {
//     res.status(404).render('404');
// });

module.exports = router;
