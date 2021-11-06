const postService = require('../services/postService');


exports.isCreator = async function(req, res, next) {
    let post = await postService.getPostById(req.params.postId);

    if (req.user?._id == post.author._id) {
        res.locals.isCreator = true;
    }

    next();
}

exports.isOwner = async function(req, res, next) {
    let post = await postService.getPostById(req.params.postId);

    if (req.user?._id != post.author._id) {
        return res.redirect(`/post/${req.params.postId}/details`);
    }

    next();
}

exports.hasVoted = async function(req, res, next){
    let post = await postService.getPostById(req.params.postId);

    let userId = req.user?._id;

    let hasVoted = post.votesOnPost.find(el => el._id == userId) ;

    if (hasVoted == undefined) {
        res.locals.hasVoted = false;
    }else{
        res.locals.hasVoted = true;
    }

    next();
}

exports.isAllowedToVote = async function(req, res, next){
    let post = await postService.getPostById(req.params.postId);

    let userId = req.user?._id;

    let hasVoted = post.votesOnPost.find(el => el._id == userId) ;

    if (hasVoted != undefined) {
        return res.redirect(`/post/${req.params.postId}/details`);
    }

    next();
}

exports.isNotOwnerAndNotVoted = async function(req, res, next) {
    let post = await postService.getPostById(req.params.postId);

    if (req.user?._id == post.author._id) {
        return res.redirect(`/post/${req.params.postId}/details`);
    }else if(post.votesOnPost.find(el => el._id == req.user?._id) != undefined){
        return res.redirect(`/post/${req.params.postId}/details`);
    }

    next();
};