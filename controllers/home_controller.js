const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    
    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: 'Home Page',
    //         posts: posts
    //     });
    // });

    try {
        let posts = await Post.find({})
        .sort('-createdAt')
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
        });

        let all_users = await User.find({});

        return res.render('home', {
            title: 'Home Page',
            posts: posts,
            all_users: all_users
        });
    }catch(err){
        console.log('error', err);
        return;
    }
}