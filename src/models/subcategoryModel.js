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
    number: {
        type: Number,
        required: true
    },
    isLocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('SubCategory', subCategorySchema);
