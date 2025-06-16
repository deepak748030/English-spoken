import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    like: {
        type: [String], // Store user IDs who liked
        default: []
    },
    commentCount: {
        type: Number,
        default: 0
    },
    reply: {
        type: Number,
        default: 0
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        default: null
    }
});

const Community = mongoose.model('Community', CommunitySchema);

export default Community;
