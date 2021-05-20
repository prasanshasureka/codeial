const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req, res){
    try{
        let likeable;
        let deleted = false
        
        // /likes/toggle/?id=abc123&type=Post
        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        //check if like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // if a like already exists, delete it, else make one
        if (existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        } else {
            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            })
            likeable.likes.push(newLike);
            likeable.save();
        }

        return res.status(200).json({
            message: 'Request successful!',
            data:{
                deleted: deleted
            }
        })
        // res.redirect('/');

    } catch (err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}