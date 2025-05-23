
// controllers/lessonController.js
import Lesson from '../models/lessonCourseModel.js';
import { sendResponse } from '../utils/response.js';

export const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);
        sendResponse(res, 201, 'Lesson created', lesson);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        sendResponse(res, 200, 'Lessons fetched', lessons);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Lesson updated', lesson);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteLesson = async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Lesson deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getLessonByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const lessons = await Lesson.find({ courseId });
        sendResponse(res, 200, 'Lessons fetched by courseId', lessons);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};