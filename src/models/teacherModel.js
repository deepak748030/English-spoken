import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
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
        default: function () {
            return this.teacherType === 'other' ? 20 : 0;
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);
