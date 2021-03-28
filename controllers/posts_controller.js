const Post = require('../models/post');
const Comment = require('../models/comment')


module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if (err){console.log('error in creating the post'); return;}
         
        return res.redirect('back');
    })
}

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        // user.id and not user._id as we need the string of the id and not as the type Object
        if (post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    })
}