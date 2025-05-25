import mongoose from 'mongoose';

const topicContentSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('TopicContent', topicContentSchema);
