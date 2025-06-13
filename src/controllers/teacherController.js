import Teacher from "../models/teacherModel.js";
import { sendResponse } from "../utils/response.js";
import fs from 'fs';
import path from 'path';

// Create Teacher
export const createTeacher = async (req, res) => {
    try {
        const { teacherName, teacherNumber, teacherType,
            introVideoUrl = '',   // default to ''
            about = ''            // default to ''
        } = req.body;
        let commission;
        if (teacherType == 'personal') {
            commission = 0;
        } else if (teacherType == 'other') {
            commission = req.body.commission; // Default commission for 'other' type
        }
        const existing = await Teacher.findOne({ teacherNumber });
        if (existing) return sendResponse(res, 400, "Teacher already exists");
        let enableLive = false;
        if (req.body.enableLive) {
            enableLive = req.body.enableLive;
        }

        // ✅ Handle file upload
        const profileImg = req.file ? `${process.env.IMG_URL}${req.file.filename}` : 'https://img.freepik.com/premium-vector/stylish-default-user-profile-photo-avatar-vector-illustration_664995-353.jpg';

        const newTeacher = new Teacher({ profileImg, teacherName, teacherNumber, teacherType, commission, enableLive, introVideoUrl, about });
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


export const updateTeacher = async (req, res) => {
    try {
        const {
            teacherName,
            teacherNumber,
            teacherType,
            isVerified,
            enableLive,
            commission,
            introVideoUrl,
            about
        } = req.body;

        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return sendResponse(res, 404, "Teacher not found");

        if (teacherName) teacher.teacherName = teacherName;
        if (teacherNumber) teacher.teacherNumber = teacherNumber;

        if (teacherType) {
            teacher.teacherType = teacherType;
            teacher.commission = teacherType === 'other' ? commission || 0 : 0;
        }

        if (typeof isVerified === 'boolean') teacher.isVerified = isVerified;
        if (typeof enableLive === 'boolean') teacher.enableLive = enableLive;

        if (introVideoUrl !== undefined) teacher.introVideoUrl = introVideoUrl;
        if (about !== undefined) teacher.about = about;

        // ✅ Handle image update
        if (req.file) {
            // Get the old image filename from the full URL
            const oldImgPath = teacher.profileImg.replace(process.env.IMG_URL, '');

            const fullOldImgPath = path.join('uploads', oldImgPath);
            if (fs.existsSync(fullOldImgPath)) {
                fs.unlinkSync(fullOldImgPath); // Delete old image
            }

            teacher.profileImg = `${process.env.IMG_URL}${req.file.filename}`;
        }

        await teacher.save();
        sendResponse(res, 200, "Teacher updated", teacher);
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, err.message);
    }
};


// Delete Teacher
export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return sendResponse(res, 404, "Teacher not found");

        // ✅ Remove image file
        if (teacher.profileImg) {
            const imgPath = teacher.profileImg.replace(process.env.IMG_URL, '');
            const fullImgPath = path.join('uploads', imgPath);

            if (fs.existsSync(fullImgPath)) {
                fs.unlinkSync(fullImgPath);
            }
        }

        await Teacher.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, "Teacher deleted");
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, err.message);
    }
};


export const teacherLogin = async (req, res) => {
    try {
        const { teacherNumber, teacherType } = req.body;

        if (!teacherNumber) {
            return sendResponse(res, 400, "Teacher number is required");
        }

        const teacher = await Teacher.findOne({ teacherNumber, teacherType });

        if (!teacher) {
            return sendResponse(res, 404, "Teacher not found");
        }

        sendResponse(res, 200, "Teacher logged in", teacher);

    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
