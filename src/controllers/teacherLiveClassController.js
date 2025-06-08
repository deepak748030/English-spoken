import LiveClass from '../models/teacherLiveClassModel.js';
import { sendResponse } from '../utils/response.js';
import mongoose from 'mongoose';

// ✅ CREATE
export const createLiveClass = async (req, res) => {
    try {
        const { title, youtubeUrl, type, teacherId, courseIds, status } = req.body;

        if (!title || !youtubeUrl || !type || !teacherId || !status) {
            return sendResponse(res, 400, 'Title, YouTube URL, type, teacherId, and status are required');
        }

        if (type === 'course' && (!Array.isArray(courseIds) || courseIds.length === 0)) {
            return sendResponse(res, 400, 'At least one course must be selected for type "course"');
        }

        const liveClass = new LiveClass({
            title,
            youtubeUrl,
            type,
            teacherId,
            status,
            courseIds: type === 'course' ? courseIds.map(id => new mongoose.Types.ObjectId(id)) : []
        });

        await liveClass.save();
        sendResponse(res, 201, 'Live class created', liveClass);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ GET ALL
export const getAllLiveClasses = async (req, res) => {
    try {
        const classes = await LiveClass.find();
        sendResponse(res, 200, 'All live classes', classes);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ GET BY TEACHER
export const getLiveClassesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const classes = await LiveClass.find({ teacherId });
        sendResponse(res, 200, 'Live classes by teacher', classes);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ UPDATE
export const updateLiveClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, youtubeUrl, type, courseIds, status } = req.body;

        const liveClass = await LiveClass.findById(id);
        if (!liveClass) return sendResponse(res, 404, 'Live class not found');

        if (title) liveClass.title = title;
        if (youtubeUrl) liveClass.youtubeUrl = youtubeUrl;
        if (type) liveClass.type = type;
        if (status) liveClass.status = status;

        if (type === 'course') {
            if (!courseIds || courseIds.length === 0) {
                return sendResponse(res, 400, 'At least one course is required for type "course"');
            }
            liveClass.courseIds = courseIds;
        } else {
            liveClass.courseIds = [];
        }

        await liveClass.save();
        sendResponse(res, 200, 'Live class updated', liveClass);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// ✅ DELETE
export const deleteLiveClass = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await LiveClass.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, 'Live class not found');
        sendResponse(res, 200, 'Live class deleted', deleted);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
