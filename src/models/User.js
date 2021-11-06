const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        validate: [/^[a-zA-Z0-9]+$/, 'Username must contain only english alphabetical characters or numeric characters!'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long!'],
    },
    lastName:{
        type: String,
        required: true,
        validate: [/^[a-zA-Z0-9]+$/, 'Username must contain only english alphabetical characters or numeric characters!'],
        unique: true,
        minlength: [5, 'Username must be at least 5 characters long!'],
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [/^[a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]+$/, 'Email must contain only English letters!'],
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Password must be at least 4 characters long!']
    },
    myPosts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }]
});

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            
            next();
        });
});

userSchema.static('findByEmail', function(email){
    return this.findOne({email});
});

userSchema.method('validatePassword', function(pass){
    return bcrypt.compare(pass, this.password);
});


const User = mongoose.model('User', userSchema);

module.exports = User;