import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
    topicContent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TopicContent',
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

export default mongoose.model('SubCategory', subCategorySchema);
