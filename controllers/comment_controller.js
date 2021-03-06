const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user').execPopulate();

            let job = queue.create('emails', comment).save(function(err){
                if (err){
                    console.log('error in creating a queue', err); 
                    return;
                }
                // console.log('job enqueued', job.id);
            })
            // commentsMailer.newComment(comment);

            if (req.xhr){
                // Similar for comments to fetch the user's id!
                
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            
            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        // populate post users so that post owner can delete any comment
        let comment = await Comment.findById(req.params.id).populate('post', 'user').exec();
        // console.log(comment)
        // let post = await Post.findById(comment.post);
        if (comment.user == req.user.id || comment.post.user == req.user.id){

            let postId = comment.post._id;
            let postDel = await Post.findById(postId);
            postDel.comments.pull(req.params.id);
            postDel.save()
            
            
            comment.remove();

            
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}