import mongoose from 'mongoose';

const ebookOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ebookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ebook',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('EbookOrder', ebookOrderSchema);
