// src/models/topicModel.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // stored as lowercase-slug
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);
// daily use sentences
// vocabulary 

