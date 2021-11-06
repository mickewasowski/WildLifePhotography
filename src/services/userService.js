const User = require('../models/User');
const { JWT_SECRET } = require('../constants');
const { sign } = require('../utils/jwtUtils');


exports.register =  function (firstName, lastName, email, password, repeatPassword) {  

    if (password != repeatPassword) {
        throw new Error('Passwords do not match!');

    }else{
        return User.create({firstName, lastName, email, password, repeatPassword});
    }
    
};

exports.login = async function(email, password){

    //if the password is only numeric the bcrypt compare method doesnt function properly
    return await User.findByEmail(email)
    .then(user => {
        if (user != null) {
            return Promise.all([user.validatePassword(password), user]);
        }
        else{
            throw new Error('No such user was found!');
        }
    })
    .then(([isPassValid, user])=> {
        console.log(isPassValid);
        if(isPassValid){
            return user;
        }else{
            throw new Error('Username or password are invalid!');
        }
    })
    .catch(err => {
        throw err;
    });

    // let user = await User.findByEmail(email);
    // let isPassValid = await user.validatePassword(password);

    // console.log(isPassValid);

};

exports.addPostToCollection = async function(postId, email){
    
    let user = await User.findByEmail(email);

    user.myPosts.push(postId);

    return user.save();
};

exports.getUserInfoWithPosts = async function(userId){
    return await User.findById(userId).populate('myPosts').lean();
}

// use inside the controller upon login
exports.createToken = async function (user) {
    let payload = {
        _id: user._id,
        email: user.email,
    };

    return await sign(payload, JWT_SECRET, {expiresIn: '1h'});
}
