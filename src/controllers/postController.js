const router = require('express').Router();
const {isAuth, isNotAuth} = require('../middlewares/authMiddleware');
const postService = require('../services/postService');
const userService = require('../services/userService');

const {isCreator, isOwner, hasVoted, isAllowedToVote, isNotOwnerAndNotVoted} = require('../middlewares/postMiddleware');
const {errorHandlerUponCreateOrUpdate} = require('../middlewares/errorHandler');

router.get('/all', async (req, res) => {
   let posts = await postService.getAllPosts();
   
   res.render('post/all', {posts});
});

router.get('/:postId/details', isCreator, hasVoted, async (req,res) => {
   let postId = req.params.postId;
   
   let post = await postService.getPostById(postId);
   
   res.render('post/details', {...post});
});


router.get('/:postId/voteUp', isNotOwnerAndNotVoted,  async (req, res) =>{ 
   
      await postService.voteUp(req.user._id, req.params.postId);

      res.redirect(`/post/${req.params.postId}/details`);
   
});

router.get('/:postId/voteDown', isNotOwnerAndNotVoted, async (req, res) =>{
   await postService.voteDown(req.user._id, req.params.postId);

   res.redirect(`/post/${req.params.postId}/details`);
});

router.get('/:postId/edit', isOwner, async (req, res) => {
   let post = await postService.getPostById(req.params.postId);

   res.render('post/edit', {...post})
});

router.post('/:postId/edit', isOwner, async (req, res) => {

      try {
         let {title, keyword, location, dateOfCreation, image, description} = req.body;

         await postService.updatePost(req.params.postId, {title, keyword, location, dateOfCreation, image, description});
         
         res.redirect('/');
   } catch (error) {
         res.render('post/edit', {error: errorHandlerUponCreateOrUpdate(error), ...req.body});
   }
});

router.get('/:postId/delete', isOwner, async (req, res) => {
   await postService.deletePost(req.params.postId);

   res.redirect('/post/all');
})


router.get('/create', isAuth, (req,res) => {
   res.render('post/create');
});

router.post('/create', isAuth, async (req, res) => {

   try {
      let userId = req.user._id;

      let {title, keyword, location, dateOfCreation, image, description} = req.body;

      let post = await postService.create(title, keyword, location, dateOfCreation, image, description, userId);

      await userService.addPostToCollection(post._id, req.user.email);

      res.redirect('/');

   } catch (error) {
      res.status(400).render('post/create', { error: error.message });
   }
   
});



router.get('/mine', isAuth, async (req,res) => {
   let userDetails = await userService.getUserInfoWithPosts(req.user._id);
   let posts = userDetails.myPosts;

   res.render('post/mine', {posts});
});

module.exports = router;