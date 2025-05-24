import SubCategory from '../models/subcategoryModel.js';
import { sendResponse } from '../utils/response.js';

export const createSubCategory = async (req, res) => {
    try {
        const { topicContent, title, number, isLocked, type } = req.body;

        if (!topicContent || !title || number === undefined || !type) {
            return sendResponse(res, 400, "topicContent, title, number, and type are required.");
        }

        const newSub = await SubCategory.create({ topicContent, title, number, isLocked, type });
        sendResponse(res, 201, "Subcategory created successfully", newSub);
    } catch (err) {
        sendResponse(res, 500, "Error creating subcategory");
    }
};

export const getAllSubCategories = async (req, res) => {
    try {
        const subs = await SubCategory.find().sort({ number: 1 });
        sendResponse(res, 200, "Subcategories fetched", subs);
    } catch (err) {
        sendResponse(res, 500, "Error fetching subcategories");
    }
};

export const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const sub = await SubCategory.find({ topicContent: id });
        if (!sub) return sendResponse(res, 404, "Subcategory not found");
        sendResponse(res, 200, "Subcategory fetched", sub);
    } catch (err) {
        sendResponse(res, 500, "Error fetching subcategory");
    }
};

export const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await SubCategory.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Subcategory not found");
        sendResponse(res, 200, "Subcategory updated", updated);
    } catch (err) {
        sendResponse(res, 500, "Error updating subcategory");
    }
};

export const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SubCategory.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, "Subcategory not found");
        sendResponse(res, 200, "Subcategory deleted");
    } catch (err) {
        sendResponse(res, 500, "Error deleting subcategory");
    }
};
