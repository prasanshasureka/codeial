const User = require('../models/user');

module.exports.profile = function(req, res){
    // res.end('<h1>User Profile</h1>');
    return res.render('user_profile', {
        title: 'Profile'
    })
}

module.exports.posts = function(req, res){
    res.end('<h1>User Posts</h1>')
}

module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/user/profile');
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    })
}

module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/user/profile');
    }

    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    })
}


// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err) {
            console.log('error in finding user in signing up');
            return
        }
        if (!user){
            User.create(req.body, function(err, user){
                if(err) {
                    console.log('error in creating user in signing up');
                    return
                }
                return res.redirect('/user/sign-in');
            })
        } else {
            return res.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/')
}

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/');
}