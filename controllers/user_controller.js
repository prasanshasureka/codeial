const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = async function(req, res){
    // res.end('<h1>User Profile</h1>');
    let user = await User.findById(req.params.id);
    return res.render('user_profile', {
        title: 'Profile',
        profile_user: user
    });

    // User.findById(req.params.id, function(err, user){
    //     return res.render('user_profile', {
    //         title: 'Profile',
    //         profile_user: user
    //     })
    // })
    
}

module.exports.update = async function(req, res){
    if (req.params.id == req.user.id){
        try {
            let user = await User.findById(req.params.id);
            
            User.uploadedAvatar(req, res, function(err){
                
                if (err){
                    console.log('******Multer Error: ', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                
                
                if (req.file){
                    
                    // if user has avatar delete that avatar
                    
                    if (user.avatar){
                        avatarID = 'avatar-' + user.avatar.split('-').slice(-1);
                        if (fs.existsSync(__dirname, '..', 'uploads', 'users', avatarID)) {
                            fs.unlinkSync(path.join(__dirname , '..'  , user.avatar));
                        }
                        else{
                            alert("Can't change profile photo");
                        }
                    }
                    
                    // saving the path of the uploaded file into the avatar field of the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
            });
            // await User.findByIdAndUpdate(req.params.id,{name: req.body.name, email: req.body.email});
        } catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized! ');
        return res.status(401).send('Unauthorized');
    }
    
    // if (req.params.id == req.user.id){
    //     User.findByIdAndUpdate(req.params.id,{name: req.body.name, email: req.body.email} ,function(err, user){
    //         return res.redirect('back');
    //     });
    // } else {
    //     return res.status(401).send('Unauthorized');
    // }
    
    
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
module.exports.create = async function(req, res){
    try{
        if (req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
        let user = await User.findOne({email: req.body.email});
        if (!user){
            await User.create(req.body);
            return res.redirect('/user/sign-in');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
    
    

    // if (req.body.password != req.body.confirm_password){
    //     return res.redirect('back');
    // }
    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err) {
    //         console.log('error in finding user in signing up');
    //         return
    //     }
    //     if (!user){
    //         User.create(req.body, function(err, user){
    //             if(err) {
    //                 console.log('error in creating user in signing up');
    //                 return
    //             }
    //             return res.redirect('/user/sign-in');
    //         })
    //     } else {
    //         return res.redirect('back');
    //     }
    // });
}

//sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/')
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out successfully!');
    return res.redirect('/');
}