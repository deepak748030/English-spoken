import UserClasses from '../models/userClassesModel.js';
import { sendResponse } from '../utils/response.js';

// CREATE
export const createUserClasses = async (req, res) => {
    try {
        const newData = await UserClasses.create(req.body);
        sendResponse(res, 201, "UserClasses created successfully", newData);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// GET ALL
export const getAllUserClasses = async (req, res) => {
    try {
        const all = await UserClasses.find().populate("userId", "mobileNo");
        sendResponse(res, 200, "All UserClasses fetched", all);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// GET BY USER ID
export const getUserClassesByUserId = async (req, res) => {
    try {
        const data = await UserClasses.findOne({ userId: req.params.userId }).populate("userId", "mobileNo");
        if (!data) return sendResponse(res, 404, "No data found for this user");
        sendResponse(res, 200, "UserClasses fetched", data);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// UPDATE
export const updateUserClasses = async (req, res) => {
    try {
        const updated = await UserClasses.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "UserClasses not found");
        sendResponse(res, 200, "UserClasses updated", updated);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// DELETE
export const deleteUserClasses = async (req, res) => {
    try {
        const deleted = await UserClasses.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "UserClasses not found");
        sendResponse(res, 200, "UserClasses deleted");
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
