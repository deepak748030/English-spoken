import Vocabulary from '../models/vocabularyModel.js';
import { sendResponse } from '../utils/response.js';

// Clean text utility
const cleanText = (input) => input.replace(/[.?]/g, '');

export const createVocabulary = async (req, res) => {
    try {
        const { subCategory, text, type } = req.body;
        if (!subCategory || !text) {
            return sendResponse(res, 400, "subCategory and text are required");
        }

        const cleaned = cleanText(text);
        const newVocabulary = await Vocabulary.create({ subCategory, text: cleaned, type });

        sendResponse(res, 201, "Vocabulary created successfully", newVocabulary);
    } catch (error) {
        sendResponse(res, 500, "Error creating vocabulary");
    }
};

export const getAllVocabulary = async (req, res) => {
    try {
        const vocabularies = await Vocabulary.find().populate('subCategory', 'title');
        sendResponse(res, 200, "Vocabularies fetched successfully", vocabularies);
    } catch (error) {
        sendResponse(res, 500, "Error fetching vocabularies");
    }
};

export const getVocabularyById = async (req, res) => {
    try {
        const vocabulary = await Vocabulary.find({ subCategory: req.params.id }).populate('subCategory', 'title');;
        if (!vocabulary) return sendResponse(res, 404, "Vocabulary not found");
        sendResponse(res, 200, "Vocabulary found", vocabulary);
    } catch (error) {
        sendResponse(res, 500, "Error fetching vocabulary");
    }
};

export const updateVocabulary = async (req, res) => {
    try {
        if (req.body.text) {
            req.body.text = cleanText(req.body.text);
        }

        const updated = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Vocabulary not found");

        sendResponse(res, 200, "Vocabulary updated", updated);
    } catch (error) {
        sendResponse(res, 500, "Error updating vocabulary");
    }
};

export const deleteVocabulary = async (req, res) => {
    try {
        const deleted = await Vocabulary.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Vocabulary not found");

        sendResponse(res, 200, "Vocabulary deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting vocabulary");
    }
};

export const getDataByType = async (req, res) => {
    try {
        const { type } = req.params;
        if (!type) {
            return sendResponse(res, 400, "Type parameter is required");
        }
        const vocabularies = await Vocabulary.find({ type }).populate('subCategory', 'title');
        sendResponse(res, 200, "Vocabularies fetched by type successfully", vocabularies);
    } catch (error) {
        sendResponse(res, 500, "Error fetching vocabularies by type");
    }
};