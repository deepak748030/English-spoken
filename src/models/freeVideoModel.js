import mongoose from 'mongoose';

const freeVideoSchema = new mongoose.Schema({
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
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
    },
    type: {
        type: String,
        default: 'free'
    }
}, { timestamps: true });

export default mongoose.model('FreeVideo', freeVideoSchema);
