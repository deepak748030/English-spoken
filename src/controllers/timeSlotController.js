import TimeSlot from '../models/timeSlotModel.js';
import { sendResponse } from '../utils/response.js';
import mongoose from 'mongoose';

// ✅ CREATE Time Slots
export const createTimeSlots = async (req, res) => {
    try {
        const { teacherId, date, times } = req.body;

        // Basic validation
        if (!teacherId || !date || !Array.isArray(times) || times.length === 0) {
            return sendResponse(res, 400, 'teacherId, date, and times[] are required');
        }

        // Check teacherId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return sendResponse(res, 400, 'Invalid teacherId');
        }

        // Optionally: normalize date format (if needed)
        // const normalizedDate = new Date(date).toISOString().slice(0, 10);

        // Check if TimeSlots for this teacher and date already exist
        const existing = await TimeSlot.findOne({ teacherId, date });
        if (existing) {
            return sendResponse(res, 400, 'Time slots already exist for this teacher and date');
        }

        // Create slots array from times
        const slots = times.map(time => ({ time }));

        // Create new TimeSlot doc
        const newSlot = new TimeSlot({ teacherId, date, slots });
        await newSlot.save();

        sendResponse(res, 201, 'Time slots created', newSlot);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ GET Time Slots by Teacher ID
export const getTimeSlotsByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const slots = await TimeSlot.find({ teacherId }).populate('slots.bookedBy', 'name email');
        sendResponse(res, 200, 'Time slots by teacher', slots);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ GET Time Slots by Date
export const getTimeSlotsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const slots = await TimeSlot.find({ date }).populate('slots.bookedBy', 'name email');
        sendResponse(res, 200, 'Time slots for date', slots);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ GET Booked Slots by User ID
export const getTimeSlotsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all TimeSlot documents that have any slot booked by userId
        const timeSlots = await TimeSlot.find({ 'slots.bookedBy': userId })
            .populate('teacherId', 'teacherName');

        // Filter slots inside each TimeSlot document
        const filteredTimeSlots = timeSlots.map(ts => {
            // Filter slots booked by the user only
            const bookedSlots = ts.slots.filter(slot => slot.bookedBy?.toString() === userId);

            return {
                _id: ts._id,
                teacherId: ts.teacherId,
                date: ts.date,
                slots: bookedSlots,
                createdAt: ts.createdAt,
                updatedAt: ts.updatedAt
            };
        });

        sendResponse(res, 200, 'Time slots booked by user', filteredTimeSlots);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ BOOK a Time Slot
export const bookTimeSlot = async (req, res) => {
    try {
        const { teacherId, date, time, userId } = req.body;


        if (!teacherId || !date || !time || !userId) {
            return sendResponse(res, 400, 'teacherId, date, time, and userId are required');
        }


        const slotDoc = await TimeSlot.findOne({ teacherId, date });
        if (!slotDoc) return sendResponse(res, 404, 'Time slot document not found');

        const slot = slotDoc.slots.find(s => s.time === time);
        if (!slot) return sendResponse(res, 404, 'Time not found');
        if (slot.isBooked) return sendResponse(res, 400, 'This time is already booked');

        slot.isBooked = true;
        slot.bookedBy = new mongoose.Types.ObjectId(userId);

        await slotDoc.save();
        sendResponse(res, 200, 'Time slot booked successfully', slot);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteTimeSlotById = async (req, res) => {
    try {
        const { id } = req.params;  // TimeSlot document _id

        if (!id) {
            return sendResponse(res, 400, '_id param is required');
        }

        const result = await TimeSlot.findByIdAndDelete(id);

        if (!result) {
            return sendResponse(res, 404, 'No time slot found to delete with this id');
        }

        sendResponse(res, 200, 'Time slot deleted successfully', result);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};



export const getAllTeachersWithFreeSlots = async (req, res) => {
    try {
        // Find all TimeSlot documents and populate teacher info
        const timeSlots = await TimeSlot.find()
            .populate('teacherId', 'teacherName');

        // Filter slots to only include free (not booked) slots
        const freeSlotsByTeacher = timeSlots.map(ts => {
            const freeSlots = ts.slots.filter(slot => !slot.isBooked);

            return {
                _id: ts._id,
                teacherId: ts.teacherId,
                date: ts.date,
                slots: freeSlots,
                createdAt: ts.createdAt,
                updatedAt: ts.updatedAt
            };
        })
            // Optionally filter out days where no slots are free
            .filter(ts => ts.slots.length > 0);

        sendResponse(res, 200, 'Teachers and their available slots', freeSlotsByTeacher);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const getAllBookedTeacherSlots = async (req, res) => {
    try {
        // Find all time slots where at least one is booked
        const allSlots = await TimeSlot.find({ 'slots.isBooked': true })
            .populate('teacherId', 'teacherName')
            .populate('slots.bookedBy', 'name'); // Optional: populate booked user's name

        // Filter out only booked slots inside each time slot
        const result = allSlots
            .map(ts => {
                const bookedSlots = ts.slots.filter(slot => slot.isBooked);

                return {
                    _id: ts._id,
                    teacherId: ts.teacherId,
                    date: ts.date,
                    slots: bookedSlots,
                    createdAt: ts.createdAt,
                    updatedAt: ts.updatedAt
                };
            })
            .filter(ts => ts.slots.length > 0); // Remove empty results

        sendResponse(res, 200, 'Booked slots for all teachers', result);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const getBookedSlotsByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return sendResponse(res, 400, 'Invalid teacherId');
        }

        const timeSlots = await TimeSlot.find({ teacherId, 'slots.isBooked': true })
            .populate('teacherId', 'teacherName')
            .populate('slots.bookedBy', 'mobileNo'); // Optional: include user info

        const result = timeSlots
            .map(ts => {
                const bookedSlots = ts.slots.filter(slot => slot.isBooked);

                return {
                    _id: ts._id,
                    teacherId: ts.teacherId,
                    date: ts.date,
                    slots: bookedSlots,
                    createdAt: ts.createdAt,
                    updatedAt: ts.updatedAt
                };
            })
            .filter(ts => ts.slots.length > 0);

        sendResponse(res, 200, 'Booked slots for the teacher', result);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateTimeSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const { times } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, 'Invalid TimeSlot id');
        }

        if (!Array.isArray(times) || times.length === 0) {
            return sendResponse(res, 400, 'times[] is required in request body');
        }

        const newSlots = times.map(time => ({
            time,
            isBooked: false,
            bookedBy: null
        }));

        const updatedSlot = await TimeSlot.findByIdAndUpdate(
            id,
            { slots: newSlots },
            { new: true }
        );

        if (!updatedSlot) {
            return sendResponse(res, 404, 'TimeSlot not found');
        }

        sendResponse(res, 200, 'Time slots updated successfully', updatedSlot);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};