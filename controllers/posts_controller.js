const Post = require('../models/post');
const Comment = require('../models/comment')
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user').execPopulate();
            post.save();
            console.log(post.createdAt);
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post Published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        // console.log('error', err);
        return res.redirect('back');
    }

    // Post.create({
    //     content: req.body.content,
    //     user: req.user._id
    // }, function(err, post){
    //     if (err){console.log('error in creating the post'); return;}
         
    //     return res.redirect('back');
    // })
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id).populate('comments').exec();

        if (post.user == req.user.id){

            
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            // await Like.deleteMany({_id: {$in: post.comments}});

            // iterate over all comments of a post and delete all likes inside each comment
            post.comments.forEach(async function(_comment){
                await Like.deleteMany({_id: {$in: _comment.likes}});
            })
            


            post.remove();

            await Comment.deleteMany({post: req.params.id});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}