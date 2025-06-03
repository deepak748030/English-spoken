import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    rating: Number,
    imageUrl: String,
    demoPdfUrl: String,
    originalPdfUrl: String,
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        // required: true,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Ebook", ebookSchema);
