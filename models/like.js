const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // defines the objectid of the liked object
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // for dynamic reference of the schema we are refering to
        refPath: 'onModel'
    },
    // defines type of the liked object since it is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
},{
    timestamps: true
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;