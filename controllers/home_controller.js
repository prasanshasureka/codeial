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
        .populate('likes')
        .populate({
            path: 'comments',
            options: { sort: { 'createdAt': -1 } },
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'likes',
            }
        })
        .populate({
            path: 'comments',
            options: { sort: { 'createdAt': -1 } },
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