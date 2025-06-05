
// controllers/courseController.js
import Course from '../models/Course.js';
import { sendResponse } from '../utils/response.js';

export const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        sendResponse(res, 201, 'Course created', course);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        sendResponse(res, 200, 'Courses fetched', courses);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Course updated', course);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Course deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getCoursesByType = async (req, res) => {
    try {
        console.log(req.params.type)
        const courses = await Course.find({ type: req.params.type });
        if (courses.length === 0) {
            return sendResponse(res, 404, 'No courses found for this type');
        }
        sendResponse(res, 200, 'Courses fetched', courses);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
}


export const getCourseByTeacherId = async (req, res) => {
    try {

        const courses = await Course.find({ teacherId: req.params.teacherId });
        if (courses.length === 0) {
            return sendResponse(res, 404, 'No courses found for this teacher');
        }
        sendResponse(res, 200, 'Courses fetched', courses);

    } catch (error) {
        sendResponse(res, 500, err.message);
    }
}

