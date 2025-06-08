import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    time: { type: String, required: true },  // e.g., "09:00 AM"
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const timeSlotSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    slots: [slotSchema]
}, { timestamps: true });

export default mongoose.model('TimeSlot', timeSlotSchema);
