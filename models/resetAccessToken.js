const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isValid: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

const resetAccessToken = mongoose.model('ResetAccessToken', accessTokenSchema);
module.exports = resetAccessToken;