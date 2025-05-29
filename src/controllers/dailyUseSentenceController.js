import DailyUseSentence from '../models/dailyUseSentenceModel.js';
import { sendResponse } from '../utils/response.js';

export const createDailyUseSentence = async (req, res) => {
    try {
        const sentence = await DailyUseSentence.create(req.body);
        sendResponse(res, 201, 'Daily Use Sentence created', sentence);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getDailyUseSentences = async (req, res) => {
    try {
        const sentences = await DailyUseSentence.find();
        sendResponse(res, 200, 'Daily Use Sentences fetched', sentences);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteDailyUseSentence = async (req, res) => {
    try {
        await DailyUseSentence.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Sentence deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
export const updateDailyUseSentence = async (req, res) => {
    try {
        const updatedSentence = await DailyUseSentence.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSentence) {
            return sendResponse(res, 404, 'Sentence not found');
        }
        sendResponse(res, 200, 'Sentence updated', updatedSentence);
    }
    catch (err) {
        sendResponse(res, 500, err.message);
    }
}

export const getDailyUseSentencesBySubcategoryId = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const sentences = await DailyUseSentence.find({ subCategory: subcategoryId });
        sendResponse(res, 200, 'Daily Use Sentences fetched by subcategoryId', sentences);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};