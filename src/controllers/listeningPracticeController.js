import ListeningPractice from '../models/listeningPracticeModel.js';
import { sendResponse } from '../utils/response.js';

export const createListeningPractice = async (req, res) => {
    try {
        const { subCategoryId, title, url, authorName, description } = req.body;
        if (!subCategoryId || !title || !url || !authorName || !description) {
            return sendResponse(res, 400, "All fields are required");
        }

        const newItem = await ListeningPractice.create({ subCategoryId, title, url, authorName, description });
        sendResponse(res, 201, "Listening practice created successfully", newItem);
    } catch (error) {
        sendResponse(res, 500, "Error creating listening practice");
    }
};

export const getAllListeningPractices = async (req, res) => {
    try {
        const items = await ListeningPractice.find();
        sendResponse(res, 200, "All listening practices fetched", items);
    } catch (error) {
        sendResponse(res, 500, "Error fetching listening practices");
    }
};

export const getListeningPracticeBySubCategory = async (req, res) => {
    try {
        const items = await ListeningPractice.find({ subCategoryId: req.params.subCategoryId });
        if (!items || items.length === 0) {
            return sendResponse(res, 404, "No listening practices found");
        }
        sendResponse(res, 200, "Listening practices by subCategory fetched", items);
    } catch (error) {
        sendResponse(res, 500, "Error fetching data");
    }
};

export const updateListeningPractice = async (req, res) => {
    try {
        const updated = await ListeningPractice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Listening practice not found");
        sendResponse(res, 200, "Listening practice updated", updated);
    } catch (error) {
        sendResponse(res, 500, "Error updating");
    }
};

export const deleteListeningPractice = async (req, res) => {
    try {
        const deleted = await ListeningPractice.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Listening practice not found");
        sendResponse(res, 200, "Listening practice deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting");
    }
};
