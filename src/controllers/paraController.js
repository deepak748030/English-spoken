import Para from '../models/paraModel.js';
import { sendResponse } from '../utils/response.js';

// Clean text utility
const cleanText = (input) => input.replace(/[.?]/g, '');

export const createPara = async (req, res) => {
    try {
        const { subCategory, text } = req.body;
        if (!subCategory || !text) {
            return sendResponse(res, 400, "subCategory and text are required");
        }

        const cleaned = cleanText(text);
        const newPara = await Para.create({ subCategory, text: cleaned });

        sendResponse(res, 201, "Para created successfully", newPara);
    } catch (error) {
        sendResponse(res, 500, "Error creating para");
    }
};

export const getAllParas = async (req, res) => {
    try {
        const paras = await Para.find();
        sendResponse(res, 200, "Paras fetched successfully", paras);
    } catch (error) {
        sendResponse(res, 500, "Error fetching paras");
    }
};

export const getParaById = async (req, res) => {
    try {
        const para = await Para.find({ subCategory: req.params.id });
        if (!para) return sendResponse(res, 404, "Para not found");
        sendResponse(res, 200, "Para found", para);
    } catch (error) {
        sendResponse(res, 500, "Error fetching para");
    }
};

export const updatePara = async (req, res) => {
    try {
        if (req.body.text) {
            req.body.text = cleanText(req.body.text);
        }

        const updated = await Para.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Para not found");

        sendResponse(res, 200, "Para updated", updated);
    } catch (error) {
        sendResponse(res, 500, "Error updating para");
    }
};

export const deletePara = async (req, res) => {
    try {
        const deleted = await Para.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Para not found");

        sendResponse(res, 200, "Para deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting para");
    }
};
