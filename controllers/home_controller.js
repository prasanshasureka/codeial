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
                path: 'user post likes',
            }
        });

        let current_user;
        let all_users;
        if (req.user){
            current_user = await User.findById(req.user.id)
            .populate({
                path: 'friendships'
                // populate: {
                //     path: 'to_user from_user'
                // }
            });

            // show all users except the current logged in user
            all_users = await User.find({_id: {$nin: [req.user.id]}});
        }
         
        return res.render('home', {
            title: 'Home Page',
            posts: posts,
            all_users: all_users,
            current_user: current_user
        });
    }catch(err){
        console.log('error', err);
        return;
    }
}