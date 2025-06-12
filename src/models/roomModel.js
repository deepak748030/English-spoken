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
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
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
