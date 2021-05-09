// const Comment = require('../models/comment');
// const Post = require('../models/post');

// module.exports.create = async function(req, res){
//     try{
//         let post = await Post.findById(req.body.post);
//         if (post){
//             let comment = await Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             });

            
//             post.comments.push(comment);
//             post.save();

//             if (req.xhr){
//                 // Similar for comments to fetch the user's id!
//                 comment = await comment.populate('user', 'name').execPopulate();
    
//                 return res.status(200).json({
//                     data: {
//                         comment: comment
//                     },
//                     message: "Post created!"
//                 });
//             }

//             return res.redirect('back');
//         }
//     }catch(err){
//         console.log('error', err);
//         return;
//     }

//     // Post.findById(req.body.post, function(err, post){
//     //     if (post){
//     //         Comment.create({
//     //             content: req.body.content,
//     //             post: req.body.post,
//     //             user: req.user._id
//     //         }, function(err, comment){
//     //             if (err){console.log('error in creating the post'); return;}
//     //             post.comments.push(comment);
//     //             post.save();
//     //             return res.redirect('back');
//     //         });

//     //     }
//     //     if (err){console.log('error in finding the post'); return;}
//     // })
// }

// module.exports.destroy = async function(req, res){
//     try{
//         let comment = await Comment.findById(req.params.id);
//         let post = await Post.findById(comment.post);
//         if (comment.user == req.user.id || post.user == req.user.id){
//             comment.remove();
//             // .pull({ fileID: req.params.id }) this is the way .pull works 
//             // but since comments dont have key-value pair, syntax to remove reference is unknown
//             // post.post.comments.pull(req.params.id);
//             // await post.save();
//             await Post.findByIdAndUpdate(post.id, {$pull: {comments: req.params.id}});

//             // send the comment id which was deleted back to the views
//             if (req.xhr){
//                 return res.status(200).json({
//                     data: {
//                         comment_id: req.params.id
//                     },
//                     message: "Post deleted"
//                 });
//             }

//             req.flash('success', 'Comment deleted!');

//         }
//         return res.redirect('back');
//     }catch(err){
//         console.log('error', err);
//         return;
//     }

//     // Comment.findById(req.params.id, function(err, comment){
//     //     Post.findById(comment.post, function(err, post){
//     //         postUser = post.user
//     //         postId = post.id
//     //         if (comment.user == req.user.id || postUser == req.user.id){
//     //             comment.remove();
//     //             Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, function(err, post){
//     //                 return res.redirect('back');
//     //             });
//     //         }else{
//     //             return res.redirect('back');
//     //         }
//     //     })
//     // });
// }


const Comment = require('../models/comment');
const Post = require('../models/post');

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

            if (req.xhr){
                // Similar for comments to fetch the user's id!
                comment = await comment.populate('user', 'name').execPopulate();
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
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
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
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