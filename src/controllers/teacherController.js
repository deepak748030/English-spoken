import Teacher from "../models/teacherModel.js";
import { sendResponse } from "../utils/response.js";

// Create Teacher
export const createTeacher = async (req, res) => {
    try {
        const { teacherName, teacherNumber, teacherType } = req.body;

        const existing = await Teacher.findOne({ teacherNumber });
        if (existing) return sendResponse(res, 400, "Teacher already exists");

        const newTeacher = new Teacher({ teacherName, teacherNumber, teacherType });
        await newTeacher.save();

        sendResponse(res, 201, "Teacher created", newTeacher);
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, "Server Error");
    }
};

// Get all Teachers
export const getAllTeachers = async (_, res) => {
    try {
        const teachers = await Teacher.find();
        sendResponse(res, 200, "All teachers fetched", teachers);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get single teacher by ID
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return sendResponse(res, 404, "Teacher not found");

        sendResponse(res, 200, "Teacher fetched", teacher);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
    try {
        const { teacherName, teacherNumber, teacherType, isVerified } = req.body;
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) return sendResponse(res, 404, "Teacher not found");

        if (teacherName) teacher.teacherName = teacherName;
        if (teacherNumber) teacher.teacherNumber = teacherNumber;
        if (teacherType) {
            teacher.teacherType = teacherType;
            teacher.commission = teacherType === 'other' ? 20 : 0;
        }
        if (typeof isVerified === 'boolean') teacher.isVerified = isVerified;

        await teacher.save();
        sendResponse(res, 200, "Teacher updated", teacher);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, "Teacher deleted");
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
