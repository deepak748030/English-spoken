import TeacherTopicContentSubcategory from '../models/TeacherTopicContentSubcategory.js';
import { sendResponse } from '../utils/response.js'; // Make sure you have this utility

// CREATE
export const createSubcategory = async (req, res) => {
    try {
        const { title, type, typeId, teacherId } = req.body;

        if (!title || !type || !teacherId) {
            return sendResponse(res, 400, "Title, type, and teacherId are required");
        }

        if (type !== 'topic' && !typeId) {
            return sendResponse(res, 400, "typeId is required when type is not 'topic'");
        }

        const newSubcategory = new TeacherTopicContentSubcategory({
            title,
            type,
            teacherId,
            typeId: type === 'topic' ? null : typeId,
        });

        await newSubcategory.save();
        sendResponse(res, 201, "Subcategory created", newSubcategory);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


// GET ALL
export const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await TeacherTopicContentSubcategory.find();
        sendResponse(res, 200, "All subcategories", subcategories);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


// GET BY typeId AND type
export const getByTypeAndOptionalTypeId = async (req, res) => {
    try {
        const { type, typeId, teacherId } = req.query;

        if (!type || !teacherId) {
            return sendResponse(res, 400, "Type and teacherId are required");
        }

        const filter = { type, teacherId };
        if (type !== 'topic' && typeId) {
            filter.typeId = typeId;
        }

        const results = await TeacherTopicContentSubcategory.find(filter);
        sendResponse(res, 200, "Filtered subcategories", results);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};



// UPDATE
export const updateSubcategory = async (req, res) => {
    try {
        const { title, type, typeId, teacherId } = req.body;
        const subcategory = await TeacherTopicContentSubcategory.findById(req.params.id);

        if (!subcategory) return sendResponse(res, 404, "Subcategory not found");

        if (title) subcategory.title = title;
        if (type) subcategory.type = type;
        if (teacherId) subcategory.teacherId = teacherId;

        if (type && type !== 'topic') {
            if (!typeId) return sendResponse(res, 400, "typeId required for non-topic type");
            subcategory.typeId = typeId;
        } else if (type === 'topic') {
            subcategory.typeId = null;
        }

        await subcategory.save();
        sendResponse(res, 200, "Subcategory updated", subcategory);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


// DELETE
export const deleteSubcategory = async (req, res) => {
    try {
        const deleted = await TeacherTopicContentSubcategory.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Subcategory not found");
        sendResponse(res, 200, "Subcategory deleted", deleted);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

