const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req,res){
    // use lean populate exec to populate certain fields only
    let posts = await Post.find({})
    .sort('-createdAt')
    .lean().populate('user', 'name email')
    .exec();

    // TODO try to populate all fields except password for the users

    return res.status(200).json({
        message: "List of Posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            return res.status(200).json({
                message: "Post and related comments deleted"
            });
        }else{
            return res.status(401).json({
                message: "You can not delete this post!"
            })
        }

    }catch(err){
        
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
    
}