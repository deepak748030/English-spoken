import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    profileImg: {
        type: String
    },
    teacherName: {
        type: String,
        required: true,
        trim: true
    },
    teacherNumber: {
        type: String,
        required: true,
        unique: true
    },
    teacherType: {
        type: String,
        enum: ['other', 'personal'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    commission: {
        type: Number,
        required: true,
    },
    enableLive: {
        type: Boolean,
        default: false
    },
    introVideoUrl: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);
// commission