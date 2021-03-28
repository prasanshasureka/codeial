const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    
    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: 'Home Page',
    //         posts: posts
    //     });
    // });

    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'post'
        }
    })
    .exec(function(err, posts){
        User.find({}, function(err, all_users){
            return res.render('home', {
                title: 'Home Page',
                posts: posts,
                all_users: all_users
            });
        })
        
    });
    
}