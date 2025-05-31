import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    rating: { type: Number, default: 0 },
    demoPdfUrl: { type: String, required: true },
    originalPdfUrl: { type: String, required: true },
    banner: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Ebook', ebookSchema);
