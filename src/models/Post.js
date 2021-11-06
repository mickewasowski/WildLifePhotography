const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   title:{
      type: String,
      required: true,
      minlength: [6, 'Title must be at least 6 characters long!'],
   },
   keyword:{
      type: String,
      required: true,
      minlength: [6, 'Keyword must be at least 6 characters long!'],
   },
   location: {
      type: String,
      required: true,
   },
   dateOfCreation: {
      type: String,
      required: true,
      validate: [/^[0-9]{2}[.]{1}[0-9]{2}[.]{1}[0-9]{4}$/, 'Date must be exactly in format dd.MM.yyyy !'],
   },
   image:{
      type: String,
      required: true,
      validate: [/^https?:\/\//i, "The image URL is invalid!"],
   },
   description:{
      type: String,
      required: true,
      minlength: [8, 'Description must be at least 8 characters long!']
   },
   author:{
      type: mongoose.Types.ObjectId,
      ref: 'User'
   },
   votesOnPost:[{
      type: mongoose.Types.ObjectId,
      ref: 'User'
      }
   ],
   ratingOfPost: {
      type: Number,
      default: 0,
   }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;