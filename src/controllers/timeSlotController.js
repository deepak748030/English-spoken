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

export const bookTimeSlot = async (req, res) => {
    try {
        const { teacherId, date, time, userId, description, type, status, meetLink } = req.body;

        // Validate required fields
        if (!teacherId || !date || !time || !userId) {
            return sendResponse(res, 400, 'teacherId, date, time, and userId are required');
        }

        // Find document for teacher and date
        const slotDoc = await TimeSlot.findOne({ teacherId, date });
        if (!slotDoc) return sendResponse(res, 404, 'Time slot document not found');

        // Find the specific time slot
        const slot = slotDoc.slots.find(s => s.time === time);
        if (!slot) return sendResponse(res, 404, 'Time not found');
        if (slot.isBooked) return sendResponse(res, 400, 'This time is already booked');

        // Update the slot
        slot.isBooked = true;
        slot.bookedBy = new mongoose.Types.ObjectId(userId);
        if (description) slot.description = description;
        if (type) slot.type = type;
        if (status) slot.status = status;
        if (meetLink) slot.meetLink = meetLink;

        // Save document
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
            .populate('teacherId');

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
        // Fetch all time slots where at least one slot is booked
        const allSlots = await TimeSlot.find({ 'slots.isBooked': true })
            .populate('teacherId', 'teacherName')
            .populate('slots.bookedBy', 'name');

        // Filter only booked slots and include all fields
        const result = allSlots
            .map(ts => {
                const bookedSlots = ts.slots
                    .filter(slot => slot.isBooked)
                    .map(slot => ({
                        time: slot.time,
                        isBooked: slot.isBooked,
                        bookedBy: slot.bookedBy,
                        description: slot.description,
                        type: slot.type,
                        status: slot.status,
                        meetLink: slot.meetLink
                    }));

                return {
                    _id: ts._id,
                    teacherId: ts.teacherId,
                    date: ts.date,
                    slots: bookedSlots,
                    createdAt: ts.createdAt,
                    updatedAt: ts.updatedAt
                };
            })
            .filter(ts => ts.slots.length > 0); // Remove days with no booked slots

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
        const { times, status, meetLink } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, 'Invalid TimeSlot id');
        }

        const slotDoc = await TimeSlot.findById(id);
        if (!slotDoc) {
            return sendResponse(res, 404, 'TimeSlot not found');
        }

        if (Array.isArray(times) && times.length > 0) {
            // ✅ Update or add only matching time slots
            times.forEach(inputTime => {
                const existingSlot = slotDoc.slots.find(s => s.time === inputTime);
                if (existingSlot) {
                    if (!existingSlot.isBooked) {
                        if (status) existingSlot.status = status;
                        if (meetLink) existingSlot.meetLink = meetLink;
                    }
                } else {
                    // Add new slot
                    slotDoc.slots.push({
                        time: inputTime,
                        isBooked: false,
                        bookedBy: null,
                        status: status || 'upcoming',
                        meetLink: meetLink || null
                    });
                }
            });
        } else if (status || meetLink) {
            // ✅ If no times[], apply status/meetLink to all unbooked slots
            slotDoc.slots = slotDoc.slots.map(slot => {
                if (!slot.isBooked) {
                    if (status) slot.status = status;
                    if (meetLink) slot.meetLink = meetLink;
                }
                return slot;
            });
        }

        await slotDoc.save();
        sendResponse(res, 200, 'Time slots updated successfully', slotDoc);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const getTimeSlotsByTeacherAndType = async (req, res) => {
    try {
        const { teacherId, type } = req.params;

        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return sendResponse(res, 400, 'Invalid teacherId');
        }

        if (!['one-to-one-class', 'group-class', 'trainer-talk'].includes(type)) {
            return sendResponse(res, 400, 'Invalid type. Must be one of: one-to-one-class, group-class, trainer-talk');
        }

        const allTimeSlots = await TimeSlot.find({ teacherId }).populate('slots.bookedBy', 'name email');

        // Filter slots by given type
        const filteredSlots = allTimeSlots
            .map(ts => {
                const matchingSlots = ts.slots.filter(slot => slot.type === type);

                return {
                    _id: ts._id,
                    teacherId: ts.teacherId,
                    date: ts.date,
                    slots: matchingSlots,
                    createdAt: ts.createdAt,
                    updatedAt: ts.updatedAt
                };
            })
            .filter(ts => ts.slots.length > 0);

        sendResponse(res, 200, `Time slots of type '${type}' for teacher`, filteredSlots);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const updateSingleTimeSlotById = async (req, res) => {
    try {
        const { id } = req.params; // TimeSlot document ID
        const { slotId, status, meetLink } = req.body; // slot._id, status, meetLink

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(slotId)) {
            return sendResponse(res, 400, 'Invalid TimeSlot id or slotId');
        }

        const slotDoc = await TimeSlot.findById(id);
        if (!slotDoc) {
            return sendResponse(res, 404, 'TimeSlot not found');
        }

        const slot = slotDoc.slots.id(slotId);
        if (!slot) {
            return sendResponse(res, 404, 'Time slot not found');
        }

        // ✅ Update only if not booked OR if you want to allow booked too, remove this check
        // if (slot.isBooked) {
        //     return sendResponse(res, 400, 'Cannot update a booked time slot');
        // }

        if (status) slot.status = status;
        if (meetLink) slot.meetLink = meetLink;

        await slotDoc.save();
        sendResponse(res, 200, 'Single time slot updated successfully', slot);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
