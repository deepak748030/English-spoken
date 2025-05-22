import mongoose from 'mongoose';

const paraSchema = new mongoose.Schema({
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Para', paraSchema);
