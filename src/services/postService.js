const Post = require('../models/Post');

exports.create = function (title, keyword, location, dateOfCreation, image, description, userId) {
    
    let post = new Post({
        title, 
        keyword, 
        location, 
        dateOfCreation, 
        image, 
        description,
        author: userId,
    });

    return post.save();

};

exports.getAllPosts = () => Post.find().lean();

exports.getPostById = (postId) => {
    return Post.findById(postId)
    .populate('author')
    .populate('votesOnPost')
    .lean(); 
};

exports.voteUp = async (userId, postId) => {
    
    return await Post.findByIdAndUpdate(postId, {
        $push: { votesOnPost: userId},
        $inc: {ratingOfPost: 1 },
    });
};

exports.voteDown = async (userId, postId) => {
    return await Post.findByIdAndUpdate(postId, {
        $push: { votesOnPost: userId},
        $inc: {ratingOfPost: -1 },
    });
};

exports.updatePost = async (postId, postData) => {
    await Post.findByIdAndUpdate(postId, postData, {runValidators: true});
};

exports.deletePost = async (postId) => await Post.findByIdAndDelete(postId);