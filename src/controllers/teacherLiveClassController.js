import LiveClass from '../models/teacherLiveClassModel.js';
import { sendResponse } from '../utils/response.js';
import mongoose from 'mongoose';

export const createLiveClass = async (req, res) => {
    try {
        const { title, youtubeUrl, type, teacherId, courseIds } = req.body;

        if (!title || !youtubeUrl || !type || !teacherId) {
            return sendResponse(res, 400, 'Title, YouTube URL, type, and teacherId are required');
        }

        if (type === 'course' && (!Array.isArray(courseIds) || courseIds.length === 0)) {
            return sendResponse(res, 400, 'At least one course must be selected for type "course"');
        }

        const liveClass = new LiveClass({
            title,
            youtubeUrl,
            type,
            teacherId,
            courseIds: type === 'course' ? courseIds.map(id => new mongoose.Types.ObjectId(id)) : []
        });

        await liveClass.save();
        sendResponse(res, 201, 'Live class created', liveClass);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


export const getAllLiveClasses = async (req, res) => {
    try {
        const classes = await LiveClass.find();
        sendResponse(res, 200, 'All live classes', classes);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getLiveClassesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const classes = await LiveClass.find({ teacherId });
        sendResponse(res, 200, 'Live classes by teacher', classes);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateLiveClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, youtubeUrl, type, courseIds } = req.body;

        const liveClass = await LiveClass.findById(id);
        if (!liveClass) return sendResponse(res, 404, 'Live class not found');

        if (title) liveClass.title = title;
        if (youtubeUrl) liveClass.youtubeUrl = youtubeUrl;
        if (type) liveClass.type = type;

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
