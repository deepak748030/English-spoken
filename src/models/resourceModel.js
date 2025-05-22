import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    topicContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TopicContent',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
