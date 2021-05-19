const crypto = require('crypto');
const ResetAccessToken = require('../models/resetAccessToken');
const User = require('../models/user');
const accessTokenMailer = require('../mailers/reset_access_token_mailer');
const resetEmailWorker = require('../workers/reset_password_email_worker');
const queue = require('../config/kue');


module.exports.checkMail = async function(req, res){
    return res.render('reset_password', {
        title: "Reset Password",
        mailSent: false,
    });
}

module.exports.passwordForm = async function(req, res){
    let resetAccessToken = await ResetAccessToken.findOne({accessToken: req.params.accessToken})
    return res.render('update_password', {
        title: "Reset Password",
        accessToken: resetAccessToken
    });
}


module.exports.checkUser = async function(req, res){
    let user = await User.findOne({email: req.body.email});
    if (user){
        resetAccessToken = await ResetAccessToken.create({
            accessToken: crypto.randomBytes(10).toString('hex'),
            user: user._id,
            isValid: true
        });
        resetAccessToken = await resetAccessToken.populate('user', 'name email').execPopulate();

        let job = queue.create('resetEmails', resetAccessToken).save(function(err){
            if (err){
                console.log('error in creating a queue', err); 
                return;
            }
            // console.log('job enqueued', job.id);
        })

        // accessTokenMailer.newAccessToken(resetAccessToken);
        
        req.flash('success', 'Mail Sent!');
        return res.redirect('back');
        
    }else{
        req.flash('error', 'No User exists!');
        return res.redirect('back');
    }
    
}

module.exports.updatePassword = async function(req, res){
    let resetAccessToken = await ResetAccessToken.findOne({accessToken: req.params.accessToken})
    if (resetAccessToken.isValid){
        if (req.body.password == req.body.confirmPassword){
            resetAccessToken = await resetAccessToken.populate('user', 'email').execPopulate();
            resetAccessToken.isValid = false
            let user = await User.findOne({email: resetAccessToken.user.email});
            user.password = req.body.password
            user.save()
            resetAccessToken.save()

            return res.redirect('/user/sign-in');
        } else{
            req.flash('error', 'Password does not match!');
        }
    } else {
        req.flash('error', 'Resend Reset Link!');
    }
}