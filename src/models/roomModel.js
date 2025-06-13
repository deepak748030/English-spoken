import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        enum: ['audio', 'video'],
        default: ''
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    limit: {
        type: Number,
        default: 10, // default max users
        min: 1
    }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
