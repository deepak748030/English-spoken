import TeacherCourse from '../models/TeacherCourseModel.js';
import { sendResponse } from '../utils/response.js';

export const createTeacherCourse = async (req, res) => {
    try {
        const data = req.body;

        if (req.files?.coverImg?.[0]) {
            data.coverImg = process.env.IMG_URL + req.files.coverImg[0].filename;
        }
        if (req.files?.demoPdf?.[0]) {
            data.demoPdf = process.env.IMG_URL + req.files.demoPdf[0].filename;
        }
        if (req.files?.originalPdf?.[0]) {
            data.originalPdf = process.env.IMG_URL + req.files.originalPdf[0].filename;
        }

        const course = await TeacherCourse.create(data);
        sendResponse(res, 201, 'Teacher course created', course);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getTeacherCourses = async (req, res) => {
    try {
        const courses = await TeacherCourse.find();
        sendResponse(res, 200, 'Teacher courses fetched', courses);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getCoursesByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const courses = await TeacherCourse.find({ teacherId });
        sendResponse(res, 200, 'Courses fetched by teacher ID', courses);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get courses by subcategoryId
export const getTeacherCoursesBySubcategoryId = async (req, res) => {
    try {
        const courses = await TeacherCourse.find({ subcategoryId: req.params.subcategoryId });
        sendResponse(res, 200, 'Teacher courses fetched by subcategoryId', courses);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateTeacherCourse = async (req, res) => {
    try {
        const data = req.body;

        if (req.files?.coverImg?.[0]) {
            data.coverImg = process.env.IMG_URL + req.files.coverImg[0].filename;
        }
        if (req.files?.demoPdf?.[0]) {
            data.demoPdf = process.env.IMG_URL + req.files.demoPdf[0].filename;
        }
        if (req.files?.originalPdf?.[0]) {
            data.originalPdf = process.env.IMG_URL + req.files.originalPdf[0].filename;
        }

        const updated = await TeacherCourse.findByIdAndUpdate(req.params.id, data, { new: true });
        sendResponse(res, 200, 'Teacher course updated', updated);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteTeacherCourse = async (req, res) => {
    try {
        await TeacherCourse.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Teacher course deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
